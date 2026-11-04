import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { api } from '../services/api';
import AddReservationModal from '../components/AddReservationModal';
import { CalendarDays, Plus, Clock, Users, CheckCircle2, XCircle, Trash2 } from 'lucide-react';

export default function ReservationsPage() {
  const { refreshIndex, triggerRefresh, addToast, globalSearch } = useRestaurant();
  const [reservations, setReservations] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [dateFilter, setDateFilter] = useState('');
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

  const displayedReservations = reservations.filter((r) => {
    if (!globalSearch) return true;
    return (
      r.customer_name.toLowerCase().includes(globalSearch.toLowerCase()) ||
      (r.special_requests && r.special_requests.toLowerCase().includes(globalSearch.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Advance Reservations
          </h1>
          <p className="text-xs sm:text-sm text-noir-400 mt-0.5">
            Manage advance table booking schedules, 30-minute lock windows, and VIP arrangements.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-noir-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white shadow-xs focus:outline-none focus:ring-1 focus:ring-champagne-500"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-xs text-champagne-400 hover:text-champagne-300 underline"
            >
              Clear
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-champagne-500 to-champagne-600 hover:from-champagne-400 hover:to-champagne-500 text-noir-950 shadow-glow-champagne transition-all"
          >
            <Plus className="w-4 h-4" />
            Book Reservation
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-3xl border border-white/10 shadow-3d-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-noir-900/80 border-b border-white/10 text-noir-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 sm:px-6">Customer Name</th>
                <th className="py-3.5 px-4">Party Size</th>
                <th className="py-3.5 px-4">Booking Date</th>
                <th className="py-3.5 px-4">Scheduled Time</th>
                <th className="py-3.5 px-4">Special Requests</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-noir-200">
              {displayedReservations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-noir-500">
                    No reservations found.
                  </td>
                </tr>
              ) : (
                displayedReservations.map((r) => (
                  <tr key={r.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="font-semibold text-white">{r.customer_name}</div>
                      <div className="text-[10px] text-noir-500 font-mono">Ref: RES-{r.id.toString().padStart(4, '0')}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-semibold text-champagne-300">
                        <Users className="w-3.5 h-3.5 text-champagne-400" />
                        {r.group_size} Guests
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-noir-300">
                      {r.reservation_date}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1 font-semibold text-white bg-noir-850 px-2 py-0.5 rounded-lg border border-white/5">
                        <Clock className="w-3.5 h-3.5 text-champagne-400" />
                        <span>{r.reservation_time}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-noir-400 text-[11px]">
                      {r.special_requests || 'Standard seating'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          r.status === 'CONFIRMED'
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                            : r.status === 'SEATED'
                            ? 'bg-blue-950/80 text-blue-300 border-blue-500/30'
                            : 'bg-noir-900 text-noir-400 border-white/10'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {r.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleUpdateStatus(r, 'SEATED')}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 transition-colors"
                          >
                            Mark Seated
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(r)}
                          className="p-1 text-noir-400 hover:text-rose-400 transition-colors"
                          title="Cancel reservation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
