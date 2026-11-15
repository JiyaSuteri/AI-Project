import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import {
  UtensilsCrossed,
  Sparkles,
  ArrowRight,
  BrainCircuit,
  LayoutGrid,
  Users,
  PlaySquare,
  BotMessageSquare,
  BarChart3,
  ShieldCheck,
  Zap,
  Cpu,
  Clock,
  CheckCircle2,
  CalendarDays
} from 'lucide-react';

export default function LandingPage() {
  const { setActiveTab, serverOnline, aiProviderInfo } = useRestaurant();
  const { isAuthenticated, user, isGuest } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleGetStarted = () => {
    if (isAuthenticated || isGuest) {
      setActiveTab('dashboard');
    } else {
      setShowAuthModal(true);
    }
  };

  const keyFeatures = [
    {
      id: 'allocation',
      title: '5 AI Search Algorithms',
      description: 'Heuristic-driven table allocation using A*, Greedy Best-First, BFS, DFS, and Rule-Based optimization with seat-waste minimization.',
      icon: BrainCircuit,
      badge: 'Core AI',
    },
    {
      id: 'dashboard',
      title: 'Interactive Floor Plan',
      description: 'Live 14-table dining room layout across 5 zones (Window, Main Dining, Booths, Patio, Private) with automatic state transitions.',
      icon: LayoutGrid,
      badge: 'Floor Plan',
    },
    {
      id: 'waiters',
      title: 'Waiter Workload Balancer',
      description: 'Dynamic server allocation heuristic calculating live load scores to prevent server burnout and maintain high guest satisfaction.',
      icon: Users,
      badge: 'Staff Load',
    },
    {
      id: 'assistant',
      title: 'Floating AI Concierge',
      description: 'Ultra-fast Groq AI assistant accessible via the bottom-right concierge button, grounded on live SQLite records and service policies.',
      icon: BotMessageSquare,
      badge: 'Groq LPU',
    },
    {
      id: 'simulation',
      title: 'Multi-Agent Simulator',
      description: 'Discrete-event simulation modeling customer arrival intervals, dining periods, bill payment, and sanitization turnover.',
      icon: PlaySquare,
      badge: 'Discrete Sim',
    },
    {
      id: 'analytics',
      title: 'Operations Analytics',
      description: 'Real-time telemetry measuring seat occupancy curves, hourly arrival peaks, and algorithm execution benchmarking.',
      icon: BarChart3,
      badge: 'Analytics',
    }
  ];

  return (
    <div className="space-y-12 pb-16 max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-[#E8E3DA] p-8 sm:p-12 lg:p-16 shadow-sm">
        {/* Subtle Decorative Backdrop Circle */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#55745E]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C47A59]/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#55745E]/10 text-[#55745E] text-xs font-semibold border border-[#55745E]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#C47A59]" />
            <span>Saffron &amp; Sage | AI Bistro Operations</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#55745E]" />
            <span className="text-[11px] text-stone-500 font-normal">
              {serverOnline ? (aiProviderInfo || 'Live System Online') : 'Interactive Demo Ready'}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#28352D] font-serif leading-tight">
            Intelligent Restaurant Table Allocation &amp; Service Planner
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-stone-600 font-normal max-w-2xl mx-auto leading-relaxed">
            Eliminating dining room congestion, capacity waste, and staff fatigue through multi-agent heuristics, real-time floor plan coordination, and grounded Groq AI reasoning.
          </p>

          {/* Action Button: Get Started */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <button
              onClick={handleGetStarted}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white bg-[#55745E] hover:bg-[#45604D] shadow-md shadow-[#55745E]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>

            <button
              onClick={() => setShowAuthModal(true)}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl font-semibold text-[#28352D] bg-[#FAF7F2] hover:bg-stone-200/60 border border-[#E8E3DA] transition-all text-sm cursor-pointer"
            >
              <Users className="w-4 h-4 text-[#55745E]" />
              <span>{isAuthenticated ? `Signed In (${user?.name?.split(' ')[0]})` : 'Sign In / Guest Options'}</span>
            </button>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 max-w-2xl mx-auto border-t border-stone-200/80">
            <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E3DA] text-center">
              <div className="text-xl font-bold text-[#28352D]">14 Tables</div>
              <div className="text-[11px] text-stone-500">5 Distinct Zones</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E3DA] text-center">
              <div className="text-xl font-bold text-[#55745E]">5 Algorithms</div>
              <div className="text-[11px] text-stone-500">A*, Greedy, BFS, DFS, Rules</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E3DA] text-center">
              <div className="text-xl font-bold text-[#C47A59]">6 Servers</div>
              <div className="text-[11px] text-stone-500">Balanced Load Scoring</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E3DA] text-center">
              <div className="text-xl font-bold text-[#28352D]">&lt; 50ms</div>
              <div className="text-[11px] text-stone-500">Allocation Latency</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Card Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-7 rounded-3xl bg-white border border-[#E8E3DA] shadow-sm space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>The Real-World Problem</span>
          </div>
          <h2 className="text-lg font-bold text-[#28352D] font-serif">Manual Guesswork &amp; Staff Burnout</h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            During peak dining hours, manual hosts struggle to match party sizes with available tables. This causes capacity waste (2 guests sitting at an 8-person booth), unbalanced waiter workloads, and long customer waiting times.
          </p>
        </div>

        <div className="p-7 rounded-3xl bg-white border border-[#E8E3DA] shadow-sm space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#55745E]/10 text-[#55745E] text-xs font-semibold border border-[#55745E]/20">
            <Zap className="w-3.5 h-3.5 text-[#C47A59]" />
            <span>The AI Solution</span>
          </div>
          <h2 className="text-lg font-bold text-[#28352D] font-serif">Autonomous Algorithmic Optimization</h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Saffron &amp; Sage applies 5 classical and heuristic AI search algorithms to evaluate capacity fit, waiter workload distribution, customer wait times, and special requirements—producing optimal table assignments in milliseconds.
          </p>
        </div>
      </section>

      {/* Key Feature Cards */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#28352D] font-serif tracking-tight">
            Key System Capabilities
          </h2>
          <p className="text-sm text-stone-500 max-w-xl mx-auto">
            Everything needed to manage a busy bistro floor with autonomous multi-agent intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {keyFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                onClick={() => {
                  if (feat.id === 'allocation') setActiveTab('dashboard');
                  else if (feat.id === 'simulation' || feat.id === 'analytics') setActiveTab('advanced');
                  else if (feat.id === 'assistant') setActiveTab('dashboard');
                  else setActiveTab(feat.id);
                }}
                className="group cursor-pointer p-6 rounded-3xl bg-white border border-[#E8E3DA] hover:border-[#55745E] shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-[#55745E]/10 text-[#55745E]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-600">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#28352D] group-hover:text-[#55745E] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
                <div className="pt-4 flex items-center gap-1.5 text-xs font-semibold text-[#55745E] group-hover:translate-x-1 transition-transform">
                  <span>Explore Feature</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="rounded-3xl bg-gradient-to-br from-[#55745E]/10 via-[#FAF7F2] to-[#C47A59]/15 border border-[#E8E3DA] p-8 sm:p-12 text-center space-y-4 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-bold text-[#28352D] font-serif">
          Ready to experience autonomous dining service planning?
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
          Sign in with Google to manage your live dining room, or continue as a guest to explore the full interactive demo sandbox.
        </p>
        <button
          onClick={handleGetStarted}
          className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-bold text-white bg-[#55745E] hover:bg-[#45604D] shadow-md shadow-[#55745E]/20 transition-all transform hover:-translate-y-0.5 text-sm cursor-pointer"
        >
          <span>Launch Dashboard</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setActiveTab('dashboard')}
      />
    </div>
  );
}
