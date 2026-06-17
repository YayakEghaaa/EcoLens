import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { useApp } from '../context/AppContext';

export default function AuthPage() {
  const { navigate } = useApp();
  const [mode, setMode]         = useState('login'); // 'login' | 'register'
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const clearError = () => setError('');

  // ── Email Auth ──────────────────────────────────
  const handleSubmit = async () => {
    setError('');
    if (!email || !password) return setError('Email dan password wajib diisi.');
    if (mode === 'register' && !name) return setError('Nama wajib diisi.');
    if (password.length < 6) return setError('Password minimal 6 karakter.');

    setLoading(true);
    try {
      if (mode === 'register') {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(user, { displayName: name });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('home');
    } catch (err) {
      const messages = {
        'auth/email-already-in-use': 'Email sudah terdaftar.',
        'auth/user-not-found':       'Email tidak ditemukan.',
        'auth/wrong-password':       'Password salah.',
        'auth/invalid-email':        'Format email tidak valid.',
        'auth/invalid-credential':   'Email atau password salah.',
      };
      setError(messages[err.code] || 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // ── Google Auth ─────────────────────────────────
  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('home');
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Login Google gagal. Coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(m => m === 'login' ? 'register' : 'login');
    clearError();
    setName(''); setEmail(''); setPassword('');
  };

  return (
    <motion.div
      className="min-h-screen bg-[#0A0F0D] flex items-center justify-center px-4 py-12 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >

      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-green-light/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-teal-light/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div
            className="inline-flex items-center gap-2 cursor-pointer mb-6"
            onClick={() => navigate('landing')}
          >
            <div className="w-10 h-10 rounded-2xl bg-green-light/15 flex items-center justify-center">
              <i className="fa-solid fa-leaf text-green-light text-lg" />
            </div>
            <span className="gradient-text font-extrabold text-2xl">EcoLens</span>
          </div>

          <h1 className="text-2xl font-black text-white mb-2">
            {mode === 'login' ? 'Selamat Datang Kembali 👋' : 'Buat Akun Baru 🌿'}
          </h1>
          <p className="text-white/45 text-sm">
            {mode === 'login'
              ? 'Masuk untuk lanjutkan perjalanan EcoLens-mu'
              : 'Bergabung dan mulai selamatkan bumi bersama kami'}
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          className="eco-card p-6 sm:p-8 flex flex-col gap-5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
        >

          {/* Google Button */}
          <motion.button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold text-sm py-3 rounded-xl transition-all duration-200 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
              <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
              <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
            </svg>
            Lanjutkan dengan Google
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs">atau</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Name field (register only) */}
          {mode === 'register' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-white/60 text-xs font-medium">Nama Lengkap</label>
              <div className="relative">
                <i className="fa-solid fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm" />
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); clearError(); }}
                  placeholder="Nama kamu"
                  className="w-full bg-white/5 border border-white/10 focus:border-green-light/50 text-white placeholder-white/25 text-sm rounded-xl pl-10 pr-4 py-3 outline-none transition-colors duration-200"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-white/60 text-xs font-medium">Email</label>
            <div className="relative">
              <i className="fa-solid fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm" />
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); clearError(); }}
                placeholder="email@contoh.com"
                className="w-full bg-white/5 border border-white/10 focus:border-green-light/50 text-white placeholder-white/25 text-sm rounded-xl pl-10 pr-4 py-3 outline-none transition-colors duration-200"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-white/60 text-xs font-medium">Password</label>
            <div className="relative">
              <i className="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm" />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); clearError(); }}
                placeholder="Minimal 6 karakter"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                className="w-full bg-white/5 border border-white/10 focus:border-green-light/50 text-white placeholder-white/25 text-sm rounded-xl pl-10 pr-10 py-3 outline-none transition-colors duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPass(s => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                <i className={`fa-solid ${showPass ? 'fa-eye-slash' : 'fa-eye'} text-sm`} />
              </button>
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl px-4 py-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <i className="fa-solid fa-circle-exclamation flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Memproses...</>
              : <><i className={`fa-solid ${mode === 'login' ? 'fa-arrow-right-to-bracket' : 'fa-user-plus'}`} />
                  {mode === 'login' ? 'Masuk' : 'Daftar Sekarang'}</>
            }
          </motion.button>

          {/* Switch mode */}
          <p className="text-center text-white/40 text-xs">
            {mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
            <button
              onClick={switchMode}
              className="text-green-light hover:underline font-semibold"
            >
              {mode === 'login' ? 'Daftar sekarang' : 'Masuk di sini'}
            </button>
          </p>
        </motion.div>

        {/* Back to landing */}
        <button
          onClick={() => navigate('landing')}
          className="w-full mt-4 text-white/30 hover:text-white/60 text-xs flex items-center justify-center gap-2 transition-colors duration-200"
        >
          <i className="fa-solid fa-arrow-left text-[10px]" /> Kembali ke halaman utama
        </button>
      </div>
    </motion.div>
  );
}