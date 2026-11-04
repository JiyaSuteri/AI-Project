import React, { useState, useRef, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { api } from '../services/api';
import {
  BotMessageSquare,
  Send,
  Sparkles,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  User,
  Lightbulb,
  Cpu
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  'Which tables are currently available?',
  'Which table can seat seven customers?',
  'Which waiter currently has the highest workload?',
  'Why was customer group allocated a specific table?',
  'What is the reservation and late arrival policy?',
  'How can the restaurant reduce average waiting time?',
  'Compare the current allocation algorithms.',
];

export default function AIAssistantPage() {
  const { addToast } = useRestaurant();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hello! I am your AI Restaurant Service Assistant for Saffron & Sage powered by Groq LPU inference. I am grounded directly on real-time SQLite database tables and our indexed service policy knowledge base. How can I assist floor operations today?',
      sources: ['table_allocation_policy.md', 'reservation_policy.md'],
      suggestedAction: 'Ask about available tables, staff workloads, or policy compliance.',
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
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <span>Grounded AI Restaurant Assistant</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
              RAG Grounded
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Answers queries with zero hallucination using live SQLite records and operational policy documents.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300 glass-panel px-3 py-1.5 rounded-xl border border-slate-800">
          <Cpu className="w-4 h-4 text-champagne-400" />
          <span className="text-champagne-300 font-medium">Groq LPU (gpt-oss-120b)</span>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 text-xs">
        {SUGGESTED_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-champagne-300 border border-slate-800/80 hover:border-champagne-500/40 shadow-xs transition-colors whitespace-nowrap text-xs font-medium disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Canvas */}
      <div className="flex-1 glass-panel rounded-3xl shadow-3d-card p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={index}
              className={`flex gap-3 text-xs sm:text-sm ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-champagne-500 to-amber-600 text-slate-950 flex items-center justify-center shrink-0 shadow-glow-champagne mt-1">
                  <BotMessageSquare className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-xl rounded-2xl p-4 space-y-2.5 ${
                  isUser
                    ? 'bg-gradient-to-r from-champagne-500 to-amber-600 text-slate-950 font-medium rounded-tr-none shadow-glow-champagne'
                    : 'bg-slate-900/80 text-slate-100 border border-slate-800/80 rounded-tl-none shadow-xs'
                }`}
              >
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
                            ? 'bg-slate-950/20 text-slate-900'
                            : 'bg-slate-950/60 border border-slate-800 text-slate-300'
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
                    isUser ? 'border-slate-950/20 text-slate-900' : 'border-slate-800/80 text-slate-400'
                  }`}>
                    <BookOpen className="w-3.5 h-3.5 text-champagne-400 shrink-0" />
                    <span className="font-semibold text-champagne-300">Cited Sources:</span>
                    <span className="truncate">{msg.sources.join(' • ')}</span>
                  </div>
                )}

                {/* Suggested Action */}
                {msg.suggestedAction && (
                  <div className={`p-2.5 rounded-xl text-[11px] flex items-start gap-2 ${
                    isUser
                      ? 'bg-slate-950/20 text-slate-950'
                      : 'bg-slate-950/60 border border-slate-800/80 text-slate-300'
                  }`}>
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className={`font-semibold ${isUser ? 'text-slate-950' : 'text-slate-100'}`}>Recommended Action: </span>
                      {msg.suggestedAction}
                    </div>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center shrink-0 shadow-xs mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 text-xs">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-champagne-500 to-amber-600 text-slate-950 flex items-center justify-center shrink-0 shadow-glow-champagne">
              <BotMessageSquare className="w-4 h-4 animate-bounce" />
            </div>
            <div className="bg-slate-900/80 text-slate-300 border border-slate-800/80 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-champagne-400 animate-ping" />
              <span>Querying Groq LPU engine & grounding on SQLite state...</span>
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
        className="flex items-center gap-2 shrink-0 glass-panel p-2 rounded-2xl border border-slate-800/80 shadow-3d-card"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about available tables, staff workloads, or restaurant policies..."
          className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-gradient-to-r from-champagne-500 to-amber-600 hover:from-champagne-400 hover:to-amber-500 text-slate-950 shadow-glow-champagne transition-all disabled:opacity-40 font-medium"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
