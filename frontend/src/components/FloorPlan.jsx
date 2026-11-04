import React from 'react';
import { Users, User, Sparkles, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function FloorPlan({ tables, onSelectTable, filter = 'ALL' }) {
  const filteredTables = tables.filter((t) => {
    if (filter === 'ALL') return true;
    return t.status === filter;
  });

  const getStatusConfig = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return {
          pill: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/30 shadow-[0_0_12px_-2px_rgba(16,185,129,0.3)]',
          dot: 'bg-emerald-400',
          label: 'Available',
          cardGlow: 'hover:border-emerald-500/50 hover:shadow-[0_0_20px_-3px_rgba(16,185,129,0.25)]',
          tableSurface: 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]',
          chairColor: 'bg-emerald-600/40 border-emerald-400/50',
        };
      case 'OCCUPIED':
        return {
          pill: 'bg-amber-950/70 text-amber-300 border-amber-500/30 shadow-[0_0_12px_-2px_rgba(245,158,11,0.3)]',
          dot: 'bg-amber-400 animate-pulse',
          label: 'Occupied',
          cardGlow: 'hover:border-amber-500/50 hover:shadow-[0_0_20px_-3px_rgba(245,158,11,0.25)]',
          tableSurface: 'bg-amber-950/50 border-amber-500/40 text-amber-200 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]',
          chairColor: 'bg-amber-600/40 border-amber-400/50',
        };
      case 'RESERVED':
        return {
          pill: 'bg-violet-950/70 text-violet-300 border-violet-500/30 shadow-[0_0_12px_-2px_rgba(139,92,246,0.3)]',
          dot: 'bg-violet-400',
          label: 'Reserved',
          cardGlow: 'hover:border-violet-500/50 hover:shadow-[0_0_20px_-3px_rgba(139,92,246,0.25)]',
          tableSurface: 'bg-violet-950/50 border-violet-500/40 text-violet-200 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]',
          chairColor: 'bg-violet-600/40 border-violet-400/50',
        };
      case 'CLEANING':
        return {
          pill: 'bg-sky-950/70 text-sky-300 border-sky-500/30 shadow-[0_0_12px_-2px_rgba(14,165,233,0.3)]',
          dot: 'bg-sky-400 animate-pulse',
          label: 'Cleaning',
          cardGlow: 'hover:border-sky-500/50 hover:shadow-[0_0_20px_-3px_rgba(14,165,233,0.25)]',
          tableSurface: 'bg-sky-950/50 border-sky-500/40 text-sky-200 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]',
          chairColor: 'bg-sky-600/40 border-sky-400/50',
        };
      default:
        return {
          pill: 'bg-slate-900 text-slate-400 border-slate-700',
          dot: 'bg-slate-500',
          label: 'Inactive',
          cardGlow: 'opacity-50',
          tableSurface: 'bg-slate-900 border-slate-800 text-slate-400',
          chairColor: 'bg-slate-800 border-slate-700',
        };
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/10 shadow-3d-card relative overflow-hidden">
      {/* Header and Legend */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Interactive 3D Restaurant Floor Plan</span>
          </h3>
          <p className="text-xs text-noir-400">
            Tactile 3D table objects representing live dining room seating, zone placement, and turnover.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs flex-wrap bg-noir-900/80 px-3 py-1.5 rounded-2xl border border-white/5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-glow-emerald" />
            <span className="text-noir-300 text-[11px]">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-champagne-400 shadow-glow-champagne" />
            <span className="text-noir-300 text-[11px]">Occupied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-noir-300 text-[11px]">Reserved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400 shadow-glow-sky" />
            <span className="text-noir-300 text-[11px]">Cleaning</span>
          </div>
        </div>
      </div>

      {/* Grid of Tables */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4">
        {filteredTables.map((table) => {
          const config = getStatusConfig(table.status);
          const chairCount = Math.min(table.capacity, 8);

          return (
            <div
              key={table.id}
              onClick={() => onSelectTable(table)}
              className={`group cursor-pointer glass-panel-elevated rounded-2xl border border-white/10 p-3.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${config.cardGlow} flex flex-col justify-between min-h-[175px] relative overflow-hidden`}
            >
              {/* Top row: Table number & status */}
              <div className="flex items-start justify-between gap-1 z-10">
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-champagne-300 transition-colors">
                    {table.table_number}
                  </div>
                  <div className="text-[10px] text-noir-400 font-mono">{table.location}</div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${config.pill}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                  {config.label}
                </span>
              </div>

              {/* 3D Isometric Table Centerpiece with Chairs */}
              <div className="my-2.5 flex items-center justify-center py-2 relative">
                <div className="relative flex items-center justify-center">
                  {/* Chairs rendered around the table */}
                  {Array.from({ length: chairCount }).map((_, i) => {
                    const angle = (i / chairCount) * 2 * Math.PI;
                    const radius = 28;
                    const cx = Math.cos(angle) * radius;
                    const cy = Math.sin(angle) * radius * 0.65; // isometric perspective compression
                    return (
                      <div
                        key={i}
                        className={`absolute w-3 h-2.5 rounded-md border ${config.chairColor} transition-transform group-hover:scale-110`}
                        style={{
                          transform: `translate(${cx}px, ${cy}px) rotate(${angle}rad)`,
                        }}
                      />
                    );
                  })}

                  {/* 3D Table Top */}
                  <div
                    className={`w-12 h-10 rounded-xl border flex flex-col items-center justify-center ${config.tableSurface} shadow-lg z-10 transition-transform group-hover:scale-105`}
                  >
                    <span className="text-[11px] font-bold font-mono">{table.table_number}</span>
                    <span className="text-[9px] opacity-75">{table.capacity}p</span>
                  </div>
                </div>
              </div>

              {/* Bottom State Details */}
              <div className="pt-2 border-t border-white/5 text-[11px] space-y-1 z-10">
                {table.status === 'OCCUPIED' ? (
                  <>
                    <div className="font-semibold text-white truncate flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-champagne-400" />
                      <span className="truncate">{table.group_name || 'Seated Party'} ({table.group_size || table.capacity}p)</span>
                    </div>
                    <div className="text-noir-400 truncate flex items-center gap-1 text-[10px]">
                      <User className="w-3 h-3 text-noir-400 shrink-0" />
                      <span className="truncate">{table.waiter_name || 'Unassigned Staff'}</span>
                    </div>
                  </>
                ) : table.status === 'CLEANING' ? (
                  <div className="text-sky-300 font-medium flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3 text-sky-400 animate-spin" />
                    <span>Sanitation turnover</span>
                  </div>
                ) : table.status === 'RESERVED' ? (
                  <div className="text-amber-300 font-medium flex items-center gap-1 text-[11px]">
                    <AlertCircle className="w-3 h-3 text-amber-400" />
                    <span>Hold window active</span>
                  </div>
                ) : (
                  <div className="text-emerald-300 text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Ready for allocation</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
