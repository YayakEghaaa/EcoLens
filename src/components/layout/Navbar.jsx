import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { NAV_ITEMS } from '../../data/appData';

export default function Navbar() {
  const { currentPage, navigate, ecoPoints, user, setProfileOpen } = useApp();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const formatted = ecoPoints.toLocaleString('id-ID');
  const photoURL  = user?.photoURL;
  const initials  = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'EC';

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3 transition-all duration-300
        ${scrolled ? 'navbar-scrolled' : 'bg-transparent'}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2 text-green-light font-bold text-lg cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('home')}
      >
        <i className="fa-solid fa-leaf text-xl" />
        <span className="gradient-text font-extrabold">EcoLens</span>
      </div>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex items-center gap-1">
        {NAV_ITEMS.map(item => (
          <button
            key={item.page}
            onClick={() => navigate(item.page)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
              ${currentPage === item.page
                ? 'bg-green-light/15 text-green-light'
                : 'text-white/60 hover:text-white hover:bg-white/5'}`}
          >
            <i className={`fa-solid ${item.icon} text-xs`} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Right: EcoPoints + Avatar */}
      <div className="flex items-center gap-3">
        {/* EcoPoints badge */}
        <div className="flex items-center gap-1.5 bg-green-light/10 border border-green-light/20 text-green-light text-xs sm:text-sm font-semibold px-2.5 sm:px-3 py-1.5 rounded-full">
          <i className="fa-solid fa-seedling text-[10px] sm:text-xs" />
          <span>{formatted}</span>
          <span className="text-[10px] sm:text-xs opacity-70">EP</span>
        </div>

        {/* Avatar — klik buka profile modal */}
        <button
          onClick={() => setProfileOpen(true)}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-green-light/30 hover:border-green-light transition-colors duration-200 flex-shrink-0"
        >
          {photoURL
            ? <img src={photoURL} alt="avatar" className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gradient-to-br from-green-light to-teal-light flex items-center justify-center text-white text-[10px] sm:text-xs font-bold">
                {initials}
              </div>
          }
        </button>
      </div>
    </motion.nav>
  );
}