import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { api } from '../services/api';
import AddCustomerModal from '../components/AddCustomerModal';
import { Users, Plus, Clock, Star, Trash2, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function CustomerQueuePage() {
  const { refreshIndex, triggerRefresh, addToast, setActiveTab, globalSearch } = useRestaurant();
  const [customers, setCustomers] = useState([]);
  const [filter, setFilter] = useState('WAITING');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await api.getCustomers(filter === 'ALL' ? null : filter);
        setCustomers(data);
      } catch (err) {
        addToast(err.message || 'Failed to fetch customer queue', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [filter, refreshIndex]);

  const handleDelete = async (cust) => {
    if (!window.confirm(`Remove party '${cust.group_name}' from queue?`)) return;
    try {
      await api.deleteCustomer(cust.id);
      addToast(`Customer group '${cust.group_name}' removed`, 'info');
      triggerRefresh();
    } catch (err) {
      addToast(err.message || 'Failed to remove customer', 'error');
    }
  };

  const displayedCustomers = customers.filter((c) => {
    if (!globalSearch) return true;
    return (
      c.group_name.toLowerCase().includes(globalSearch.toLowerCase()) ||
      (c.special_requirements && c.special_requirements.toLowerCase().includes(globalSearch.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Customer Queue & Seating Priority
          </h1>
          <p className="text-xs sm:text-sm text-noir-400 mt-0.5">
            Real-time walk-in guest flow organized by FIFO arrival order and priority weights.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('allocation')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-noir-900 hover:bg-noir-850 text-white border border-white/10 shadow-xs transition-all"
          >
            Run AI Allocation
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-champagne-500 to-champagne-600 hover:from-champagne-400 hover:to-champagne-500 text-noir-950 shadow-glow-champagne transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Party to Queue
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        {['WAITING', 'SEATED', 'COMPLETED', 'ALL'].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3.5 py-2 rounded-xl font-medium transition-all border ${
              filter === st
                ? 'bg-champagne-500/20 text-champagne-300 border-champagne-500/40 shadow-glow-champagne'
                : 'bg-noir-900/60 hover:bg-noir-850 text-noir-400 border-white/5 hover:text-white'
            }`}
          >
            {st === 'ALL' ? 'All Customers' : st}
          </button>
        ))}
      </div>

      {/* Customer Queue Table */}
      <div className="glass-panel rounded-3xl border border-white/10 shadow-3d-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-noir-900/80 border-b border-white/10 text-noir-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 sm:px-6">Party Name & ID</th>
                <th className="py-3.5 px-4">Group Size</th>
                <th className="py-3.5 px-4">Waiting Time</th>
                <th className="py-3.5 px-4">Priority Level</th>
                <th className="py-3.5 px-4">Special Requests</th>
                <th className="py-3.5 px-4">Status & Table</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-noir-200">
              {displayedCustomers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-noir-500">
                    No customer groups found matching the current filter.
                  </td>
                </tr>
              ) : (
                displayedCustomers.map((c) => {
                  let waitWarning = c.waiting_minutes > 20;

                  return (
                    <tr key={c.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="font-semibold text-white">{c.group_name}</div>
                        <div className="text-[10px] text-noir-500 font-mono">ID: G{c.id.toString().padStart(3, '0')}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 font-semibold text-champagne-300">
                          <Users className="w-3.5 h-3.5 text-champagne-400" />
                          {c.group_size} Guests
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className={`inline-flex items-center gap-1 font-medium ${waitWarning ? 'text-rose-400 font-bold' : 'text-noir-300'}`}>
                          <Clock className="w-3.5 h-3.5" />
                          <span>{c.waiting_minutes ?? 0} mins</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                            c.priority >= 3
                              ? 'bg-rose-950/80 text-rose-300 border-rose-500/30'
                              : c.priority === 2
                              ? 'bg-amber-950/80 text-amber-300 border-amber-500/30'
                              : 'bg-noir-850 text-noir-300 border-white/10'
                          }`}
                        >
                          <Star className="w-3 h-3" />
                          Priority {c.priority}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-noir-400 text-[11px]">
                          {c.special_requirements || '—'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                            c.status === 'SEATED'
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                              : c.status === 'WAITING'
                              ? 'bg-amber-950/80 text-amber-300 border-amber-500/30'
                              : 'bg-noir-900 text-noir-400 border-white/10'
                          }`}
                        >
                          {c.status}
                          {c.assigned_table_number && ` • Table ${c.assigned_table_number}`}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDelete(c)}
                          className="p-1 text-noir-400 hover:text-rose-400 transition-colors"
                          title="Remove customer group"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddCustomerModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}
