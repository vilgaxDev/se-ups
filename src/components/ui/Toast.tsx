import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  title?: string;
}

interface ToastContextType {
  toast: (options: { type?: 'success' | 'error' | 'info' | 'warning'; message: string; title?: string }) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback(({ type = 'info', message, title }: { type?: 'success' | 'error' | 'info' | 'warning'; message: string; title?: string }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message, title }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg bg-white transition-all duration-200 animate-in slide-in-from-bottom-2 ${
              t.type === 'success'
                ? 'border-[#167447]/30 text-[#123C30]'
                : t.type === 'error'
                ? 'border-[#C13F43]/30 text-[#C13F43]'
                : t.type === 'warning'
                ? 'border-[#A96B19]/30 text-[#123C30]'
                : 'border-[#146B50]/30 text-[#123C30]'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#167447]" />}
              {t.type === 'error' && <AlertCircle className="w-5 h-5 text-[#C13F43]" />}
              {t.type === 'warning' && <AlertCircle className="w-5 h-5 text-[#A96B19]" />}
              {t.type === 'info' && <Info className="w-5 h-5 text-[#146B50]" />}
            </div>
            <div className="flex-1 min-w-0">
              {t.title && <p className="text-xs font-bold text-[#123C30]">{t.title}</p>}
              <p className="text-xs text-[#17251F] leading-relaxed">{t.message}</p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="shrink-0 text-[#89968E] hover:text-[#17251F] p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
