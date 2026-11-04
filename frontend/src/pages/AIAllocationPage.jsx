import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { api } from '../services/api';
import {
  BrainCircuit,
  Sparkles,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  Compass,
  Zap,
  HelpCircle,
  Layers,
  ArrowRight
} from 'lucide-react';

const ALGORITHM_DESCRIPTIONS = {
  A_STAR: {
    name: 'A* Heuristic Search',
    badge: 'Optimal Cost Guaranteed',
    description: 'Priority queue exploration guided by an admissible lower-bound heuristic h(n) on capacity waste. Minimizes total service cost.',
  },
  GREEDY: {
    name: 'Greedy Search',
    badge: 'Locally Optimal',
    description: 'Picks the immediate lowest-cost table and waiter at each step without backtracking. Very fast, but subject to local minima.',
  },
  RULE_BASED: {
    name: 'Rule-Based Allocation',
    badge: 'Deterministic IF/ELSE',
    description: 'Cascading priority rules: exact location match -> minimum capacity difference -> lowest waiter load.',
  },
  BFS: {
    name: 'Breadth-First Search (BFS)',
    badge: 'Shortest Path Steps',
    description: 'Explores state space level-by-level across customer queues. Guarantees fewest unallocated transitions.',
  },
  DFS: {
    name: 'Depth-First Search (DFS)',
    badge: 'Deep Exploration',
    description: 'Traverses deep branches of the allocation state graph with visited-state cycle prevention.',
  },
};

export default function AIAllocationPage() {
  const { refreshIndex, triggerRefresh, addToast, setActiveTab } = useRestaurant();
  const [selectedAlgo, setSelectedAlgo] = useState('A_STAR');
  const [autoCommit, setAutoCommit] = useState(true);
  const [running, setRunning] = useState(false);
  const [allocationResult, setAllocationResult] = useState(null);
  const [waitingCustomers, setWaitingCustomers] = useState([]);
  const [availableTables, setAvailableTables] = useState([]);
  const [recentAllocations, setRecentAllocations] = useState([]);

  useEffect(() => {
    const loadState = async () => {
      try {
        const [cData, tData, aData] = await Promise.all([
          api.getCustomers('WAITING'),
          api.getTables('AVAILABLE'),
          api.getAllocations(10)
        ]);
        setWaitingCustomers(cData);
        setAvailableTables(tData);
        setRecentAllocations(aData);
      } catch (err) {
        console.error('Error loading allocation state:', err);
      }
    };
    loadState();
  }, [refreshIndex]);

  const handleRunAllocation = async () => {
    if (waitingCustomers.length === 0) {
      addToast('No customers currently in waiting queue to allocate.', 'warning');
      return;
    }
    if (availableTables.length === 0) {
      addToast('No tables currently available. Free or reset tables first.', 'warning');
      return;
    }

    try {
      setRunning(true);
      const res = await api.runAllocation(selectedAlgo, null, autoCommit);
      setAllocationResult(res);
      addToast(`Allocated ${res.successful_allocations}/${res.total_requested} parties using ${selectedAlgo}!`, 'success');
      triggerRefresh();
    } catch (err) {
      addToast(err.message || 'Allocation execution failed', 'error');
    } finally {
      setRunning(false);
    }
  };

  const algoMeta = ALGORITHM_DESCRIPTIONS[selectedAlgo] || ALGORITHM_DESCRIPTIONS.A_STAR;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>AI Table Allocation Engine</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-champagne-500/15 text-champagne-300 font-semibold border border-champagne-500/30">
              Core Academic Module
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-noir-400 mt-0.5">
            Optimize table assignments and waiter distribution by minimizing multi-factor service cost.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('comparison')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-noir-900 hover:bg-noir-850 text-white border border-white/10 shadow-xs transition-all"
        >
          Compare All 5 Algorithms
        </button>
      </div>

      {/* Control Panel Card */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/10 shadow-3d-card space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-semibold text-champagne-400 uppercase tracking-wider block">
              Step 1: Select AI Algorithm
            </span>
            <span className="text-xs text-noir-400">Choose the search paradigm to evaluate state transitions</span>
          </div>

          {/* Auto-commit switch */}
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-noir-300">
            <input
              type="checkbox"
              checked={autoCommit}
              onChange={(e) => setAutoCommit(e.target.checked)}
              className="w-4 h-4 rounded text-champagne-500 focus:ring-champagne-500 bg-noir-900 border-white/10"
            />
            <span>Commit decisions directly to live restaurant state</span>
          </label>
        </div>

        {/* Algorithm Selection Radio Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {Object.entries(ALGORITHM_DESCRIPTIONS).map(([key, item]) => {
            const isSelected = selectedAlgo === key;
            return (
              <div
                key={key}
                onClick={() => setSelectedAlgo(key)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-champagne-500/15 border-champagne-500/50 shadow-glow-champagne ring-1 ring-champagne-500/30'
                    : 'bg-noir-900/60 border-white/5 hover:border-white/15 hover:bg-noir-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white">{item.name.split(' ')[0]}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase ${isSelected ? 'bg-champagne-500 text-noir-950' : 'bg-noir-800 text-noir-400'}`}>
                      {key}
                    </span>
                  </div>
                  <p className="text-[11px] text-noir-400 leading-snug line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-white/5 text-[10px] font-semibold text-champagne-400">
                  {item.badge}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button & Readiness Summary */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-noir-300">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Queue Waiting: <strong>{waitingCustomers.length} parties</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-noir-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Available Tables: <strong>{availableTables.length} tables</strong></span>
            </div>
          </div>

          <button
            onClick={handleRunAllocation}
            disabled={running || waitingCustomers.length === 0 || availableTables.length === 0}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-champagne-500 to-champagne-600 hover:from-champagne-400 hover:to-champagne-500 text-noir-950 shadow-glow-champagne transition-all disabled:opacity-40"
          >
            <Sparkles className={`w-4 h-4 text-noir-950 ${running ? 'animate-spin' : ''}`} />
            {running ? 'Evaluating Search States...' : `Execute ${selectedAlgo} Allocation`}
          </button>
        </div>
      </div>

      {/* Allocation Execution Results */}
      {allocationResult && (
        <div className="space-y-4 animate-fade-in">
          {/* Metrics bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3.5 rounded-2xl glass-panel border border-white/10">
              <span className="text-[10px] text-noir-400 block uppercase font-medium">Algorithm</span>
              <span className="text-sm font-bold text-white">{allocationResult.algorithm}</span>
            </div>
            <div className="p-3.5 rounded-2xl glass-panel border border-white/10">
              <span className="text-[10px] text-noir-400 block uppercase font-medium">Execution Time</span>
              <span className="text-sm font-bold text-champagne-300 font-mono">{allocationResult.execution_time_ms} ms</span>
            </div>
            <div className="p-3.5 rounded-2xl glass-panel border border-white/10">
              <span className="text-[10px] text-noir-400 block uppercase font-medium">Nodes Explored</span>
              <span className="text-sm font-bold text-champagne-400">{allocationResult.nodes_explored} states</span>
            </div>
            <div className="p-3.5 rounded-2xl glass-panel border border-white/10">
              <span className="text-[10px] text-noir-400 block uppercase font-medium">Success Rate</span>
              <span className="text-sm font-bold text-emerald-400">
                {allocationResult.successful_allocations} / {allocationResult.total_requested}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl glass-panel border border-white/10">
              <span className="text-[10px] text-noir-400 block uppercase font-medium">Table Utilization</span>
              <span className="text-sm font-bold text-white">{allocationResult.table_utilization_percent}%</span>
            </div>
            <div className="p-3.5 rounded-2xl glass-panel border border-white/10">
              <span className="text-[10px] text-noir-400 block uppercase font-medium">Total Cost Score</span>
              <span className="text-sm font-bold text-champagne-300 font-mono">{allocationResult.total_cost}</span>
            </div>
          </div>

          {/* Allocation Decisions Details */}
          <div className="glass-panel rounded-3xl border border-white/10 shadow-3d-card p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Allocation Decision Explanations & Alternatives</h3>

            <div className="space-y-3">
              {allocationResult.decisions.map((dec, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border text-xs ${
                    dec.success
                      ? 'bg-noir-900/70 border-white/10'
                      : 'bg-rose-950/40 border-rose-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${dec.success ? 'bg-emerald-400 shadow-glow-emerald' : 'bg-rose-400'}`} />
                      <span className="font-bold text-white text-sm">{dec.group_name} ({dec.group_size} guests)</span>
                      {dec.table_number && (
                        <span className="px-2 py-0.5 rounded-md bg-noir-850 border border-champagne-500/30 font-mono font-semibold text-champagne-300">
                          Table {dec.table_number} ({dec.table_capacity} seats)
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-mono text-noir-400">
                      Cost: <strong className="text-champagne-300">{dec.cost.toFixed(1)}</strong>
                    </span>
                  </div>

                  {/* Decision Explanation */}
                  <p className="text-noir-300 leading-relaxed font-normal mb-2">
                    {dec.reason}
                  </p>

                  {/* Rejected Alternatives */}
                  {dec.rejected_alternatives && dec.rejected_alternatives.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-white/5 text-[11px] text-noir-400">
                      <span className="font-semibold text-noir-300 block mb-1">Evaluated & Rejected Alternatives:</span>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {dec.rejected_alternatives.map((alt, aIdx) => (
                          <li key={aIdx}>{alt}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Allocations Table */}
      <div className="glass-panel rounded-3xl border border-white/10 shadow-3d-card p-5 sm:p-6">
        <h3 className="text-sm font-bold text-white mb-3">Recent Executed Allocations Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-noir-900/80 border-b border-white/10 text-noir-400 font-semibold uppercase text-[10px]">
                <th className="py-2.5 px-3">Party Name</th>
                <th className="py-2.5 px-3">Table</th>
                <th className="py-2.5 px-3">Waiter Assigned</th>
                <th className="py-2.5 px-3">Algorithm</th>
                <th className="py-2.5 px-3">Decision Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-noir-200">
              {recentAllocations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-noir-500">
                    No logged allocations found in active session.
                  </td>
                </tr>
              ) : (
                recentAllocations.map((a) => (
                  <tr key={a.id} className="hover:bg-white/5">
                    <td className="py-2.5 px-3 font-semibold text-white">{a.group_name || `Group #${a.customer_group_id}`}</td>
                    <td className="py-2.5 px-3 font-mono font-medium text-champagne-300">{a.table_number || `Table #${a.table_id}`}</td>
                    <td className="py-2.5 px-3">{a.waiter_name || `Staff #${a.waiter_id}`}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-noir-850 text-noir-300 border border-white/10">
                        {a.algorithm_used}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-noir-400 max-w-xs truncate">{a.allocation_reason}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
