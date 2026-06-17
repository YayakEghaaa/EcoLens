import { useState, useEffect, useRef } from 'react';

export function useCounter(target, duration = 1500, trigger = true) {
  const [value, setValue]   = useState(0);
  const animatedRef          = useRef(false);

  useEffect(() => {
    if (!trigger || animatedRef.current) return;
    animatedRef.current = true;

    const start = performance.now();
    const update = (time) => {
      const elapsed  = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }, [target, duration, trigger]);

  return value;
}
