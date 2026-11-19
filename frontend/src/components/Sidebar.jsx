import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  LayoutGrid,
  Users,
  CalendarDays,
  UserCheck,
  BotMessageSquare,
  Wrench,
  Settings,
  UtensilsCrossed,
  Sparkles,
  LogOut,
  Shield,
  X,
  Compass
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'tables', label: 'Tables', icon: LayoutGrid },
  { id: 'queue', label: 'Customers', icon: Users },
  { id: 'reservations', label: 'Reservations', icon: CalendarDays },
  { id: 'waiters', label: 'Waiters', icon: UserCheck },
  { id: 'advanced', label: 'Advanced Tools', icon: Wrench, badge: '5 Algos' },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }) {
  const { activeTab, setActiveTab } = useRestaurant();
  const { user, isAuthenticated, isGuest, logout } = useAuth();

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
          className="fixed inset-0 bg-stone-900/40 dark:bg-black/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-[#18201B] border-r border-[#E8E3DA] dark:border-[#2A382F] flex flex-col transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#E8E3DA] dark:border-[#2A382F]">
          <div
            onClick={() => handleSelect('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#55745E] dark:bg-[#6E9A7B] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform overflow-hidden p-1">
              <img
                src="/brand/bistro-crest.svg"
                alt="Saffron &amp; Sage Brand Crest"
                className="w-full h-full object-contain"
                loading="eager"
              />
            </div>
            <div>
              <div className="font-serif font-bold text-[#28352D] dark:text-[#F3EFEA] tracking-wide text-base group-hover:text-[#55745E] dark:group-hover:text-[#6E9A7B] transition-colors">
                Saffron &amp; Sage
              </div>
              <div className="text-[10px] text-[#C47A59] dark:text-[#DC8A66] font-mono tracking-wider uppercase font-semibold">
                AI Bistro Planner
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="lg:hidden text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Link to Landing Page */}
        <div className="px-3 pt-3">
          <button
            onClick={() => handleSelect('landing')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'landing'
                ? 'bg-[#55745E] dark:bg-[#6E9A7B] text-white shadow-xs'
                : 'text-stone-600 dark:text-[#98A89E] hover:bg-stone-100 dark:hover:bg-[#1F2A23] hover:text-[#28352D] dark:hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Project Home</span>
          </button>
        </div>

        {/* 7 Focused Dashboard Navigation Items */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
            Operations &amp; Intelligence
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#55745E]/10 dark:bg-[#6E9A7B]/15 text-[#55745E] dark:text-[#6E9A7B] font-bold border-r-3 border-[#55745E] dark:border-[#6E9A7B]'
                    : 'text-stone-600 dark:text-[#98A89E] hover:bg-stone-50 dark:hover:bg-[#1F2A23] hover:text-[#28352D] dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? 'text-[#55745E] dark:text-[#6E9A7B]'
                        : 'text-stone-400 dark:text-stone-500 group-hover:text-[#55745E] dark:group-hover:text-[#6E9A7B]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold tracking-wide uppercase ${
                      isActive
                        ? 'bg-[#55745E] dark:bg-[#6E9A7B] text-white'
                        : 'bg-stone-100 dark:bg-[#1F2A23] text-stone-600 dark:text-[#98A89E] border border-stone-200 dark:border-[#2A382F]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* User / Guest Status Footer */}
        <div className="p-3 border-t border-[#E8E3DA] dark:border-[#2A382F] bg-[#FAF7F2] dark:bg-[#111613]">
          {isAuthenticated && user ? (
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white dark:bg-[#1F2A23] border border-[#E8E3DA] dark:border-[#2A382F] shadow-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#55745E]/15 dark:bg-[#6E9A7B]/20 text-[#55745E] dark:text-[#6E9A7B] font-bold flex items-center justify-center shrink-0 text-xs">
                  {user.name ? user.name[0].toUpperCase() : 'M'}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#28352D] dark:text-[#F3EFEA] truncate">{user.name}</div>
                  <div className="text-[10px] text-stone-500 dark:text-[#98A89E] font-mono truncate">{user.email}</div>
                </div>
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="p-1.5 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-stone-100 dark:hover:bg-[#18201B] transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-white dark:bg-[#1F2A23] border border-[#E8E3DA] dark:border-[#2A382F] shadow-xs space-y-1.5 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Guest Mode Active</span>
              </div>
              <p className="text-[10px] text-stone-500 dark:text-[#98A89E] leading-tight">
                Demo sandbox active. Database edits require login.
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
