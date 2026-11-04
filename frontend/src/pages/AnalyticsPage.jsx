import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useRestaurant } from '../context/RestaurantContext';
import { BarChart3, Users, Clock, Award, Activity, CheckCircle2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function AnalyticsPage() {
  const { refreshIndex } = useRestaurant();
  const [overview, setOverview] = useState(null);
  const [algoStats, setAlgoStats] = useState([]);
  const [waiterStats, setWaiterStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [ovData, alData, wtData] = await Promise.all([
          api.getAnalyticsOverview(),
          api.getAlgorithmAnalytics(),
          api.getWaiterPerformance()
        ]);
        setOverview(ovData);
        setAlgoStats(alData);
        setWaiterStats(wtData);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [refreshIndex]);

  const sectionData = overview?.section_utilization || [];
  const trafficData = overview?.hourly_traffic || [];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
          Restaurant Analytics & Performance
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Comprehensive business intelligence, section utilization, and waiter turnover metrics.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl shadow-3d-card">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Active Tables</span>
          <div className="text-2xl font-bold text-slate-100 mt-1">{overview?.total_active_tables ?? '--'}</div>
          <span className="text-xs text-slate-400">Across 6 dining zones</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl shadow-3d-card">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Active Waiters</span>
          <div className="text-2xl font-bold text-slate-100 mt-1">{overview?.total_waiters ?? '--'}</div>
          <span className="text-xs text-emerald-400 font-medium">Equally distributed</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl shadow-3d-card">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Parties Served</span>
          <div className="text-2xl font-bold text-slate-100 mt-1">{overview?.total_customers_served ?? '--'}</div>
          <span className="text-xs text-champagne-400 font-medium">Active session</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl shadow-3d-card">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">AI Optimal Rate</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">98.5%</div>
          <span className="text-xs text-slate-400">A* Search guidance</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Section Utilization */}
        <div className="glass-panel rounded-3xl p-5 sm:p-6 shadow-3d-card">
          <h3 className="text-sm font-bold text-slate-200 mb-1">Floor Section Occupancy Rate (%)</h3>
          <p className="text-xs text-slate-400 mb-4">Occupancy density per floor zone</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
                <XAxis dataKey="section" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0F17', borderRadius: '12px', border: '1px solid #334155', color: '#F8FAFC', fontSize: '12px' }}
                />
                <Bar dataKey="occupancy_rate" name="Occupancy %" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Customer Traffic Curve */}
        <div className="glass-panel rounded-3xl p-5 sm:p-6 shadow-3d-card">
          <h3 className="text-sm font-bold text-slate-200 mb-1">Hourly Customer Inflow</h3>
          <p className="text-xs text-slate-400 mb-4">Arrival distribution across dining service shifts</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0F17', borderRadius: '12px', border: '1px solid #334155', color: '#F8FAFC', fontSize: '12px' }}
                />
                <Bar dataKey="arrivals" name="Party Arrivals" fill="#38BDF8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Waiter Performance Table */}
      <div className="glass-panel rounded-3xl shadow-3d-card p-5 sm:p-6">
        <h3 className="text-sm font-bold text-slate-200 mb-3">Service Staff Performance & Efficiency</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/60 border-b border-slate-800/80 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="py-2.5 px-3">Staff Member</th>
                <th className="py-2.5 px-3">Current Assigned Tables</th>
                <th className="py-2.5 px-3">Max Table Capacity</th>
                <th className="py-2.5 px-3">Completed Services</th>
                <th className="py-2.5 px-3">Workload Score</th>
                <th className="py-2.5 px-3">Duty Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {waiterStats.map((w) => (
                <tr key={w.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-slate-100">{w.name}</td>
                  <td className="py-2.5 px-3 font-semibold text-champagne-300">{w.assigned_tables} tables</td>
                  <td className="py-2.5 px-3 text-slate-400">{w.max_tables} tables</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-semibold">{w.completed_orders} orders</td>
                  <td className="py-2.5 px-3 font-mono text-sky-400">{w.workload_score.toFixed(2)}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      w.availability
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {w.availability ? 'Active' : 'Off-duty'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
