import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { api, getApiBaseUrl, isRealBackendConfigured, setCustomApiUrl, setApiMode } from '../services/api';
import Modal from '../components/Modal';
import {
  Settings,
  BookOpen,
  Plus,
  Trash2,
  CheckCircle2,
  RotateCcw,
  Shield,
  Layers,
  KeyRound,
  Cpu,
  Globe,
  Radio,
  Server,
  Zap,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

export default function SettingsPage() {
  const { triggerRefresh, addToast, refreshIndex, aiProviderInfo } = useRestaurant();
  const [policies, setPolicies] = useState([]);
  const [showAddPolicy, setShowAddPolicy] = useState(false);
  const [newPolicyName, setNewPolicyName] = useState('');
  const [newPolicyDesc, setNewPolicyDesc] = useState('');
  const [newPolicyCat, setNewPolicyCat] = useState('ALLOCATION');
  const [loading, setLoading] = useState(false);

  // Backend connection state
  const [customUrl, setCustomUrl] = useState(() => {
    return typeof window !== 'undefined' ? (localStorage.getItem('bistro_custom_api_url') || '') : '';
  });
  const [activeBackendMode, setActiveBackendMode] = useState(() => {
    return isRealBackendConfigured() ? 'live' : 'demo';
  });
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState(null);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const data = await api.getPolicies();
        setPolicies(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPolicies();
  }, [refreshIndex]);

  const handleTestBackendConnection = async () => {
    setTestingConnection(true);
    setConnectionResult(null);
    try {
      const res = await api.getHealth();
      setConnectionResult({
        success: true,
        message: `Successfully connected! Health status: ${res.status} | AI: ${res.ai_provider || 'Active'}`
      });
      addToast('Backend connection verified!', 'success');
      triggerRefresh();
    } catch (err) {
      setConnectionResult({
        success: false,
        message: `Connection failed: ${err.message}. If deploying to Render, please ensure the Web Service is awake and CORS allows this origin.`
      });
      addToast('Failed to reach backend', 'error');
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSaveBackendUrl = (e) => {
    e.preventDefault();
    setCustomApiUrl(customUrl.trim());
    setActiveBackendMode(customUrl.trim() ? 'live' : 'demo');
    addToast(customUrl.trim() ? 'Custom Backend URL saved!' : 'Switched to Default Mode', 'info');
    triggerRefresh();
  };

  const handleToggleMode = (mode) => {
    setApiMode(mode);
    setActiveBackendMode(mode);
    addToast(`Switched to ${mode === 'live' ? 'Live Backend' : 'In-Browser Demo'} Mode`, 'info');
    triggerRefresh();
  };

  const handleTogglePolicy = async (policy) => {
    try {
      await api.updatePolicy(policy.id, { is_active: !policy.is_active });
      addToast(`Policy '${policy.policy_name}' updated`, 'info');
      triggerRefresh();
    } catch (err) {
      addToast(err.message || 'Failed to update policy', 'error');
    }
  };

  const handleDeletePolicy = async (policy) => {
    if (!window.confirm(`Delete policy '${policy.policy_name}'?`)) return;
    try {
      await api.deletePolicy(policy.id);
      addToast('Policy deleted', 'info');
      triggerRefresh();
    } catch (err) {
      addToast(err.message || 'Failed to delete policy', 'error');
    }
  };

  const handleAddPolicy = async (e) => {
    e.preventDefault();
    if (!newPolicyName.trim() || !newPolicyDesc.trim()) {
      addToast('Please provide both policy name and description', 'error');
      return;
    }

    try {
      setLoading(true);
      await api.createPolicy({
        policy_name: newPolicyName.trim(),
        description: newPolicyDesc.trim(),
        category: newPolicyCat,
        is_active: true,
      });
      addToast(`Policy '${newPolicyName}' registered!`, 'success');
      triggerRefresh();
      setNewPolicyName('');
      setNewPolicyDesc('');
      setShowAddPolicy(false);
    } catch (err) {
      addToast(err.message || 'Failed to create policy', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetDatabase = async () => {
    if (!window.confirm('Reset the restaurant database to initial benchmark data?')) return;
    try {
      setLoading(true);
      await api.resetDatabase();
      addToast('Database successfully re-seeded!', 'success');
      triggerRefresh();
    } catch (err) {
      addToast(err.message || 'Failed to reset database', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Title */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#28352D] font-serif tracking-tight flex items-center gap-2">
            <span>System Settings &amp; Backend Configuration</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Configure backend URL, AI inference provider, operational rules, and database persistence.
          </p>
        </div>

        <button
          onClick={() => setShowAddPolicy(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#55745E] hover:bg-[#455E4C] text-white shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Service Policy
        </button>
      </div>

      {/* Backend & Deployment Connectivity */}
      <div className="bg-white rounded-3xl shadow-xs p-5 sm:p-6 space-y-5 border border-[#E8E3DA]">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#55745E]/10 border border-[#55745E]/20 flex items-center justify-center text-[#55745E]">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#28352D] flex items-center gap-2 font-serif">
                <span>FastAPI Backend Deployment &amp; Networking</span>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                  activeBackendMode === 'live'
                    ? 'bg-[#55745E]/10 text-[#55745E] border border-[#55745E]/20'
                    : 'bg-[#C47A59]/15 text-[#916E32] border border-[#C47A59]/30'
                }`}>
                  {activeBackendMode === 'live' ? 'Live API Mode' : 'Standalone Demo Mode'}
                </span>
              </h2>
              <p className="text-xs text-stone-500">
                Connect the frontend to your live FastAPI service or run in localhost development.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleToggleMode('live')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                activeBackendMode === 'live'
                  ? 'bg-[#55745E] text-white border-[#55745E] shadow-xs'
                  : 'bg-white text-stone-600 border-[#E8E3DA] hover:bg-stone-50'
              }`}
            >
              Live Backend
            </button>
            <button
              onClick={() => handleToggleMode('demo')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                activeBackendMode === 'demo'
                  ? 'bg-[#55745E] text-white border-[#55745E] shadow-xs'
                  : 'bg-white text-stone-600 border-[#E8E3DA] hover:bg-stone-50'
              }`}
            >
              Offline Demo
            </button>
          </div>
        </div>

        {/* Backend URL Form */}
        <form onSubmit={handleSaveBackendUrl} className="space-y-3 pt-1">
          <div>
            <label className="block text-xs font-semibold text-[#28352D] mb-1.5">
              Live Backend Endpoint (Render Web Service / Localhost)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://saffron-sage-backend.onrender.com"
                className="flex-1 bg-[#FAF7F2] border border-[#E8E3DA] rounded-xl px-3.5 py-2 text-xs text-[#28352D] placeholder-stone-400 focus:outline-none focus:border-[#55745E]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-stone-50 text-[#28352D] border border-[#E8E3DA] transition-colors cursor-pointer shadow-xs"
              >
                Save URL
              </button>
              <button
                type="button"
                onClick={handleTestBackendConnection}
                disabled={testingConnection}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#55745E]/10 hover:bg-[#55745E]/20 text-[#55745E] border border-[#55745E]/20 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
                <span>Test Connection</span>
              </button>
            </div>
            <div className="text-[11px] text-stone-500 mt-1.5 flex items-center gap-1.5">
              <span>Active Target:</span>
              <code className="text-[#55745E] bg-[#FAF7F2] px-1.5 py-0.5 rounded border border-[#E8E3DA] font-mono">
                {getApiBaseUrl()}
              </code>
            </div>
          </div>

          {connectionResult && (
            <div className={`p-3 rounded-xl text-xs border ${
              connectionResult.success
                ? 'bg-[#55745E]/10 text-[#55745E] border-[#55745E]/30'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              {connectionResult.message}
            </div>
          )}
        </form>
      </div>

      {/* Groq Engine Configuration Panel */}
      <div className="bg-white rounded-3xl shadow-xs p-5 sm:p-6 space-y-4 border border-[#E8E3DA]">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#55745E]/10 border border-[#55745E]/20 flex items-center justify-center text-[#55745E]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#28352D] font-serif">AI Intelligence Provider</h2>
              <p className="text-xs text-stone-500">Low-latency LPU inference with real-time SQLite grounding</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#55745E]/10 text-[#55745E] border border-[#55745E]/20">
            Active &amp; Grounded
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8E3DA]">
            <div className="text-[10px] text-stone-500 uppercase font-semibold">Engine</div>
            <div className="text-sm font-bold text-[#55745E] mt-0.5">Groq LPU</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8E3DA]">
            <div className="text-[10px] text-stone-500 uppercase font-semibold">Model</div>
            <div className="text-sm font-bold text-[#28352D] mt-0.5">{aiProviderInfo || 'llama-3.3-70b-versatile'}</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8E3DA]">
            <div className="text-[10px] text-stone-500 uppercase font-semibold">Average Latency</div>
            <div className="text-sm font-bold text-[#55745E] mt-0.5">&lt; 1.5 seconds</div>
          </div>
        </div>
      </div>

      {/* Operational Policies Table */}
      <div className="bg-white rounded-3xl shadow-xs p-5 sm:p-6 space-y-4 border border-[#E8E3DA]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#28352D] font-serif">Active Service Policies ({policies.length})</h2>
            <p className="text-xs text-stone-500">Rules utilized by RAG semantic retrieval and multi-agent coordination</p>
          </div>
        </div>

        <div className="space-y-3">
          {policies.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E3DA] hover:border-[#55745E]/30 transition-all flex items-start justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#28352D] text-sm">{p.policy_name}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#C47A59]/15 text-[#916E32] border border-[#C47A59]/30">
                    {p.category}
                  </span>
                </div>
                <p className="text-stone-600 leading-relaxed font-normal">{p.description}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0 pt-1">
                <button
                  onClick={() => handleTogglePolicy(p)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition-colors cursor-pointer ${
                    p.is_active
                      ? 'bg-[#55745E]/10 text-[#55745E] border-[#55745E]/20'
                      : 'bg-stone-100 text-stone-500 border-stone-200'
                  }`}
                >
                  {p.is_active ? 'Active' : 'Disabled'}
                </button>

                <button
                  onClick={() => handleDeletePolicy(p)}
                  className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Delete policy"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Administration & DB Reset */}
      <div className="bg-white rounded-3xl shadow-xs p-5 sm:p-6 space-y-4 border border-[#E8E3DA]">
        <h2 className="text-sm font-bold text-[#28352D] font-serif">System Maintenance &amp; Benchmark Data</h2>
        <p className="text-xs text-stone-500">
          Restore the pristine initial state at any time for testing, evaluator demonstration, or academic presentations.
        </p>

        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E3DA] flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-xs font-bold text-[#28352D]">Re-seed Database Benchmark Data</div>
            <div className="text-[11px] text-stone-500">
              Restores 14 tables, 6 waiters, 12 customer groups, 6 reservations, and 11 policies.
            </div>
          </div>

          <button
            onClick={handleResetDatabase}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-stone-50 text-[#28352D] border border-[#E8E3DA] shadow-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Reset Database
          </button>
        </div>
      </div>

      {/* Add Policy Modal */}
      <Modal
        isOpen={showAddPolicy}
        onClose={() => setShowAddPolicy(false)}
        title="Add Service Policy"
        subtitle="Registers a new operational rule in the RAG knowledge vector store"
      >
        <form onSubmit={handleAddPolicy} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#28352D] mb-1">Policy Title</label>
            <input
              type="text"
              required
              value={newPolicyName}
              onChange={(e) => setNewPolicyName(e.target.value)}
              placeholder="e.g. VIP Priority Protocol"
              className="w-full bg-[#FAF7F2] border border-[#E8E3DA] rounded-xl px-3.5 py-2 text-sm text-[#28352D] placeholder-stone-400 focus:outline-none focus:border-[#55745E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#28352D] mb-1">Category</label>
            <select
              value={newPolicyCat}
              onChange={(e) => setNewPolicyCat(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E8E3DA] rounded-xl px-3.5 py-2 text-sm text-[#28352D] focus:outline-none focus:border-[#55745E]"
            >
              <option value="ALLOCATION">ALLOCATION</option>
              <option value="RESERVATION">RESERVATION</option>
              <option value="WAITER">WAITER</option>
              <option value="QUEUE">QUEUE</option>
              <option value="ACCESSIBILITY">ACCESSIBILITY</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#28352D] mb-1">Policy Description / Rule Text</label>
            <textarea
              required
              rows={4}
              value={newPolicyDesc}
              onChange={(e) => setNewPolicyDesc(e.target.value)}
              placeholder="Detail the exact operational criteria and constraints..."
              className="w-full bg-[#FAF7F2] border border-[#E8E3DA] rounded-xl px-3.5 py-2 text-sm text-[#28352D] placeholder-stone-400 focus:outline-none focus:border-[#55745E]"
            />
          </div>

          <div className="pt-3 border-t border-[#E8E3DA] flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setShowAddPolicy(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-stone-500 hover:text-[#28352D] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#55745E] hover:bg-[#455E4C] text-white shadow-xs transition-all disabled:opacity-50 font-medium cursor-pointer"
            >
              {loading ? 'Saving...' : 'Add Policy'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
