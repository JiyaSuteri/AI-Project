import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, trend, variant = 'default' }) {
  let iconColor = 'text-[#55745E] dark:text-[#6E9A7B] bg-[#55745E]/10 dark:bg-[#6E9A7B]/15 border-[#55745E]/20 dark:border-[#6E9A7B]/30';
  let badgeStyle = 'text-[#55745E] dark:text-[#6E9A7B] bg-[#55745E]/10 dark:bg-[#6E9A7B]/15 border-[#55745E]/20 dark:border-[#6E9A7B]/30';

  if (variant === 'accent' || variant === 'amber') {
    iconColor = 'text-[#C47A59] dark:text-[#DC8A66] bg-[#C47A59]/10 dark:bg-[#C47A59]/20 border-[#C47A59]/25 dark:border-[#C47A59]/35';
    badgeStyle = 'text-[#C47A59] dark:text-[#DC8A66] bg-[#C47A59]/10 dark:bg-[#C47A59]/20 border-[#C47A59]/25 dark:border-[#C47A59]/35';
  } else if (variant === 'emerald') {
    iconColor = 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40';
    badgeStyle = 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40';
  } else if (variant === 'blue') {
    iconColor = 'text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800/40';
    badgeStyle = 'text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800/40';
  }

  return (
    <div className="bg-white dark:bg-[#18201B] rounded-2xl border border-[#E8E3DA] dark:border-[#2A382F] p-4 sm:p-5 shadow-xs hover:shadow-md dark:shadow-dark-card hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-stone-500 dark:text-[#98A89E] uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-transform duration-200 group-hover:scale-105 ${iconColor}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold text-[#28352D] dark:text-[#F3EFEA] tracking-tight">{value}</span>
        {trend && (
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeStyle}`}>
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <div className="mt-2 text-xs text-stone-500 dark:text-[#98A89E] font-normal leading-relaxed">{subtitle}</div>
      )}
    </div>
  );
}
