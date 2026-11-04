import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { api } from '../services/api';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  PlaySquare,
  Users,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  History,
  Activity,
  Sliders
} from 'lucide-react';

export default function SimulationPage() {
  const { triggerRefresh, addToast } = useRestaurant();
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Simulation Parameters
  const [customerCount, setCustomerCount] = useState(12);
  const [algorithm, setAlgorithm] = useState('A_STAR');
  const [arrivalInterval, setArrivalInterval] = useState(2.0);
  const [serviceDuration, setServiceDuration] = useState(8.0);
  const [cleaningDuration, setCleaningDuration] = useState(4.0);
  const [randomSeed, setRandomSeed] = useState(42);

  const fetchStatus = async () => {
    try {
      const data = await api.getSimulationStatus();
      setStatus(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistory = async () => {
    try {
      const data = await api.getSimulationHistory();
      setHistory(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchHistory();
  }, []);

  const handleStart = async () => {
    try {
      setLoading(true);
      const res = await api.startSimulation({
        customer_count: Number(customerCount),
        algorithm,
        arrival_interval_seconds: Number(arrivalInterval),
        service_duration_seconds: Number(serviceDuration),
        cleaning_duration_seconds: Number(cleaningDuration),
        random_seed: Number(randomSeed),
      });
      setStatus(res);
      addToast(`Multi-agent simulation finished using ${algorithm}!`, 'success');
      fetchHistory();
      triggerRefresh();
    } catch (err) {
      addToast(err.message || 'Simulation start failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStep = async () => {
    try {
      const res = await api.stepSimulation(1.0);
      setStatus(res);
    } catch (err) {
      addToast(err.message || 'Simulation step failed', 'error');
    }
  };

  const handleReset = async () => {
    try {
      const res = await api.resetSimulation();
      setStatus(res);
      addToast('Simulation timeline reset.', 'info');
    } catch (err) {
      addToast(err.message || 'Simulation reset failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Multi-Agent Restaurant Simulator</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 font-semibold border border-emerald-500/30">
              Discrete-Event Engine
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-noir-400 mt-0.5">
            Interacting Customer, Table, Waiter, and Manager agents modeling dining lifecycles and queue patience limits.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleStep}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-noir-900 hover:bg-noir-850 text-white border border-white/10 shadow-xs transition-all"
            title="Step forward 1 second"
          >
            <FastForward className="w-3.5 h-3.5 text-champagne-400" />
            Step +1s
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-noir-900 hover:bg-noir-850 text-white border border-white/10 shadow-xs transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-noir-400" />
            Reset
          </button>
          <button
            onClick={handleStart}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-champagne-500 to-champagne-600 hover:from-champagne-400 hover:to-champagne-500 text-noir-950 shadow-glow-champagne transition-all disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Simulating...' : 'Run Full Simulation'}
          </button>
        </div>
      </div>

      {/* Configuration Parameters Card */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/10 shadow-3d-card space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-champagne-400">
          <Sliders className="w-4 h-4 text-champagne-400" />
          <span>Configurable Simulation Parameters</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-noir-300 mb-1">Customer Parties</label>
            <input
              type="number"
              min="2"
              max="30"
              value={customerCount}
              onChange={(e) => setCustomerCount(e.target.value)}
              className="w-full bg-noir-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-champagne-500 font-semibold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-noir-300 mb-1">AI Algorithm</label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="w-full bg-noir-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-champagne-500 font-semibold"
            >
              <option value="A_STAR">A* Search</option>
              <option value="GREEDY">Greedy Search</option>
              <option value="RULE_BASED">Rule-Based</option>
              <option value="BFS">BFS</option>
              <option value="DFS">DFS</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-noir-300 mb-1">Arrival Interval (s)</label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="10"
              value={arrivalInterval}
              onChange={(e) => setArrivalInterval(e.target.value)}
              className="w-full bg-noir-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-champagne-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-noir-300 mb-1">Dining Duration (s)</label>
            <input
              type="number"
              min="2"
              max="30"
              value={serviceDuration}
              onChange={(e) => setServiceDuration(e.target.value)}
              className="w-full bg-noir-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-champagne-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-noir-300 mb-1">Cleaning Turnover (s)</label>
            <input
              type="number"
              min="1"
              max="15"
              value={cleaningDuration}
              onChange={(e) => setCleaningDuration(e.target.value)}
              className="w-full bg-noir-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-champagne-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-noir-300 mb-1">Random Seed</label>
            <input
              type="number"
              value={randomSeed}
              onChange={(e) => setRandomSeed(e.target.value)}
              className="w-full bg-noir-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-champagne-300 focus:outline-none focus:border-champagne-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Live Timeline & Real-Time Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl glass-panel border border-white/10 shadow-xs">
          <span className="text-[10px] text-noir-400 uppercase font-semibold block">Virtual Clock</span>
          <span className="text-xl font-bold text-champagne-300 font-mono">
            {status?.current_time_sec ?? 0.0}s
          </span>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-white/10 shadow-xs">
          <span className="text-[10px] text-noir-400 uppercase font-semibold block">Total Customers</span>
          <span className="text-xl font-bold text-white">
            {status?.total_customers ?? 0}
          </span>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-white/10 shadow-xs">
          <span className="text-[10px] text-emerald-400 uppercase font-semibold block">Successfully Seated</span>
          <span className="text-xl font-bold text-emerald-400">
            {status?.allocated_customers ?? 0}
          </span>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-white/10 shadow-xs">
          <span className="text-[10px] text-amber-400 uppercase font-semibold block">In Waiting Queue</span>
          <span className="text-xl font-bold text-amber-300">
            {status?.waiting_customers ?? 0}
          </span>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-white/10 shadow-xs">
          <span className="text-[10px] text-rose-400 uppercase font-semibold block">Reneged (Patience)</span>
          <span className="text-xl font-bold text-rose-400">
            {status?.reneged_customers ?? 0}
          </span>
        </div>
      </div>

      {/* Live Event Stream Timeline */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/10 shadow-3d-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Live Agent Event Stream</h3>
            <p className="text-xs text-noir-400">Autonomous discrete events generated by Customer, Table, and Waiter agents</p>
          </div>
          <span className="text-xs font-mono font-medium text-champagne-400">
            {status?.events?.length || 0} events logged
          </span>
        </div>

        <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
          {(!status?.events || status.events.length === 0) ? (
            <div className="p-12 text-center text-xs text-noir-500 bg-noir-900/60 rounded-2xl border border-white/5">
              No simulation events recorded yet. Click "Run Full Simulation" or "Step +1s" to begin.
            </div>
          ) : (
            status.events.map((ev, idx) => {
              let badge = 'bg-noir-850 text-noir-300 border-white/10';
              let icon = <Activity className="w-3.5 h-3.5" />;

              if (ev.event_type === 'ARRIVAL') {
                badge = 'bg-amber-950/80 text-amber-300 border-amber-500/30';
                icon = <Users className="w-3.5 h-3.5 text-amber-400" />;
              } else if (ev.event_type === 'ALLOCATED') {
                badge = 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30';
                icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
              } else if (ev.event_type === 'SERVICE_DONE') {
                badge = 'bg-blue-950/80 text-blue-300 border-blue-500/30';
                icon = <Clock className="w-3.5 h-3.5 text-blue-400" />;
              } else if (ev.event_type === 'CLEANING_DONE') {
                badge = 'bg-sky-950/80 text-sky-300 border-sky-500/30';
                icon = <Sparkles className="w-3.5 h-3.5 text-sky-400" />;
              } else if (ev.event_type === 'RENEGED') {
                badge = 'bg-rose-950/80 text-rose-300 border-rose-500/30';
                icon = <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />;
              }

              return (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-noir-900/60 border border-white/5 flex items-start gap-3 text-xs hover:border-white/10 transition-colors"
                >
                  <span className="font-mono text-champagne-400 text-[11px] w-12 shrink-0 pt-0.5">
                    {ev.timestamp_sec.toFixed(1)}s
                  </span>

                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase shrink-0 border ${badge}`}>
                    {ev.event_type}
                  </span>

                  <div className="flex-1 text-noir-200 font-medium leading-snug">
                    {ev.description}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Historical Simulation Records Table */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/10 shadow-3d-card">
        <div className="flex items-center gap-2 mb-3">
          <History className="w-4 h-4 text-champagne-400" />
          <h3 className="text-sm font-bold text-white">Historical Simulation Runs</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-noir-900/80 border-b border-white/10 text-noir-400 font-semibold uppercase text-[10px]">
                <th className="py-2.5 px-3">Run Name</th>
                <th className="py-2.5 px-3">Algorithm</th>
                <th className="py-2.5 px-3">Customers</th>
                <th className="py-2.5 px-3">Allocated</th>
                <th className="py-2.5 px-3">Avg Wait (s)</th>
                <th className="py-2.5 px-3">Execution (ms)</th>
                <th className="py-2.5 px-3">Utilization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-noir-200">
              {history.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-noir-500">
                    No simulation records persisted in database yet.
                  </td>
                </tr>
              ) : (
                history.map((h) => (
                  <tr key={h.id} className="hover:bg-white/5">
                    <td className="py-2.5 px-3 font-semibold text-white">{h.simulation_name}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-noir-850 text-noir-300 border border-white/10">
                        {h.algorithm}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">{h.total_customers}</td>
                    <td className="py-2.5 px-3 font-semibold text-emerald-400">{h.successful_allocations}</td>
                    <td className="py-2.5 px-3 font-mono">{h.average_waiting_time}s</td>
                    <td className="py-2.5 px-3 font-mono">{h.execution_time}ms</td>
                    <td className="py-2.5 px-3 font-semibold text-champagne-300">{h.utilization}%</td>
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
