import React, { useState } from 'react';
import Modal from './Modal';
import { api } from '../services/api';
import { useRestaurant } from '../context/RestaurantContext';
import { Plus, Users } from 'lucide-react';

export default function AddCustomerModal({ isOpen, onClose }) {
  const { triggerRefresh, addToast } = useRestaurant();
  const [groupName, setGroupName] = useState('');
  const [groupSize, setGroupSize] = useState(2);
  const [priority, setPriority] = useState(1);
  const [specialReq, setSpecialReq] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      addToast('Please enter a party name', 'error');
      return;
    }

    try {
      setLoading(true);
      await api.createCustomer({
        group_name: groupName.trim(),
        group_size: Number(groupSize),
        priority: Number(priority),
        special_requirements: specialReq.trim() || null,
        status: 'WAITING',
      });
      addToast(`Customer group '${groupName}' added to queue!`, 'success');
      triggerRefresh();
      setGroupName('');
      setSpecialReq('');
      setGroupSize(2);
      setPriority(1);
      onClose();
    } catch (err) {
      addToast(err.message || 'Failed to add customer group', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Walk-in Customer Party"
      subtitle="Registers a dining group directly into the live waiting queue"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-noir-300 mb-1">Party / Customer Name</label>
          <input
            type="text"
            required
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="e.g. Sterling Family, Dr. Watson"
            className="w-full bg-noir-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-champagne-500 focus:border-champagne-500 placeholder-noir-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-noir-300 mb-1">Party Size (Guests)</label>
            <input
              type="number"
              min="1"
              max="16"
              required
              value={groupSize}
              onChange={(e) => setGroupSize(e.target.value)}
              className="w-full bg-noir-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-champagne-500 focus:border-champagne-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-noir-300 mb-1">Priority Level</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-noir-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-champagne-500 focus:border-champagne-500"
            >
              <option value="1">1 - Standard Walk-in</option>
              <option value="2">2 - VIP / Loyalty Guest</option>
              <option value="3">3 - Delayed Reservation</option>
              <option value="4">4 - High Priority / Urgent</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-noir-300 mb-1">Special Requirements (Optional)</label>
          <input
            type="text"
            value={specialReq}
            onChange={(e) => setSpecialReq(e.target.value)}
            placeholder="e.g. Window seat preferred, Wheelchair access, High chair"
            className="w-full bg-noir-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-champagne-500 focus:border-champagne-500 placeholder-noir-500"
          />
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
            {loading ? 'Adding...' : 'Add to Queue'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
