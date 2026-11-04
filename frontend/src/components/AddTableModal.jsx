import React, { useState } from 'react';
import Modal from './Modal';
import { api } from '../services/api';
import { useRestaurant } from '../context/RestaurantContext';

export default function AddTableModal({ isOpen, onClose }) {
  const { triggerRefresh, addToast } = useRestaurant();
  const [tableNumber, setTableNumber] = useState('');
  const [capacity, setCapacity] = useState(4);
  const [location, setLocation] = useState('Main Dining');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tableNumber.trim()) {
      addToast('Please enter a table number', 'error');
      return;
    }

    try {
      setLoading(true);
      await api.createTable({
        table_number: tableNumber.trim().toUpperCase(),
        capacity: Number(capacity),
        location,
        status: 'AVAILABLE',
        is_active: true,
      });
      addToast(`Table ${tableNumber.toUpperCase()} added to floor plan!`, 'success');
      triggerRefresh();
      setTableNumber('');
      onClose();
    } catch (err) {
      addToast(err.message || 'Failed to add table', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Table"
      subtitle="Configure a new dining table object on the floor plan"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-noir-300 mb-1">Table Number</label>
          <input
            type="text"
            required
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            placeholder="e.g. T15, T16, B01"
            className="w-full bg-noir-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-champagne-500 focus:border-champagne-500 uppercase placeholder-noir-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-noir-300 mb-1">Capacity (Seats)</label>
            <input
              type="number"
              min="1"
              max="20"
              required
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full bg-noir-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-champagne-500 focus:border-champagne-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-noir-300 mb-1">Floor Zone / Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-noir-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-champagne-500 focus:border-champagne-500"
            >
              <option value="Main Dining">Main Dining</option>
              <option value="Window">Window</option>
              <option value="Booth Zone">Booth Zone</option>
              <option value="Patio">Patio</option>
              <option value="Banquet Alcove">Banquet Alcove</option>
              <option value="Private Dining">Private Dining</option>
            </select>
          </div>
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
            {loading ? 'Creating...' : 'Create Table'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
