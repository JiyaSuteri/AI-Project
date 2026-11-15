import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import StatCard from '../components/StatCard';
import FloorPlan from '../components/FloorPlan';
import TableDetailsModal from '../components/TableDetailsModal';
import AddCustomerModal from '../components/AddCustomerModal';
import {
  LayoutGrid,
  Users,
  UserCheck,
  Clock,
  Percent,
  CheckCircle2,
  CalendarDays,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Activity,
  Zap,
  BrainCircuit,
  AlertCircle,
  Check,
  ShieldCheck,
  Compass
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

export default function DashboardPage() {
  const { refreshIndex, triggerRefresh, setActiveTab, addToast } = useRestaurant();
  const { isGuest } = useAuth();

  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [tables, setTables] = useState([]);
  const [waiters, setWaiters] = useState([]);
  const [queue, setQueue] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [loading, setLoading] = useState(true);

  // AI Table Allocation Hero Widget State
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('A_STAR');
  const [allocating, setAllocating] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [pendingRecommendation, setPendingRecommendation] = useState(null);
  const [lastAllocationResult, setLastAllocationResult] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [statsRes, actRes, tablesRes, waitersRes, queueRes] = await Promise.allSettled([
          api.getDashboardStats(),
          api.getDashboardActivity(),
          api.getTables(),
          api.getWaiters(),
          api.getCustomers('WAITING')
        ]);

        if (statsRes.status === 'fulfilled') setStats(statsRes.value);
        if (actRes.status === 'fulfilled') setActivity(actRes.value);
        if (tablesRes.status === 'fulfilled') setTables(tablesRes.value);
        if (waitersRes.status === 'fulfilled') setWaiters(waitersRes.value);

        if (queueRes.status === 'fulfilled') {
          const qData = queueRes.value || [];
          setQueue(qData);

          // Support seamless handoff from Customers page "Allocate Table" button
          const handoffId = localStorage.getItem('bistro_selected_customer');
          if (handoffId && qData.some(c => c.id.toString() === handoffId)) {
            setSelectedCustomerId(handoffId);
            localStorage.removeItem('bistro_selected_customer');
          } else if (qData.length > 0) {
            setSelectedCustomerId(prev => {
              const stillExists = qData.some(c => c.id.toString() === prev);
              return stillExists ? prev : qData[0].id.toString();
            });
          } else {
            setSelectedCustomerId('');
          }
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, [refreshIndex]);

  // Step 1: Request and View AI Table Recommendation (without committing)
  const handleGetRecommendation = async () => {
    if (!selectedCustomerId && queue.length === 0) {
      addToast('No waiting parties available. Add a customer first.', 'info');
      setShowAddCustomer(true);
      return;
    }

    const customerId = selectedCustomerId || queue[0]?.id;
    if (!customerId) return;

    setAllocating(true);
    try {
      const result = await api.allocateTable(parseInt(customerId, 10), selectedAlgorithm, false);
      const dec = result.decisions?.find(d => d.group_id === parseInt(customerId, 10)) || result.decisions?.[0];
      
      if (dec && dec.success) {
        setPendingRecommendation({
          customerId: parseInt(customerId, 10),
          partyName: dec.group_name,
          groupSize: dec.group_size,
          tableNumber: dec.table_number,
          tableId: dec.table_id,
          tableCapacity: dec.table_capacity,
          waiterName: dec.waiter_name,
          waiterId: dec.waiter_id,
          reason: dec.reason,
          cost: dec.cost,
          algorithm: result.algorithm,
          executionTimeMs: result.execution_time_ms
        });
        setLastAllocationResult(null);
        addToast(
          `Recommendation ready: Table ${dec.table_number} via ${result.algorithm}`,
          'info'
        );
      } else {
        addToast(dec?.reason || 'No available table fits this party without exceeding constraints.', 'warning');
        setPendingRecommendation(null);
      }
    } catch (err) {
      addToast(err.message || 'Recommendation failed for selected customer', 'error');
      setPendingRecommendation(null);
    } finally {
      setAllocating(false);
    }
  };

  // Step 2: Confirm and Seat the Recommended Party into Real DB
  const handleConfirmAllocation = async () => {
    if (!pendingRecommendation) return;

    setConfirming(true);
    const seatedId = pendingRecommendation.customerId;
    try {
      const result = await api.allocateTable(
        pendingRecommendation.customerId,
        pendingRecommendation.algorithm,
        true
      );
      setLastAllocationResult({
        table_number: pendingRecommendation.tableNumber,
        party_name: pendingRecommendation.partyName,
        waiter_name: pendingRecommendation.waiterName,
        algorithm_used: pendingRecommendation.algorithm,
        reason: pendingRecommendation.reason
      });
      // Immediately remove seated customer from waiting dropdown
      setPendingRecommendation(null);
      setQueue((prev) => prev.filter((c) => c.id !== seatedId));
      setSelectedCustomerId('');
      addToast(
        `Confirmed! Table ${pendingRecommendation.tableNumber} assigned to ${pendingRecommendation.partyName}.`,
        'success'
      );
      triggerRefresh();
    } catch (err) {
      addToast(err.message || 'Failed to confirm table allocation', 'error');
    } finally {
      setConfirming(false);
    }
  };

  // Cancel / Discard Recommendation
  const handleCancelRecommendation = () => {
    setPendingRecommendation(null);
    addToast('Allocation preview cleared.', 'info');
  };

  // Quick 1-Step Direct Allocation
  const handleQuickAllocate = async () => {
    if (!selectedCustomerId && queue.length === 0) {
      addToast('No waiting parties available. Add a customer first.', 'info');
      setShowAddCustomer(true);
      return;
    }

    const customerId = selectedCustomerId || queue[0]?.id;
    if (!customerId) return;

    setAllocating(true);
    const seatedId = parseInt(customerId, 10);
    try {
      const result = await api.allocateTable(seatedId, selectedAlgorithm, true);
      const dec = result.decisions?.find(d => d.group_id === seatedId) || result.decisions?.[0];
      if (dec && dec.success) {
        setLastAllocationResult({
          table_number: dec.table_number,
          party_name: dec.group_name,
          waiter_name: dec.waiter_name,
          algorithm_used: result.algorithm,
          reason: dec.reason
        });
        setPendingRecommendation(null);
        setQueue((prev) => prev.filter((c) => c.id !== seatedId));
        setSelectedCustomerId('');
        addToast(
          `Allocated Table ${dec.table_number} to ${dec.group_name}!`,
          'success'
        );
        triggerRefresh();
      } else {
        addToast(dec?.reason || 'Allocation could not be completed.', 'warning');
      }
    } catch (err) {
      addToast(err.message || 'Allocation failed for selected customer', 'error');
    } finally {
      setAllocating(false);
    }
  };

  // Hourly traffic curve
  const occupancyChartData = [
    { time: '12:00', guests: 14, capacity: 45 },
    { time: '13:00', guests: 28, capacity: 60 },
    { time: '14:00', guests: 22, capacity: 50 },
    { time: '17:00', guests: 12, capacity: 30 },
    { time: '18:00', guests: 34, capacity: 75 },
    { time: '19:00', guests: 48, capacity: 92 },
    { time: '20:00', guests: 40, capacity: 85 },
    { time: '21:00', guests: 26, capacity: 55 },
  ];

  // Waiter workload chart data
  const waiterWorkloadData = waiters.map((w) => ({
    name: w.name.split(' ')[0],
    assigned: w.assigned_tables,
    max: w.max_tables,
    utilization: Math.round((w.assigned_tables / w.max_tables) * 100),
  }));

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#28352D] font-serif tracking-tight flex items-center gap-2">
            <span>Restaurant Floor &amp; Operations</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#55745E]/10 text-[#55745E] border border-[#55745E]/20 font-sans font-semibold">
              Live Monitor
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Real-time table occupancy, queue management, and automated seating recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddCustomer(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-stone-50 text-[#28352D] border border-[#E8E3DA] shadow-xs transition-all cursor-pointer"
          >
            <Users className="w-4 h-4 text-[#55745E]" />
            + Add Customer
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#55745E] hover:bg-[#45604D] shadow-sm transition-all cursor-pointer"
          >
            <BrainCircuit className="w-4 h-4 text-white" />
            Advanced Tools
          </button>
        </div>
      </div>

      {/* HERO WIDGET: AI Table Allocation */}
      <div className="bg-white rounded-3xl border border-[#E8E3DA] p-5 sm:p-6 shadow-xs space-y-5">
        {/* 1. Top Section: Heading & Description */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#55745E]/10 text-[#55745E] flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 text-[#C47A59]" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#28352D] font-serif">
              Smart Table Allocation
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Select a waiting party to find the best available table and server match using AI heuristic optimization.
            </p>
          </div>
        </div>

        {/* 2. Form Area: Full-width Dropdown and Find Best Table Button Below */}
        <div className="space-y-3 pt-1">
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
              Waiting Party ({queue.length} in queue)
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => {
                setSelectedCustomerId(e.target.value);
                setPendingRecommendation(null);
              }}
              className="w-full bg-[#FAF7F2] border border-[#E8E3DA] rounded-xl px-3.5 py-2.5 text-xs text-[#28352D] font-medium focus:outline-none focus:border-[#55745E] focus:ring-1 focus:ring-[#55745E]/20"
            >
              {queue.length === 0 ? (
                <option value="">No customers waiting</option>
              ) : (
                queue.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.group_name} ({c.group_size} guests) • {c.special_requirements || 'Standard seating'}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <button
              onClick={handleGetRecommendation}
              disabled={allocating || confirming || (queue.length === 0 && !selectedCustomerId)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#55745E] hover:bg-[#45604D] shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              title="Search available tables and servers using A* algorithm"
            >
              <Sparkles className={`w-3.5 h-3.5 text-white ${allocating ? 'animate-spin' : ''}`} />
              <span>{allocating ? 'Finding Best Table...' : 'Find Best Table'}</span>
            </button>
          </div>
        </div>

        {/* 3. Recommendation Card / Result Section: Below the form, never on top of it */}
        {pendingRecommendation ? (
          <div className="w-full p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#C47A59]/40 space-y-3.5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#E8E3DA]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C47A59] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C47A59]" />
                Recommended Match
              </span>
              <span className="text-[10px] font-mono text-stone-600 bg-white px-2.5 py-1 rounded-md border border-[#E8E3DA]">
                Algorithm: {pendingRecommendation.algorithm} • {pendingRecommendation.executionTimeMs?.toFixed(1)}ms
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-xl border border-[#E8E3DA]">
                <span className="text-[10px] uppercase font-semibold text-stone-500 block mb-0.5">Recommended Table</span>
                <span className="text-base font-bold text-[#28352D] font-serif">Table {pendingRecommendation.tableNumber}</span>
                <span className="text-xs text-stone-500 ml-1.5">(Seats {pendingRecommendation.tableCapacity})</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#E8E3DA]">
                <span className="text-[10px] uppercase font-semibold text-stone-500 block mb-0.5">Customer Party</span>
                <span className="text-sm font-bold text-[#55745E]">{pendingRecommendation.partyName}</span>
                <span className="text-xs text-stone-500 ml-1.5">({pendingRecommendation.groupSize} guests)</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#E8E3DA]">
                <span className="text-[10px] uppercase font-semibold text-stone-500 block mb-0.5">Assigned Waiter</span>
                <span className="text-sm font-bold text-[#28352D]">{pendingRecommendation.waiterName}</span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#E8E3DA] text-xs text-stone-600">
              <span className="font-semibold text-stone-700 block mb-0.5">Recommendation Reason:</span>
              <span className="italic leading-relaxed">"{pendingRecommendation.reason}"</span>
            </div>

            {/* Actions: Confirm Allocation and Cancel */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                onClick={handleConfirmAllocation}
                disabled={confirming}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#55745E] hover:bg-[#45604D] shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                <Check className={`w-3.5 h-3.5 ${confirming ? 'animate-spin' : ''}`} />
                <span>{confirming ? 'Confirming...' : 'Confirm Allocation'}</span>
              </button>
              <button
                onClick={handleCancelRecommendation}
                disabled={confirming}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 bg-white hover:bg-stone-100 border border-stone-200 transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : lastAllocationResult ? (
          <div className="w-full p-4 rounded-2xl bg-[#FAF7F2] border border-[#55745E]/30 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#55745E] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Allocation Confirmed
              </span>
              <span className="text-[10px] font-mono text-stone-500 bg-white px-2 py-0.5 rounded border border-[#E8E3DA]">
                {lastAllocationResult.algorithm_used}
              </span>
            </div>
            <div className="text-xs text-[#28352D] space-y-1">
              <div>
                <strong>Table {lastAllocationResult.table_number}</strong> successfully seated with <strong>{lastAllocationResult.party_name}</strong> (Assigned Server: <strong>{lastAllocationResult.waiter_name}</strong>).
              </div>
              <div className="text-[11px] text-stone-500 italic">
                "{lastAllocationResult.reason}"
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E3DA] text-center text-xs text-stone-500">
            Select a waiting customer above and click <strong className="text-[#55745E]">'Find Best Table'</strong> to preview the recommended table and server assignment.
          </div>
        )}
      </div>

      {/* Primary 8 Operational Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <StatCard
          title="Total Tables"
          value={stats?.total_tables ?? '--'}
          subtitle={`${stats?.available_tables ?? 0} Available • ${stats?.occupied_tables ?? 0} Seated`}
          icon={LayoutGrid}
          trend={`${stats?.table_utilization_percent ?? 0}% Utilized`}
          variant="default"
        />

        <StatCard
          title="Occupied Tables"
          value={stats?.occupied_tables ?? '--'}
          subtitle={`${stats?.cleaning_tables ?? 0} in cleaning turnover`}
          icon={Activity}
          trend="Live Seating"
          variant="accent"
        />

        <StatCard
          title="Customer Queue"
          value={stats?.waiting_customers ?? '--'}
          subtitle="Parties in waiting queue"
          icon={Users}
          trend="FIFO + Priority"
          variant="amber"
        />

        <StatCard
          title="Active Waiters"
          value={stats?.active_waiters ?? '--'}
          subtitle={`Average load: ${stats?.active_waiters ? Math.round(((stats?.occupied_tables || 0) / (stats.active_waiters * 4)) * 100) : 0}%`}
          icon={UserCheck}
          trend="Balanced"
          variant="blue"
        />

        <StatCard
          title="Available Tables"
          value={stats?.available_tables ?? '--'}
          subtitle="Ready for immediate seating"
          icon={CheckCircle2}
          trend="Free to allocate"
          variant="emerald"
        />

        <StatCard
          title="Reserved Tables"
          value={stats?.reserved_tables ?? '--'}
          subtitle="Locked holding windows"
          icon={CalendarDays}
          trend="30m grace"
          variant="default"
        />

        <StatCard
          title="Avg Waiting Time"
          value={`${stats?.average_waiting_time_minutes ?? 0}m`}
          subtitle="Tolerance threshold: 25m"
          icon={Clock}
          trend="Queue Latency"
          variant="accent"
        />

        <StatCard
          title="Table Utilization"
          value={`${stats?.table_utilization_percent ?? 0}%`}
          subtitle="Occupied seat capacity"
          icon={Percent}
          trend="Target: >75%"
          variant="emerald"
        />
      </div>

      {/* Interactive Floor Plan */}
      <FloorPlan
        tables={tables}
        onSelectTable={(t) => setSelectedTable(t)}
      />

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Occupancy and Customer Arrival Trend */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E3DA] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#28352D] font-serif">Dining Traffic &amp; Occupancy Curve</h3>
              <p className="text-xs text-stone-500">Hourly guest arrivals vs. restaurant seat capacity utilization</p>
            </div>
            <span className="text-[11px] font-mono font-medium text-[#916E32] bg-[#C47A59]/15 px-2.5 py-1 rounded-full border border-[#C47A59]/30">
              Peak: 19:00 - 20:00
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={occupancyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGuests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#55745E" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#55745E" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E3DA" />
                <XAxis dataKey="time" stroke="#78716C" fontSize={11} tickLine={false} />
                <YAxis stroke="#78716C" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E3DA', color: '#28352D', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="guests" name="Active Guests" stroke="#55745E" strokeWidth={2.5} fillOpacity={1} fill="url(#colorGuests)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Waiter Workload Distribution */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E3DA] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-[#28352D] font-serif">Waiter Workloads</h3>
              <button
                onClick={() => setActiveTab('waiters')}
                className="text-xs text-[#55745E] hover:text-[#455E4C] font-semibold flex items-center gap-1 cursor-pointer"
              >
                Manage <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <p className="text-xs text-stone-500 mb-4">Assigned tables per server (Max: 4-5)</p>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waiterWorkloadData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E3DA" />
                  <XAxis dataKey="name" stroke="#78716C" fontSize={11} tickLine={false} />
                  <YAxis stroke="#78716C" fontSize={11} tickLine={false} domain={[0, 5]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E3DA', color: '#28352D', fontSize: '12px' }}
                  />
                  <Bar dataKey="assigned" name="Assigned Tables" fill="#55745E" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
            <span>Workload balancing: Active</span>
            <span className="font-semibold text-[#55745E]">Optimal</span>
          </div>
        </div>
      </div>

      {/* Split Row: Queue Preview & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Live Customer Queue Preview */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E3DA] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#28352D] font-serif">Waiting Customer Queue ({queue.length})</h3>
              <p className="text-xs text-stone-500">Parties awaiting table assignment in arrival order</p>
            </div>
            <button
              onClick={() => setActiveTab('queue')}
              className="text-xs text-[#55745E] hover:text-[#455E4C] font-semibold flex items-center gap-1 cursor-pointer"
            >
              View Full Queue <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {queue.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-400 bg-[#FAF7F2] rounded-2xl border border-[#E8E3DA]">
              No parties currently waiting in queue.
            </div>
          ) : (
            <div className="space-y-2.5">
              {queue.slice(0, 5).map((cust) => (
                <div
                  key={cust.id}
                  className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8E3DA] flex items-center justify-between text-xs hover:border-[#55745E]/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#55745E]/10 text-[#55745E] font-bold flex items-center justify-center shrink-0 border border-[#55745E]/20">
                      {cust.group_size}
                    </div>
                    <div>
                      <div className="font-semibold text-[#28352D]">{cust.group_name}</div>
                      <div className="text-stone-500 text-[11px]">
                        Waited: <span className="font-medium text-[#28352D]">{cust.waiting_minutes}m</span>
                        {cust.special_requirements && ` • ${cust.special_requirements}`}
                      </div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#C47A59]/15 text-[#916E32] border border-[#C47A59]/30">
                    Priority {cust.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Allocation & Activity Log */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E3DA] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#28352D] font-serif">Recent Service Activity</h3>
              <p className="text-xs text-stone-500">Live allocations, reservations, and state shifts</p>
            </div>
            <button
              onClick={() => setActiveTab('advanced')}
              className="text-xs text-[#55745E] hover:text-[#455E4C] font-semibold flex items-center gap-1 cursor-pointer"
            >
              Advanced Logs <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {activity.slice(0, 5).map((act) => (
              <div
                key={act.id}
                className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8E3DA] flex items-start gap-3 text-xs hover:border-[#55745E]/40 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-[#55745E]/10 text-[#55745E] border border-[#55745E]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[#28352D] truncate">{act.title}</div>
                  <div className="text-stone-500 text-[11px] leading-snug">{act.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <TableDetailsModal
        table={selectedTable}
        isOpen={Boolean(selectedTable)}
        onClose={() => setSelectedTable(null)}
        waiters={waiters}
      />

      <AddCustomerModal
        isOpen={showAddCustomer}
        onClose={() => setShowAddCustomer(false)}
      />
    </div>
  );
}
