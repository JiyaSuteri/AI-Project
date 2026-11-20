import React, { useState } from 'react';
import { assetUrl } from '../utils/assetUrl';
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
          <h1 className="text-xl sm:text-2xl font-bold text-[#28352D] dark:text-[#F3EFEA] font-serif tracking-tight flex items-center gap-2.5">
            <span>Advanced AI Tools &amp; Laboratory</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#55745E]/10 dark:bg-[#6E9A7B]/20 text-[#55745E] dark:text-[#6E9A7B] font-semibold border border-[#55745E]/20 dark:border-[#6E9A7B]/30">
              5 Algorithms Active
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-[#98A89E] mt-0.5">
            Compare search algorithms, run multi-agent discrete event simulations, and inspect heuristic cost functions.
          </p>
        </div>
      </div>

      {/* AI Laboratory Visual Showcase */}
      <div className="relative w-full h-36 sm:h-44 rounded-3xl overflow-hidden border border-[#E8E3DA] dark:border-[#2A382F] shadow-xs group">
        <img
          src={assetUrl('/images/ai-algorithm-artwork.jpg')}
          alt="AI Heuristic Algorithm Neural Decision Tree"
          className="w-full h-full object-cover object-center transform group-hover:scale-[1.01] transition-transform duration-500"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent flex items-center p-6 sm:p-8">
          <div className="text-white space-y-1.5 max-w-xl">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#55745E] text-white">
              Multi-Agent Heuristics
            </span>
            <h2 className="text-base sm:text-xl font-bold font-serif text-white">
              Heuristic Search &amp; Decision Optimization Laboratory
            </h2>
            <p className="text-xs text-white/85 leading-relaxed hidden sm:block">
              Comparing A*, Greedy Best-First, Breadth-First, Depth-First, and Rule-Based optimization with live cost telemetry.
            </p>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto p-1.5 bg-white dark:bg-[#18201B] rounded-2xl border border-[#E8E3DA] dark:border-[#2A382F] shadow-xs">
        {tools.map((t) => {
          const Icon = t.icon;
          const isActive = activeSubTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveSubTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#55745E] dark:bg-[#6E9A7B] text-white shadow-sm'
                  : 'text-stone-600 dark:text-[#98A89E] hover:text-[#28352D] dark:hover:text-white hover:bg-stone-100 dark:hover:bg-[#1F2A23]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#55745E] dark:text-[#6E9A7B]'}`} />
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
