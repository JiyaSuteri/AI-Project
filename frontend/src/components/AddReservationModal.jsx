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
          <label className="block text-xs font-semibold text-[#28352D] dark:text-[#F3EFEA] mb-1">Customer / Host Name</label>
          <input
            type="text"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="e.g. Senator Collins, Claire Redfield"
            className="w-full bg-[#FAF7F2] dark:bg-[#111613] border border-[#E8E3DA] dark:border-[#2A382F] rounded-xl px-3.5 py-2 text-sm text-[#28352D] dark:text-[#F3EFEA] focus:outline-none focus:border-[#55745E] dark:focus:border-[#6E9A7B] placeholder-stone-400 dark:placeholder-stone-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#28352D] dark:text-[#F3EFEA] mb-1">Party Size</label>
            <input
              type="number"
              min="1"
              max="20"
              required
              value={groupSize}
              onChange={(e) => setGroupSize(e.target.value)}
              className="w-full bg-[#FAF7F2] dark:bg-[#111613] border border-[#E8E3DA] dark:border-[#2A382F] rounded-xl px-3.5 py-2 text-sm text-[#28352D] dark:text-[#F3EFEA] focus:outline-none focus:border-[#55745E] dark:focus:border-[#6E9A7B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#28352D] dark:text-[#F3EFEA] mb-1">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#FAF7F2] dark:bg-[#111613] border border-[#E8E3DA] dark:border-[#2A382F] rounded-xl px-3.5 py-2 text-sm text-[#28352D] dark:text-[#F3EFEA] focus:outline-none focus:border-[#55745E] dark:focus:border-[#6E9A7B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#28352D] dark:text-[#F3EFEA] mb-1">Time</label>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-[#FAF7F2] dark:bg-[#111613] border border-[#E8E3DA] dark:border-[#2A382F] rounded-xl px-3.5 py-2 text-sm text-[#28352D] dark:text-[#F3EFEA] focus:outline-none focus:border-[#55745E] dark:focus:border-[#6E9A7B]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#28352D] dark:text-[#F3EFEA] mb-1">Special Preferences / Requests</label>
          <textarea
            rows={3}
            value={requests}
            onChange={(e) => setRequests(e.target.value)}
            placeholder="e.g. Quiet booth, Birthday celebration, Allergen notice"
            className="w-full bg-[#FAF7F2] dark:bg-[#111613] border border-[#E8E3DA] dark:border-[#2A382F] rounded-xl px-3.5 py-2 text-sm text-[#28352D] dark:text-[#F3EFEA] focus:outline-none focus:border-[#55745E] dark:focus:border-[#6E9A7B] placeholder-stone-400 dark:placeholder-stone-500"
          />
        </div>

        <div className="pt-4 border-t border-[#E8E3DA] dark:border-[#2A382F] flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-stone-500 dark:text-[#98A89E] hover:text-[#28352D] dark:hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#55745E] dark:bg-[#6E9A7B] hover:bg-[#45604D] dark:hover:bg-[#5B8267] text-white shadow-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Confirming...' : 'Save Reservation'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
