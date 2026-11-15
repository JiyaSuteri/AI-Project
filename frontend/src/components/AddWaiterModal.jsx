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
          <label className="block text-xs font-semibold text-[#28352D] mb-1">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Julian Hayes, Maria Santos"
            className="w-full bg-[#FAF7F2] border border-[#E8E3DA] rounded-xl px-3.5 py-2 text-sm text-[#28352D] focus:outline-none focus:border-[#55745E] placeholder-stone-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#28352D] mb-1">Max Concurrent Tables</label>
          <input
            type="number"
            min="1"
            max="8"
            required
            value={maxTables}
            onChange={(e) => setMaxTables(e.target.value)}
            className="w-full bg-[#FAF7F2] border border-[#E8E3DA] rounded-xl px-3.5 py-2 text-sm text-[#28352D] focus:outline-none focus:border-[#55745E]"
          />
          <p className="text-[11px] text-stone-500 mt-1">Default policy limit is 4 tables per waiter.</p>
        </div>

        <div className="pt-4 border-t border-[#E8E3DA] flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-stone-500 hover:text-[#28352D] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#55745E] hover:bg-[#455E4C] text-white shadow-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Adding...' : 'Add Waiter'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
