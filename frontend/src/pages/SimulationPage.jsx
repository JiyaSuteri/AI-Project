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

  const handlePause = async () => {
    try {
      const res = await api.pauseSimulation();
      setStatus(res);
      addToast('Simulation timeline paused.', 'info');
    } catch (err) {
      addToast(err.message || 'Simulation pause failed', 'error');
    }
  };

  const handleResume = async () => {
    try {
      const res = await api.resumeSimulation();
      setStatus(res);
      addToast('Simulation timeline resumed.', 'info');
    } catch (err) {
      addToast(err.message || 'Simulation resume failed', 'error');
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
          <h2 className="text-lg sm:text-xl font-bold text-[#28352D] font-serif tracking-tight flex items-center gap-2">
            <span>Multi-Agent Restaurant Simulator</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#55745E]/10 text-[#55745E] font-semibold border border-[#55745E]/20">
              Discrete-Event Engine
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Interacting Customer, Table, Waiter, and Manager agents modeling dining lifecycles and queue patience limits.
          </p>
        </div>

        {/* Action Controls: Start, Step, Pause, Resume, Reset */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleStep}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-stone-50 text-[#28352D] border border-[#E8E3DA] shadow-xs transition-all cursor-pointer"
            title="Step forward 1 second"
          >
            <FastForward className="w-3.5 h-3.5 text-[#55745E]" />
            Step +1s
          </button>
          
          {status?.is_paused ? (
            <button
              onClick={handleResume}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-stone-50 text-[#55745E] border border-[#55745E]/30 shadow-xs transition-all cursor-pointer"
              title="Resume simulation clock"
            >
              <Play className="w-3.5 h-3.5 text-[#55745E]" />
              Resume
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-stone-50 text-stone-600 border border-[#E8E3DA] shadow-xs transition-all cursor-pointer"
              title="Pause simulation clock"
            >
              <Pause className="w-3.5 h-3.5 text-stone-500" />
              Pause
            </button>
          )}

          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-stone-50 text-stone-600 border border-[#E8E3DA] shadow-xs transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
            Reset
          </button>
          <button
            onClick={handleStart}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#55745E] hover:bg-[#45604D] text-white shadow-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Simulating...' : 'Run Full Simulation'}
          </button>
        </div>
      </div>

      {/* Configuration Parameters Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E3DA] shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#55745E]">
          <Sliders className="w-4 h-4 text-[#55745E]" />
          <span>Configurable Simulation Parameters</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-stone-500 mb-1">Customer Parties</label>
            <input
              type="number"
              min="2"
              max="30"
              value={customerCount}
              onChange={(e) => setCustomerCount(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E8E3DA] rounded-xl px-3 py-1.5 text-xs text-[#28352D] focus:outline-none focus:border-[#55745E] font-semibold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-500 mb-1">AI Algorithm</label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E8E3DA] rounded-xl px-3 py-1.5 text-xs text-[#28352D] focus:outline-none focus:border-[#55745E] font-semibold"
            >
              <option value="A_STAR">A* Search</option>
              <option value="GREEDY">Greedy Search</option>
              <option value="RULE_BASED">Rule-Based</option>
              <option value="BFS">BFS</option>
              <option value="DFS">DFS</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-500 mb-1">Arrival Interval (s)</label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="10"
              value={arrivalInterval}
              onChange={(e) => setArrivalInterval(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E8E3DA] rounded-xl px-3 py-1.5 text-xs text-[#28352D] focus:outline-none focus:border-[#55745E]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-500 mb-1">Dining Duration (s)</label>
            <input
              type="number"
              min="2"
              max="30"
              value={serviceDuration}
              onChange={(e) => setServiceDuration(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E8E3DA] rounded-xl px-3 py-1.5 text-xs text-[#28352D] focus:outline-none focus:border-[#55745E]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-500 mb-1">Cleaning Turnover (s)</label>
            <input
              type="number"
              min="1"
              max="15"
              value={cleaningDuration}
              onChange={(e) => setCleaningDuration(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E8E3DA] rounded-xl px-3 py-1.5 text-xs text-[#28352D] focus:outline-none focus:border-[#55745E]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-500 mb-1">Random Seed</label>
            <input
              type="number"
              value={randomSeed}
              onChange={(e) => setRandomSeed(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E8E3DA] rounded-xl px-3 py-1.5 text-xs text-[#28352D] focus:outline-none focus:border-[#55745E] font-mono"
            />
          </div>
        </div>
      </div>

      {/* Live Timeline & Real-Time Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-[#E8E3DA] shadow-xs">
          <span className="text-[10px] text-stone-500 uppercase font-semibold block">Virtual Clock</span>
          <span className="text-xl font-bold text-[#55745E] font-mono">
            {status?.current_time_sec ?? 0.0}s
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E8E3DA] shadow-xs">
          <span className="text-[10px] text-stone-500 uppercase font-semibold block">Total Customers</span>
          <span className="text-xl font-bold text-[#28352D]">
            {status?.total_customers ?? 0}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E8E3DA] shadow-xs">
          <span className="text-[10px] text-[#55745E] uppercase font-semibold block">Successfully Seated</span>
          <span className="text-xl font-bold text-[#55745E]">
            {status?.allocated_customers ?? 0}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E8E3DA] shadow-xs">
          <span className="text-[10px] text-amber-600 uppercase font-semibold block">In Waiting Queue</span>
          <span className="text-xl font-bold text-amber-700">
            {status?.waiting_customers ?? 0}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E8E3DA] shadow-xs">
          <span className="text-[10px] text-rose-600 uppercase font-semibold block">Reneged (Patience)</span>
          <span className="text-xl font-bold text-rose-600">
            {status?.reneged_customers ?? 0}
          </span>
        </div>
      </div>

      {/* Live Event Stream Timeline */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E3DA] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#28352D] font-serif">Live Agent Event Stream</h3>
            <p className="text-xs text-stone-500">Autonomous discrete events generated by Customer, Table, and Waiter agents</p>
          </div>
          <span className="text-xs font-mono font-medium text-[#55745E]">
            {status?.events?.length || 0} events logged
          </span>
        </div>

        <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
          {(!status?.events || status.events.length === 0) ? (
            <div className="p-12 text-center text-xs text-stone-400 bg-[#FAF7F2] rounded-2xl border border-[#E8E3DA]">
              No simulation events recorded yet. Click "Run Full Simulation" or "Step +1s" to begin.
            </div>
          ) : (
            status.events.map((ev, idx) => {
              let badge = 'bg-stone-100 text-stone-600 border-stone-200';
              let icon = <Activity className="w-3.5 h-3.5" />;

              if (ev.event_type === 'ARRIVAL') {
                badge = 'bg-amber-50 text-amber-800 border-amber-200';
                icon = <Users className="w-3.5 h-3.5 text-amber-600" />;
              } else if (ev.event_type === 'ALLOCATED') {
                badge = 'bg-[#55745E]/10 text-[#55745E] border-[#55745E]/20';
                icon = <CheckCircle2 className="w-3.5 h-3.5 text-[#55745E]" />;
              } else if (ev.event_type === 'SERVICE_DONE') {
                badge = 'bg-blue-50 text-blue-800 border-blue-200';
                icon = <Clock className="w-3.5 h-3.5 text-blue-600" />;
              } else if (ev.event_type === 'CLEANING_DONE') {
                badge = 'bg-sky-50 text-sky-800 border-sky-200';
                icon = <Sparkles className="w-3.5 h-3.5 text-sky-600" />;
              } else if (ev.event_type === 'RENEGED') {
                badge = 'bg-rose-50 text-rose-700 border-rose-200';
                icon = <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />;
              }

              return (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8E3DA] flex items-start gap-3 text-xs hover:border-[#55745E]/30 transition-colors"
                >
                  <span className="font-mono text-[#55745E] text-[11px] w-12 shrink-0 pt-0.5">
                    {ev.timestamp_sec.toFixed(1)}s
                  </span>

                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase shrink-0 border ${badge}`}>
                    {ev.event_type}
                  </span>

                  <div className="flex-1 text-[#28352D] font-medium leading-snug">
                    {ev.description}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Historical Simulation Records Table */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E3DA] shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <History className="w-4 h-4 text-[#55745E]" />
          <h3 className="text-sm font-bold text-[#28352D] font-serif">Historical Simulation Runs</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E8E3DA] text-stone-500 font-semibold uppercase text-[10px]">
                <th className="py-2.5 px-3">Run Name</th>
                <th className="py-2.5 px-3">Algorithm</th>
                <th className="py-2.5 px-3">Customers</th>
                <th className="py-2.5 px-3">Allocated</th>
                <th className="py-2.5 px-3">Avg Wait (s)</th>
                <th className="py-2.5 px-3">Execution (ms)</th>
                <th className="py-2.5 px-3">Utilization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3DA] text-[#28352D]">
              {history.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-stone-400">
                    No simulation records persisted in database yet.
                  </td>
                </tr>
              ) : (
                history.map((h) => (
                  <tr key={h.id} className="hover:bg-stone-50/80">
                    <td className="py-2.5 px-3 font-semibold text-[#28352D]">{h.simulation_name}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF7F2] text-stone-600 border border-[#E8E3DA]">
                        {h.algorithm}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">{h.total_customers}</td>
                    <td className="py-2.5 px-3 font-semibold text-[#55745E]">{h.successful_allocations}</td>
                    <td className="py-2.5 px-3 font-mono">{h.average_waiting_time}s</td>
                    <td className="py-2.5 px-3 font-mono">{h.execution_time}ms</td>
                    <td className="py-2.5 px-3 font-semibold text-[#916E32]">{h.utilization}%</td>
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
