import React, { useEffect, useState } from 'react';
import { AlertTriangle, ShieldAlert, Clock, CheckCircle } from 'lucide-react';
import { indianDisruptions } from '../data/mockData';

export const DisruptionsView: React.FC = () => {
  const [disruptions, setDisruptions] = useState(indianDisruptions);
  const [mitigatedId, setMitigatedId] = useState<string | null>(null);

  const handleMitigate = (id: string) => {
    setMitigatedId(id);
    setTimeout(() => {
      setDisruptions(prev => prev.filter(d => d.id !== id));
      setMitigatedId(null);
    }, 1200);
  };

  return (
    <div className="space-y-4 max-w-[1440px] mx-auto pb-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[#ef4444]" />
          Indian Supply Chain Active Disruptions Center
        </h2>
        <p className="text-xs text-[#64748b]">Live incident reporting for Western Ghats monsoon blockages, GIDC power outages, and coastal weather detours.</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {disruptions.length === 0 ? (
          <div className="p-8 text-center bg-[#0b111c] border border-[#162030] rounded-xl text-xs text-[#10b981]">
            ✓ All active operational disruptions have been successfully mitigated.
          </div>
        ) : (
          disruptions.map((d) => (
            <div key={d.id} className="bg-[#0b111c] border border-[#162030] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${d.severity === 'Critical' ? 'bg-[#ef4444]/20 text-[#ef4444]' : 'bg-[#f59e0b]/20 text-[#f59e0b]'}`}>
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#38bdf8] font-bold">{d.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${d.severity === 'Critical' ? 'bg-[#ef4444]/20 text-[#ef4444]' : 'bg-[#f59e0b]/20 text-[#f59e0b]'}`}>
                      {d.severity}
                    </span>
                    <span className="text-[10px] text-[#64748b]">{d.location}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{d.title}</h3>
                  <p className="text-xs text-[#94a3b8]">Impact: <strong className="text-white">{d.impact}</strong></p>
                  <p className="text-[11px] text-[#38bdf8]">Recommended SOP: {d.recommendedAction}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end md:self-auto">
                <span className="text-xs text-[#64748b] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {d.timestamp}
                </span>
                <button
                  onClick={() => handleMitigate(d.id)}
                  disabled={mitigatedId === d.id}
                  className="px-4 py-2 rounded-xl bg-[#1e60f2] text-xs font-semibold text-white hover:bg-[#184ebd] transition-all cursor-pointer disabled:opacity-50"
                >
                  {mitigatedId === d.id ? 'Mitigating...' : 'Execute Mitigation'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
