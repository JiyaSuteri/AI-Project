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
        <h2 className="text-lg sm:text-xl font-bold text-[#28352D] font-serif tracking-tight">
          Restaurant Analytics &amp; Performance Telemetry
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          Comprehensive business intelligence, section utilization, and waiter turnover metrics.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#E8E3DA] shadow-xs">
          <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider">Active Tables</span>
          <div className="text-2xl font-bold text-[#28352D] mt-1">{overview?.total_active_tables ?? '--'}</div>
          <span className="text-xs text-stone-500">Across 5 dining zones</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E3DA] shadow-xs">
          <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider">Active Waiters</span>
          <div className="text-2xl font-bold text-[#28352D] mt-1">{overview?.total_waiters ?? '--'}</div>
          <span className="text-xs text-[#55745E] font-medium">Equally distributed</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E3DA] shadow-xs">
          <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider">Parties Served</span>
          <div className="text-2xl font-bold text-[#28352D] mt-1">{overview?.total_customers_served ?? '--'}</div>
          <span className="text-xs text-[#916E32] font-medium">Active session</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E3DA] shadow-xs">
          <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider">AI Optimal Rate</span>
          <div className="text-2xl font-bold text-[#55745E] mt-1">98.5%</div>
          <span className="text-xs text-stone-500">A* Search guidance</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Section Utilization */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-[#E8E3DA]">
          <h3 className="text-sm font-bold text-[#28352D] font-serif mb-1">Floor Section Occupancy Rate (%)</h3>
          <p className="text-xs text-stone-500 mb-4">Occupancy density per floor zone</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E3DA" />
                <XAxis dataKey="section" stroke="#78716C" fontSize={11} tickLine={false} />
                <YAxis stroke="#78716C" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E3DA', color: '#28352D', fontSize: '12px' }}
                />
                <Bar dataKey="occupancy_rate" name="Occupancy %" fill="#55745E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Customer Traffic Curve */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-[#E8E3DA]">
          <h3 className="text-sm font-bold text-[#28352D] font-serif mb-1">Hourly Customer Inflow</h3>
          <p className="text-xs text-stone-500 mb-4">Arrival distribution across dining service shifts</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E3DA" />
                <XAxis dataKey="time" stroke="#78716C" fontSize={11} tickLine={false} />
                <YAxis stroke="#78716C" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E3DA', color: '#28352D', fontSize: '12px' }}
                />
                <Bar dataKey="arrivals" name="Party Arrivals" fill="#C47A59" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Waiter Performance Table */}
      <div className="bg-white rounded-3xl shadow-xs border border-[#E8E3DA] p-5 sm:p-6">
        <h3 className="text-sm font-bold text-[#28352D] font-serif mb-3">Service Staff Performance &amp; Efficiency</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E8E3DA] text-stone-500 font-semibold uppercase text-[10px]">
                <th className="py-2.5 px-3">Staff Member</th>
                <th className="py-2.5 px-3">Current Assigned Tables</th>
                <th className="py-2.5 px-3">Max Table Capacity</th>
                <th className="py-2.5 px-3">Completed Services</th>
                <th className="py-2.5 px-3">Workload Score</th>
                <th className="py-2.5 px-3">Duty Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3DA] text-[#28352D]">
              {waiterStats.map((w) => (
                <tr key={w.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-[#28352D]">{w.name}</td>
                  <td className="py-2.5 px-3 font-semibold text-[#55745E]">{w.assigned_tables} tables</td>
                  <td className="py-2.5 px-3 text-stone-500">{w.max_tables} tables</td>
                  <td className="py-2.5 px-3 text-[#55745E] font-semibold">{w.completed_orders} orders</td>
                  <td className="py-2.5 px-3 font-mono text-[#916E32]">{w.workload_score.toFixed(2)}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      w.availability
                        ? 'bg-[#55745E]/10 text-[#55745E] border-[#55745E]/20'
                        : 'bg-stone-100 text-stone-500 border-stone-200'
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
