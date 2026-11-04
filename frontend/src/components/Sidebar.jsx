import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import {
  LayoutDashboard,
  LayoutGrid,
  Users,
  UserCheck,
  CalendarDays,
  BrainCircuit,
  PlaySquare,
  GitCompare,
  BotMessageSquare,
  BarChart3,
  Settings,
  Sparkles,
  UtensilsCrossed,
  Zap,
  X
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tables', label: 'Table Management', icon: LayoutGrid },
  { id: 'waiters', label: 'Waiter Management', icon: UserCheck },
  { id: 'queue', label: 'Customer Queue', icon: Users },
  { id: 'reservations', label: 'Reservations', icon: CalendarDays },
  { id: 'allocation', label: 'AI Allocation', icon: BrainCircuit, badge: 'Core AI' },
  { id: 'simulation', label: 'Simulation', icon: PlaySquare },
  { id: 'comparison', label: 'Algorithm Comparison', icon: GitCompare },
  { id: 'assistant', label: 'AI Assistant', icon: BotMessageSquare, badge: 'Groq RAG' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }) {
  const { activeTab, setActiveTab } = useRestaurant();

  const handleSelect = (id) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-noir-950/80 backdrop-blur-md z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0A0E17]/95 border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 backdrop-blur-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-[0_0_20px_-3px_rgba(245,158,11,0.4)]">
              <UtensilsCrossed className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="font-serif font-bold text-slate-100 tracking-wide text-base flex items-center gap-1.5">
                Saffron & Sage
              </div>
              <div className="text-[10px] text-amber-400/90 font-mono tracking-wider uppercase font-semibold">
                AI Service Planner
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Operations & AI Core
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent text-amber-300 font-semibold border-l-2 border-amber-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100 border-l-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-amber-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold tracking-wide uppercase ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'bg-slate-900 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800/80 bg-[#070A0F]/60">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 shadow-[0_0_12px_-2px_rgba(16,185,129,0.3)]">
              <Zap className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <div className="font-semibold text-slate-100">Groq LPU Enabled</div>
              <div className="text-slate-400 text-[10px] font-mono">openai/gpt-oss-120b</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
