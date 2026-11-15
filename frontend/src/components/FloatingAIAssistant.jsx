import React, { useState, useRef, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
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
        'Hello! I am your Saffron & Sage AI Assistant. Ask me directly about live table availability, waiter workloads, the customer queue, or restaurant service policies.',
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
        return { label: 'Conversational', cls: 'bg-[#55745E]/10 text-[#55745E] border-[#55745E]/20' };
      case 'LIVE_DATABASE':
        return { label: 'Live SQLite', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'GUEST_SANDBOX':
        return { label: 'Guest Sandbox', cls: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'POLICY_RAG':
        return { label: 'Policy RAG', cls: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'ERROR_STATE':
        return { label: 'Connection Error', cls: 'bg-rose-50 text-rose-700 border-rose-200' };
      default:
        return { label: type || 'GROUNDED', cls: 'bg-[#FAF7F2] text-stone-600 border-[#E8E3DA]' };
    }
  };

  return (
    <>
      {/* Floating Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-22 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[400px] h-[520px] max-h-[calc(100vh-6.5rem)] bg-white rounded-3xl shadow-2xl border border-[#E8E3DA] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="h-16 px-4 bg-white border-b border-[#E8E3DA] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#55745E] text-white flex items-center justify-center shadow-xs">
                <BotMessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs font-serif font-bold text-[#28352D] flex items-center gap-1.5">
                  <span>AI Bistro Concierge</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#55745E]/10 text-[#55745E] font-sans font-bold">
                    Groq RAG
                  </span>
                </div>
                <div className="text-[10px] text-stone-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  <span>{isGuest ? 'Guest Sandbox' : 'Live SQLite Grounded'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                title="Reset conversation"
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close assistant"
                className="p-1.5 text-stone-400 hover:text-[#28352D] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Suggested Prompts Bar */}
          <div className="px-3 py-2 bg-[#FAF7F2] border-b border-[#E8E3DA] flex items-center gap-1.5 overflow-x-auto text-xs shrink-0 no-scrollbar">
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-stone-50 text-stone-700 border border-[#E8E3DA] whitespace-nowrap text-[11px] font-medium transition-colors disabled:opacity-50 cursor-pointer shadow-2xs shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Message Stream */}
          <div className="flex-1 min-h-0 p-3.5 overflow-y-auto space-y-3 text-xs bg-[#FAF7F2]/50">
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              const badge = getGroundingBadge(msg.groundingType);
              return (
                <div
                  key={index}
                  className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-6 h-6 rounded-lg bg-[#55745E] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <Sparkles className="w-3.5 h-3.5 text-[#C47A59]" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3 space-y-2 leading-relaxed break-words ${
                      isUser
                        ? 'bg-[#55745E] text-white font-medium rounded-tr-none shadow-xs'
                        : 'bg-white text-[#28352D] border border-[#E8E3DA] rounded-tl-none shadow-xs'
                    }`}
                  >
                    {/* Meta info header for Assistant */}
                    {!isUser && (
                      <div className="flex items-center justify-between pb-1 border-b border-[#E8E3DA] text-[10px] text-stone-500">
                        <span className="font-semibold text-[#55745E]">
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
                      <div className="pt-1.5 border-t border-[#E8E3DA] flex items-center gap-1 text-[10px] text-stone-500">
                        <BookOpen className="w-3 h-3 text-[#55745E] shrink-0" />
                        <span className="font-semibold">Sources:</span>
                        <span className="truncate">{msg.sources.join(' • ')}</span>
                      </div>
                    )}

                    {/* Suggested Action */}
                    {msg.suggestedAction && msg.suggestedAction.trim() !== '' && (
                      <div className="p-2 rounded-xl text-[10px] bg-[#FAF7F2] border border-[#E8E3DA] text-stone-700 flex items-start gap-1.5">
                        <Lightbulb className="w-3 h-3 text-[#C47A59] shrink-0 mt-0.5" />
                        <span>{msg.suggestedAction}</span>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-6 h-6 rounded-lg bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 text-stone-500 text-xs p-2">
                <div className="w-6 h-6 rounded-lg bg-[#55745E] text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-[#C47A59]" />
                </div>
                <div className="bg-white border border-[#E8E3DA] px-3 py-1.5 rounded-xl shadow-2xs italic text-[11px]">
                  Consulting live database &amp; policies...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar */}
          <div className="p-3 bg-white border-t border-[#E8E3DA] shrink-0">
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
                className="flex-1 bg-[#FAF7F2] border border-[#E8E3DA] rounded-xl px-3.5 py-2 text-xs text-[#28352D] placeholder-stone-400 focus:outline-none focus:border-[#55745E] focus:ring-1 focus:ring-[#55745E]/20"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-8 h-8 rounded-xl bg-[#55745E] hover:bg-[#45604D] text-white flex items-center justify-center shadow-xs disabled:opacity-40 transition-all cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Action Button (Bottom-Right) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Open AI Concierge"
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full text-white shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
          isOpen ? 'bg-[#45604D] ring-2 ring-[#C47A59]' : 'bg-[#55745E] hover:bg-[#45604D]'
        }`}
      >
        <div className="relative">
          <BotMessageSquare className="w-5 h-5 text-white" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#C47A59] ring-2 ring-white" />
        </div>
        <span className="text-xs font-bold tracking-wide font-sans">
          {isOpen ? 'Close AI' : 'AI Concierge'}
        </span>
      </button>
    </>
  );
}
