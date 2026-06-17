import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';

export default function Toast() {
  const { toast } = useApp();
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    if (!toast) return;
    setCurrent(toast);
    setVisible(true);
    const t1 = setTimeout(() => setVisible(false), 2800);
    const t2 = setTimeout(() => setCurrent(null), 3150);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [toast]);

  const isSuccess = current?.type === 'success';

  return (
    <AnimatePresence>
      {current && visible && (
        <motion.div
          key={current.id}
          className={`fixed bottom-24 md:bottom-8 left-1/2 z-[9999] flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white shadow-xl whitespace-nowrap pointer-events-none
            ${isSuccess ? 'bg-green-dark' : 'bg-teal-dark'}`}
          style={{ x: '-50%' }}
          initial={{ y: 40, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          <i className={`fa-solid ${isSuccess ? 'fa-check-circle' : 'fa-info-circle'}`} />
          <span>{current.message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}