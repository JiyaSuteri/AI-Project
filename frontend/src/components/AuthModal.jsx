import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRestaurant } from '../context/RestaurantContext';
import {
  UtensilsCrossed,
  UserCheck,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  X,
  AlertCircle,
  KeyRound,
  CheckCircle2
} from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const { loginWithGoogle, loginAsGuest, loginWithDevDemo, googleConfigured } = useAuth();
  const { addToast } = useRestaurant();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleGuestEntry = () => {
    loginAsGuest();
    addToast('Entered as Guest. Exploring read-only demo sandbox.', 'info');
    if (onSuccess) onSuccess();
    if (onClose) onClose();
  };

  const handleDevLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await loginWithDevDemo();
      addToast('Signed in as Executive Manager (Localhost Demo)', 'success');
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  // Google credential response handler (triggered by Google Identity Services or manual paste)
  const handleGoogleCredential = async (credential) => {
    setLoading(true);
    setErrorMsg('');
    try {
      await loginWithGoogle(credential);
      addToast('Successfully authenticated with Google!', 'success');
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Google token verification failed. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#E8E3DA] shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#55745E]/10 text-[#55745E] flex items-center justify-center shadow-sm">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#28352D] tracking-tight">
            Saffron &amp; Sage
          </h2>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            AI-Based Restaurant Table Allocation &amp; Multi-Agent Service Planner
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="leading-snug">{errorMsg}</div>
          </div>
        )}

        {/* Main Two Options */}
        <div className="space-y-3 pt-1">
          {/* Option 1: Continue with Google */}
          <div className="space-y-2">
            <button
              onClick={() => {
                // If real Google Client ID is configured, we can prompt or invoke
                const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
                if (!clientId && !googleConfigured) {
                  setErrorMsg('Google Client ID is not yet configured in backend/.env. Use the Local Demo Manager option below to test on localhost!');
                  return;
                }
                // Simulated Google login for testing when prompt clicked
                const credential = window.prompt("Enter Google ID Token JWT (or click OK to test with dev token):");
                if (credential && credential.trim()) {
                  handleGoogleCredential(credential.trim());
                } else if (credential === "") {
                  handleDevLogin();
                }
              }}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 font-semibold text-xs sm:text-sm shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
            <p className="text-[11px] text-center text-stone-400">
              Verified server-side OAuth 2.0 &amp; session tokens.
            </p>
          </div>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider text-stone-400">
              <span className="bg-white px-3">or</span>
            </div>
          </div>

          {/* Option 2: Continue as Guest */}
          <button
            onClick={handleGuestEntry}
            disabled={loading}
            className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl bg-stone-100 hover:bg-stone-200/80 text-[#28352D] font-semibold text-xs sm:text-sm border border-[#E8E3DA] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <div className="flex items-center gap-2.5">
              <UserCheck className="w-4 h-4 text-[#55745E]" />
              <span>Continue as Guest</span>
            </div>
            <span className="text-[11px] font-medium text-stone-500 bg-white px-2.5 py-0.5 rounded-full border border-stone-200">
              Demo Sandbox
            </span>
          </button>
          <p className="text-[11px] text-center text-stone-400">
            Explore all 5 AI algorithms &amp; simulation without altering live records.
          </p>

          {/* Localhost Developer Helper */}
          <div className="pt-2">
            <button
              onClick={handleDevLogin}
              disabled={loading}
              className="w-full py-2 px-3 text-xs text-[#55745E] hover:text-[#455E4C] font-medium text-center flex items-center justify-center gap-1.5 hover:underline"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Test Manager Login (Localhost Demo)</span>
            </button>
          </div>
        </div>

        {/* Security Note */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5 text-[#55745E]" />
          <span>Protected with server-side SQLite &amp; JWT isolation</span>
        </div>
      </div>
    </div>
  );
}
