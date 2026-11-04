import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { api } from '../services/api';
import AddWaiterModal from '../components/AddWaiterModal';
import { UserCheck, Plus, CheckCircle2, XCircle, Trash2, Award, Clock } from 'lucide-react';

export default function WaiterManagementPage() {
  const { refreshIndex, triggerRefresh, addToast, globalSearch } = useRestaurant();
  const [waiters, setWaiters] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
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

  const displayedWaiters = waiters.filter((w) => {
    if (!globalSearch) return true;
    return w.name.toLowerCase().includes(globalSearch.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Waiter & Staff Workload Management
          </h1>
          <p className="text-xs sm:text-sm text-noir-400 mt-0.5">
            Monitor floor service workloads, active assigned stations, and turnover performance.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-champagne-500 to-champagne-600 hover:from-champagne-400 hover:to-champagne-500 text-noir-950 shadow-glow-champagne transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Waiter
        </button>
      </div>

      {/* Waiters Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedWaiters.map((w) => {
          const loadPercent = Math.min(100, Math.round((w.assigned_tables / w.max_tables) * 100));
          let barColor = 'bg-emerald-500';
          if (loadPercent >= 75) barColor = 'bg-rose-500';
          else if (loadPercent >= 50) barColor = 'bg-amber-500';

          return (
            <div
              key={w.id}
              className="glass-panel glass-card-hover rounded-3xl p-5 border border-white/10 shadow-3d-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-noir-850 text-champagne-300 border border-white/10 font-bold text-sm flex items-center justify-center shadow-xs">
                      {w.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{w.name}</h3>
                      <span className="text-[11px] text-noir-400 font-mono">ID: W{w.id.toString().padStart(2, '0')}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleAvailability(w)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
                      w.availability
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                        : 'bg-noir-900 text-noir-400 border-white/10'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${w.availability ? 'bg-emerald-400' : 'bg-noir-500'}`} />
                    {w.availability ? 'Available' : 'Off-duty'}
                  </button>
                </div>

                {/* Workload Progress Bar */}
                <div className="my-4 p-3 rounded-2xl bg-noir-900/60 border border-white/5">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-noir-400 font-medium">Assigned Tables</span>
                    <span className="font-semibold text-white">
                      {w.assigned_tables} / {w.max_tables} ({loadPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-noir-950 overflow-hidden">
                    <div
                      className={`h-full ${barColor} transition-all duration-300 rounded-full`}
                      style={{ width: `${loadPercent}%` }}
                    />
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-noir-900/40 border border-white/5">
                    <span className="text-[10px] text-noir-400 block uppercase">Completed</span>
                    <span className="font-bold text-white flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-champagne-400" />
                      {w.completed_orders} Orders
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-noir-900/40 border border-white/5">
                    <span className="text-[10px] text-noir-400 block uppercase">Workload Score</span>
                    <span className="font-bold text-champagne-300 font-mono">
                      {w.workload_score.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Delete action */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-noir-400">
                  {w.assigned_tables > 0 ? `${w.assigned_tables} active table(s)` : 'Idle, ready for assignment'}
                </span>
                <button
                  onClick={() => handleDeleteWaiter(w)}
                  disabled={w.assigned_tables > 0}
                  className="text-noir-400 hover:text-rose-400 transition-colors disabled:opacity-30 p-1"
                  title="Delete waiter"
                >
                  <Trash2 className="w-3.5 h-3.5" />
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
