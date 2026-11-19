import React, { useState } from 'react';
import Modal from './Modal';
import { api } from '../services/api';
import { useRestaurant } from '../context/RestaurantContext';
import { Users, User, MapPin, Check, RefreshCw, Trash2, ArrowRight } from 'lucide-react';

export default function TableDetailsModal({ table, isOpen, onClose, waiters = [] }) {
  const { triggerRefresh, addToast } = useRestaurant();
  const [loading, setLoading] = useState(false);

  if (!table) return null;

  const handleUpdateStatus = async (newStatus) => {
    try {
      setLoading(true);
      await api.updateTableStatus(table.id, newStatus);
      addToast(`Table ${table.table_number} status updated to ${newStatus}`, 'success');
      triggerRefresh();
      onClose();
    } catch (err) {
      addToast(err.message || 'Failed to update table status', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetTable = async () => {
    try {
      setLoading(true);
      await api.resetTable(table.id);
      addToast(`Table ${table.table_number} reset to AVAILABLE`, 'success');
      triggerRefresh();
      onClose();
    } catch (err) {
      addToast(err.message || 'Failed to reset table', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTable = async () => {
    if (!window.confirm(`Are you sure you want to delete Table ${table.table_number}?`)) return;
    try {
      setLoading(true);
      await api.deleteTable(table.id);
      addToast(`Table ${table.table_number} deleted`, 'info');
      triggerRefresh();
      onClose();
    } catch (err) {
      addToast(err.message || 'Failed to delete table', 'error');
    } finally {
      setLoading(false);
    }
  };

  const STATUSES = ['AVAILABLE', 'OCCUPIED', 'RESERVED', 'CLEANING', 'UNAVAILABLE'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Table ${table.table_number} Details`}
      subtitle={`Zone: ${table.location} • Capacity: ${table.capacity} seats`}
    >
      <div className="space-y-5 text-sm">
        {/* Table Overview Card */}
        <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#111613] border border-[#E8E3DA] dark:border-[#2A382F] grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-stone-500 dark:text-[#98A89E] block mb-0.5">Current Status</span>
            <span className="font-semibold text-[#55745E] dark:text-[#6E9A7B] px-2 py-0.5 rounded-lg bg-[#55745E]/10 dark:bg-[#6E9A7B]/20 border border-[#55745E]/20 dark:border-[#6E9A7B]/30 inline-block">
              {table.status}
            </span>
          </div>
          <div>
            <span className="text-stone-500 dark:text-[#98A89E] block mb-0.5">Seating Capacity</span>
            <span className="font-semibold text-[#28352D] dark:text-[#F3EFEA] flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#55745E] dark:text-[#6E9A7B]" />
              {table.capacity} Guests
            </span>
          </div>

          <div>
            <span className="text-stone-500 dark:text-[#98A89E] block mb-0.5">Assigned Waiter</span>
            <span className="font-semibold text-[#28352D] dark:text-[#F3EFEA] flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
              {table.waiter_name || 'None'}
            </span>
          </div>

          <div>
            <span className="text-stone-500 dark:text-[#98A89E] block mb-0.5">Current Customer</span>
            <span className="font-semibold text-[#28352D] dark:text-[#F3EFEA]">
              {table.group_name ? `${table.group_name} (${table.group_size}p)` : 'None'}
            </span>
          </div>
        </div>

        {/* Change Status Fast Buttons */}
        <div>
          <label className="text-xs font-semibold text-stone-500 dark:text-[#98A89E] block mb-2 uppercase tracking-wider">
            Transition Operational State
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {STATUSES.map((st) => (
              <button
                key={st}
                onClick={() => handleUpdateStatus(st)}
                disabled={loading || table.status === st}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  table.status === st
                    ? 'bg-[#55745E] dark:bg-[#6E9A7B] text-white border-[#55745E] dark:border-[#6E9A7B] shadow-xs'
                    : 'bg-white dark:bg-[#1F2A23] hover:bg-stone-50 dark:hover:bg-[#26332B] text-stone-700 dark:text-[#F3EFEA] border-[#E8E3DA] dark:border-[#2A382F]'
                } disabled:opacity-50`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-[#E8E3DA] dark:border-[#2A382F] flex items-center justify-between gap-3">
          <button
            onClick={handleDeleteTable}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-stone-500 dark:text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-transparent hover:border-rose-200 dark:hover:border-rose-900 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Table
          </button>

          <button
            onClick={handleResetTable}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#1F2A23] hover:bg-stone-50 dark:hover:bg-[#26332B] text-[#28352D] dark:text-[#F3EFEA] border border-[#E8E3DA] dark:border-[#2A382F] shadow-xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#55745E] dark:text-[#6E9A7B] ${loading ? 'animate-spin' : ''}`} />
            Clear &amp; Make Available
          </button>
        </div>
      </div>
    </Modal>
  );
}
