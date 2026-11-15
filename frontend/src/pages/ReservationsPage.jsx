import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { api } from '../services/api';
import AddReservationModal from '../components/AddReservationModal';
import { CalendarDays, Plus, Clock, Users, CheckCircle2, XCircle, Trash2, Search } from 'lucide-react';

export default function ReservationsPage() {
  const { refreshIndex, triggerRefresh, addToast, globalSearch } = useRestaurant();
  const [reservations, setReservations] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [dateFilter, setDateFilter] = useState('');
  const [localSearch, setLocalSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const data = await api.getReservations(dateFilter || null);
        setReservations(data);
      } catch (err) {
        addToast(err.message || 'Failed to fetch reservations', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, [dateFilter, refreshIndex]);

  const handleSeatParty = async (res) => {
    try {
      const result = await api.seatReservation(res.id);
      addToast(
        `Seated! Table ${result.table_number} assigned to ${res.customer_name} (Waiter: ${result.waiter_name})`,
        'success'
      );
      triggerRefresh();
    } catch (err) {
      addToast(err.message || 'Failed to seat reservation', 'error');
    }
  };

  const handleUpdateStatus = async (res, newStatus) => {
    try {
      await api.updateReservation(res.id, { status: newStatus });
      addToast(`Reservation for ${res.customer_name} marked ${newStatus}`, 'success');
      triggerRefresh();
    } catch (err) {
      addToast(err.message || 'Failed to update reservation', 'error');
    }
  };

  const handleDelete = async (res) => {
    if (!window.confirm(`Cancel reservation for ${res.customer_name}?`)) return;
    try {
      await api.deleteReservation(res.id);
      addToast(`Reservation for ${res.customer_name} cancelled`, 'info');
      triggerRefresh();
    } catch (err) {
      addToast(err.message || 'Failed to cancel reservation', 'error');
    }
  };

  const q = (localSearch || globalSearch).toLowerCase().trim();
  const displayedReservations = reservations.filter((r) => {
    if (!q) return true;
    return (
      r.customer_name.toLowerCase().includes(q) ||
      (r.special_requests && r.special_requests.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#28352D] font-serif tracking-tight">
            Advance Reservations
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Manage advance table booking schedules, 30-minute lock windows, and VIP arrangements.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search reservations..."
              className="bg-white border border-[#E8E3DA] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#28352D] shadow-xs focus:outline-none focus:border-[#55745E]"
            />
          </div>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-white border border-[#E8E3DA] rounded-xl px-3 py-1.5 text-xs text-[#28352D] shadow-xs focus:outline-none focus:ring-1 focus:ring-[#55745E]"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-xs text-[#55745E] hover:underline font-medium cursor-pointer"
            >
              Clear Date
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#55745E] hover:bg-[#45604D] text-white shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Reservation
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-[#E8E3DA] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E8E3DA] text-stone-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 sm:px-6">Guest Name</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Party Size</th>
                <th className="py-3.5 px-4">Reserved Time</th>
                <th className="py-3.5 px-4">Table Assigned</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3DA] text-[#28352D]">
              {displayedReservations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-stone-400">
                    No reservations found for the selected criteria.
                  </td>
                </tr>
              ) : (
                displayedReservations.map((r) => (
                  <tr key={r.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-[#28352D]">
                      {r.customer_name}
                      {r.special_requests && (
                        <div className="text-[11px] text-stone-500 font-normal">{r.special_requests}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 font-mono text-[11px]">
                      {r.contact_number || '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[#28352D] font-semibold">
                        <Users className="w-3.5 h-3.5 text-[#55745E]" />
                        {r.group_size} Guests
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 font-mono text-[11px]">
                      {new Date(r.reservation_time).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      {r.table_id ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#55745E]/10 text-[#55745E] border border-[#55745E]/20">
                          Table T{r.table_id.toString().padStart(2, '0')}
                        </span>
                      ) : (
                        <span className="text-stone-400 text-[11px]">Auto-assign on arrival</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          r.status === 'CONFIRMED'
                            ? 'bg-[#55745E]/10 text-[#55745E] border-[#55745E]/20'
                            : r.status === 'SEATED'
                            ? 'bg-sky-50 text-sky-800 border-sky-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {r.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleSeatParty(r)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#55745E] hover:bg-[#45604D] text-white shadow-2xs transition-all cursor-pointer"
                        >
                          Seat Party
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(r)}
                        className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Cancel reservation"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddReservationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}
