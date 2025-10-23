import { useState, useCallback } from 'react';

const WARMUP_DELAY = 10000; // 10 segundos

export const useServiceWarmup = () => {
  const [isWarming, setIsWarming] = useState(false);

  const withWarmupFeedback = useCallback(async (asyncFn) => {
    setIsWarming(false);
    
    const warmupTimer = setTimeout(() => {
      setIsWarming(true);
    }, WARMUP_DELAY);

    try {
      const result = await asyncFn();
      clearTimeout(warmupTimer);
      setIsWarming(false);
      return result;
    } catch (err) {
      clearTimeout(warmupTimer);
      setIsWarming(false);
      throw err;
    }
  }, []);

  return { isWarming, withWarmupFeedback };
};
