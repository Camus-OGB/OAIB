import { useState, useCallback } from 'react';
import type { ToastType } from '../components/ui/Toast';

interface ToastState {
  id: number;
  type: ToastType;
  message: string;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
    success: useCallback((message: string) => showToast('success', message), [showToast]),
    error: useCallback((message: string) => showToast('error', message), [showToast]),
    warning: useCallback((message: string) => showToast('warning', message), [showToast]),
    info: useCallback((message: string) => showToast('info', message), [showToast]),
  };
};
