import { useApp } from '../../context/AppContext';
import { motion } from 'framer-motion';
import { NAV_ITEMS } from '../../data/appData';

export default function BottomNav() {
  const { currentPage, navigate } = useApp();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#111A14] border-t border-[#1E2D22] flex items-stretch">
      {NAV_ITEMS.map((item, i) => (
        <motion.button
          key={item.page}
          onClick={() => navigate(item.page)}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium transition-colors duration-200
            ${currentPage === item.page ? 'text-green-light' : 'text-white/40 hover:text-white/70'}`}
          whileTap={{ scale: 0.85 }}
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: i * 0.07, duration: 0.4, ease: 'easeOut' }}
        >
          {currentPage === item.page && (
            <motion.div
              layoutId="bottomNavIndicator"
              className="absolute top-0 w-8 h-0.5 bg-green-light rounded-full"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <i className={`fa-solid ${item.icon} text-base`} />
          <span>{item.label}</span>
        </motion.button>
      ))}
    </nav>
  );
}