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
        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E3DA] grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-stone-500 block mb-0.5">Current Status</span>
            <span className="font-semibold text-[#55745E] px-2 py-0.5 rounded-lg bg-[#55745E]/10 border border-[#55745E]/20 inline-block">
              {table.status}
            </span>
          </div>
          <div>
            <span className="text-stone-500 block mb-0.5">Seating Capacity</span>
            <span className="font-semibold text-[#28352D] flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#55745E]" />
              {table.capacity} Guests
            </span>
          </div>

          <div>
            <span className="text-stone-500 block mb-0.5">Assigned Waiter</span>
            <span className="font-semibold text-[#28352D] flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-stone-400" />
              {table.waiter_name || 'None'}
            </span>
          </div>

          <div>
            <span className="text-stone-500 block mb-0.5">Current Customer</span>
            <span className="font-semibold text-[#28352D]">
              {table.group_name ? `${table.group_name} (${table.group_size}p)` : 'None'}
            </span>
          </div>
        </div>

        {/* Change Status Fast Buttons */}
        <div>
          <label className="text-xs font-semibold text-stone-500 block mb-2 uppercase tracking-wider">
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
                    ? 'bg-[#55745E] text-white border-[#55745E] shadow-xs'
                    : 'bg-white hover:bg-stone-50 text-stone-700 border-[#E8E3DA]'
                } disabled:opacity-50`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-[#E8E3DA] flex items-center justify-between gap-3">
          <button
            onClick={handleDeleteTable}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-stone-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Table
          </button>

          <button
            onClick={handleResetTable}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-stone-50 text-[#28352D] border border-[#E8E3DA] shadow-xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#55745E] ${loading ? 'animate-spin' : ''}`} />
            Clear &amp; Make Available
          </button>
        </div>
      </div>
    </Modal>
  );
}
