'use client';

import { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import Toast, { ToastProps } from './Toast';

export interface ToastItem extends Omit<ToastProps, 'onClose'> {}

let toastIdCounter = 0;
const toastListeners: Array<(toast: ToastItem) => void> = [];

export const addToast = (toast: Omit<ToastItem, 'id'>) => {
  const id = `toast-${++toastIdCounter}`;
  const newToast: ToastItem = { ...toast, id };
  toastListeners.forEach((listener) => listener(newToast));
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const listener = (toast: ToastItem) => {
      setToasts((prev) => [...prev, toast]);
    };

    toastListeners.push(listener);

    return () => {
      const index = toastListeners.indexOf(listener);
      if (index > -1) {
        toastListeners.splice(index, 1);
      }
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <Box
      position="fixed"
      top={20}
      right={4}
      zIndex={9999}
      pointerEvents="none"
    >
      <Box pointerEvents="auto">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={removeToast} />
        ))}
      </Box>
    </Box>
  );
}

