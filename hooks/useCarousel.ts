import { useState, useEffect, useCallback, useRef } from 'react';

export function useCarousel(length: number, intervalMs: number = 5000) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (isPaused || length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isPaused, length, intervalMs]);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % length);
  }, [length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + length) % length);
  }, [length]);

  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
  }, [next, prev]);

  return {
    current,
    goTo,
    next,
    prev,
    pause,
    resume,
    isPaused,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
