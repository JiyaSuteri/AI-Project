import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
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
  Zap
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
  const { refreshIndex, triggerRefresh, setActiveTab } = useRestaurant();
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [tables, setTables] = useState([]);
  const [waiters, setWaiters] = useState([]);
  const [queue, setQueue] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [statsData, actData, tablesData, waitersData, queueData] = await Promise.all([
          api.getDashboardStats(),
          api.getDashboardActivity(),
          api.getTables(),
          api.getWaiters(),
          api.getCustomers('WAITING')
        ]);
        setStats(statsData);
        setActivity(actData);
        setTables(tablesData);
        setWaiters(waitersData);
        setQueue(queueData);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, [refreshIndex]);

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
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Executive Operations Telemetry</span>
          </h1>
          <p className="text-xs sm:text-sm text-noir-400 mt-0.5">
            Real-time table occupancy, queue flow, and multi-agent AI allocation telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddCustomer(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold glass-panel hover:bg-slate-800 text-slate-200 border border-slate-700/80 shadow-xs hover:border-amber-500/40 transition-all"
          >
            <Users className="w-4 h-4 text-amber-400" />
            + Walk-in Customer
          </button>
          <button
            onClick={() => setActiveTab('allocation')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold btn-luxury transition-all"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            Run AI Allocation
          </button>
        </div>
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

      {/* Interactive 3D Floor Plan */}
      <FloorPlan
        tables={tables}
        onSelectTable={(t) => setSelectedTable(t)}
      />

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Occupancy and Customer Arrival Trend */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800/80 shadow-3d-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Dining Traffic & Occupancy Curve</h3>
              <p className="text-xs text-slate-400">Hourly guest arrivals vs. restaurant seat capacity utilization</p>
            </div>
            <span className="text-[11px] font-mono font-medium text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
              Peak: 19:00 - 20:00
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={occupancyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGuests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0A0E17', borderRadius: '12px', border: '1px solid #334155', color: '#F8FAFC', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="guests" name="Active Guests" stroke="#F59E0B" strokeWidth={2.5} fillOpacity={1} fill="url(#colorGuests)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Waiter Workload Distribution */}
        <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800/80 shadow-3d-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-100">Waiter Workloads</h3>
              <button
                onClick={() => setActiveTab('waiters')}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
              >
                Manage <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">Assigned tables per server (Max: 4-5)</p>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waiterWorkloadData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} domain={[0, 5]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0A0E17', borderRadius: '12px', border: '1px solid #334155', color: '#F8FAFC', fontSize: '12px' }}
                  />
                  <Bar dataKey="assigned" name="Assigned Tables" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Workload balancing: Active</span>
            <span className="font-semibold text-emerald-400">Optimal</span>
          </div>
        </div>
      </div>

      {/* Split Row: Queue Preview & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Live Customer Queue Preview */}
        <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800/80 shadow-3d-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Waiting Customer Queue ({queue.length})</h3>
              <p className="text-xs text-slate-400">Parties awaiting table assignment in arrival order</p>
            </div>
            <button
              onClick={() => setActiveTab('queue')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
            >
              View Full Queue <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {queue.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 bg-slate-900/60 rounded-2xl border border-slate-800">
              No parties currently waiting in queue.
            </div>
          ) : (
            <div className="space-y-2.5">
              {queue.slice(0, 5).map((cust) => (
                <div
                  key={cust.id}
                  className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between text-xs hover:border-amber-500/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-300 font-bold flex items-center justify-center shrink-0 border border-amber-500/30">
                      {cust.group_size}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-100">{cust.group_name}</div>
                      <div className="text-slate-400 text-[11px]">
                        Waited: <span className="font-medium text-slate-200">{cust.waiting_minutes}m</span>
                        {cust.special_requirements && ` • ${cust.special_requirements}`}
                      </div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    Priority {cust.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Allocation & Activity Log */}
        <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800/80 shadow-3d-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Recent Service Activity</h3>
              <p className="text-xs text-slate-400">Live allocations, reservations, and state shifts</p>
            </div>
            <button
              onClick={() => setActiveTab('allocation')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
            >
              History <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {activity.slice(0, 5).map((act) => (
              <div
                key={act.id}
                className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start gap-3 text-xs hover:border-slate-700 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-950/70 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_10px_-2px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-100 truncate">{act.title}</div>
                  <div className="text-slate-400 text-[11px] leading-snug">{act.description}</div>
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
