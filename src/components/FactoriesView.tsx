import React from 'react';
import { Factory as FactoryIcon, Activity, CheckCircle, AlertTriangle } from 'lucide-react';
import { indianFactories } from '../data/mockData';

export const FactoriesView: React.FC = () => {
  return (
    <div className="space-y-4 max-w-[1440px] mx-auto pb-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FactoryIcon className="w-5 h-5 text-[#38bdf8]" />
          Indian Manufacturing Mega-Plants (OEM Assembly)
        </h2>
        <p className="text-xs text-[#64748b]">Live OEE, active shift throughput, and assembly line bottleneck monitoring.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {indianFactories.map(f => (
          <div key={f.id} className="bg-[#0b111c] border border-[#162030] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-[#38bdf8] font-bold">{f.id}</span>
                <h3 className="text-base font-bold text-white mt-0.5">{f.name}</h3>
                <p className="text-xs text-[#94a3b8]">{f.location}</p>
              </div>
              <span className={`px-2.5 py-1 rounded text-xs font-bold border ${
                f.status === 'Degraded' ? 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/40' :
                'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/40'
              }`}>
                {f.status}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-3 bg-[#0e1726] border border-[#18263a] p-3 rounded-xl text-center">
              <div>
                <span className="text-[10px] text-[#64748b] block">Plant OEE</span>
                <span className="text-sm font-bold text-[#22c55e]">{f.oee}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#64748b] block">Throughput</span>
                <span className="text-sm font-bold text-white">{f.throughput}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#64748b] block">Buffer Stock</span>
                <span className="text-sm font-bold text-[#38bdf8]">{f.inventoryDays} days</span>
              </div>
              <div>
                <span className="text-[10px] text-[#64748b] block">Active Lines</span>
                <span className="text-sm font-bold text-white">{f.activeLines}/{f.totalLines}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-[#94a3b8]">Shift Status: <strong>Shift 2 (Operating)</strong></span>
              <button className="px-3 py-1.5 rounded-lg bg-[#152338] text-[#38bdf8] hover:bg-[#1e60f2] hover:text-white transition-all text-xs font-semibold">
                Manage Production Schedule
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
