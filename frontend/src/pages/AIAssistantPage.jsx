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
  Cpu,
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Database,
  Layers
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  'How many tables are currently available?',
  'Which tables can accommodate four people?',
  'Which waiter has the lowest workload?',
  'How many customers are waiting?',
  'What reservations are scheduled?',
  'What is the restaurant seating policy?',
  'Which table should be allocated to a group of five?',
  'What happens when all tables are occupied?',
  'Explain how AI table allocation works.',
  'What is the difference between Greedy and A*?',
];

export default function AIAssistantPage() {
  const { addToast, aiProviderInfo } = useRestaurant();
  const { isGuest, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hello! I am your AI Restaurant Service Concierge for Saffron & Sage powered by Groq LPU inference. I am grounded directly on real-time SQLite database tables and our indexed service policy knowledge base. How can I assist floor operations today?',
      sources: ['table_allocation_policy.md', 'reservation_policy.md'],
      suggestedAction: 'Ask about available tables, staff workloads, or policy compliance.',
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
    scrollToBottom();
  }, [messages, loading]);

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
          content: 'Unable to process query at this time. Please check your backend connection.',
          sources: [],
          isFallback: true,
          groundingType: 'ERROR_STATE'
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto h-[calc(100vh-8.5rem)] flex flex-col">
      {/* Title */}
      <div className="flex items-center justify-between flex-wrap gap-2 shrink-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#28352D] font-serif tracking-tight flex items-center gap-2">
            <span>Grounded AI Restaurant Assistant</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#55745E]/10 text-[#55745E] font-semibold border border-[#55745E]/20">
              RAG Grounded
            </span>
          </h1>
          <p className="text-xs text-stone-500">
            Answers queries with zero hallucination using {isGuest ? 'isolated guest demonstration records' : 'live SQLite database records'} and operational policy documents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Badge */}
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border ${
            isGuest
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : 'bg-[#55745E]/10 text-[#55745E] border-[#55745E]/20'
          }`}>
            <Database className="w-3.5 h-3.5" />
            <span>{isGuest ? 'Guest Sandbox Mode' : 'Live SQLite Mode'}</span>
          </span>

          <div className="flex items-center gap-2 text-xs text-stone-600 bg-white px-3 py-1 rounded-xl border border-[#E8E3DA] shadow-xs">
            <Zap className="w-4 h-4 text-[#55745E]" />
            <span className="text-[#28352D] font-medium">{aiProviderInfo || 'Groq LPU Active'}</span>
          </div>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 text-xs">
        {SUGGESTED_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-600 hover:text-[#28352D] border border-[#E8E3DA] shadow-xs transition-colors whitespace-nowrap text-xs font-medium disabled:opacity-50 cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Canvas */}
      <div className="flex-1 bg-white rounded-3xl border border-[#E8E3DA] shadow-xs p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={index}
              className={`flex gap-3 text-xs sm:text-sm ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-[#55745E] text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                  <BotMessageSquare className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-xl rounded-2xl p-4 space-y-2.5 ${
                  isUser
                    ? 'bg-[#55745E] text-white font-medium rounded-tr-none shadow-xs'
                    : 'bg-[#FAF7F2] text-[#28352D] border border-[#E8E3DA] rounded-tl-none shadow-xs'
                }`}
              >
                {/* Meta Badge Bar for Assistant */}
                {!isUser && (
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#E8E3DA] text-[10px] text-stone-500">
                    <span className="inline-flex items-center gap-1 font-semibold text-[#55745E]">
                      <Sparkles className="w-3 h-3 text-[#C47A59]" />
                      <span>{msg.modelUsed ? `Groq LPU (${msg.modelUsed})` : (msg.isFallback ? 'Deterministic Grounder' : 'Groq LPU Engine')}</span>
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-white border border-[#E8E3DA] font-mono font-medium text-stone-600">
                      {msg.groundingType || 'GROUNDED'}
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </div>

                {/* Relevant Info Pills */}
                {msg.relevantInfo && msg.relevantInfo.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.relevantInfo.map((info, i) => (
                      <span
                        key={i}
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                          isUser
                            ? 'bg-white/20 text-white'
                            : 'bg-white border border-[#E8E3DA] text-stone-600'
                        }`}
                      >
                        {info}
                      </span>
                    ))}
                  </div>
                )}

                {/* Policy Citations / Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className={`pt-2 border-t flex items-center gap-1.5 text-[11px] ${
                    isUser ? 'border-white/20 text-white/90' : 'border-[#E8E3DA] text-stone-500'
                  }`}>
                    <BookOpen className={`w-3.5 h-3.5 shrink-0 ${isUser ? 'text-white' : 'text-[#55745E]'}`} />
                    <span className="font-semibold">Cited Sources:</span>
                    <span className="truncate">{msg.sources.join(' • ')}</span>
                  </div>
                )}

                {/* Suggested Action */}
                {msg.suggestedAction && (
                  <div className={`p-2.5 rounded-xl text-[11px] flex items-start gap-2 ${
                    isUser
                      ? 'bg-white/15 text-white'
                      : 'bg-white border border-[#E8E3DA] text-stone-700'
                  }`}>
                    <Lightbulb className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isUser ? 'text-white' : 'text-[#C47A59]'}`} />
                    <div>
                      <span className="font-semibold">Recommended Action: </span>
                      {msg.suggestedAction}
                    </div>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 shadow-xs mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 text-xs">
            <div className="w-8 h-8 rounded-xl bg-[#55745E] text-white flex items-center justify-center shrink-0 shadow-xs">
              <BotMessageSquare className="w-4 h-4 animate-bounce" />
            </div>
            <div className="bg-[#FAF7F2] text-stone-600 border border-[#E8E3DA] rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#55745E] animate-ping" />
              <span>Querying Groq LPU engine &amp; grounding on SQLite state...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 shrink-0 bg-white p-2 rounded-2xl border border-[#E8E3DA] shadow-xs"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about available tables, staff workloads, or restaurant policies..."
          className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-[#28352D] placeholder-stone-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-[#55745E] hover:bg-[#455E4C] text-white shadow-xs transition-all disabled:opacity-40 font-medium cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
