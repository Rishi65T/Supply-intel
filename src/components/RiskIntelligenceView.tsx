import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Navigation } from 'lucide-react';

export const RiskIntelligenceView: React.FC = () => {
  const corridors = [
    { name: 'NH48 Mumbai-Pune Expressway (Ghat Section)', risk: 78, level: 'High Risk', cause: 'Heavy Monsoon Cloudbursts & Rockfall Vulnerability', status: 'Active Detour Advisory' },
    { name: 'Western Dedicated Freight Corridor (Gujarat-NCR)', risk: 14, level: 'Low Risk', cause: 'Dedicated Electric Double-Stack Track', status: 'Optimal Green Track' },
    { name: 'Golden Quadrilateral (Delhi - Kolkata Corridor)', risk: 42, level: 'Moderate Risk', cause: 'Toll plaza queuing at Barhi & Varanasi check-posts', status: 'Normal Transit' },
    { name: 'Chennai-Bengaluru Industrial Corridor', risk: 18, level: 'Low Risk', cause: '4-Lane Expressway clear passage', status: 'Optimal' },
    { name: 'West Coast Coastal Maritime Lane (Howrah-JNPT)', risk: 65, level: 'Elevated Risk', cause: 'Deep Depression in Bay of Bengal with 3m sea swell', status: 'Speed Restriction 12 kts' }
  ];

  return (
    <div className="space-y-4 max-w-[1440px] mx-auto pb-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#ef4444]" />
          Indian Supply Chain Risk Intelligence Center
        </h2>
        <p className="text-xs text-[#64748b]">Multi-tier risk indexing across Highway corridors, Monsoon climate alerts, and GST regulatory compliance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Corridor Risk Breakdown */}
        <div className="bg-[#0b111c] border border-[#162030] rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Navigation className="w-4 h-4 text-[#38bdf8]" />
            National Freight Corridor Risk Index
          </h3>
          <div className="space-y-3">
            {corridors.map((c, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#0e1726] border border-[#18263a] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{c.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    c.risk > 70 ? 'bg-[#ef4444]/20 text-[#ef4444]' :
                    c.risk > 40 ? 'bg-[#f59e0b]/20 text-[#f59e0b]' :
                    'bg-[#10b981]/20 text-[#10b981]'
                  }`}>
                    {c.risk}% ({c.level})
                  </span>
                </div>
                <div className="w-full bg-[#162234] h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      c.risk > 70 ? 'bg-[#ef4444]' :
                      c.risk > 40 ? 'bg-[#f59e0b]' :
                      'bg-[#10b981]'
                    }`}
                    style={{ width: `${c.risk}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-[#94a3b8]">{c.cause} • <strong className="text-[#38bdf8]">{c.status}</strong></p>
              </div>
            ))}
          </div>
        </div>

        {/* Regulatory & GST Risk */}
        <div className="bg-[#0b111c] border border-[#162030] rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Compliance & Infrastructure Resilience</h3>
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-[#0e1726] border border-[#18263a] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">GST e-Way Bill Compliance Rate</span>
                <span className="text-xs font-mono font-bold text-[#10b981]">99.4%</span>
              </div>
              <p className="text-[11px] text-[#64748b]">Real-time API reconciliation with National Informatics Centre (NIC) gateway.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0e1726] border border-[#18263a] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Monsoon Season Disruption Exposure</span>
                <span className="text-xs font-mono font-bold text-[#f59e0b]">₹14.8 Cr</span>
              </div>
              <p className="text-[11px] text-[#64748b]">Total inventory in transit across Western Ghats and coastal shipping lanes.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0e1726] border border-[#18263a] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Supplier Single-Source Dependency</span>
                <span className="text-xs font-mono font-bold text-[#ef4444]">High (EV Batteries)</span>
              </div>
              <p className="text-[11px] text-[#64748b]">Sanand supplier SUP-IND-183 provides 72% of EV traction modules.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
