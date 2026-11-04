import React, { useState } from 'react';
import Modal from './Modal';
import { api } from '../services/api';
import { useRestaurant } from '../context/RestaurantContext';

export default function AddReservationModal({ isOpen, onClose }) {
  const { triggerRefresh, addToast } = useRestaurant();
  const [customerName, setCustomerName] = useState('');
  const [groupSize, setGroupSize] = useState(2);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('19:00');
  const [requests, setRequests] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      addToast('Please enter customer name', 'error');
      return;
    }

    try {
      setLoading(true);
      await api.createReservation({
        customer_name: customerName.trim(),
        group_size: Number(groupSize),
        reservation_date: date,
        reservation_time: time,
        special_requests: requests.trim() || null,
        status: 'CONFIRMED',
      });
      addToast(`Reservation confirmed for ${customerName} on ${date} at ${time}!`, 'success');
      triggerRefresh();
      setCustomerName('');
      setRequests('');
      onClose();
    } catch (err) {
      addToast(err.message || 'Failed to create reservation', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Advance Reservation"
      subtitle="Registers an advance booking and locks table eligibility window"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-noir-300 mb-1">Customer / Host Name</label>
          <input
            type="text"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="e.g. Senator Collins, Claire Redfield"
            className="w-full bg-noir-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-champagne-500 focus:border-champagne-500 placeholder-noir-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-noir-300 mb-1">Party Size</label>
            <input
              type="number"
              min="1"
              max="20"
              required
              value={groupSize}
              onChange={(e) => setGroupSize(e.target.value)}
              className="w-full bg-noir-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-champagne-500 focus:border-champagne-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-noir-300 mb-1">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-noir-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-champagne-500 focus:border-champagne-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-noir-300 mb-1">Time</label>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-noir-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-champagne-500 focus:border-champagne-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-noir-300 mb-1">Special Seating Requests</label>
          <input
            type="text"
            value={requests}
            onChange={(e) => setRequests(e.target.value)}
            placeholder="e.g. Quiet corner, Romantic window, Anniversary celebration"
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
            {loading ? 'Confirming...' : 'Save Reservation'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
