import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { api } from '../services/api';
import FloorPlan from '../components/FloorPlan';
import TableDetailsModal from '../components/TableDetailsModal';
import AddTableModal from '../components/AddTableModal';
import { LayoutGrid, Plus, Filter, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function TableManagementPage() {
  const { refreshIndex, triggerRefresh, addToast, globalSearch } = useRestaurant();
  const [tables, setTables] = useState([]);
  const [waiters, setWaiters] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        setLoading(true);
        const [tablesData, waitersData] = await Promise.all([
          api.getTables(),
          api.getWaiters()
        ]);
        setTables(tablesData);
        setWaiters(waitersData);
      } catch (err) {
        addToast(err.message || 'Failed to load tables', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchTables();
  }, [refreshIndex]);

  const displayedTables = tables.filter((t) => {
    if (!globalSearch) return true;
    const q = globalSearch.toLowerCase();
    return (
      t.table_number.toLowerCase().includes(q) ||
      t.location.toLowerCase().includes(q) ||
      (t.group_name && t.group_name.toLowerCase().includes(q)) ||
      (t.waiter_name && t.waiter_name.toLowerCase().includes(q))
    );
  });

  const availableCount = tables.filter((t) => t.status === 'AVAILABLE').length;
  const occupiedCount = tables.filter((t) => t.status === 'OCCUPIED').length;
  const reservedCount = tables.filter((t) => t.status === 'RESERVED').length;
  const cleaningCount = tables.filter((t) => t.status === 'CLEANING').length;

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Floor Plan & Table Management
          </h1>
          <p className="text-xs sm:text-sm text-noir-400 mt-0.5">
            Configure floor sections, monitor real-time dining tables, and transition operational states.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => triggerRefresh()}
            className="p-2 rounded-xl text-noir-300 bg-noir-900/80 hover:bg-noir-850 border border-white/10 shadow-xs transition-colors"
            title="Refresh floor tables"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-champagne-500 to-champagne-600 hover:from-champagne-400 hover:to-champagne-500 text-noir-950 shadow-glow-champagne transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Table
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'ALL', label: `All Tables (${tables.length})` },
          { id: 'AVAILABLE', label: `Available (${availableCount})` },
          { id: 'OCCUPIED', label: `Occupied (${occupiedCount})` },
          { id: 'RESERVED', label: `Reserved (${reservedCount})` },
          { id: 'CLEANING', label: `Cleaning (${cleaningCount})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3.5 py-2 rounded-xl font-medium transition-all shrink-0 border ${
              filter === tab.id
                ? 'bg-champagne-500/20 text-champagne-300 border-champagne-500/40 shadow-glow-champagne'
                : 'bg-noir-900/60 hover:bg-noir-850 text-noir-400 border-white/5 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Floor Plan Canvas */}
      <FloorPlan
        tables={displayedTables}
        onSelectTable={(t) => setSelectedTable(t)}
        filter={filter}
      />

      {/* Modals */}
      <TableDetailsModal
        table={selectedTable}
        isOpen={Boolean(selectedTable)}
        onClose={() => setSelectedTable(null)}
        waiters={waiters}
      />

      <AddTableModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}
