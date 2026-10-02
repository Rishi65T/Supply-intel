import React, { useState } from 'react';
import { Search, Bell, Settings, X, CheckCircle, AlertTriangle, ChevronRight, User } from 'lucide-react';
import { indianSuppliers, indianShipments, indianDisruptions } from '../data/mockData';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenAI: () => void;
  activeTab: string;
  onSelectEntity?: (entity: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery, onOpenAI, onSelectEntity }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Search filtering
  const filteredSuppliers = indianSuppliers.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredShipments = indianShipments.filter(s => 
    s.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasSearchResults = searchQuery.trim().length > 0;

  return (
    <header className="h-14 px-6 bg-[#060910] border-b border-[#131d2c] flex items-center justify-between shrink-0 relative z-30">
      {/* Search Input with Live Dropdown */}
      <div className="w-84 relative">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#55657e]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Indian suppliers, NH corridors, SKUs..."
            className="w-full bg-[#0d1420] border border-[#1a2638] rounded-full pl-9 pr-8 py-1.5 text-xs text-[#E2E8F0] placeholder-[#55657e] focus:outline-none focus:border-[#2563eb] transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#55657e] hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Live Search Results Popup */}
        {hasSearchResults && (
          <div className="absolute left-0 top-10 w-96 bg-[#0b1322] border border-[#1e2d42] rounded-xl p-3 shadow-2xl z-50 max-h-80 overflow-y-auto custom-scrollbar">
            <div className="text-[10px] uppercase font-bold text-[#64748b] mb-2 px-1">Search Results</div>
            {filteredSuppliers.length === 0 && filteredShipments.length === 0 ? (
              <p className="text-xs text-[#64748b] p-2">No matching Indian suppliers or shipments found.</p>
            ) : (
              <div className="space-y-2">
                {filteredSuppliers.map(s => (
                  <div
                    key={s.id}
                    onClick={() => {
                      if (onSelectEntity) onSelectEntity(s);
                      setSearchQuery('');
                    }}
                    className="p-2 rounded-lg bg-[#0e1726] hover:bg-[#142238] border border-[#162438] cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-white">{s.name}</p>
                      <p className="text-[10px] text-[#38bdf8]">{s.location} • {s.category}</p>
                    </div>
                    <span className="text-[9px] font-mono text-[#22c55e]">{s.annualVolume}</span>
                  </div>
                ))}
                {filteredShipments.map(sh => (
                  <div
                    key={sh.id}
                    onClick={() => {
                      if (onSelectEntity) onSelectEntity(sh);
                      setSearchQuery('');
                    }}
                    className="p-2 rounded-lg bg-[#0e1726] hover:bg-[#142238] border border-[#162438] cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-white">{sh.id}: {sh.origin} → {sh.destination}</p>
                      <p className="text-[10px] text-[#94a3b8]">{sh.corridor} • Status: {sh.status}</p>
                    </div>
                    <span className="text-[9px] font-mono text-[#f59e0b]">{sh.cargoValue}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Icons & User */}
      <div className="flex items-center gap-3">
        {/* Quick Indian Logistics Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0d1726] border border-[#1b2b40] text-[10px] text-[#38bdf8]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-ping"></span>
          <span>FASTag & Western DFC Live</span>
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowSettings(false);
              setShowUserMenu(false);
            }}
            className="relative p-1.5 text-[#8897ae] hover:text-white transition-colors cursor-pointer"
            title="Live Indian Supply Chain Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#ef4444] text-[9px] font-bold text-white flex items-center justify-center">
              3
            </span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-9 w-80 bg-[#0b1322] border border-[#1e2d42] rounded-xl p-3 shadow-2xl z-50">
              <div className="flex items-center justify-between pb-2 border-b border-[#162438] mb-2">
                <span className="text-xs font-bold text-white">Active Operational Alerts (3)</span>
                <span className="text-[10px] text-[#38bdf8] font-mono">IST (UTC+5:30)</span>
              </div>
              <div className="space-y-2">
                {indianDisruptions.slice(0, 3).map((d) => (
                  <div key={d.id} className="p-2.5 rounded-lg bg-[#0e1726] border border-[#18263a] text-left">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-[#ef4444] font-bold">{d.id}</span>
                      <span className="text-[9px] text-[#64748b]">{d.timestamp}</span>
                    </div>
                    <p className="text-xs font-bold text-white leading-tight">{d.title}</p>
                    <p className="text-[10px] text-[#94a3b8] mt-0.5">{d.impact}</p>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => {
                  setShowNotifications(false);
                  onOpenAI();
                }}
                className="w-full mt-2.5 py-1.5 rounded-lg bg-[#1e60f2] text-white text-xs font-semibold hover:bg-[#194ec7] transition-all"
              >
                Run AI Disruption Analysis
              </button>
            </div>
          )}
        </div>

        {/* Settings Icon */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowSettings(!showSettings);
              setShowNotifications(false);
              setShowUserMenu(false);
            }}
            className="p-1.5 text-[#8897ae] hover:text-white transition-colors cursor-pointer"
            title="Control Tower Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Settings Dropdown */}
          {showSettings && (
            <div className="absolute right-0 top-9 w-64 bg-[#0b1322] border border-[#1e2d42] rounded-xl p-3 shadow-2xl z-50 text-left">
              <div className="text-xs font-bold text-white mb-2">Regional Preferences</div>
              <div className="space-y-2 text-xs text-[#94a3b8]">
                <div className="flex justify-between items-center p-1.5 rounded bg-[#0e1726]">
                  <span>Currency Format</span>
                  <span className="text-[#38bdf8] font-bold">INR (₹ Cr / L)</span>
                </div>
                <div className="flex justify-between items-center p-1.5 rounded bg-[#0e1726]">
                  <span>Timezone</span>
                  <span className="text-[#38bdf8] font-bold">Asia/Kolkata</span>
                </div>
                <div className="flex justify-between items-center p-1.5 rounded bg-[#0e1726]">
                  <span>GST e-Way Bill Auto-Sync</span>
                  <span className="text-[#22c55e] font-bold">Active</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Indian User Profile */}
        <div className="relative">
          <div 
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
              setShowSettings(false);
            }}
            className="flex items-center gap-2.5 pl-2 cursor-pointer hover:opacity-90"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1e60f2] to-[#06b6d4] flex items-center justify-center font-bold text-white text-xs border border-[#2563eb]/50">
              RS
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-white leading-tight">Rishi Sathiyamoorthi</p>
              <p className="text-[10px] text-[#708098] leading-tight">Head of Supply Chain (India)</p>
            </div>
          </div>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 top-9 w-56 bg-[#0b1322] border border-[#1e2d42] rounded-xl p-2.5 shadow-2xl z-50 text-left">
              <div className="px-2 py-1.5 border-b border-[#162438] mb-1.5">
                <p className="text-xs font-bold text-white">Rishi Sathiyamoorthi</p>
                <p className="text-[10px] text-[#38bdf8]">rishisathiyamoorthi@gmail.com</p>
              </div>
              <div className="space-y-1 text-xs text-[#94a3b8]">
                <div className="p-1.5 rounded hover:bg-[#0e1726] text-[#e2e8f0] cursor-pointer">Operations Center: Mumbai HQ</div>
                <div className="p-1.5 rounded hover:bg-[#0e1726] text-[#e2e8f0] cursor-pointer">Plants: Pune, Chennai, Sanand</div>
                <div className="p-1.5 rounded hover:bg-[#0e1726] text-[#e2e8f0] cursor-pointer">Role: Executive Director</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
