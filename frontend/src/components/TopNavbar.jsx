import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
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
  Sparkles,
  Sun,
  Moon,
  Laptop
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
  const { themeMode, setThemeMode, isDark } = useTheme();

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
      <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-[#18201B]/95 backdrop-blur-md border-b border-[#E8E3DA] dark:border-[#2A382F] px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors duration-200">
        {/* Left: Mobile hamburger & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            aria-label="Toggle navigation menu"
            className="lg:hidden text-stone-600 dark:text-[#98A89E] hover:text-[#28352D] dark:hover:text-white p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-[#1F2A23] transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:block">
            <div className="text-sm font-semibold text-[#28352D] dark:text-[#F3EFEA] flex items-center gap-2">
              <img
                src="/brand/bistro-crest.svg"
                alt=""
                aria-hidden="true"
                className="w-5 h-5 object-contain"
                loading="eager"
              />
              <span
                onClick={() => setActiveTab('landing')}
                className="cursor-pointer font-serif font-bold text-base hover:text-[#55745E] dark:hover:text-[#6E9A7B] transition-colors"
              >
                Saffron &amp; Sage
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-[#55745E]/10 text-[#55745E] dark:bg-[#6E9A7B]/15 dark:text-[#6E9A7B] border border-[#55745E]/20 dark:border-[#6E9A7B]/30">
                AI Bistro
              </span>

              {/* Live Status Pill */}
              <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FAF7F2] dark:bg-[#111613] text-stone-600 dark:text-[#98A89E] border border-[#E8E3DA] dark:border-[#2A382F]">
                <Zap className="w-3 h-3 text-[#55745E] dark:text-[#6E9A7B]" />
                <span>{serverOnline ? (aiProviderInfo || 'Groq LPU Active') : 'Demo Mode (Offline)'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Center: Global Search */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search tables, customer parties, servers... (Press / to search)"
              className="w-full bg-[#FAF7F2] dark:bg-[#111613] border border-[#E8E3DA] dark:border-[#2A382F] rounded-xl pl-9 pr-4 py-1.5 text-xs text-[#28352D] dark:text-[#F3EFEA] placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-[#55745E] dark:focus:border-[#6E9A7B] focus:ring-1 focus:ring-[#55745E]/20 dark:focus:ring-[#6E9A7B]/30 transition-all"
            />
          </div>
        </div>

        {/* Right: Actions, Theme Selector, Guest/Auth indicator, Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Compact Theme Selector (Light, Dark, System) */}
          <div
            role="group"
            aria-label="Theme preference selector"
            className="flex items-center bg-[#FAF7F2] dark:bg-[#111613] border border-[#E8E3DA] dark:border-[#2A382F] rounded-xl p-0.5 shadow-2xs"
          >
            <button
              onClick={() => setThemeMode('light')}
              title="Light theme"
              aria-label="Switch to Light Theme"
              className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                themeMode === 'light'
                  ? 'bg-white dark:bg-[#1F2A23] text-[#55745E] dark:text-[#6E9A7B] shadow-2xs font-semibold'
                  : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setThemeMode('dark')}
              title="Dark theme"
              aria-label="Switch to Dark Theme"
              className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                themeMode === 'dark'
                  ? 'bg-[#1F2A23] text-[#6E9A7B] shadow-2xs font-semibold'
                  : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setThemeMode('system')}
              title="System theme"
              aria-label="Use System Theme"
              className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                themeMode === 'system'
                  ? 'bg-white dark:bg-[#1F2A23] text-[#55745E] dark:text-[#6E9A7B] shadow-2xs font-semibold'
                  : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Landing / Dashboard Toggle */}
          <button
            onClick={() => setActiveTab(activeTab === 'landing' ? 'dashboard' : 'landing')}
            title="Toggle between Landing Overview and Live Dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FAF7F2] dark:bg-[#111613] hover:bg-stone-100 dark:hover:bg-[#1F2A23] text-[#28352D] dark:text-[#F3EFEA] border border-[#E8E3DA] dark:border-[#2A382F] transition-all cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-[#55745E] dark:text-[#6E9A7B]" />
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
                ? 'bg-[#C47A59]/15 dark:bg-[#C47A59]/25 text-[#C47A59] dark:text-[#DC8A66] border-[#C47A59]/40 font-semibold'
                : 'bg-[#FAF7F2] dark:bg-[#111613] text-stone-500 dark:text-[#98A89E] border-[#E8E3DA] dark:border-[#2A382F] hover:text-[#28352D] dark:hover:text-white'
            }`}
          >
            <Box className={`w-3.5 h-3.5 ${bg3DEnabled ? 'text-[#C47A59]' : 'text-stone-400 dark:text-stone-500'}`} />
            <span className="hidden sm:inline">3D Ambient</span>
          </button>

          {/* Live Clock */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-[#FAF7F2] dark:bg-[#111613] border border-[#E8E3DA] dark:border-[#2A382F] rounded-xl text-stone-600 dark:text-[#98A89E] text-xs">
            <Clock className="w-3.5 h-3.5 text-[#55745E] dark:text-[#6E9A7B]" />
            <span>{formattedDate}</span>
            <span className="text-stone-300 dark:text-stone-600">•</span>
            <span className="font-mono font-medium text-[#28352D] dark:text-[#F3EFEA]">{formattedTime}</span>
          </div>

          {/* Reset DB Button */}
          <button
            onClick={handleResetDb}
            disabled={resetting}
            title="Reset database to pristine realistic sample scenario"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#FAF7F2] dark:bg-[#111613] hover:bg-stone-100 dark:hover:bg-[#1F2A23] text-[#28352D] dark:text-[#F3EFEA] border border-[#E8E3DA] dark:border-[#2A382F] transition-all disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-[#55745E] dark:text-[#6E9A7B] ${resetting ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">{resetting ? 'Resetting...' : 'Reset DB'}</span>
          </button>

          {/* Guest / Auth Status Badge */}
          {isAuthenticated ? (
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#55745E]/10 dark:bg-[#6E9A7B]/20 text-[#55745E] dark:text-[#6E9A7B] border border-[#55745E]/20 dark:border-[#6E9A7B]/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#55745E] dark:text-[#6E9A7B]" />
              <span className="max-w-[100px] truncate">{user?.name?.split(' ')[0] || 'Manager'}</span>
            </div>
          ) : (
            <div
              onClick={() => setShowAuthModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-950/60 transition-colors"
              title="Click to sign in with Google"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Guest Mode</span>
            </div>
          )}

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="View system notifications"
              className="relative p-2 rounded-xl text-stone-500 dark:text-[#98A89E] hover:text-[#28352D] dark:hover:text-white hover:bg-stone-100 dark:hover:bg-[#1F2A23] transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#55745E] dark:bg-[#6E9A7B] ring-2 ring-white dark:ring-[#18201B]" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1F2A23] rounded-2xl shadow-xl dark:shadow-2xl p-3.5 z-50 text-xs border border-[#E8E3DA] dark:border-[#2A382F] animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E8E3DA] dark:border-[#2A382F] font-semibold text-[#28352D] dark:text-[#F3EFEA]">
                  <span>System Telemetry &amp; Alerts</span>
                  <span className="text-[10px] text-[#55745E] dark:text-[#6E9A7B] font-mono">Live</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#18201B] border border-[#E8E3DA] dark:border-[#2A382F] flex items-start gap-2.5">
                    <Zap className="w-3.5 h-3.5 text-[#55745E] dark:text-[#6E9A7B] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-[#28352D] dark:text-[#F3EFEA]">Groq LPU Engine Active</div>
                      <div className="text-stone-500 dark:text-[#98A89E] text-[11px]">Sub-second inference and RAG grounder loaded.</div>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#18201B] border border-[#E8E3DA] dark:border-[#2A382F] flex items-start gap-2.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C47A59] dark:text-[#DC8A66] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-[#28352D] dark:text-[#F3EFEA]">5 Search Algorithms Available</div>
                      <div className="text-stone-500 dark:text-[#98A89E] text-[11px]">A*, Greedy, BFS, DFS, and Rules ready in Advanced Tools.</div>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#18201B] border border-[#E8E3DA] dark:border-[#2A382F] flex items-start gap-2.5">
                    <Activity className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-[#28352D] dark:text-[#F3EFEA]">Guest Sandbox Isolation</div>
                      <div className="text-stone-500 dark:text-[#98A89E] text-[11px]">All guest allocations run safely in memory without changing live DB.</div>
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
              aria-label="User account menu"
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-stone-100 dark:hover:bg-[#1F2A23] transition-colors cursor-pointer"
            >
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user.name || 'User'}
                  className="w-8 h-8 rounded-xl object-cover border border-[#E8E3DA] dark:border-[#2A382F]"
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-[#55745E] dark:bg-[#6E9A7B] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {isAuthenticated ? (user?.name?.slice(0, 2).toUpperCase() || 'MD') : 'G'}
                </div>
              )}
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1F2A23] rounded-2xl shadow-xl dark:shadow-2xl p-3 z-50 text-xs border border-[#E8E3DA] dark:border-[#2A382F] animate-in fade-in duration-150 space-y-2">
                <div className="p-2 bg-[#FAF7F2] dark:bg-[#18201B] rounded-xl border border-[#E8E3DA] dark:border-[#2A382F]">
                  <div className="font-bold text-[#28352D] dark:text-[#F3EFEA]">
                    {isAuthenticated ? user?.name : 'Guest User'}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-[#98A89E] truncate">
                    {isAuthenticated ? user?.email : 'Exploring in Read-Only Sandbox'}
                  </div>
                  <div className="mt-1">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                      isAuthenticated
                        ? 'bg-[#55745E]/10 dark:bg-[#6E9A7B]/20 text-[#55745E] dark:text-[#6E9A7B]'
                        : 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
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
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400 transition-colors font-medium cursor-pointer"
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
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-[#55745E] hover:bg-[#45604D] text-white transition-colors font-semibold cursor-pointer justify-center shadow-xs"
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
