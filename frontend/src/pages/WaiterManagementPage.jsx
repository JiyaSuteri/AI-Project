import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { api } from '../services/api';
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
          <h1 className="text-xl sm:text-2xl font-bold text-[#28352D] font-serif tracking-tight">
            Waiter &amp; Staff Workload Management
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Monitor floor service workloads, active assigned stations, and turnover performance.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search waiter..."
              className="bg-white border border-[#E8E3DA] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#28352D] shadow-xs focus:outline-none focus:border-[#55745E]"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#55745E] hover:bg-[#45604D] text-white shadow-xs transition-all cursor-pointer"
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
          let barColor = 'bg-[#55745E]';
          if (loadPercent >= 75) barColor = 'bg-rose-500';
          else if (loadPercent >= 50) barColor = 'bg-amber-500';

          return (
            <div
              key={w.id}
              className="bg-white rounded-3xl p-5 border border-[#E8E3DA] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#55745E]/10 text-[#55745E] border border-[#55745E]/20 font-bold text-sm flex items-center justify-center shadow-xs">
                      {w.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-bold text-[#28352D] text-sm">{w.name}</div>
                      <div className="text-[11px] text-stone-500">
                        Shift: {w.shift} • ID: W{w.id}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleAvailability(w)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border cursor-pointer ${
                      w.availability
                        ? 'bg-[#55745E]/10 text-[#55745E] border-[#55745E]/20'
                        : 'bg-stone-100 text-stone-500 border-stone-200'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${w.availability ? 'bg-[#55745E]' : 'bg-stone-400'}`} />
                    {w.availability ? 'On Duty' : 'Off Duty'}
                  </button>
                </div>

                {/* Assigned load progress */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-500">Current Load</span>
                    <span className="font-bold text-[#28352D]">
                      {w.assigned_tables} / {w.max_tables} tables ({loadPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className={`h-full ${barColor} transition-all duration-300 rounded-full`}
                      style={{ width: `${loadPercent}%` }}
                    />
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#E8E3DA] text-xs">
                  <div className="p-2 rounded-xl bg-[#FAF7F2] border border-[#E8E3DA]">
                    <div className="text-[10px] text-stone-400 flex items-center gap-1">
                      <Award className="w-3 h-3 text-[#C47A59]" /> Performance
                    </div>
                    <div className="font-bold text-[#28352D] text-sm mt-0.5">
                      {w.performance_rating ? `${w.performance_rating.toFixed(1)} / 5.0` : '4.8 / 5.0'}
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-[#FAF7F2] border border-[#E8E3DA]">
                    <div className="text-[10px] text-stone-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#55745E]" /> Turnover Rate
                    </div>
                    <div className="font-bold text-[#28352D] text-sm mt-0.5">
                      {w.turnover_rate ? `${w.turnover_rate}m` : '38m avg'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Delete action */}
              <div className="mt-4 pt-3 border-t border-[#E8E3DA] flex items-center justify-between text-xs">
                <span className="text-[11px] text-stone-400">Section: Main Floor</span>
                <button
                  onClick={() => handleDeleteWaiter(w)}
                  disabled={w.assigned_tables > 0}
                  className="text-stone-400 hover:text-rose-600 disabled:opacity-30 disabled:hover:text-stone-400 transition-colors cursor-pointer"
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
