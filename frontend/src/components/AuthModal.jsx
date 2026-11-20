import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRestaurant } from '../context/RestaurantContext';
import { assetUrl } from '../utils/assetUrl';
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
      setErrorMsg(err.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/40 dark:bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Dialog Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#18201B] rounded-3xl border border-[#E8E3DA] dark:border-[#2A382F] shadow-2xl dark:shadow-dark-hover z-10 overflow-hidden p-6 sm:p-7 space-y-5 animate-in fade-in duration-200 text-[#28352D] dark:text-[#F3EFEA]">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 p-1.5 rounded-xl text-stone-400 dark:text-[#98A89E] hover:text-[#28352D] dark:hover:text-white hover:bg-stone-100 dark:hover:bg-[#1F2A23] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Icon & Heading */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-[#55745E] dark:bg-[#6E9A7B] flex items-center justify-center mx-auto shadow-md overflow-hidden p-1.5">
            <img
              src={assetUrl('/brand/bistro-crest.svg')}
              alt="Saffron &amp; Sage Brand Crest"
              className="w-full h-full object-contain"
              loading="eager"
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#28352D] dark:text-[#F3EFEA] font-serif">
              Sign In to Saffron &amp; Sage
            </h3>
            <p className="text-xs text-stone-500 dark:text-[#98A89E] mt-0.5">
              Restaurant Manager &amp; Table Allocation Planner
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Two Options */}
        <div className="space-y-3 pt-1">
          {/* Option 1: Continue with Google */}
          <div className="space-y-2">
            <button
              onClick={() => {
                const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
                if (!clientId && !googleConfigured) {
                  setErrorMsg('Google Client ID is not yet configured in backend/.env. Use the Local Demo Manager option below to test on localhost!');
                  return;
                }
                const credential = window.prompt("Enter Google ID Token JWT (or click OK to test with dev token):");
                if (credential && credential.trim()) {
                  handleGoogleCredential(credential.trim());
                } else if (credential === "") {
                  handleDevLogin();
                }
              }}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl bg-white dark:bg-[#1F2A23] hover:bg-stone-50 dark:hover:bg-[#26332B] border border-stone-300 dark:border-[#2A382F] text-stone-700 dark:text-[#F3EFEA] font-semibold text-xs sm:text-sm shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 cursor-pointer"
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
            <p className="text-[11px] text-center text-stone-400 dark:text-stone-500">
              Verified server-side OAuth 2.0 &amp; session tokens.
            </p>
          </div>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200 dark:border-stone-800" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider text-stone-400 dark:text-stone-500">
              <span className="bg-white dark:bg-[#18201B] px-3">or</span>
            </div>
          </div>

          {/* Option 2: Continue as Guest */}
          <button
            onClick={handleGuestEntry}
            disabled={loading}
            className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl bg-stone-100 dark:bg-[#1F2A23] hover:bg-stone-200/80 dark:hover:bg-[#26332B] text-[#28352D] dark:text-[#F3EFEA] font-semibold text-xs sm:text-sm border border-[#E8E3DA] dark:border-[#2A382F] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <UserCheck className="w-4 h-4 text-[#55745E] dark:text-[#6E9A7B]" />
              <span>Continue as Guest</span>
            </div>
            <span className="text-[11px] font-medium text-stone-500 dark:text-[#98A89E] bg-white dark:bg-[#18201B] px-2.5 py-0.5 rounded-full border border-stone-200 dark:border-[#2A382F]">
              Demo Sandbox
            </span>
          </button>
          <p className="text-[11px] text-center text-stone-400 dark:text-stone-500">
            Explore all 5 AI algorithms &amp; simulation without altering live records.
          </p>

          {/* Localhost Developer Helper */}
          <div className="pt-2">
            <button
              onClick={handleDevLogin}
              disabled={loading}
              className="w-full py-2 px-3 text-xs text-[#55745E] dark:text-[#6E9A7B] hover:text-[#455E4C] font-medium text-center flex items-center justify-center gap-1.5 hover:underline cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Test Manager Login (Localhost Demo)</span>
            </button>
          </div>
        </div>

        {/* Security Note */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-center gap-1.5 text-[11px] text-stone-400 dark:text-stone-500">
          <ShieldCheck className="w-3.5 h-3.5 text-[#55745E] dark:text-[#6E9A7B]" />
          <span>Protected with server-side SQLite &amp; JWT isolation</span>
        </div>
      </div>
    </div>
  );
}
