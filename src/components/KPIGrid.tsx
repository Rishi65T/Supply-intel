import React from 'react';

export const KPIGrid: React.FC = () => {
  const kpis = [
    { title: 'Total Suppliers', value: '1,284', trend: '↑ 5%', isPositive: true, subtitle: 'Tier-1 & Tier-2 Indian OEMs' },
    { title: 'Active Shipments', value: '3,482', trend: '↑ 12%', isPositive: true, subtitle: 'FASTag & DFC Live Transit' },
    { title: 'Inventory Health', value: '92%', trend: '↑ 2%', isPositive: true, subtitle: 'Bhiwandi & Bengaluru Hubs' },
    { title: 'At-Risk SKUs', value: '248', trend: '↑ 18%', isPositive: false, subtitle: 'EV Inverters & Forgings' },
    { title: 'Active Disruptions', value: '7', trend: '↑ 2%', isPositive: false, subtitle: 'NH48 & GIDC Grid Holds' },
  ];

  return (
    <div className="grid grid-cols-5 gap-3 w-full">
      {kpis.map((kpi, idx) => (
        <div 
          key={idx} 
          className="bg-[#0b111c] border border-[#162030] rounded-xl px-4 py-3 flex flex-col justify-between hover:border-[#2563eb]/50 transition-all cursor-pointer group"
          title={`${kpi.title}: ${kpi.subtitle}`}
        >
          <span className="text-[11px] font-medium text-[#738399] tracking-tight group-hover:text-[#94a3b8] transition-colors">{kpi.title}</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-xl font-bold tracking-tight ${!kpi.isPositive && kpi.title === 'At-Risk SKUs' ? 'text-[#f87171]' : !kpi.isPositive && kpi.title === 'Active Disruptions' ? 'text-[#f87171]' : 'text-[#38bdf8]'}`}>
              {kpi.value}
            </span>
            <span className={`text-[11px] font-semibold ${kpi.isPositive ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
              {kpi.trend}
            </span>
          </div>
          <span className="text-[9px] text-[#4b586e] mt-0.5 truncate">{kpi.subtitle}</span>
        </div>
      ))}
    </div>
  );
};
