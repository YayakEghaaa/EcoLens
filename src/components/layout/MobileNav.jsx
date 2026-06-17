import { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { NAV_ITEMS } from '../../data/appData';

export default function MobileNav({ isOpen, onClose }) {
  const { currentPage, navigate } = useApp();

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-black/60 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 flex flex-col
          bg-[#111A14] border-r border-[#1E2D22] transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E2D22]">
          <div className="flex items-center gap-2 text-green-light font-bold">
            <i className="fa-solid fa-leaf" />
            <span className="gradient-text font-extrabold text-lg">EcoLens</span>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors p-1">
            <i className="fa-solid fa-xmark text-lg" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1 p-4 flex-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.page}
              onClick={() => { navigate(item.page); onClose(); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left
                ${currentPage === item.page
                  ? 'bg-green-light/15 text-green-light'
                  : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              <i className={`fa-solid ${item.icon} w-4 text-center`} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#1E2D22] text-xs text-white/30 text-center">
          © 2025 EcoLens
        </div>
      </aside>
    </>
  );
}
