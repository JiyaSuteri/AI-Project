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
          <h2 className="text-lg sm:text-xl font-bold text-[#28352D] font-serif tracking-tight flex items-center gap-2">
            <span>AI Search Algorithm Benchmark</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#55745E]/10 text-[#55745E] font-semibold border border-[#55745E]/20">
              Comparative Analysis
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Empirical evaluation of Rule-Based, Greedy, BFS, DFS, and A* on identical constraints and cost functions.
          </p>
        </div>

        <button
          onClick={runComparison}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#55745E] hover:bg-[#455E4C] text-white shadow-xs transition-all disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Executing Suite...' : 'Re-Run Comparative Suite'}
        </button>
      </div>

      {/* Visual Comparative Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Nodes Explored vs Execution Time Chart */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-[#E8E3DA]">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-[#28352D] font-serif">Search Space Explored (Nodes Visited)</h3>
            <p className="text-xs text-stone-500">Number of state graph transitions evaluated before termination</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E3DA" />
                <XAxis dataKey="name" stroke="#78716C" fontSize={11} tickLine={false} />
                <YAxis stroke="#78716C" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E3DA', color: '#28352D', fontSize: '12px' }}
                />
                <Bar dataKey="nodesExplored" name="Nodes Explored" fill="#55745E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Total Cost Score Comparison */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-[#E8E3DA]">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-[#28352D] font-serif">Total Allocation Cost Score</h3>
            <p className="text-xs text-stone-500">Lower score = superior multi-factor optimization (capacity fit + waiting penalty)</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E3DA" />
                <XAxis dataKey="name" stroke="#78716C" fontSize={11} tickLine={false} />
                <YAxis stroke="#78716C" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E3DA', color: '#28352D', fontSize: '12px' }}
                />
                <Bar dataKey="totalCost" name="Total Cost Score" fill="#C47A59" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Matrix Table */}
      <div className="bg-white rounded-3xl shadow-xs border border-[#E8E3DA] overflow-hidden">
        <div className="p-5 border-b border-[#E8E3DA] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#28352D] font-serif">Side-by-Side Algorithm Comparison Matrix</h3>
            <p className="text-xs text-stone-500">Empirical benchmark conducted on identical waiting customer queues</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E8E3DA] text-stone-500 font-semibold uppercase text-[10px]">
                <th className="py-3 px-4 sm:px-6">Algorithm</th>
                <th className="py-3 px-4">Execution (ms)</th>
                <th className="py-3 px-4">Nodes Explored</th>
                <th className="py-3 px-4">Allocated Groups</th>
                <th className="py-3 px-4">Table Utilization</th>
                <th className="py-3 px-4">Total Cost</th>
                <th className="py-3 px-4">Theoretical Optimality Justification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3DA] text-[#28352D]">
              {comparisons.map((item) => (
                <tr key={item.algorithm} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-4 sm:px-6 font-bold text-[#28352D]">
                    <span className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#E8E3DA] font-mono text-xs text-[#55745E]">
                      {item.algorithm}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono font-medium text-stone-600">
                    {item.execution_time_ms} ms
                  </td>

                  <td className="py-3 px-4 font-semibold text-[#55745E]">
                    {item.nodes_explored}
                  </td>

                  <td className="py-3 px-4 font-semibold text-[#55745E]">
                    {item.successful_allocations}
                  </td>

                  <td className="py-3 px-4 font-medium text-stone-600">
                    {item.table_utilization_percent}%
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-[#916E32]">
                    {item.total_cost}
                  </td>

                  <td className="py-3 px-4 text-[11px] text-stone-600 max-w-sm leading-relaxed">
                    <div className="flex items-start gap-1.5">
                      {item.is_optimal_claimed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#55745E] shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
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
