import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle, TrendingUp, Sparkles, Send } from 'lucide-react';

interface EntityDrawerProps {
  node: any;
  onClose: () => void;
  onRunAiQuery?: (prompt: string, context: any) => void;
}

export const EntityDrawer: React.FC<EntityDrawerProps> = ({ node, onClose }) => {
  const [queryInput, setQueryInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  if (!node) return null;

  const handleAskAi = async () => {
    if (!queryInput.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: queryInput, context: node })
      });
      const data = await res.json();
      setAiResponse(data.response);
    } catch (e) {
      setAiResponse('Error communicating with Control Tower AI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-96 bg-[#0b1322] border-l border-[#1e2d42] flex flex-col h-full shadow-2xl z-40 overflow-hidden">
      {/* Header */}
      <div className="h-14 px-5 border-b border-[#162438] flex items-center justify-between bg-[#0e1726]">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${node.status === 'Critical' || node.risk > 0.7 ? 'bg-[#ef4444]' : node.status === 'Warning' || node.risk > 0.4 ? 'bg-[#f59e0b]' : 'bg-[#10b981]'}`}></span>
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">Entity Telemetry Profile</h2>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg text-[#64748b] hover:bg-[#152338] hover:text-white transition-all cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4 overflow-y-auto flex-1 custom-scrollbar text-xs">
        {/* Basic Info */}
        <div className="bg-[#0e1726] border border-[#18263a] rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[#38bdf8] font-bold">{node.id || 'NODE-01'}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${node.status === 'Critical' ? 'bg-[#ef4444]/20 text-[#ef4444]' : 'bg-[#10b981]/20 text-[#10b981]'}`}>
              {node.status || 'Active'}
            </span>
          </div>
          <h3 className="text-sm font-bold text-white">{node.name}</h3>
          <p className="text-xs text-[#94a3b8]">{node.location || 'India Network'}</p>
          {node.gstin && <p className="text-[10px] text-[#64748b] font-mono">GSTIN: {node.gstin}</p>}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-[#0e1726] border border-[#18263a] rounded-xl p-3">
            <p className="text-[10px] text-[#64748b]">Capacity</p>
            <p className="text-base font-bold text-white mt-0.5">{node.capacity ? `${node.capacity}%` : 'Optimal'}</p>
          </div>
          <div className="bg-[#0e1726] border border-[#18263a] rounded-xl p-3">
            <p className="text-[10px] text-[#64748b]">Lead Time</p>
            <p className="text-base font-bold text-[#38bdf8] mt-0.5">{node.leadTimeDays ? `${node.leadTimeDays} days` : '4 days'}</p>
          </div>
          <div className="bg-[#0e1726] border border-[#18263a] rounded-xl p-3">
            <p className="text-[10px] text-[#64748b]">Annual Volume</p>
            <p className="text-base font-bold text-[#22c55e] mt-0.5">{node.annualVolume || '₹140 Cr'}</p>
          </div>
          <div className="bg-[#0e1726] border border-[#18263a] rounded-xl p-3">
            <p className="text-[10px] text-[#64748b]">Risk Index</p>
            <p className="text-base font-bold text-[#ef4444] mt-0.5">{node.riskScore || node.risk || '0.22'}</p>
          </div>
        </div>

        {/* AI Advisor Prompt Box */}
        <div className="bg-[#0e1726] border border-[#2563eb]/40 rounded-xl p-4 space-y-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
            <h4 className="text-xs font-bold text-[#38bdf8]">Ask AI about this Indian Hub</h4>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="e.g. What is the stockout risk?"
              className="w-full bg-[#070d17] border border-[#18263a] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-[#55657e] focus:outline-none focus:border-[#38bdf8]"
            />
            <button
              onClick={handleAskAi}
              disabled={loading}
              className="bg-[#1e60f2] text-white px-3 rounded-lg text-xs font-bold hover:bg-[#184ebd] transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          {aiResponse && (
            <div className="bg-[#070d17] border border-[#18263a] rounded-lg p-2.5 text-[11px] text-white leading-relaxed">
              <p className="text-[10px] text-[#38bdf8] font-bold mb-1">AI Recommendation:</p>
              {aiResponse}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
