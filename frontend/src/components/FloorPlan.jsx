import React, { useState, lazy, Suspense } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Users, User, Sparkles, CheckCircle2, Clock, AlertCircle, Box, Layers, RefreshCw } from 'lucide-react';

const FloorPlan3D = lazy(() => import('./FloorPlan3D'));

export default function FloorPlan({ tables, onSelectTable, filter = 'ALL' }) {
  const { isDark } = useTheme();
  const [viewMode, setViewMode] = useState('2D'); // '2D' | '3D'

  const filteredTables = tables.filter((t) => {
    if (filter === 'ALL') return true;
    return t.status === filter;
  });

  const getStatusConfig = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return {
          pill: 'bg-[#55745E]/10 dark:bg-[#6E9A7B]/20 text-[#55745E] dark:text-[#6E9A7B] border-[#55745E]/20 dark:border-[#6E9A7B]/30',
          dot: 'bg-[#55745E] dark:bg-[#6E9A7B]',
          label: 'Available',
          cardGlow: 'hover:border-[#55745E]/60 dark:hover:border-[#6E9A7B]/60 hover:shadow-md',
          tableSurface: 'bg-[#55745E]/15 dark:bg-[#6E9A7B]/25 border-[#55745E]/40 dark:border-[#6E9A7B]/50 text-[#28352D] dark:text-[#F3EFEA]',
          chairColor: 'bg-[#55745E]/30 dark:bg-[#6E9A7B]/40 border-[#55745E]/40 dark:border-[#6E9A7B]/50',
        };
      case 'OCCUPIED':
        return {
          pill: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/40',
          dot: 'bg-amber-500 animate-pulse',
          label: 'Occupied',
          cardGlow: 'hover:border-amber-400 dark:hover:border-amber-500/80 hover:shadow-md',
          tableSurface: 'bg-amber-100 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700 text-[#28352D] dark:text-[#F3EFEA]',
          chairColor: 'bg-amber-200 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700',
        };
      case 'RESERVED':
        return {
          pill: 'bg-violet-50 dark:bg-violet-950/40 text-violet-800 dark:text-violet-300 border-violet-200 dark:border-violet-800/40',
          dot: 'bg-violet-500',
          label: 'Reserved',
          cardGlow: 'hover:border-violet-400 dark:hover:border-violet-500/80 hover:shadow-md',
          tableSurface: 'bg-violet-100 dark:bg-violet-950/50 border-violet-300 dark:border-violet-700 text-[#28352D] dark:text-[#F3EFEA]',
          chairColor: 'bg-violet-200 dark:bg-violet-900/40 border-violet-300 dark:border-violet-700',
        };
      case 'CLEANING':
        return {
          pill: 'bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800/40',
          dot: 'bg-sky-500 animate-pulse',
          label: 'Cleaning',
          cardGlow: 'hover:border-sky-400 dark:hover:border-sky-500/80 hover:shadow-md',
          tableSurface: 'bg-sky-100 dark:bg-sky-950/50 border-sky-300 dark:border-sky-700 text-[#28352D] dark:text-[#F3EFEA]',
          chairColor: 'bg-sky-200 dark:bg-sky-900/40 border-sky-300 dark:border-sky-700',
        };
      default:
        return {
          pill: 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700',
          dot: 'bg-stone-400',
          label: 'Inactive',
          cardGlow: 'opacity-50',
          tableSurface: 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300',
          chairColor: 'bg-stone-200 dark:bg-stone-700 border-stone-300 dark:border-stone-600',
        };
    }
  };

  return (
    <div className="bg-white dark:bg-[#18201B] rounded-3xl p-5 sm:p-6 border border-[#E8E3DA] dark:border-[#2A382F] shadow-xs relative overflow-hidden transition-colors duration-200">
      {/* Header, 2D/3D Toggle, and Legend */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-[#28352D] dark:text-[#F3EFEA] font-serif tracking-tight flex items-center gap-2">
              <span>Dining Room Floor Plan</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#FAF7F2] dark:bg-[#111613] text-stone-600 dark:text-[#98A89E] border border-[#E8E3DA] dark:border-[#2A382F] font-sans font-medium">
                14 Tables • 5 Zones
              </span>
            </h3>

            {/* 2D / 3D Toggle Pill */}
            <div
              role="group"
              aria-label="Floor plan display mode"
              className="flex items-center bg-[#FAF7F2] dark:bg-[#111613] border border-[#E8E3DA] dark:border-[#2A382F] rounded-xl p-0.5 shadow-2xs"
            >
              <button
                onClick={() => setViewMode('2D')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === '2D'
                    ? 'bg-white dark:bg-[#1F2A23] text-[#55745E] dark:text-[#6E9A7B] shadow-2xs'
                    : 'text-stone-500 dark:text-[#98A89E] hover:text-[#28352D] dark:hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>2D Plan</span>
              </button>
              <button
                onClick={() => setViewMode('3D')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === '3D'
                    ? 'bg-white dark:bg-[#1F2A23] text-[#C47A59] dark:text-[#DC8A66] shadow-2xs'
                    : 'text-stone-500 dark:text-[#98A89E] hover:text-[#28352D] dark:hover:text-white'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>3D View</span>
              </button>
            </div>
          </div>
          <p className="text-xs text-stone-500 dark:text-[#98A89E] mt-1">
            Click any table to inspect live party seating, server assignments, and change turnover state.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs flex-wrap bg-[#FAF7F2] dark:bg-[#111613] px-3.5 py-1.5 rounded-2xl border border-[#E8E3DA] dark:border-[#2A382F]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#55745E] dark:bg-[#6E9A7B]" />
            <span className="text-stone-600 dark:text-[#98A89E] text-[11px]">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-stone-600 dark:text-[#98A89E] text-[11px]">Occupied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-violet-500" />
            <span className="text-stone-600 dark:text-[#98A89E] text-[11px]">Reserved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span className="text-stone-600 dark:text-[#98A89E] text-[11px]">Cleaning</span>
          </div>
        </div>
      </div>

      {/* Render 3D Floor Plan when toggled */}
      {viewMode === '3D' ? (
        <Suspense
          fallback={
            <div className="h-[520px] rounded-2xl bg-stone-50 dark:bg-[#111613] border border-[#E8E3DA] dark:border-[#2A382F] flex flex-col items-center justify-center text-xs text-stone-500 gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-[#55745E] dark:text-[#6E9A7B]" />
              <span>Loading 3D Dining Space...</span>
            </div>
          }
        >
          <FloorPlan3D
            tables={tables}
            onSelectTable={onSelectTable}
            isDark={isDark}
            filter={filter}
          />
        </Suspense>
      ) : (
        /* Render Standard 2D Grid of Tables */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4">
          {filteredTables.map((table) => {
            const config = getStatusConfig(table.status);
            const chairCount = Math.min(table.capacity, 8);

            return (
              <div
                key={table.id}
                onClick={() => onSelectTable(table)}
                className={`group cursor-pointer bg-white dark:bg-[#1F2A23] rounded-2xl border border-[#E8E3DA] dark:border-[#2A382F] p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:shadow-dark-card ${config.cardGlow} flex flex-col justify-between min-h-[175px] relative overflow-hidden`}
              >
                {/* Top row: Table number & status */}
                <div className="flex items-start justify-between gap-1 z-10">
                  <div>
                    <div className="text-sm font-bold text-[#28352D] dark:text-[#F3EFEA] group-hover:text-[#55745E] dark:group-hover:text-[#6E9A7B] transition-colors">
                      {table.table_number}
                    </div>
                    <div className="text-[10px] text-stone-500 dark:text-[#98A89E] font-medium">{table.location}</div>
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
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] space-y-1 z-10">
                  {table.status === 'OCCUPIED' ? (
                    <>
                      <div className="font-semibold text-[#28352D] dark:text-[#F3EFEA] truncate flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        <span className="truncate">{table.group_name || 'Seated Party'} ({table.group_size || table.capacity}p)</span>
                      </div>
                      <div className="text-stone-500 dark:text-[#98A89E] truncate flex items-center gap-1 text-[10px]">
                        <User className="w-3 h-3 text-stone-400 dark:text-stone-500 shrink-0" />
                        <span className="truncate">{table.waiter_name || 'Unassigned Staff'}</span>
                      </div>
                    </>
                  ) : table.status === 'CLEANING' ? (
                    <div className="text-sky-700 dark:text-sky-400 font-medium flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3 text-sky-500 animate-spin" />
                      <span>Sanitation turnover</span>
                    </div>
                  ) : table.status === 'RESERVED' ? (
                    <div className="text-violet-700 dark:text-violet-400 font-medium flex items-center gap-1 text-[11px]">
                      <AlertCircle className="w-3 h-3 text-violet-500" />
                      <span>Hold window active</span>
                    </div>
                  ) : (
                    <div className="text-[#55745E] dark:text-[#6E9A7B] text-[11px] font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#55745E] dark:text-[#6E9A7B]" />
                      <span>Ready for allocation</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
