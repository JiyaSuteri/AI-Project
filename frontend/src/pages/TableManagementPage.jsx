import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { api } from '../services/api';
import FloorPlan from '../components/FloorPlan';
import TableDetailsModal from '../components/TableDetailsModal';
import AddTableModal from '../components/AddTableModal';
import { LayoutGrid, Plus, Filter, RefreshCw, CheckCircle2, Search } from 'lucide-react';

export default function TableManagementPage() {
  const { refreshIndex, triggerRefresh, addToast, globalSearch } = useRestaurant();
  const [tables, setTables] = useState([]);
  const [waiters, setWaiters] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [localSearch, setLocalSearch] = useState('');
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

  const q = (localSearch || globalSearch).toLowerCase().trim();
  const displayedTables = tables.filter((t) => {
    if (!q) return true;
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
          <h1 className="text-xl sm:text-2xl font-bold text-[#28352D] dark:text-[#F3EFEA] font-serif tracking-tight">
            Floor Plan &amp; Table Management
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-[#98A89E] mt-0.5">
            Configure floor sections, monitor real-time dining tables, and transition operational states.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search table or section..."
              className="bg-white dark:bg-[#18201B] border border-[#E8E3DA] dark:border-[#2A382F] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#28352D] dark:text-[#F3EFEA] shadow-xs focus:outline-none focus:border-[#55745E] dark:focus:border-[#6E9A7B]"
            />
          </div>

          <button
            onClick={() => triggerRefresh()}
            className="p-2 rounded-xl text-stone-600 dark:text-[#98A89E] bg-white dark:bg-[#18201B] hover:bg-stone-50 dark:hover:bg-[#1F2A23] border border-[#E8E3DA] dark:border-[#2A382F] shadow-xs transition-colors cursor-pointer"
            title="Refresh floor tables"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#55745E] dark:text-[#6E9A7B]' : ''}`} />
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#55745E] dark:bg-[#6E9A7B] hover:bg-[#45604D] dark:hover:bg-[#5B8267] text-white shadow-xs transition-all cursor-pointer"
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
            className={`px-3.5 py-2 rounded-xl font-medium transition-all shrink-0 border cursor-pointer ${
              filter === tab.id
                ? 'bg-[#55745E] dark:bg-[#6E9A7B] text-white border-[#55745E] dark:border-[#6E9A7B] shadow-xs font-bold'
                : 'bg-white dark:bg-[#18201B] hover:bg-stone-50 dark:hover:bg-[#1F2A23] text-stone-600 dark:text-[#98A89E] border-[#E8E3DA] dark:border-[#2A382F]'
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
