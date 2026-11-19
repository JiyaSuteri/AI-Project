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
          <h2 className="text-lg sm:text-xl font-bold text-[#28352D] dark:text-[#F3EFEA] font-serif tracking-tight flex items-center gap-2">
            <span>Algorithm Runner &amp; Decision Trees</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#55745E]/10 dark:bg-[#6E9A7B]/20 text-[#55745E] dark:text-[#6E9A7B] font-semibold border border-[#55745E]/20 dark:border-[#6E9A7B]/30">
              Heuristic Inspection
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-[#98A89E] mt-0.5">
            Optimize table assignments and waiter distribution by minimizing multi-factor service cost.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('advanced')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#18201B] hover:bg-stone-50 dark:hover:bg-[#1F2A23] text-[#28352D] dark:text-[#F3EFEA] border border-[#E8E3DA] dark:border-[#2A382F] shadow-xs transition-all cursor-pointer"
        >
          Compare All 5 Algorithms
        </button>
      </div>

      {/* Control Panel Card */}
      <div className="bg-white dark:bg-[#18201B] rounded-3xl p-5 sm:p-6 border border-[#E8E3DA] dark:border-[#2A382F] shadow-xs space-y-5 transition-colors duration-200">
        <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-[#E8E3DA] dark:border-[#2A382F]">
          <div>
            <span className="text-xs font-semibold text-[#55745E] dark:text-[#6E9A7B] uppercase tracking-wider block">
              Step 1: Select AI Algorithm
            </span>
            <span className="text-xs text-stone-500 dark:text-[#98A89E]">Choose the search paradigm to evaluate state transitions</span>
          </div>

          {/* Auto-commit switch */}
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-600 dark:text-[#98A89E]">
            <input
              type="checkbox"
              checked={autoCommit}
              onChange={(e) => setAutoCommit(e.target.checked)}
              className="w-4 h-4 rounded text-[#55745E] focus:ring-[#55745E] bg-[#FAF7F2] dark:bg-[#111613] border-[#E8E3DA] dark:border-[#2A382F]"
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
                    ? 'bg-[#55745E]/10 dark:bg-[#6E9A7B]/20 border-[#55745E] dark:border-[#6E9A7B] shadow-xs'
                    : 'bg-[#FAF7F2] dark:bg-[#111613] border-[#E8E3DA] dark:border-[#2A382F] hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-[#28352D] dark:text-[#F3EFEA]">{item.name.split(' ')[0]}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase ${isSelected ? 'bg-[#55745E] dark:bg-[#6E9A7B] text-white' : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300'}`}>
                      {key}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-[#98A89E] leading-snug line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-200/60 dark:border-stone-800 text-[10px] font-semibold text-[#55745E] dark:text-[#6E9A7B]">
                  {item.badge}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button & Readiness Summary */}
        <div className="pt-4 border-t border-[#E8E3DA] dark:border-[#2A382F] flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4 text-xs text-stone-600 dark:text-[#98A89E]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#55745E] dark:bg-[#6E9A7B]" />
              <span>Waiting: <strong className="text-[#28352D] dark:text-[#F3EFEA]">{waitingCustomers.length} parties</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Available: <strong className="text-[#28352D] dark:text-[#F3EFEA]">{availableTables.length} tables</strong></span>
            </div>
          </div>

          <button
            onClick={handleRunAllocation}
            disabled={running || waitingCustomers.length === 0 || availableTables.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#55745E] dark:bg-[#6E9A7B] hover:bg-[#45604D] dark:hover:bg-[#5B8267] text-white shadow-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${running ? 'animate-spin' : ''}`} />
            <span>{running ? 'Running Search...' : `Execute ${selectedAlgo} Allocation`}</span>
          </button>
        </div>
      </div>

      {/* Results & Decisions Tree */}
      {allocationResult && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Summary Banner */}
          <div className="bg-white dark:bg-[#18201B] rounded-3xl border border-[#55745E]/30 dark:border-[#6E9A7B]/40 p-5 sm:p-6 shadow-xs flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#55745E]/10 dark:bg-[#6E9A7B]/20 text-[#55745E] dark:text-[#6E9A7B] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-[#28352D] dark:text-[#F3EFEA]">
                  Allocation Batch Complete: {allocationResult.algorithm}
                </div>
                <div className="text-xs text-stone-500 dark:text-[#98A89E]">
                  Seated {allocationResult.successful_allocations} of {allocationResult.total_requested} requested parties in {allocationResult.execution_time_ms.toFixed(1)} ms.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-stone-500 dark:text-[#98A89E]">Nodes Explored: <strong className="text-[#55745E] dark:text-[#6E9A7B]">{allocationResult.nodes_explored}</strong></span>
              <span className="text-stone-500 dark:text-[#98A89E]">Total Cost: <strong className="text-[#C47A59] dark:text-[#DC8A66]">{allocationResult.total_cost}</strong></span>
            </div>
          </div>

          {/* Allocation Decisions Details */}
          <div className="bg-white dark:bg-[#18201B] rounded-3xl border border-[#E8E3DA] dark:border-[#2A382F] shadow-xs p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-bold text-[#28352D] dark:text-[#F3EFEA] font-serif">Allocation Decision Explanations &amp; Alternatives</h3>

            <div className="space-y-3">
              {allocationResult.decisions.map((dec, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border text-xs ${
                    dec.success
                      ? 'bg-[#FAF7F2] dark:bg-[#111613] border-[#E8E3DA] dark:border-[#2A382F]'
                      : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${dec.success ? 'bg-[#55745E] dark:bg-[#6E9A7B]' : 'bg-rose-500'}`} />
                      <span className="font-bold text-[#28352D] dark:text-[#F3EFEA] text-sm">{dec.group_name} ({dec.group_size} guests)</span>
                      {dec.table_number && (
                        <span className="px-2 py-0.5 rounded-md bg-white dark:bg-[#18201B] border border-[#55745E]/30 dark:border-[#6E9A7B]/40 font-mono font-semibold text-[#55745E] dark:text-[#6E9A7B]">
                          Table {dec.table_number} ({dec.table_capacity} seats)
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-mono text-stone-500 dark:text-[#98A89E]">
                      Cost: <strong className="text-[#C47A59] dark:text-[#DC8A66]">{dec.cost.toFixed(1)}</strong>
                    </span>
                  </div>

                  {/* Decision Explanation */}
                  <p className="text-stone-600 dark:text-[#98A89E] leading-relaxed font-normal mb-2">
                    {dec.reason}
                  </p>

                  {/* Rejected Alternatives */}
                  {dec.rejected_alternatives && dec.rejected_alternatives.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-stone-200/80 dark:border-stone-800 text-[11px] text-stone-500 dark:text-[#98A89E]">
                      <span className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">Evaluated &amp; Rejected Alternatives:</span>
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
      <div className="bg-white dark:bg-[#18201B] rounded-3xl border border-[#E8E3DA] dark:border-[#2A382F] shadow-xs p-5 sm:p-6 transition-colors duration-200">
        <h3 className="text-sm font-bold text-[#28352D] dark:text-[#F3EFEA] font-serif mb-3">Recent Executed Allocations Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] dark:bg-[#111613] border-b border-[#E8E3DA] dark:border-[#2A382F] text-stone-500 dark:text-[#98A89E] font-semibold uppercase text-[10px]">
                <th className="py-2.5 px-3">Party Name</th>
                <th className="py-2.5 px-3">Table</th>
                <th className="py-2.5 px-3">Waiter Assigned</th>
                <th className="py-2.5 px-3">Algorithm</th>
                <th className="py-2.5 px-3">Decision Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3DA] dark:divide-[#2A382F] text-[#28352D] dark:text-[#F3EFEA]">
              {recentAllocations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-stone-400 dark:text-stone-500">
                    No allocations yet
                  </td>
                </tr>
              ) : (
                recentAllocations.map((a) => (
                  <tr key={a.id} className="hover:bg-stone-50/80 dark:hover:bg-[#1F2A23]/80">
                    <td className="py-2.5 px-3 font-semibold text-[#28352D] dark:text-[#F3EFEA]">{a.group_name || `Group #${a.customer_group_id}`}</td>
                    <td className="py-2.5 px-3 font-mono font-medium text-[#55745E] dark:text-[#6E9A7B]">{a.table_number || `Table #${a.table_id}`}</td>
                    <td className="py-2.5 px-3">{a.waiter_name || `Staff #${a.waiter_id}`}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF7F2] dark:bg-[#111613] text-stone-600 dark:text-[#98A89E] border border-[#E8E3DA] dark:border-[#2A382F]">
                        {a.algorithm_used}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-stone-500 dark:text-[#98A89E] max-w-xs truncate">{a.allocation_reason}</td>
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
