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
          pill: 'bg-[#55745E]/10 text-[#55745E] border-[#55745E]/20',
          dot: 'bg-[#55745E]',
          label: 'Available',
          cardGlow: 'hover:border-[#55745E]/50 hover:shadow-md',
          tableSurface: 'bg-[#55745E]/15 border-[#55745E]/40 text-[#28352D]',
          chairColor: 'bg-[#55745E]/30 border-[#55745E]/40',
        };
      case 'OCCUPIED':
        return {
          pill: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500 animate-pulse',
          label: 'Occupied',
          cardGlow: 'hover:border-amber-400 hover:shadow-md',
          tableSurface: 'bg-amber-100 border-amber-300 text-[#28352D]',
          chairColor: 'bg-amber-200 border-amber-300',
        };
      case 'RESERVED':
        return {
          pill: 'bg-violet-50 text-violet-800 border-violet-200',
          dot: 'bg-violet-500',
          label: 'Reserved',
          cardGlow: 'hover:border-violet-400 hover:shadow-md',
          tableSurface: 'bg-violet-100 border-violet-300 text-[#28352D]',
          chairColor: 'bg-violet-200 border-violet-300',
        };
      case 'CLEANING':
        return {
          pill: 'bg-sky-50 text-sky-800 border-sky-200',
          dot: 'bg-sky-500 animate-pulse',
          label: 'Cleaning',
          cardGlow: 'hover:border-sky-400 hover:shadow-md',
          tableSurface: 'bg-sky-100 border-sky-300 text-[#28352D]',
          chairColor: 'bg-sky-200 border-sky-300',
        };
      default:
        return {
          pill: 'bg-stone-100 text-stone-600 border-stone-200',
          dot: 'bg-stone-400',
          label: 'Inactive',
          cardGlow: 'opacity-50',
          tableSurface: 'bg-stone-100 border-stone-200 text-stone-600',
          chairColor: 'bg-stone-200 border-stone-300',
        };
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E3DA] shadow-xs relative overflow-hidden">
      {/* Header and Legend */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h3 className="text-base font-bold text-[#28352D] font-serif tracking-tight flex items-center gap-2">
            <span>Dining Room Floor Plan</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#FAF7F2] text-stone-600 border border-[#E8E3DA] font-sans font-medium">
              14 Tables • 5 Zones
            </span>
          </h3>
          <p className="text-xs text-stone-500">
            Click any table to inspect live party seating, server assignments, and change turnover state.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs flex-wrap bg-[#FAF7F2] px-3.5 py-1.5 rounded-2xl border border-[#E8E3DA]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#55745E]" />
            <span className="text-stone-600 text-[11px]">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-stone-600 text-[11px]">Occupied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-violet-500" />
            <span className="text-stone-600 text-[11px]">Reserved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span className="text-stone-600 text-[11px]">Cleaning</span>
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
              className={`group cursor-pointer bg-white rounded-2xl border border-[#E8E3DA] p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${config.cardGlow} flex flex-col justify-between min-h-[175px] relative overflow-hidden`}
            >
              {/* Top row: Table number & status */}
              <div className="flex items-start justify-between gap-1 z-10">
                <div>
                  <div className="text-sm font-bold text-[#28352D] group-hover:text-[#55745E] transition-colors">
                    {table.table_number}
                  </div>
                  <div className="text-[10px] text-stone-500 font-medium">{table.location}</div>
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
                    const cy = Math.sin(angle) * radius * 0.65;
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

                  {/* Table Top */}
                  <div
                    className={`w-12 h-10 rounded-xl border flex flex-col items-center justify-center ${config.tableSurface} shadow-xs z-10 transition-transform group-hover:scale-105`}
                  >
                    <span className="text-[11px] font-bold font-mono">{table.table_number}</span>
                    <span className="text-[9px] opacity-80">{table.capacity}p</span>
                  </div>
                </div>
              </div>

              {/* Bottom State Details */}
              <div className="pt-2 border-t border-stone-100 text-[11px] space-y-1 z-10">
                {table.status === 'OCCUPIED' ? (
                  <>
                    <div className="font-semibold text-[#28352D] truncate flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span className="truncate">{table.group_name || 'Seated Party'} ({table.group_size || table.capacity}p)</span>
                    </div>
                    <div className="text-stone-500 truncate flex items-center gap-1 text-[10px]">
                      <User className="w-3 h-3 text-stone-400 shrink-0" />
                      <span className="truncate">{table.waiter_name || 'Unassigned Staff'}</span>
                    </div>
                  </>
                ) : table.status === 'CLEANING' ? (
                  <div className="text-sky-700 font-medium flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3 text-sky-500 animate-spin" />
                    <span>Sanitation turnover</span>
                  </div>
                ) : table.status === 'RESERVED' ? (
                  <div className="text-violet-700 font-medium flex items-center gap-1 text-[11px]">
                    <AlertCircle className="w-3 h-3 text-violet-500" />
                    <span>Hold window active</span>
                  </div>
                ) : (
                  <div className="text-[#55745E] text-[11px] font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#55745E]" />
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
