import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import AuthModal from './AuthModal';
import {
  Menu,
  Search,
  Bell,
  RotateCcw,
  Clock,
  CheckCircle2,
  Zap,
  Box,
  Compass,
  UserCheck,
  ShieldAlert,
  LogOut,
  LogIn,
  Activity,
  Sparkles
} from 'lucide-react';

export default function TopNavbar({ onMenuToggle }) {
  const {
    activeTab,
    setActiveTab,
    serverOnline,
    triggerRefresh,
    addToast,
    globalSearch,
    setGlobalSearch,
    bg3DEnabled,
    setBg3DEnabled,
    aiProviderInfo,
  } = useRestaurant();

  const { user, isAuthenticated, isGuest, logout } = useAuth();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
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
    <>
      <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-[#E8E3DA] px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden text-stone-600 hover:text-[#28352D] p-2 rounded-xl hover:bg-stone-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:block">
            <div className="text-sm font-semibold text-[#28352D] flex items-center gap-2">
              <span
                onClick={() => setActiveTab('landing')}
                className="cursor-pointer font-serif font-bold text-base hover:text-[#55745E] transition-colors"
              >
                Saffron &amp; Sage
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-[#55745E]/10 text-[#55745E] border border-[#55745E]/20">
                AI Bistro
              </span>

              {/* Live Status Pill */}
              <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FAF7F2] text-stone-600 border border-[#E8E3DA]">
                <Zap className="w-3 h-3 text-[#55745E]" />
                <span>{serverOnline ? (aiProviderInfo || 'Groq LPU Active') : 'Demo Mode (Offline)'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Center: Global Search */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search tables, customer parties, servers..."
              className="w-full bg-[#FAF7F2] border border-[#E8E3DA] rounded-xl pl-9 pr-4 py-1.5 text-xs text-[#28352D] placeholder-stone-400 focus:outline-none focus:border-[#55745E] focus:ring-1 focus:ring-[#55745E]/20 transition-all"
            />
          </div>
        </div>

        {/* Right: Actions, Guest/Auth indicator, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Landing / Dashboard Toggle */}
          <button
            onClick={() => setActiveTab(activeTab === 'landing' ? 'dashboard' : 'landing')}
            title="Toggle between Landing Overview and Live Dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FAF7F2] hover:bg-stone-100 text-[#28352D] border border-[#E8E3DA] transition-all cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-[#55745E]" />
            <span className="hidden sm:inline">
              {activeTab === 'landing' ? 'Dashboard' : 'Home'}
            </span>
          </button>

          {/* 3D Background Toggle (Default Off) */}
          <button
            onClick={() => setBg3DEnabled(!bg3DEnabled)}
            title="Toggle 3D Ambient Perspective Background"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              bg3DEnabled
                ? 'bg-[#C47A59]/15 text-[#C47A59] border-[#C47A59]/40 font-semibold'
                : 'bg-[#FAF7F2] text-stone-500 border-[#E8E3DA] hover:text-[#28352D]'
            }`}
          >
            <Box className={`w-3.5 h-3.5 ${bg3DEnabled ? 'text-[#C47A59]' : 'text-stone-400'}`} />
            <span className="hidden sm:inline">3D</span>
          </button>

          {/* Live Clock */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-[#FAF7F2] border border-[#E8E3DA] rounded-xl text-stone-600 text-xs">
            <Clock className="w-3.5 h-3.5 text-[#55745E]" />
            <span>{formattedDate}</span>
            <span className="text-stone-400">•</span>
            <span className="font-mono font-medium text-[#28352D]">{formattedTime}</span>
          </div>

          {/* Reset DB Button */}
          <button
            onClick={handleResetDb}
            disabled={resetting}
            title="Reset database to pristine realistic sample scenario"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#FAF7F2] hover:bg-stone-100 text-[#28352D] border border-[#E8E3DA] transition-all disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-[#55745E] ${resetting ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">{resetting ? 'Resetting...' : 'Reset DB'}</span>
          </button>

          {/* Guest / Auth Status Badge */}
          {isAuthenticated ? (
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#55745E]/10 text-[#55745E] border border-[#55745E]/20">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#55745E]" />
              <span className="max-w-[100px] truncate">{user?.name?.split(' ')[0] || 'Manager'}</span>
            </div>
          ) : (
            <div
              onClick={() => setShowAuthModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 cursor-pointer hover:bg-amber-100 transition-colors"
              title="Click to sign in with Google"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>Guest Mode (Read-Only)</span>
            </div>
          )}

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-stone-500 hover:text-[#28352D] hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#55745E] ring-2 ring-white" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl p-3.5 z-50 text-xs border border-[#E8E3DA] animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E8E3DA] font-semibold text-[#28352D]">
                  <span>System Telemetry &amp; Alerts</span>
                  <span className="text-[10px] text-[#55745E] font-mono">Live</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8E3DA] flex items-start gap-2.5">
                    <Zap className="w-3.5 h-3.5 text-[#55745E] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-[#28352D]">Groq LPU Engine Active</div>
                      <div className="text-stone-500 text-[11px]">Sub-second inference and RAG grounder loaded.</div>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8E3DA] flex items-start gap-2.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C47A59] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-[#28352D]">5 Search Algorithms Available</div>
                      <div className="text-stone-500 text-[11px]">A*, Greedy, BFS, DFS, and Rules ready in Advanced Tools.</div>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8E3DA] flex items-start gap-2.5">
                    <Activity className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-[#28352D]">Guest Sandbox Isolation</div>
                      <div className="text-stone-500 text-[11px]">All guest allocations run safely in memory without changing live DB.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Account / Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
            >
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user.name || 'User'}
                  className="w-8 h-8 rounded-xl object-cover border border-[#E8E3DA]"
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-[#55745E] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {isAuthenticated ? (user?.name?.slice(0, 2).toUpperCase() || 'MD') : 'G'}
                </div>
              )}
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl p-3 z-50 text-xs border border-[#E8E3DA] animate-in fade-in duration-150 space-y-2">
                <div className="p-2 bg-[#FAF7F2] rounded-xl border border-[#E8E3DA]">
                  <div className="font-bold text-[#28352D]">
                    {isAuthenticated ? user?.name : 'Guest User'}
                  </div>
                  <div className="text-[11px] text-stone-500 truncate">
                    {isAuthenticated ? user?.email : 'Exploring in Read-Only Sandbox'}
                  </div>
                  <div className="mt-1">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                      isAuthenticated
                        ? 'bg-[#55745E]/10 text-[#55745E]'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isAuthenticated ? `Role: ${user?.role || 'Manager'}` : 'Guest Mode'}
                    </span>
                  </div>
                </div>

                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                      addToast('Signed out. Switched to Guest Mode.', 'info');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-stone-700 hover:bg-rose-50 hover:text-rose-600 transition-colors font-medium cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setShowAuthModal(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-[#55745E] text-white hover:bg-[#455E4C] transition-colors font-semibold cursor-pointer justify-center shadow-xs"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In with Google</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
