import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ToastContainer() {
  const { toasts, removeToast } = useRestaurant();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          let style = 'bg-white dark:bg-[#18201B] text-[#28352D] dark:text-[#F3EFEA] border-[#E8E3DA] dark:border-[#2A382F] shadow-lg dark:shadow-dark-hover';
          let icon = <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />;

          if (toast.type === 'success') {
            style = 'bg-white dark:bg-[#18201B] text-[#28352D] dark:text-[#F3EFEA] border-[#55745E]/30 dark:border-[#6E9A7B]/40 shadow-lg dark:shadow-dark-hover';
            icon = <CheckCircle2 className="w-5 h-5 text-[#55745E] dark:text-[#6E9A7B] shrink-0" />;
          } else if (toast.type === 'error') {
            style = 'bg-white dark:bg-[#18201B] text-[#28352D] dark:text-[#F3EFEA] border-rose-300 dark:border-rose-800 shadow-lg dark:shadow-dark-hover';
            icon = <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />;
          } else if (toast.type === 'warning') {
            style = 'bg-white dark:bg-[#18201B] text-[#28352D] dark:text-[#F3EFEA] border-amber-300 dark:border-amber-800 shadow-lg dark:shadow-dark-hover';
            icon = <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />;
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border ${style}`}
            >
              {icon}
              <div className="flex-1 text-xs font-medium leading-snug">{toast.message}</div>
              <button
                onClick={() => removeToast(toast.id)}
                aria-label="Dismiss toast notification"
                className="text-stone-400 hover:text-stone-700 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
