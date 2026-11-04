import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, trend, variant = 'default' }) {
  let iconColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  let badgeStyle = 'text-amber-300 bg-amber-500/15 border-amber-500/30';

  if (variant === 'accent') {
    iconColor = 'text-amber-400 bg-amber-500/15 border-amber-500/40 shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)]';
    badgeStyle = 'text-amber-300 bg-amber-500/20 border-amber-500/40';
  } else if (variant === 'emerald') {
    iconColor = 'text-emerald-400 bg-emerald-500/15 border-emerald-500/40 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]';
    badgeStyle = 'text-emerald-300 bg-emerald-500/20 border-emerald-500/40';
  } else if (variant === 'amber') {
    iconColor = 'text-amber-400 bg-amber-500/15 border-amber-500/40';
    badgeStyle = 'text-amber-300 bg-amber-500/20 border-amber-500/40';
  } else if (variant === 'blue') {
    iconColor = 'text-sky-400 bg-sky-500/15 border-sky-500/40 shadow-[0_0_15px_-3px_rgba(14,165,233,0.3)]';
    badgeStyle = 'text-sky-300 bg-sky-500/20 border-sky-500/40';
  }

  return (
    <div className="glass-panel glass-card-hover p-4 sm:p-5 rounded-2xl border border-slate-800/80 shadow-3d-card flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${iconColor}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">{value}</span>
        {trend && (
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeStyle}`}>
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <div className="mt-2 text-xs text-slate-400 font-normal">{subtitle}</div>
      )}
    </div>
  );
}
