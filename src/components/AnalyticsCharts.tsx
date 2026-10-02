import React from 'react';
import { X } from 'lucide-react';

export const AnalyticsCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-4 gap-3 w-full">
      {/* 1. Network Risk Gauge */}
      <div className="bg-[#0b111c] border border-[#162030] rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#e2e8f0]">Corridor Risk Index</span>
          <span className="text-[9px] text-[#38bdf8] font-mono">NH48 & Coast</span>
        </div>
        
        {/* Semi-circular Radial Gauge */}
        <div className="relative flex flex-col items-center justify-center my-1">
          <svg className="w-32 h-20 overflow-visible" viewBox="0 0 100 55">
            {/* Background Track */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="#162030"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Gradient Arc for 32% Risk */}
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="40%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth="8"
              strokeDasharray="125.6"
              strokeDashoffset="85"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute top-7 flex flex-col items-center">
            <span className="text-2xl font-extrabold text-white tracking-tight">32%</span>
          </div>
        </div>

        <div className="text-center">
          <span className="text-xs font-bold text-[#f59e0b]">Medium Risk</span>
          <p className="text-[9px] text-[#64748b]">Western Ghats Monsoon Alert</p>
        </div>
      </div>

      {/* 2. Shipment Status Donut */}
      <div className="bg-[#0b111c] border border-[#162030] rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#e2e8f0]">Shipment Status</span>
          <span className="text-[9px] text-[#10b981] font-mono">FASTag Sync</span>
        </div>

        <div className="flex items-center justify-between gap-2 my-1">
          {/* Donut chart */}
          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              {/* On Time 72% */}
              <circle cx="18" cy="18" r="14" fill="transparent" stroke="#06b6d4" strokeWidth="4.5" strokeDasharray="63 37" strokeDashoffset="0" />
              {/* Delayed 18% */}
              <circle cx="18" cy="18" r="14" fill="transparent" stroke="#f43f5e" strokeWidth="4.5" strokeDasharray="16 84" strokeDashoffset="-63" />
              {/* In Transit 8% */}
              <circle cx="18" cy="18" r="14" fill="transparent" stroke="#2563eb" strokeWidth="4.5" strokeDasharray="7 93" strokeDashoffset="-79" />
              {/* At Risk 2% */}
              <circle cx="18" cy="18" r="14" fill="transparent" stroke="#b91c1c" strokeWidth="4.5" strokeDasharray="2 98" strokeDashoffset="-86" />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-xs font-bold text-white leading-tight">3,482</span>
              <span className="text-[9px] text-[#64748b]">Total</span>
            </div>
          </div>

          {/* Legend */}
          <div className="text-[10px] space-y-1 text-[#94a3b8]">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4]"></span>On Time</span>
              <span className="text-white font-medium">72%</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e]"></span>Delayed</span>
              <span className="text-white font-medium">18%</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]"></span>In Transit</span>
              <span className="text-white font-medium">8%</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#b91c1c]"></span>At Risk</span>
              <span className="text-white font-medium">2%</span>
            </div>
          </div>
        </div>

        <div className="h-1"></div>
      </div>

      {/* 3. Inventory Status Donut */}
      <div className="bg-[#0b111c] border border-[#162030] rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#e2e8f0]">DC Inventory Status</span>
          <span className="text-[9px] text-[#38bdf8] font-mono">Bhiwandi & BLR</span>
        </div>

        <div className="flex items-center justify-between gap-2 my-1">
          {/* Donut chart */}
          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              {/* Healthy 92% */}
              <circle cx="18" cy="18" r="14" fill="transparent" stroke="#10b981" strokeWidth="4.5" strokeDasharray="81 19" strokeDashoffset="0" />
              {/* Low Stock 6% */}
              <circle cx="18" cy="18" r="14" fill="transparent" stroke="#f97316" strokeWidth="4.5" strokeDasharray="5.5 94.5" strokeDashoffset="-81" />
              {/* Out of Stock 2% */}
              <circle cx="18" cy="18" r="14" fill="transparent" stroke="#ef4444" strokeWidth="4.5" strokeDasharray="2 98" strokeDashoffset="-86.5" />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-xs font-bold text-white leading-tight">92%</span>
              <span className="text-[9px] text-[#10b981]">Healthy</span>
            </div>
          </div>

          {/* Legend */}
          <div className="text-[10px] space-y-1.5 text-[#94a3b8]">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>Healthy</span>
              <span className="text-white font-medium">92%</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#f97316]"></span>Low Stock</span>
              <span className="text-white font-medium">6%</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]"></span>Critical</span>
              <span className="text-white font-medium">2%</span>
            </div>
          </div>
        </div>

        <div className="h-1"></div>
      </div>

      {/* 4. Demand Forecast Chart */}
      <div className="bg-[#0b111c] border border-[#162030] rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-[#e2e8f0]">Festive Demand Forecast</span>
          <span className="text-[9px] text-[#22c55e] font-mono">Q3 Diwali Surge</span>
        </div>

        {/* Dual Line Area Chart */}
        <div className="relative h-20 w-full flex items-center">
          <div className="absolute left-0 top-0 bottom-4 flex flex-col justify-between text-[8px] text-[#64748b] font-mono">
            <span>100</span>
            <span>50</span>
            <span>0</span>
          </div>

          <div className="ml-5 flex-1 h-full flex flex-col justify-end">
            <svg className="w-full h-14 overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
              <defs>
                <linearGradient id="forecastGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area fill */}
              <path
                d="M 0 35 Q 20 28, 40 18 T 80 10 T 100 6 L 100 40 L 0 40 Z"
                fill="url(#forecastGlow)"
              />

              {/* Actual Line (Dark Blue) */}
              <path
                d="M 0 36 Q 20 32, 40 25 T 80 20 T 100 18"
                fill="none"
                stroke="#1d4ed8"
                strokeWidth="2"
              />

              {/* Forecast Line (Cyan) */}
              <path
                d="M 0 35 Q 20 28, 40 18 T 80 10 T 100 6"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
              />
            </svg>

            {/* X-axis months */}
            <div className="flex justify-between text-[8px] text-[#64748b] pt-1 font-mono">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-[9px] text-[#94a3b8] pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-[#1d4ed8]"></span>
            <span>Actual (Units)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-[#38bdf8]"></span>
            <span>Forecast (Diwali Surge)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
