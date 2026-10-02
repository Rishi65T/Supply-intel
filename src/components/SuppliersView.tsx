import React, { useState } from 'react';
import { Building2, Search, Filter, ShieldAlert, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { indianSuppliers } from '../data/mockData';
import { Supplier } from '../types/supply';

interface SuppliersViewProps {
  onSelectSupplier?: (supplier: Supplier) => void;
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({ onSelectSupplier }) => {
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [auditedSupplierId, setAuditedSupplierId] = useState<string | null>(null);

  const states = ['All', 'Tamil Nadu', 'Maharashtra', 'Gujarat', 'Karnataka', 'Telangana', 'Haryana', 'West Bengal'];
  const categories = ['All', 'Automotive & Precision Castings', 'EV Batteries & Motors', 'Heavy Chassis & Forgings', 'Semiconductors & Sensors', 'Embedded IoT & Power Controllers', 'Container Freight Port', 'High-Tensile Fasteners', 'Raw Metals & Castings'];

  const filtered = indianSuppliers.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.location.toLowerCase().includes(search.toLowerCase());
    const matchesState = selectedState === 'All' || s.state === selectedState;
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesState && matchesCategory;
  });

  return (
    <div className="space-y-4 max-w-[1440px] mx-auto pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#38bdf8]" />
            Indian Supplier Intelligence Network
          </h2>
          <p className="text-xs text-[#64748b]">1,284 Tier-1 and Tier-2 component manufacturing vendors across India.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vendor name or city..."
              className="bg-[#0b111c] border border-[#162030] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-[#2563eb]"
            />
          </div>

          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-[#0b111c] border border-[#162030] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#2563eb]"
          >
            {states.map(st => <option key={st} value={st}>{st === 'All' ? 'All States' : st}</option>)}
          </select>
        </div>
      </div>

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(s => (
          <div 
            key={s.id} 
            className="bg-[#0b111c] border border-[#162030] rounded-xl p-4 space-y-3 hover:border-[#2563eb] transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#38bdf8] font-bold">{s.id}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  s.status === 'Critical' ? 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/40' :
                  s.status === 'Warning' ? 'bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/40' :
                  'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/40'
                }`}>
                  {s.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white leading-tight">{s.name}</h3>
              <p className="text-xs text-[#94a3b8]">{s.location}</p>
              <p className="text-[11px] text-[#64748b] font-medium">{s.category}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#141d2b] text-center text-xs">
              <div>
                <span className="text-[9px] text-[#64748b] block">Capacity</span>
                <span className="font-bold text-white">{s.capacity}%</span>
              </div>
              <div>
                <span className="text-[9px] text-[#64748b] block">Lead Time</span>
                <span className="font-bold text-[#38bdf8]">{s.leadTimeDays} days</span>
              </div>
              <div>
                <span className="text-[9px] text-[#64748b] block">Annual Vol</span>
                <span className="font-bold text-[#22c55e]">{s.annualVolume}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#94a3b8] pt-1">
              <span>GSTIN: <strong className="font-mono text-[#cbd5e1]">{s.gstin}</strong></span>
              <button
                onClick={() => {
                  setAuditedSupplierId(s.id);
                  setTimeout(() => setAuditedSupplierId(null), 2500);
                }}
                className="px-2.5 py-1 rounded bg-[#131f32] text-[#38bdf8] hover:bg-[#1e60f2] hover:text-white transition-all font-semibold"
              >
                {auditedSupplierId === s.id ? '✓ Audit Syncing...' : 'Quick Audit'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
