import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useRestaurant();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let style = 'bg-white text-[#28352D] border-[#E8E3DA] shadow-lg';
        let icon = <Info className="w-5 h-5 text-blue-600 shrink-0" />;

        if (toast.type === 'success') {
          style = 'bg-white text-[#28352D] border-[#55745E]/30 shadow-lg';
          icon = <CheckCircle2 className="w-5 h-5 text-[#55745E] shrink-0" />;
        } else if (toast.type === 'error') {
          style = 'bg-white text-[#28352D] border-rose-300 shadow-lg';
          icon = <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />;
        } else if (toast.type === 'warning') {
          style = 'bg-white text-[#28352D] border-amber-300 shadow-lg';
          icon = <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border transition-all duration-300 animate-in slide-in-from-bottom-2 ${style}`}
          >
            {icon}
            <div className="flex-1 text-xs font-medium leading-snug">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
