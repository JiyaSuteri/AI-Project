import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { api } from '../services/api';
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
  Cpu
} from 'lucide-react';

export default function SettingsPage() {
  const { triggerRefresh, addToast, refreshIndex, aiProviderInfo } = useRestaurant();
  const [policies, setPolicies] = useState([]);
  const [showAddPolicy, setShowAddPolicy] = useState(false);
  const [newPolicyName, setNewPolicyName] = useState('');
  const [newPolicyDesc, setNewPolicyDesc] = useState('');
  const [newPolicyCat, setNewPolicyCat] = useState('ALLOCATION');
  const [loading, setLoading] = useState(false);

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
    if (!window.confirm('Reset the entire SQLite database to initial benchmark data?')) return;
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
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <span>Restaurant Settings & Service Policies</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Manage operational rules, Groq LLM inference parameters, and system state.
          </p>
        </div>

        <button
          onClick={() => setShowAddPolicy(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-champagne-500 to-amber-600 hover:from-champagne-400 hover:to-amber-500 text-slate-950 shadow-glow-champagne transition-all font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Service Policy
        </button>
      </div>

      {/* Groq Engine Configuration Panel */}
      <div className="glass-panel rounded-3xl shadow-3d-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-champagne-500/10 border border-champagne-500/30 flex items-center justify-center text-champagne-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">AI Intelligence Provider</h3>
              <p className="text-xs text-slate-400">Low-latency LPU inference with real-time SQLite grounding</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Active & Grounded
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Engine</div>
            <div className="text-sm font-bold text-champagne-300 mt-0.5">Groq LPU</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Model</div>
            <div className="text-sm font-bold text-slate-200 mt-0.5">openai/gpt-oss-120b</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Average Latency</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">&lt; 1.5 seconds</div>
          </div>
        </div>
      </div>

      {/* Operational Policies Table */}
      <div className="glass-panel rounded-3xl shadow-3d-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Active Service Policies ({policies.length})</h3>
            <p className="text-xs text-slate-400">Rules utilized by RAG semantic retrieval and multi-agent coordination</p>
          </div>
        </div>

        <div className="space-y-3">
          {policies.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 transition-all flex items-start justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-100 text-sm">{p.policy_name}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-champagne-500/10 text-champagne-300 border border-champagne-500/20">
                    {p.category}
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed font-normal">{p.description}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0 pt-1">
                <button
                  onClick={() => handleTogglePolicy(p)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
                    p.is_active
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {p.is_active ? 'Active' : 'Disabled'}
                </button>

                <button
                  onClick={() => handleDeletePolicy(p)}
                  className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
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
      <div className="glass-panel rounded-3xl shadow-3d-card p-5 sm:p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-200">System Maintenance & Benchmark Data</h3>
        <p className="text-xs text-slate-400">
          Restore the pristine initial state at any time for testing, evaluator demonstration, or academic presentations.
        </p>

        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-xs font-bold text-amber-300">Re-seed SQLite Sample Data</div>
            <div className="text-[11px] text-slate-400">
              Restores 14 tables, 6 waiters, 12 customer groups, 6 reservations, and 11 policies.
            </div>
          </div>

          <button
            onClick={handleResetDatabase}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 shadow-sm transition-all disabled:opacity-50"
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
            <label className="block text-xs font-semibold text-slate-300 mb-1">Policy Title</label>
            <input
              type="text"
              required
              value={newPolicyName}
              onChange={(e) => setNewPolicyName(e.target.value)}
              placeholder="e.g. VIP Priority Protocol"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-champagne-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
            <select
              value={newPolicyCat}
              onChange={(e) => setNewPolicyCat(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-champagne-500"
            >
              <option value="ALLOCATION">ALLOCATION</option>
              <option value="RESERVATION">RESERVATION</option>
              <option value="WAITER">WAITER</option>
              <option value="QUEUE">QUEUE</option>
              <option value="ACCESSIBILITY">ACCESSIBILITY</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Policy Description / Rule Text</label>
            <textarea
              required
              rows={4}
              value={newPolicyDesc}
              onChange={(e) => setNewPolicyDesc(e.target.value)}
              placeholder="Detail the exact operational criteria and constraints..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-champagne-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setShowAddPolicy(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-champagne-500 to-amber-600 hover:from-champagne-400 hover:to-amber-500 text-slate-950 shadow-glow-champagne transition-all disabled:opacity-50 font-medium"
            >
              {loading ? 'Saving...' : 'Add Policy'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
