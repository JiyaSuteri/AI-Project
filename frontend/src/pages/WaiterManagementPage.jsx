import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { api } from '../services/api';
import { assetUrl } from '../utils/assetUrl';
import AddWaiterModal from '../components/AddWaiterModal';
import { UserCheck, Plus, CheckCircle2, XCircle, Trash2, Award, Clock, Search } from 'lucide-react';

export default function WaiterManagementPage() {
  const { refreshIndex, triggerRefresh, addToast, globalSearch } = useRestaurant();
  const [waiters, setWaiters] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWaiters = async () => {
      try {
        setLoading(true);
        const data = await api.getWaiters();
        setWaiters(data);
      } catch (err) {
        addToast(err.message || 'Failed to fetch waiters', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchWaiters();
  }, [refreshIndex]);

  const toggleAvailability = async (waiter) => {
    try {
      await api.updateWaiter(waiter.id, { availability: !waiter.availability });
      addToast(`Status updated for ${waiter.name}`, 'info');
      triggerRefresh();
    } catch (err) {
      addToast(err.message || 'Failed to update waiter', 'error');
    }
  };

  const handleDeleteWaiter = async (waiter) => {
    if (waiter.assigned_tables > 0) {
      addToast('Cannot delete a waiter with active assigned tables', 'error');
      return;
    }
    if (!window.confirm(`Delete waiter ${waiter.name}?`)) return;

    try {
      await api.deleteWaiter(waiter.id);
      addToast(`Waiter ${waiter.name} removed`, 'info');
      triggerRefresh();
    } catch (err) {
      addToast(err.message || 'Failed to delete waiter', 'error');
    }
  };

  const q = (localSearch || globalSearch).toLowerCase().trim();
  const displayedWaiters = waiters.filter((w) => {
    if (!q) return true;
    return w.name.toLowerCase().includes(q) || (w.section && w.section.toLowerCase().includes(q));
  });

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#28352D] dark:text-[#F3EFEA] font-serif tracking-tight">
            Waiter &amp; Staff Workload Management
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-[#98A89E] mt-0.5">
            Monitor floor service workloads, active assigned stations, and turnover performance.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search waiter..."
              className="bg-white dark:bg-[#18201B] border border-[#E8E3DA] dark:border-[#2A382F] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#28352D] dark:text-[#F3EFEA] shadow-xs focus:outline-none focus:border-[#55745E] dark:focus:border-[#6E9A7B]"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#55745E] dark:bg-[#6E9A7B] hover:bg-[#45604D] dark:hover:bg-[#5B8267] text-white shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Waiter
          </button>
        </div>
      </div>

      {/* Waiters Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedWaiters.map((w) => {
          const loadPercent = Math.min(100, Math.round((w.assigned_tables / w.max_tables) * 100));
          let barColor = 'bg-[#55745E] dark:bg-[#6E9A7B]';
          if (loadPercent >= 75) barColor = 'bg-rose-500';
          else if (loadPercent >= 50) barColor = 'bg-amber-500';

          return (
            <div
              key={w.id}
              className="bg-white dark:bg-[#18201B] rounded-3xl p-5 border border-[#E8E3DA] dark:border-[#2A382F] shadow-xs hover:shadow-md dark:hover:border-[#384A3E] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-2xl bg-[#55745E]/10 dark:bg-[#6E9A7B]/20 text-[#55745E] dark:text-[#6E9A7B] border border-[#55745E]/20 dark:border-[#6E9A7B]/30 font-bold text-sm flex items-center justify-center shadow-xs overflow-hidden shrink-0">
                      <span className="absolute inset-0 flex items-center justify-center select-none">
                        {w.name.split(' ').map((n) => n[0]).join('')}
                      </span>
                      <img
                        src={assetUrl(`/avatars/waiter-${((w.id - 1) % 6) + 1}.svg`)}
                        alt={`${w.name} avatar`}
                        className="relative z-10 w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                    <div>
                      <div className="font-bold text-[#28352D] dark:text-[#F3EFEA] text-sm">{w.name}</div>
                      <div className="text-[11px] text-stone-500 dark:text-[#98A89E]">
                        Shift: {w.shift} • ID: W{w.id}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleAvailability(w)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border cursor-pointer ${
                      w.availability
                        ? 'bg-[#55745E]/10 dark:bg-[#6E9A7B]/20 text-[#55745E] dark:text-[#6E9A7B] border-[#55745E]/20 dark:border-[#6E9A7B]/30'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${w.availability ? 'bg-[#55745E] dark:bg-[#6E9A7B]' : 'bg-stone-400'}`} />
                    {w.availability ? 'On Duty' : 'Off Duty'}
                  </button>
                </div>

                {/* Assigned load progress */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-500 dark:text-[#98A89E]">Current Load</span>
                    <span className="font-bold text-[#28352D] dark:text-[#F3EFEA]">
                      {w.assigned_tables} / {w.max_tables} tables ({loadPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                    <div
                      className={`h-full ${barColor} transition-all duration-300 rounded-full`}
                      style={{ width: `${loadPercent}%` }}
                    />
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#E8E3DA] dark:border-[#2A382F] text-xs">
                  <div className="p-2 rounded-xl bg-[#FAF7F2] dark:bg-[#111613] border border-[#E8E3DA] dark:border-[#2A382F]">
                    <div className="text-[10px] text-stone-400 dark:text-stone-500 flex items-center gap-1">
                      <Award className="w-3 h-3 text-[#C47A59] dark:text-[#DC8A66]" /> Performance
                    </div>
                    <div className="font-bold text-[#28352D] dark:text-[#F3EFEA] text-sm mt-0.5">
                      {w.performance_rating ? `${w.performance_rating.toFixed(1)} / 5.0` : '4.8 / 5.0'}
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-[#FAF7F2] dark:bg-[#111613] border border-[#E8E3DA] dark:border-[#2A382F]">
                    <div className="text-[10px] text-stone-400 dark:text-stone-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#55745E] dark:text-[#6E9A7B]" /> Turnover Rate
                    </div>
                    <div className="font-bold text-[#28352D] dark:text-[#F3EFEA] text-sm mt-0.5">
                      {w.turnover_rate ? `${w.turnover_rate}m` : '38m avg'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Delete action */}
              <div className="mt-4 pt-3 border-t border-[#E8E3DA] dark:border-[#2A382F] flex items-center justify-between text-xs">
                <span className="text-[11px] text-stone-400 dark:text-stone-500">Section: Main Floor</span>
                <button
                  onClick={() => handleDeleteWaiter(w)}
                  disabled={w.assigned_tables > 0}
                  className="text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 disabled:opacity-30 disabled:hover:text-stone-400 transition-colors cursor-pointer"
                  title={w.assigned_tables > 0 ? 'Cannot remove while tables are assigned' : 'Remove waiter'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <AddWaiterModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}
