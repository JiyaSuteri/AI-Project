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
      title={`Table ${table.table_number} Configuration`}
      subtitle={`Zone: ${table.location} • Capacity: ${table.capacity} seats`}
    >
      <div className="space-y-5 text-sm">
        {/* Table Overview Card */}
        <div className="p-4 rounded-2xl bg-noir-900/60 border border-white/5 grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-noir-400 block mb-0.5">Current Status</span>
            <span className="font-semibold text-champagne-300 px-2 py-0.5 rounded-lg bg-champagne-500/10 border border-champagne-500/20 inline-block">
              {table.status}
            </span>
          </div>
          <div>
            <span className="text-noir-400 block mb-0.5">Seating Capacity</span>
            <span className="font-medium text-white flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-champagne-400" />
              {table.capacity} Persons
            </span>
          </div>

          <div>
            <span className="text-noir-400 block mb-0.5">Assigned Waiter</span>
            <span className="font-medium text-white flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-noir-400" />
              {table.waiter_name || 'None'}
            </span>
          </div>

          <div>
            <span className="text-noir-400 block mb-0.5">Current Customer</span>
            <span className="font-medium text-white">
              {table.group_name ? `${table.group_name} (${table.group_size}p)` : 'None'}
            </span>
          </div>
        </div>

        {/* Change Status Fast Buttons */}
        <div>
          <label className="text-xs font-semibold text-noir-400 block mb-2 uppercase tracking-wider">
            Quick Status Transition
          </label>
          <div className="grid grid-cols-3 gap-2">
            {STATUSES.map((st) => (
              <button
                key={st}
                onClick={() => handleUpdateStatus(st)}
                disabled={loading || table.status === st}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                  table.status === st
                    ? 'bg-champagne-500 text-noir-950 font-bold border-champagne-400 shadow-glow-champagne'
                    : 'bg-noir-900/80 text-noir-300 border-white/5 hover:border-champagne-500/40 hover:text-white'
                } disabled:opacity-40`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleResetTable}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-noir-850 hover:bg-noir-800 text-white border border-white/10 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-champagne-400 ${loading ? 'animate-spin' : ''}`} />
            Release / Reset Table
          </button>

          <button
            type="button"
            onClick={handleDeleteTable}
            disabled={loading || table.status === 'OCCUPIED'}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/40 border border-rose-800/40 transition-colors disabled:opacity-30"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
