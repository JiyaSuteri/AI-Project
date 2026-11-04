import React, { useState } from 'react';
import Modal from './Modal';
import { api } from '../services/api';
import { useRestaurant } from '../context/RestaurantContext';

export default function AddWaiterModal({ isOpen, onClose }) {
  const { triggerRefresh, addToast } = useRestaurant();
  const [name, setName] = useState('');
  const [maxTables, setMaxTables] = useState(4);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Please enter waiter name', 'error');
      return;
    }

    try {
      setLoading(true);
      await api.createWaiter({
        name: name.trim(),
        availability: true,
        max_tables: Number(maxTables),
      });
      addToast(`Waiter '${name}' added to active staff!`, 'success');
      triggerRefresh();
      setName('');
      setMaxTables(4);
      onClose();
    } catch (err) {
      addToast(err.message || 'Failed to add waiter', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Waiter / Service Staff"
      subtitle="Register a server to accept table allocations"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-noir-300 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Julian Hayes, Maria Santos"
            className="w-full bg-noir-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-champagne-500 focus:border-champagne-500 placeholder-noir-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-noir-300 mb-1">Max Concurrent Tables</label>
          <input
            type="number"
            min="1"
            max="8"
            required
            value={maxTables}
            onChange={(e) => setMaxTables(e.target.value)}
            className="w-full bg-noir-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-champagne-500 focus:border-champagne-500"
          />
          <p className="text-[11px] text-noir-400 mt-1">Default policy limit is 4 tables per waiter.</p>
        </div>

        <div className="pt-3 border-t border-white/10 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-noir-300 hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-champagne-500 to-champagne-600 hover:from-champagne-400 hover:to-champagne-500 text-noir-950 shadow-glow-champagne transition-all disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Waiter'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
