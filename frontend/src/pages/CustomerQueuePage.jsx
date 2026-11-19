import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { api } from '../services/api';
import AddCustomerModal from '../components/AddCustomerModal';
import { Users, Plus, Clock, Star, Trash2, CheckCircle2, ArrowRight, Sparkles, Search } from 'lucide-react';

export default function CustomerQueuePage() {
  const { refreshIndex, triggerRefresh, addToast, setActiveTab, globalSearch } = useRestaurant();
  const [customers, setCustomers] = useState([]);
  const [filter, setFilter] = useState('WAITING');
  const [showAddModal, setShowAddModal] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
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

  const handleAllocate = (cust) => {
    localStorage.setItem('bistro_selected_customer', cust.id.toString());
    setActiveTab('dashboard');
  };

  const formatWaitTime = (mins) => {
    if (mins === undefined || mins === null || mins <= 0) return 'Just arrived';
    if (mins > 1440) {
      const days = Math.floor(mins / 1440);
      return `${days}d ago (Demo Record)`;
    }
    if (mins > 60) {
      const hrs = Math.floor(mins / 60);
      const m = Math.round(mins % 60);
      return `${hrs}h ${m}m`;
    }
    return `${Math.round(mins)} mins`;
  };

  const query = (localSearch || globalSearch).toLowerCase().trim();
  const displayedCustomers = customers.filter((c) => {
    if (!query) return true;
    return (
      c.group_name.toLowerCase().includes(query) ||
      (c.special_requirements && c.special_requirements.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#28352D] dark:text-[#F3EFEA] font-serif tracking-tight">
            Customer Queue &amp; Seating Priority
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-[#98A89E] mt-0.5">
            Real-time walk-in guest flow organized by arrival order and priority.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#18201B] hover:bg-stone-50 dark:hover:bg-[#1F2A23] text-[#28352D] dark:text-[#F3EFEA] border border-[#E8E3DA] dark:border-[#2A382F] shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#55745E] dark:text-[#6E9A7B]" />
            AI Table Allocation
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#55745E] dark:bg-[#6E9A7B] hover:bg-[#45604D] dark:hover:bg-[#5B8267] text-white shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            + Add Customer
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs overflow-x-auto">
          {['WAITING', 'SEATED', 'COMPLETED', 'ALL'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3.5 py-2 rounded-xl font-medium transition-all border cursor-pointer shrink-0 ${
                filter === st
                  ? 'bg-[#55745E] dark:bg-[#6E9A7B] text-white border-[#55745E] dark:border-[#6E9A7B] shadow-xs font-bold'
                  : 'bg-white dark:bg-[#18201B] hover:bg-stone-50 dark:hover:bg-[#1F2A23] text-stone-600 dark:text-[#98A89E] border-[#E8E3DA] dark:border-[#2A382F]'
              }`}
            >
              {st === 'ALL' ? 'All Customers' : st}
            </button>
          ))}
        </div>

        {/* Local Search Input */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search party name or requirement..."
            className="w-full bg-white dark:bg-[#18201B] border border-[#E8E3DA] dark:border-[#2A382F] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#28352D] dark:text-[#F3EFEA] shadow-xs focus:outline-none focus:border-[#55745E] dark:focus:border-[#6E9A7B]"
          />
        </div>
      </div>

      {/* Queue Data Table */}
      <div className="bg-white dark:bg-[#18201B] rounded-3xl border border-[#E8E3DA] dark:border-[#2A382F] shadow-xs overflow-hidden transition-colors duration-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] dark:bg-[#111613] border-b border-[#E8E3DA] dark:border-[#2A382F] text-stone-500 dark:text-[#98A89E] font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 sm:px-6">Party Name</th>
                <th className="py-3.5 px-4">Size</th>
                <th className="py-3.5 px-4">Wait Time</th>
                <th className="py-3.5 px-4">Priority Level</th>
                <th className="py-3.5 px-4">Special Requests</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3DA] dark:divide-[#2A382F] text-[#28352D] dark:text-[#F3EFEA]">
              {displayedCustomers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-stone-400 dark:text-stone-500">
                    {localSearch || globalSearch
                      ? `No customer groups found matching "${localSearch || globalSearch}".`
                      : filter === 'WAITING'
                      ? 'No customers waiting'
                      : 'No customer groups found in this view.'}
                  </td>
                </tr>
              ) : (
                displayedCustomers.map((c) => {
                  return (
                    <tr key={c.id} className="hover:bg-stone-50/80 dark:hover:bg-[#1F2A23]/80 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="font-semibold text-[#28352D] dark:text-[#F3EFEA]">{c.group_name}</div>
                        <div className="text-[10px] text-stone-400 dark:text-stone-500 font-mono">ID: G{c.id.toString().padStart(3, '0')}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 font-semibold text-[#28352D] dark:text-[#F3EFEA]">
                          <Users className="w-3.5 h-3.5 text-[#55745E] dark:text-[#6E9A7B]" />
                          {c.group_size} Guests
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1 text-stone-600 dark:text-[#98A89E] font-medium">
                          <Clock className="w-3.5 h-3.5 text-[#55745E] dark:text-[#6E9A7B]" />
                          <span>{formatWaitTime(c.waiting_minutes)}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                            c.priority >= 3
                              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/40'
                              : c.priority === 2
                              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/40'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                          }`}
                        >
                          <Star className="w-3 h-3" />
                          Priority {c.priority}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-stone-500 dark:text-[#98A89E] text-[11px]">
                          {c.special_requirements || '—'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                            c.status === 'SEATED'
                              ? 'bg-[#55745E]/10 dark:bg-[#6E9A7B]/20 text-[#55745E] dark:text-[#6E9A7B] border-[#55745E]/20 dark:border-[#6E9A7B]/30'
                              : c.status === 'WAITING'
                              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/40'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                          }`}
                        >
                          {c.status}
                          {c.assigned_table_number && ` • Table ${c.assigned_table_number}`}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {c.status === 'WAITING' && (
                            <button
                              onClick={() => handleAllocate(c)}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#55745E] dark:bg-[#6E9A7B] hover:bg-[#45604D] dark:hover:bg-[#5B8267] text-white shadow-2xs transition-all cursor-pointer flex items-center gap-1"
                              title="Allocate table for this party"
                            >
                              <Sparkles className="w-3 h-3 text-[#C47A59] dark:text-[#DC8A66]" />
                              <span>Allocate</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(c)}
                            className="p-1 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                            title="Remove customer group"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
