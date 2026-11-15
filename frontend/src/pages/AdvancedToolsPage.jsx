import React, { useState } from 'react';
import AlgorithmComparisonPage from './AlgorithmComparisonPage';
import SimulationPage from './SimulationPage';
import AnalyticsPage from './AnalyticsPage';
import AIAllocationPage from './AIAllocationPage';
import {
  GitCompare,
  PlaySquare,
  BarChart3,
  BrainCircuit,
  Wrench,
  ShieldCheck,
  Cpu
} from 'lucide-react';

export default function AdvancedToolsPage() {
  const [activeSubTab, setActiveSubTab] = useState('comparison');

  const tools = [
    {
      id: 'comparison',
      label: 'Algorithm Benchmark',
      description: 'Side-by-side performance of all 5 algorithms',
      icon: GitCompare,
    },
    {
      id: 'simulation',
      label: 'Multi-Agent Simulation',
      description: 'Discrete-event arrivals & dining cycles',
      icon: PlaySquare,
    },
    {
      id: 'allocation-details',
      label: 'Algorithm Runner & Decision Trees',
      description: 'Manual algorithm picker & cost inspection',
      icon: BrainCircuit,
    },
    {
      id: 'analytics',
      label: 'Operations Analytics',
      description: 'Hourly traffic & section utilization telemetry',
      icon: BarChart3,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#28352D] font-serif tracking-tight flex items-center gap-2.5">
            <span>Advanced AI Tools &amp; Laboratory</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#55745E]/10 text-[#55745E] font-semibold border border-[#55745E]/20">
              5 Algorithms Active
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Compare search algorithms, run multi-agent discrete event simulations, and inspect heuristic cost functions.
          </p>
        </div>
      </div>

      {/* Clean Light-Themed Sub-Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto p-1.5 bg-white rounded-2xl border border-[#E8E3DA] shadow-xs">
        {tools.map((t) => {
          const Icon = t.icon;
          const isActive = activeSubTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveSubTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#55745E] text-white shadow-sm'
                  : 'text-stone-600 hover:text-[#28352D] hover:bg-stone-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#55745E]'}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Selected Tool Sub-Page */}
      <div className="pt-1">
        {activeSubTab === 'comparison' && <AlgorithmComparisonPage />}
        {activeSubTab === 'simulation' && <SimulationPage />}
        {activeSubTab === 'allocation-details' && <AIAllocationPage />}
        {activeSubTab === 'analytics' && <AnalyticsPage />}
      </div>
    </div>
  );
}
