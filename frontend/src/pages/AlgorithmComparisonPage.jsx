import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { api } from '../services/api';
import {
  GitCompare,
  Sparkles,
  Zap,
  Clock,
  Compass,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BarChart2,
  RefreshCw,
  Cpu
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';

export default function AlgorithmComparisonPage() {
  const { addToast } = useRestaurant();
  const [comparisons, setComparisons] = useState([]);
  const [loading, setLoading] = useState(false);

  const runComparison = async () => {
    try {
      setLoading(true);
      const data = await api.compareAlgorithms();
      setComparisons(data);
      addToast('Evaluated all 5 algorithms on identical restaurant scenario!', 'success');
    } catch (err) {
      addToast(err.message || 'Comparison failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runComparison();
  }, []);

  // Prepare chart datasets
  const chartData = comparisons.map((c) => ({
    name: c.algorithm.replace('_', ' '),
    executionTimeMs: c.execution_time_ms,
    nodesExplored: c.nodes_explored,
    totalCost: c.total_cost,
    utilization: c.table_utilization_percent,
  }));

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <span>AI Search Algorithm Benchmark</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-champagne-500/10 text-champagne-400 font-semibold border border-champagne-500/20">
              Academic Comparative Study
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Empirical evaluation of Rule-Based, Greedy, BFS, DFS, and A* on identical constraints and cost functions.
          </p>
        </div>

        <button
          onClick={runComparison}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-champagne-500 to-amber-600 hover:from-champagne-400 hover:to-amber-500 text-slate-950 shadow-glow-champagne transition-all disabled:opacity-50 font-medium"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Executing Suite...' : 'Re-Run Comparative Suite'}
        </button>
      </div>

      {/* Visual Comparative Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Nodes Explored vs Execution Time Chart */}
        <div className="glass-panel rounded-3xl p-5 sm:p-6 shadow-3d-card">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-200">Search Space Explored (Nodes Visited)</h3>
            <p className="text-xs text-slate-400">Number of state graph transitions evaluated before termination</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0F17', borderRadius: '12px', border: '1px solid #334155', color: '#F8FAFC', fontSize: '12px' }}
                />
                <Bar dataKey="nodesExplored" name="Nodes Explored" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Total Cost Score Comparison */}
        <div className="glass-panel rounded-3xl p-5 sm:p-6 shadow-3d-card">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-200">Total Allocation Cost Score</h3>
            <p className="text-xs text-slate-400">Lower score = superior multi-factor optimization (capacity fit + waiting penalty)</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0F17', borderRadius: '12px', border: '1px solid #334155', color: '#F8FAFC', fontSize: '12px' }}
                />
                <Bar dataKey="totalCost" name="Total Cost Score" fill="#38BDF8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Matrix Table */}
      <div className="glass-panel rounded-3xl shadow-3d-card overflow-hidden">
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Side-by-Side Algorithm Comparison Matrix</h3>
            <p className="text-xs text-slate-400">Empirical benchmark conducted on identical waiting customer queues</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/60 border-b border-slate-800/80 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="py-3 px-4 sm:px-6">Algorithm</th>
                <th className="py-3 px-4">Execution (ms)</th>
                <th className="py-3 px-4">Nodes Explored</th>
                <th className="py-3 px-4">Allocated Groups</th>
                <th className="py-3 px-4">Table Utilization</th>
                <th className="py-3 px-4">Total Cost</th>
                <th className="py-3 px-4">Theoretical Optimality Justification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {comparisons.map((item) => (
                <tr key={item.algorithm} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 sm:px-6 font-bold text-slate-100">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700/80 font-mono text-xs text-champagne-300">
                      {item.algorithm}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono font-medium text-slate-300">
                    {item.execution_time_ms} ms
                  </td>

                  <td className="py-3 px-4 font-semibold text-champagne-400">
                    {item.nodes_explored}
                  </td>

                  <td className="py-3 px-4 font-semibold text-emerald-400">
                    {item.successful_allocations}
                  </td>

                  <td className="py-3 px-4 font-medium text-slate-300">
                    {item.table_utilization_percent}%
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-sky-400">
                    {item.total_cost}
                  </td>

                  <td className="py-3 px-4 text-[11px] text-slate-400 max-w-sm leading-relaxed">
                    <div className="flex items-start gap-1.5">
                      {item.is_optimal_claimed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      )}
                      <span>{item.optimality_explanation}</span>
                    </div>
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
