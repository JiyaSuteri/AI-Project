import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-stone-900/45 dark:bg-black/75 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full ${maxWidth} bg-white dark:bg-[#18201B] rounded-3xl border border-[#E8E3DA] dark:border-[#2A382F] shadow-2xl dark:shadow-dark-hover z-10 overflow-hidden text-[#28352D] dark:text-[#F3EFEA]`}
          >
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#E8E3DA] dark:border-[#2A382F] bg-[#FAF7F2] dark:bg-[#111613]">
              <div>
                <h3 className="text-base font-bold text-[#28352D] dark:text-[#F3EFEA] font-serif">{title}</h3>
                {subtitle && <p className="text-xs text-stone-500 dark:text-[#98A89E] mt-0.5">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="p-1.5 rounded-xl text-stone-400 dark:text-[#98A89E] hover:text-[#28352D] dark:hover:text-white hover:bg-stone-100 dark:hover:bg-[#1F2A23] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[80vh] overflow-y-auto text-[#28352D] dark:text-[#F3EFEA]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
