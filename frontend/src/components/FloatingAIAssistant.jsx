import React, { useState, useRef, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';
import {
  BotMessageSquare,
  Send,
  BookOpen,
  User,
  Lightbulb,
  Sparkles,
  Zap,
  CheckCircle2,
  Database,
  X,
  RotateCcw,
  MessageSquare
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  'How many tables are available right now?',
  'Which waiter has the lowest workload?',
  'How many customers are waiting?',
  'What reservations are scheduled?',
  'What is the reservation holding policy?',
  'Which table fits a party of 4?',
];

export default function FloatingAIAssistant() {
  const { addToast, aiProviderInfo } = useRestaurant();
  const { isGuest } = useAuth();
  const { isDark } = useTheme();

  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('ai_open') === 'true';
    }
    return false;
  });

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hello! I am your Saffron & Sage AI Concierge. Ask me directly about live table availability, waiter workloads, the customer queue, or restaurant service policies.',
      sources: ['table_allocation_policy.md', 'reservation_policy.md'],
      suggestedAction: '',
      groundingType: isGuest ? 'GUEST_SANDBOX' : 'LIVE_DATABASE',
      modelUsed: 'Groq LPU (qwen/qwen3.8-27b)',
      isFallback: false
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, loading, isOpen]);

  const handleSend = async (queryText) => {
    const text = queryText || input;
    if (!text.trim() || loading) return;

    const userMessage = { role: 'user', content: text.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.aiChat(text.trim());
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.reply,
          relevantInfo: response.relevant_info,
          sources: response.sources,
          explanation: response.explanation,
          suggestedAction: response.suggested_action,
          isFallback: response.is_fallback,
          groundingType: response.grounding_type,
          modelUsed: response.model_used,
        },
      ]);
    } catch (err) {
      addToast(err.message || 'AI request failed', 'error');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Unable to reach the assistant backend service. Please check that the server is running on localhost:8000.',
          sources: [],
          isFallback: true,
          groundingType: 'ERROR_STATE'
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Conversation reset. How can I assist you with table allocations, server loads, or reservations?',
        sources: [],
        groundingType: isGuest ? 'GUEST_SANDBOX' : 'LIVE_DATABASE',
        modelUsed: 'Groq LPU (qwen/qwen3.8-27b)'
      }
    ]);
  };

  const getGroundingBadge = (type) => {
    switch (type) {
      case 'CONVERSATIONAL':
        return { label: 'Conversational', cls: 'bg-[#55745E]/10 dark:bg-[#6E9A7B]/20 text-[#55745E] dark:text-[#6E9A7B] border-[#55745E]/20 dark:border-[#6E9A7B]/30' };
      case 'LIVE_DATABASE':
        return { label: 'Live SQLite', cls: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40' };
      case 'GUEST_SANDBOX':
        return { label: 'Guest Sandbox', cls: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/40' };
      case 'POLICY_RAG':
        return { label: 'Policy RAG', cls: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/40' };
      case 'ERROR_STATE':
        return { label: 'Connection Error', cls: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/40' };
      default:
        return { label: type || 'GROUNDED', cls: 'bg-[#FAF7F2] dark:bg-[#111613] text-stone-600 dark:text-[#98A89E] border-[#E8E3DA] dark:border-[#2A382F]' };
    }
  };

  return (
    <>
      {/* Floating Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-20 sm:bottom-22 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[410px] h-[530px] max-h-[calc(100vh-6.5rem)] bg-white dark:bg-[#18201B] rounded-3xl shadow-2xl dark:shadow-dark-hover border border-[#E8E3DA] dark:border-[#2A382F] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="h-16 px-4 bg-white dark:bg-[#18201B] border-b border-[#E8E3DA] dark:border-[#2A382F] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-[#55745E] dark:bg-[#6E9A7B] text-white flex items-center justify-center shadow-xs">
                    <BotMessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#18201B]" />
                </div>
                <div>
                  <div className="text-xs font-serif font-bold text-[#28352D] dark:text-[#F3EFEA] flex items-center gap-1.5">
                    <span>AI Bistro Concierge</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#55745E]/10 dark:bg-[#6E9A7B]/20 text-[#55745E] dark:text-[#6E9A7B] font-sans font-bold">
                      Groq RAG
                    </span>
                  </div>
                  <div className="text-[10px] text-stone-500 dark:text-[#98A89E] flex items-center gap-1">
                    <span>{isGuest ? 'Guest Sandbox Mode' : 'Live SQLite Grounded'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearChat}
                  title="Reset conversation"
                  aria-label="Reset conversation"
                  className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#1F2A23] rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close assistant"
                  aria-label="Close assistant"
                  className="p-1.5 text-stone-400 hover:text-[#28352D] dark:hover:text-white hover:bg-stone-100 dark:hover:bg-[#1F2A23] rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Suggested Prompts Bar */}
            <div className="px-3 py-2 bg-[#FAF7F2] dark:bg-[#111613] border-b border-[#E8E3DA] dark:border-[#2A382F] flex items-center gap-1.5 overflow-x-auto text-xs shrink-0 no-scrollbar">
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  disabled={loading}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1F2A23] hover:bg-stone-50 dark:hover:bg-[#26332B] text-stone-700 dark:text-[#F3EFEA] border border-[#E8E3DA] dark:border-[#2A382F] whitespace-nowrap text-[11px] font-medium transition-colors disabled:opacity-50 cursor-pointer shadow-2xs shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Message Stream */}
            <div className="flex-1 min-h-0 p-3.5 overflow-y-auto space-y-3 text-xs bg-[#FAF7F2]/40 dark:bg-[#111613]/50">
              {messages.map((msg, index) => {
                const isUser = msg.role === 'user';
                const badge = getGroundingBadge(msg.groundingType);
                return (
                  <div
                    key={index}
                    className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="w-6 h-6 rounded-lg bg-[#55745E] dark:bg-[#6E9A7B] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        <BotMessageSquare className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-3 space-y-2 ${
                        isUser
                          ? 'bg-[#55745E] dark:bg-[#6E9A7B] text-white shadow-xs'
                          : 'bg-white dark:bg-[#1F2A23] text-[#28352D] dark:text-[#F3EFEA] border border-[#E8E3DA] dark:border-[#2A382F] shadow-xs'
                      }`}
                    >
                      {/* Sub-header for Assistant */}
                      {!isUser && (
                        <div className="flex items-center justify-between pb-1 border-b border-[#E8E3DA] dark:border-[#2A382F] text-[10px] text-stone-500 dark:text-[#98A89E]">
                          <span className="font-semibold text-[#55745E] dark:text-[#6E9A7B]">
                            {msg.modelUsed || 'Groq LPU Engine'}
                          </span>
                          <span className={`px-1.5 py-0.2 rounded border font-mono text-[9px] ${badge.cls}`}>
                            {badge.label}
                          </span>
                        </div>
                      )}

                      {/* Content */}
                      <div className="whitespace-pre-wrap break-words text-xs leading-relaxed">
                        {msg.content}
                      </div>

                      {/* Sources / Policy Citations */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="pt-1.5 border-t border-[#E8E3DA] dark:border-[#2A382F] flex items-center gap-1 text-[10px] text-stone-500 dark:text-[#98A89E]">
                          <BookOpen className="w-3 h-3 text-[#55745E] dark:text-[#6E9A7B] shrink-0" />
                          <span className="font-semibold">Sources:</span>
                          <span className="truncate">{msg.sources.join(' • ')}</span>
                        </div>
                      )}

                      {/* Suggested Action */}
                      {msg.suggestedAction && msg.suggestedAction.trim() !== '' && (
                        <div className="p-2 rounded-xl text-[10px] bg-[#FAF7F2] dark:bg-[#18201B] border border-[#E8E3DA] dark:border-[#2A382F] text-stone-700 dark:text-stone-300 flex items-start gap-1.5">
                          <Lightbulb className="w-3 h-3 text-[#C47A59] dark:text-[#DC8A66] shrink-0 mt-0.5" />
                          <span>{msg.suggestedAction}</span>
                        </div>
                      )}
                    </div>

                    {isUser && (
                      <div className="w-6 h-6 rounded-lg bg-stone-200 dark:bg-[#1F2A23] text-stone-700 dark:text-[#F3EFEA] flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}

              {loading && (
                <div className="flex items-center gap-2 text-stone-500 dark:text-[#98A89E] text-xs p-2">
                  <div className="w-6 h-6 rounded-lg bg-[#55745E] dark:bg-[#6E9A7B] text-white flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-[#C47A59] dark:text-[#DC8A66]" />
                  </div>
                  <div className="bg-white dark:bg-[#1F2A23] border border-[#E8E3DA] dark:border-[#2A382F] px-3 py-1.5 rounded-xl shadow-2xs italic text-[11px] flex items-center gap-1.5">
                    <span>Consulting live database &amp; policies</span>
                    <span className="flex gap-1 ml-1">
                      <span className="w-1.5 h-1.5 bg-[#55745E] dark:bg-[#6E9A7B] rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-[#55745E] dark:bg-[#6E9A7B] rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-[#55745E] dark:bg-[#6E9A7B] rounded-full animate-bounce" />
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Footer Input Bar */}
            <div className="p-3 bg-white dark:bg-[#18201B] border-t border-[#E8E3DA] dark:border-[#2A382F] shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about tables, staff, policies..."
                  disabled={loading}
                  className="flex-1 bg-[#FAF7F2] dark:bg-[#111613] border border-[#E8E3DA] dark:border-[#2A382F] rounded-xl px-3.5 py-2 text-xs text-[#28352D] dark:text-[#F3EFEA] placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-[#55745E] dark:focus:border-[#6E9A7B] focus:ring-1 focus:ring-[#55745E]/20"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Send query"
                  className="w-8 h-8 rounded-xl bg-[#55745E] dark:bg-[#6E9A7B] hover:bg-[#45604D] dark:hover:bg-[#5B8267] text-white flex items-center justify-center shadow-xs disabled:opacity-40 transition-all cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button with Animated AI Orb */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Open AI Concierge"
        aria-label="Toggle AI Concierge assistant"
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full text-white shadow-xl dark:shadow-dark-hover transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
          isOpen
            ? 'bg-[#45604D] dark:bg-[#385140] ring-2 ring-[#C47A59] dark:ring-[#DC8A66]'
            : 'bg-[#55745E] dark:bg-[#6E9A7B] hover:bg-[#45604D] dark:hover:bg-[#5B8267]'
        }`}
      >
        <div className="relative flex items-center justify-center">
          <BotMessageSquare className="w-5 h-5 text-white" />
          {/* Subtle Animated Glowing AI Orb Indicator */}
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#C47A59] dark:bg-[#DC8A66] ring-2 ring-white dark:ring-[#18201B] animate-ping opacity-75" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#C47A59] dark:bg-[#DC8A66] ring-2 ring-white dark:ring-[#18201B]" />
        </div>
        <span className="text-xs font-bold tracking-wide font-sans">
          {isOpen ? 'Close AI' : 'AI Concierge'}
        </span>
      </button>
    </>
  );
}
