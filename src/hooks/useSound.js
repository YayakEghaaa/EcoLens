import { useRef, useEffect, useCallback } from 'react';

export function useSound(soundMap = {}, options = {}) {
  const { volume = 0.7, cooldown = 1000 } = options;

  // AudioBuffer per key — di-decode saat preload, dipakai saat play
  const buffersRef  = useRef({});
  // Satu AudioContext dishare untuk semua sound (hemat resource)
  const ctxRef      = useRef(null);
  // Timestamp terakhir play per key — untuk cooldown guard
  const lastPlayRef = useRef({});

  // ── Buat / ambil AudioContext (lazy, bukan saat mount) ────
  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Browser suspend AudioContext sebelum user interaction — resume otomatis
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume().catch(() => {});
    }
    return ctxRef.current;
  }, []);

  // ── Preload semua sound saat mount ───────────────────────
  useEffect(() => {
    // AudioContext untuk decode — dibuat sekali di sini
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    ctxRef.current = ctx;

    const entries = Object.entries(soundMap);
    if (entries.length === 0) return;

    (async () => {
      for (const [key, src] of entries) {
        try {
          const res = await fetch(src);
          if (!res.ok) throw new Error(`HTTP ${res.status} — ${src}`);
          const arrayBuffer = await res.arrayBuffer();
          buffersRef.current[key] = await ctx.decodeAudioData(arrayBuffer);
        } catch (err) {
          // Silent fail — jangan crash app hanya karena sound tidak ada
          console.warn(`[useSound] Gagal preload "${key}" (${src}):`, err.message);
        }
      }
    })();

    // Cleanup saat komponen unmount
    return () => {
      ctx.close().catch(() => {});
      ctxRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── play(key, overrides?) ────────────────────────────────
  const play = useCallback((key, overrides = {}) => {
    const buffer = buffersRef.current[key];
    if (!buffer) return; // Belum preload atau file tidak ditemukan — skip silently

    // Cooldown guard — cegah sound sama berbunyi terlalu cepat berulang
    const now = Date.now();
    const cd  = overrides.cooldown ?? cooldown;
    if (lastPlayRef.current[key] && now - lastPlayRef.current[key] < cd) return;
    lastPlayRef.current[key] = now;

    try {
      const ctx      = getCtx();
      const source   = ctx.createBufferSource();
      const gainNode = ctx.createGain();

      source.buffer       = buffer;
      gainNode.gain.value = overrides.volume ?? volume;

      source.connect(gainNode);
      gainNode.connect(ctx.destination);
      source.start(0);
    } catch (err) {
      // Silent fail — jangan crash AR hanya karena audio gagal
      console.warn(`[useSound] Gagal play "${key}":`, err.message);
    }
  }, [getCtx, volume, cooldown]);

  return { play };
}