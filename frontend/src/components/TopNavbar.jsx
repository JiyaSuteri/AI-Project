import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { api } from '../services/api';
import {
  Menu,
  Search,
  Bell,
  RotateCcw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  Activity,
  Zap,
  Box
} from 'lucide-react';

export default function TopNavbar({ onMenuToggle }) {
  const {
    serverOnline,
    triggerRefresh,
    addToast,
    globalSearch,
    setGlobalSearch,
    bg3DEnabled,
    setBg3DEnabled,
    aiProviderInfo,
  } = useRestaurant();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleResetDb = async () => {
    if (!window.confirm('Reset database to pristine sample data (14 tables, 6 waiters, 12 customer parties)?')) return;
    try {
      setResetting(true);
      await api.resetDatabase();
      triggerRefresh();
      addToast('Database reset to clean sample scenario!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to reset database', 'error');
    } finally {
      setResetting(false);
    }
  };

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <header className="sticky top-0 z-30 h-16 glass-panel border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <div className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <span>Saffron & Sage</span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
              AI Bistro
            </span>

            {/* Groq Active Pill */}
            <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 shadow-[0_0_12px_-2px_rgba(16,185,129,0.3)]">
              <Zap className="w-3 h-3 text-emerald-400" />
              <span>Groq LPU Active (GPT-OSS-120B)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Center: Global Search */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search tables, customer parties, servers..."
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Right: Date/Time, 3D Toggle, Quick Reset, Notifications & User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* 3D Background Toggle */}
        <button
          onClick={() => setBg3DEnabled(!bg3DEnabled)}
          title="Toggle 3D Ambient Perspective Background"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
            bg3DEnabled
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)]'
              : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Box className={`w-3.5 h-3.5 ${bg3DEnabled ? 'text-amber-400 animate-spin-slow' : 'text-slate-500'}`} />
          <span className="hidden sm:inline">3D View</span>
        </button>

        {/* Live Date & Time */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-300 text-xs">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>{formattedDate}</span>
          <span className="text-slate-600">•</span>
          <span className="font-mono font-medium text-slate-100">{formattedTime}</span>
        </div>

        {/* Reset DB Button */}
        <button
          onClick={handleResetDb}
          disabled={resetting}
          title="Reset database to realistic sample scenario"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900/80 hover:bg-slate-850 text-slate-200 border border-slate-800 shadow-xs hover:border-amber-500/40 transition-all disabled:opacity-50"
        >
          <RotateCcw className={`w-3.5 h-3.5 text-amber-400 ${resetting ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{resetting ? 'Resetting...' : 'Reset Demo DB'}</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-slate-950 animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 glass-panel-elevated rounded-2xl shadow-2xl p-3.5 z-50 text-xs border border-slate-800 animate-fade-in">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 font-semibold text-slate-100">
                <span>Restaurant System Alerts</span>
                <span className="text-[10px] text-amber-400 font-mono">3 live feeds</span>
              </div>
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-slate-100">Groq LPU Engine Active</div>
                    <div className="text-slate-400 text-[11px]">Sub-second inference powered by openai/gpt-oss-120b.</div>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-slate-100">A* Search Guidance</div>
                    <div className="text-slate-400 text-[11px]">Admissible lower-bound heuristic applied to pending queue.</div>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                  <Activity className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-slate-100">Sanitation Turnover</div>
                    <div className="text-noir-400 text-[11px]">Table T09 resetting after customer departure.</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
          <div className="w-8 h-8 rounded-xl bg-champagne-500/20 text-champagne-300 border border-champagne-500/30 flex items-center justify-center font-bold text-xs shadow-xs">
            MD
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-white leading-tight">Chef Maître D'</div>
            <div className="text-[10px] text-noir-400">Executive Floor Planner</div>
          </div>
        </div>
      </div>
    </header>
  );
}
