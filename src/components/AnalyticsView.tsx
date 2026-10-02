import React from 'react';
import { BarChart3, TrendingUp, Truck, Train, Ship, Plane } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="space-y-4 max-w-[1440px] mx-auto pb-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#38bdf8]" />
          Indian Multi-Modal Freight Analytics
        </h2>
        <p className="text-xs text-[#64748b]">On-Time-In-Full (OTIF) metrics, transit velocity, and freight mode distribution.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0b111c] border border-[#162030] rounded-xl p-4">
          <span className="text-xs text-[#94a3b8] flex items-center gap-1.5"><Truck className="w-4 h-4 text-[#38bdf8]" /> Highway Road</span>
          <div className="text-2xl font-bold text-white mt-1">65%</div>
          <span className="text-[10px] text-[#64748b]">Avg speed: 42 km/h</span>
        </div>
        <div className="bg-[#0b111c] border border-[#162030] rounded-xl p-4">
          <span className="text-xs text-[#94a3b8] flex items-center gap-1.5"><Train className="w-4 h-4 text-[#22d3ee]" /> DFC Rail Freight</span>
          <div className="text-2xl font-bold text-[#22d3ee] mt-1">20%</div>
          <span className="text-[10px] text-[#64748b]">Avg speed: 75 km/h</span>
        </div>
        <div className="bg-[#0b111c] border border-[#162030] rounded-xl p-4">
          <span className="text-xs text-[#94a3b8] flex items-center gap-1.5"><Ship className="w-4 h-4 text-[#a855f7]" /> Coastal Shipping</span>
          <div className="text-2xl font-bold text-[#a855f7] mt-1">10%</div>
          <span className="text-[10px] text-[#64748b]">Avg cost: ₹0.85/ton-km</span>
        </div>
        <div className="bg-[#0b111c] border border-[#162030] rounded-xl p-4">
          <span className="text-xs text-[#94a3b8] flex items-center gap-1.5"><Plane className="w-4 h-4 text-[#f59e0b]" /> Air Express</span>
          <div className="text-2xl font-bold text-[#f59e0b] mt-1">5%</div>
          <span className="text-[10px] text-[#64748b]">Critical semiconductors</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0b111c] border border-[#162030] rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white">OTIF (On-Time In-Full) by Industrial Region</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2 rounded bg-[#0e1726]">
              <span>Southern Auto Hub (Chennai - Bengaluru)</span>
              <span className="font-bold text-[#10b981]">95.2% OTIF</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-[#0e1726]">
              <span>Western Auto Corridor (Pune - Sanand)</span>
              <span className="font-bold text-[#f59e0b]">86.4% OTIF (Monsoon impact)</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-[#0e1726]">
              <span>Northern Assembly Hub (Delhi NCR - Manesar)</span>
              <span className="font-bold text-[#10b981]">92.8% OTIF</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-[#0e1726]">
              <span>Eastern Raw Metals Corridor (Howrah - Durgapur)</span>
              <span className="font-bold text-[#f59e0b]">88.1% OTIF</span>
            </div>
          </div>
        </div>

        <div className="bg-[#0b111c] border border-[#162030] rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white">Logistics Cost Savings & Optimization</h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-[#0e1726] border border-[#18263a]">
              <div className="flex justify-between">
                <span className="text-white font-bold">Western DFC Modal Shift Savings</span>
                <span className="text-[#22c55e] font-bold font-mono">₹48.2 Lakhs/mo</span>
              </div>
              <p className="text-[11px] text-[#64748b] mt-1">Achieved by migrating 45 TEU containers daily from road to electric rail freight.</p>
            </div>
            <div className="p-3 rounded-xl bg-[#0e1726] border border-[#18263a]">
              <div className="flex justify-between">
                <span className="text-white font-bold">Bhiwandi Automated DC Efficiency Gain</span>
                <span className="text-[#38bdf8] font-bold font-mono">+18% Throughput</span>
              </div>
              <p className="text-[11px] text-[#64748b] mt-1">Reduced pallet turnaround dwell time from 52 mins to 28 mins.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
