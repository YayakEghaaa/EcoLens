import { useEffect, useState } from 'react';

export default function SplashScreen({ onDone }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 1800);
    const t2 = setTimeout(() => onDone(), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0A0F0D] transition-opacity duration-500
        ${fading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      {/* Icon */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-light to-teal-light flex items-center justify-center shadow-2xl shadow-green-light/40 animate-[float_3s_ease-in-out_infinite]">
          <i className="fa-solid fa-leaf text-white text-4xl" />
        </div>
      </div>

      <span className="gradient-text text-3xl font-black tracking-tight mb-8">EcoLens</span>

      {/* Loading bar */}
      <div className="w-48 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-green-light to-teal-light"
          style={{ animation: 'splashBar 1.8s ease-in-out forwards' }}
        />
      </div>

      <style>{`
        @keyframes splashBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}
