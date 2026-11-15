import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, trend, variant = 'default' }) {
  let iconColor = 'text-[#55745E] bg-[#55745E]/10 border-[#55745E]/20';
  let badgeStyle = 'text-[#55745E] bg-[#55745E]/10 border-[#55745E]/20';

  if (variant === 'accent' || variant === 'amber') {
    iconColor = 'text-[#C47A59] bg-[#C47A59]/10 border-[#C47A59]/25';
    badgeStyle = 'text-[#C47A59] bg-[#C47A59]/10 border-[#C47A59]/25';
  } else if (variant === 'emerald') {
    iconColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    badgeStyle = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  } else if (variant === 'blue') {
    iconColor = 'text-sky-700 bg-sky-50 border-sky-200';
    badgeStyle = 'text-sky-700 bg-sky-50 border-sky-200';
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E8E3DA] p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${iconColor}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold text-[#28352D] tracking-tight">{value}</span>
        {trend && (
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeStyle}`}>
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <div className="mt-2 text-xs text-stone-500 font-normal">{subtitle}</div>
      )}
    </div>
  );
}
