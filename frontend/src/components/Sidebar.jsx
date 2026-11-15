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
          className="fixed inset-0 bg-stone-900/30 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-[#E8E3DA] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#E8E3DA]">
          <div
            onClick={() => handleSelect('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#55745E] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-serif font-bold text-[#28352D] tracking-wide text-base group-hover:text-[#55745E] transition-colors">
                Saffron &amp; Sage
              </div>
              <div className="text-[10px] text-[#C47A59] font-mono tracking-wider uppercase font-semibold">
                AI Bistro Planner
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-stone-400 hover:text-stone-700 p-1 rounded-lg"
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
                ? 'bg-[#55745E] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100 hover:text-[#28352D]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Project Home</span>
          </button>
        </div>

        {/* 7 Focused Dashboard Navigation Items */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
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
                    ? 'bg-[#55745E]/10 text-[#55745E] font-bold border-r-3 border-[#55745E]'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-[#28352D]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-[#55745E]' : 'text-stone-400 group-hover:text-[#55745E]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold tracking-wide uppercase ${
                      isActive
                        ? 'bg-[#55745E] text-white'
                        : 'bg-stone-100 text-stone-600 border border-stone-200'
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
        <div className="p-3 border-t border-[#E8E3DA] bg-[#FAF7F2]">
          {isAuthenticated && user ? (
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-[#E8E3DA] shadow-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#55745E]/15 text-[#55745E] font-bold flex items-center justify-center shrink-0 text-xs">
                  {user.name ? user.name[0].toUpperCase() : 'M'}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#28352D] truncate">{user.name}</div>
                  <div className="text-[10px] text-stone-500 font-mono truncate">{user.email}</div>
                </div>
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-white border border-[#E8E3DA] shadow-xs space-y-1.5 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-stone-700">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Guest Mode Active</span>
              </div>
              <p className="text-[10px] text-stone-500 leading-tight">
                Demo sandbox active. Database edits require login.
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
