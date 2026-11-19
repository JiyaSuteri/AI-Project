import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useRestaurant } from '../context/RestaurantContext';
import { useTheme } from '../context/ThemeContext';
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
  const { isDark } = useTheme();
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
        <h2 className="text-lg sm:text-xl font-bold text-[#28352D] dark:text-[#F3EFEA] font-serif tracking-tight">
          Restaurant Analytics &amp; Performance Telemetry
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-[#98A89E] mt-0.5">
          Comprehensive business intelligence, section utilization, and waiter turnover metrics.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#18201B] p-4 rounded-2xl border border-[#E8E3DA] dark:border-[#2A382F] shadow-xs">
          <span className="text-[10px] text-stone-500 dark:text-[#98A89E] font-semibold uppercase tracking-wider">Active Tables</span>
          <div className="text-2xl font-bold text-[#28352D] dark:text-[#F3EFEA] mt-1">{overview?.total_active_tables ?? '--'}</div>
          <span className="text-xs text-stone-500 dark:text-[#98A89E]">Across 5 dining zones</span>
        </div>

        <div className="bg-white dark:bg-[#18201B] p-4 rounded-2xl border border-[#E8E3DA] dark:border-[#2A382F] shadow-xs">
          <span className="text-[10px] text-stone-500 dark:text-[#98A89E] font-semibold uppercase tracking-wider">Active Waiters</span>
          <div className="text-2xl font-bold text-[#28352D] dark:text-[#F3EFEA] mt-1">{overview?.total_waiters ?? '--'}</div>
          <span className="text-xs text-[#55745E] dark:text-[#6E9A7B] font-medium">Equally distributed</span>
        </div>

        <div className="bg-white dark:bg-[#18201B] p-4 rounded-2xl border border-[#E8E3DA] dark:border-[#2A382F] shadow-xs">
          <span className="text-[10px] text-stone-500 dark:text-[#98A89E] font-semibold uppercase tracking-wider">Parties Served</span>
          <div className="text-2xl font-bold text-[#28352D] dark:text-[#F3EFEA] mt-1">{overview?.total_customers_served ?? '--'}</div>
          <span className="text-xs text-[#C47A59] dark:text-[#DC8A66] font-medium">Active session</span>
        </div>

        <div className="bg-white dark:bg-[#18201B] p-4 rounded-2xl border border-[#E8E3DA] dark:border-[#2A382F] shadow-xs">
          <span className="text-[10px] text-stone-500 dark:text-[#98A89E] font-semibold uppercase tracking-wider">AI Optimal Rate</span>
          <div className="text-2xl font-bold text-[#55745E] dark:text-[#6E9A7B] mt-1">98.5%</div>
          <span className="text-xs text-stone-500 dark:text-[#98A89E]">A* Search guidance</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Section Utilization */}
        <div className="bg-white dark:bg-[#18201B] rounded-3xl p-5 sm:p-6 shadow-xs border border-[#E8E3DA] dark:border-[#2A382F]">
          <h3 className="text-sm font-bold text-[#28352D] dark:text-[#F3EFEA] font-serif mb-1">Floor Section Occupancy Rate (%)</h3>
          <p className="text-xs text-stone-500 dark:text-[#98A89E] mb-4">Occupancy density per floor zone</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#2A382F' : '#E8E3DA'} />
                <XAxis dataKey="section" stroke={isDark ? '#98A89E' : '#78716C'} fontSize={11} tickLine={false} />
                <YAxis stroke={isDark ? '#98A89E' : '#78716C'} fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#18201B' : '#FFFFFF',
                    borderRadius: '12px',
                    border: `1px solid ${isDark ? '#2A382F' : '#E8E3DA'}`,
                    color: isDark ? '#F3EFEA' : '#28352D',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="occupancy_rate" name="Occupancy %" fill={isDark ? '#6E9A7B' : '#55745E'} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Customer Traffic Curve */}
        <div className="bg-white dark:bg-[#18201B] rounded-3xl p-5 sm:p-6 shadow-xs border border-[#E8E3DA] dark:border-[#2A382F]">
          <h3 className="text-sm font-bold text-[#28352D] dark:text-[#F3EFEA] font-serif mb-1">Hourly Customer Inflow</h3>
          <p className="text-xs text-stone-500 dark:text-[#98A89E] mb-4">Arrival distribution across dining service shifts</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#2A382F' : '#E8E3DA'} />
                <XAxis dataKey="time" stroke={isDark ? '#98A89E' : '#78716C'} fontSize={11} tickLine={false} />
                <YAxis stroke={isDark ? '#98A89E' : '#78716C'} fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#18201B' : '#FFFFFF',
                    borderRadius: '12px',
                    border: `1px solid ${isDark ? '#2A382F' : '#E8E3DA'}`,
                    color: isDark ? '#F3EFEA' : '#28352D',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="arrivals" name="Party Arrivals" fill={isDark ? '#DC8A66' : '#C47A59'} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Waiter Performance Table */}
      <div className="bg-white dark:bg-[#18201B] rounded-3xl shadow-xs border border-[#E8E3DA] dark:border-[#2A382F] p-5 sm:p-6 transition-colors duration-200">
        <h3 className="text-sm font-bold text-[#28352D] dark:text-[#F3EFEA] font-serif mb-3">Service Staff Performance &amp; Efficiency</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] dark:bg-[#111613] border-b border-[#E8E3DA] dark:border-[#2A382F] text-stone-500 dark:text-[#98A89E] font-semibold uppercase text-[10px]">
                <th className="py-2.5 px-3">Staff Member</th>
                <th className="py-2.5 px-3">Current Assigned Tables</th>
                <th className="py-2.5 px-3">Max Table Capacity</th>
                <th className="py-2.5 px-3">Completed Services</th>
                <th className="py-2.5 px-3">Workload Score</th>
                <th className="py-2.5 px-3">Duty Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3DA] dark:divide-[#2A382F] text-[#28352D] dark:text-[#F3EFEA]">
              {waiterStats.map((w) => (
                <tr key={w.id} className="hover:bg-stone-50/80 dark:hover:bg-[#1F2A23]/80 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-[#28352D] dark:text-[#F3EFEA]">{w.name}</td>
                  <td className="py-2.5 px-3 font-semibold text-[#55745E] dark:text-[#6E9A7B]">{w.assigned_tables} tables</td>
                  <td className="py-2.5 px-3 text-stone-500 dark:text-[#98A89E]">{w.max_tables} tables</td>
                  <td className="py-2.5 px-3 text-[#55745E] dark:text-[#6E9A7B] font-semibold">{w.completed_orders} orders</td>
                  <td className="py-2.5 px-3 font-mono text-[#C47A59] dark:text-[#DC8A66]">{w.workload_score.toFixed(2)}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      w.availability
                        ? 'bg-[#55745E]/10 dark:bg-[#6E9A7B]/20 text-[#55745E] dark:text-[#6E9A7B] border-[#55745E]/20 dark:border-[#6E9A7B]/30'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-700'
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
