import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User } from 'lucide-react';

interface AIAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAdvisorModal: React.FC<AIAdvisorModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<any[]>([
    { 
      role: 'assistant', 
      text: 'Namaste Dr. Rishi. I am the SupplyIntel Control Tower AI. I am monitoring 1,284 Indian Tier-1/2 suppliers, FASTag freight movement along NH48/NH44, Western DFC rail corridors, and JNPT port operations. How can I assist with your supply chain decisions today?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'How to bypass NH48 Ghat landslide delay for Pune assembly?',
    'Evaluate alternate supplier for Sanand EV Battery Module',
    'Calculate Diwali festive buffer stock requirements',
    'Estimate cost savings of shifting Gujarat freight to Western DFC'
  ];

  const handleSend = async (userText?: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim()) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend, context: { region: 'India Operations', director: 'Rishi Sathiyamoorthi' } })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Error connecting to Control Tower AI. Please check server connection.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0b1322] border border-[#1e2d42] w-full max-w-2xl h-[620px] rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#162438] flex items-center justify-between bg-[#0e1726]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#1e60f2]/20 border border-[#1e60f2]/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#38bdf8]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">SupplyIntel Control Tower AI (India Operations)</h3>
              <p className="text-[10px] text-[#38bdf8]">FASTag, DFC Rail & NIC GST Reconciliation Stream</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#64748b] hover:bg-[#152338] hover:text-white transition-all cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto custom-scrollbar">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-[#1e60f2]/30 text-[#38bdf8]' : 'bg-[#06b6d4]/20 text-[#06b6d4]'}`}>
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-lg p-3.5 rounded-2xl text-xs leading-relaxed ${
                m.role === 'user' ? 'bg-[#1e60f2] text-white font-medium' : 'bg-[#0e1726] border border-[#18263a] text-[#F8FAFC]'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#06b6d4]/20 flex items-center justify-center text-[#06b6d4]">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-[#0e1726] border border-[#18263a] p-3 rounded-2xl text-xs text-[#94a3b8] animate-pulse">
                Analyzing Indian corridor FASTag telemetry & plant inventory...
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 border-t border-[#162438] bg-[#09101c] flex flex-wrap gap-1.5">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSend(qp)}
              className="text-[10px] px-2.5 py-1 rounded-full bg-[#0e1726] text-[#94a3b8] hover:text-[#38bdf8] hover:border-[#38bdf8] border border-[#18263a] transition-all cursor-pointer truncate max-w-xs"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Footer */}
        <div className="p-4 border-t border-[#162438] bg-[#0e1726] flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about suppliers, shipments, or bottlenecks..."
            className="w-full bg-[#070d17] border border-[#18263a] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#55657e] focus:outline-none focus:border-[#2563eb]"
          />
          <button
            onClick={() => handleSend()}
            className="bg-[#1e60f2] text-white px-5 rounded-xl text-xs font-bold hover:bg-[#184ebd] transition-all flex items-center justify-center shadow-lg shadow-[#1e60f2]/20 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
