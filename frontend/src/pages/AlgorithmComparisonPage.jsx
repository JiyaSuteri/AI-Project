import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { useTheme } from '../context/ThemeContext';
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
  const { isDark } = useTheme();
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
          <h2 className="text-lg sm:text-xl font-bold text-[#28352D] dark:text-[#F3EFEA] font-serif tracking-tight flex items-center gap-2">
            <span>AI Search Algorithm Benchmark</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#55745E]/10 dark:bg-[#6E9A7B]/20 text-[#55745E] dark:text-[#6E9A7B] font-semibold border border-[#55745E]/20 dark:border-[#6E9A7B]/30">
              Comparative Analysis
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-[#98A89E] mt-0.5">
            Empirical evaluation of Rule-Based, Greedy, BFS, DFS, and A* on identical constraints and cost functions.
          </p>
        </div>

        <button
          onClick={runComparison}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#55745E] dark:bg-[#6E9A7B] hover:bg-[#45604D] dark:hover:bg-[#5B8267] text-white shadow-xs transition-all disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Executing Suite...' : 'Re-Run Comparative Suite'}
        </button>
      </div>

      {/* Visual Comparative Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Nodes Explored vs Execution Time Chart */}
        <div className="bg-white dark:bg-[#18201B] rounded-3xl p-5 sm:p-6 shadow-xs border border-[#E8E3DA] dark:border-[#2A382F]">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-[#28352D] dark:text-[#F3EFEA] font-serif">Search Space Explored (Nodes Visited)</h3>
            <p className="text-xs text-stone-500 dark:text-[#98A89E]">Number of state graph transitions evaluated before termination</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#2A382F' : '#E8E3DA'} />
                <XAxis dataKey="name" stroke={isDark ? '#98A89E' : '#78716C'} fontSize={11} tickLine={false} />
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
                <Bar dataKey="nodesExplored" name="Nodes Explored" fill={isDark ? '#6E9A7B' : '#55745E'} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Total Cost Score Comparison */}
        <div className="bg-white dark:bg-[#18201B] rounded-3xl p-5 sm:p-6 shadow-xs border border-[#E8E3DA] dark:border-[#2A382F]">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-[#28352D] dark:text-[#F3EFEA] font-serif">Total Allocation Cost Score</h3>
            <p className="text-xs text-stone-500 dark:text-[#98A89E]">Lower score = superior multi-factor optimization (capacity fit + waiting penalty)</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#2A382F' : '#E8E3DA'} />
                <XAxis dataKey="name" stroke={isDark ? '#98A89E' : '#78716C'} fontSize={11} tickLine={false} />
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
                <Bar dataKey="totalCost" name="Total Cost Score" fill={isDark ? '#DC8A66' : '#C47A59'} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Matrix Table */}
      <div className="bg-white dark:bg-[#18201B] rounded-3xl shadow-xs border border-[#E8E3DA] dark:border-[#2A382F] overflow-hidden transition-colors duration-200">
        <div className="p-5 border-b border-[#E8E3DA] dark:border-[#2A382F] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#28352D] dark:text-[#F3EFEA] font-serif">Side-by-Side Algorithm Comparison Matrix</h3>
            <p className="text-xs text-stone-500 dark:text-[#98A89E]">Empirical benchmark conducted on identical waiting customer queues</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] dark:bg-[#111613] border-b border-[#E8E3DA] dark:border-[#2A382F] text-stone-500 dark:text-[#98A89E] font-semibold uppercase text-[10px]">
                <th className="py-3 px-4 sm:px-6">Algorithm</th>
                <th className="py-3 px-4">Execution (ms)</th>
                <th className="py-3 px-4">Nodes Explored</th>
                <th className="py-3 px-4">Allocated Groups</th>
                <th className="py-3 px-4">Table Utilization</th>
                <th className="py-3 px-4">Total Cost</th>
                <th className="py-3 px-4">Theoretical Optimality Justification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3DA] dark:divide-[#2A382F] text-[#28352D] dark:text-[#F3EFEA]">
              {comparisons.map((item) => (
                <tr key={item.algorithm} className="hover:bg-stone-50/80 dark:hover:bg-[#1F2A23]/80 transition-colors">
                  <td className="py-3 px-4 sm:px-6 font-bold text-[#28352D] dark:text-[#F3EFEA]">
                    <span className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] dark:bg-[#111613] border border-[#E8E3DA] dark:border-[#2A382F] font-mono text-xs text-[#55745E] dark:text-[#6E9A7B]">
                      {item.algorithm}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono font-medium text-stone-600 dark:text-[#98A89E]">
                    {item.execution_time_ms} ms
                  </td>

                  <td className="py-3 px-4 font-semibold text-[#55745E] dark:text-[#6E9A7B]">
                    {item.nodes_explored}
                  </td>

                  <td className="py-3 px-4 font-semibold text-[#55745E] dark:text-[#6E9A7B]">
                    {item.successful_allocations}
                  </td>

                  <td className="py-3 px-4 font-medium text-stone-600 dark:text-[#98A89E]">
                    {item.table_utilization_percent}%
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-[#C47A59] dark:text-[#DC8A66]">
                    {item.total_cost}
                  </td>

                  <td className="py-3 px-4 text-[11px] text-stone-600 dark:text-[#98A89E] max-w-sm leading-relaxed">
                    <div className="flex items-start gap-1.5">
                      {item.is_optimal_claimed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#55745E] dark:text-[#6E9A7B] shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
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
