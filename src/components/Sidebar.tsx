import React from 'react';
import { 
  LayoutDashboard, 
  Globe, 
  Building2, 
  Factory, 
  Truck, 
  Package, 
  TrendingUp, 
  ShieldAlert, 
  AlertTriangle, 
  Sliders,
  BarChart3, 
  Cpu, 
  Database, 
  Settings,
  Box
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAI: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onOpenAI }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'network', label: 'Supply Network', icon: Globe },
    { id: 'suppliers', label: 'Suppliers', icon: Building2 },
    { id: 'factories', label: 'Factories', icon: Factory },
    { id: 'shipments', label: 'Shipments', icon: Truck },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'demand', label: 'Demand', icon: TrendingUp },
    { id: 'risk', label: 'Risk Intelligence', icon: ShieldAlert },
    { id: 'disruptions', label: 'Disruptions', icon: AlertTriangle },
    { id: 'scenarios', label: 'Scenario Lab', icon: Sliders },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'models', label: 'Models', icon: Cpu },
    { id: 'data', label: 'Data', icon: Database },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-56 bg-[#080c14] border-r border-[#151f2e] flex flex-col justify-between shrink-0 select-none h-screen py-4 z-10">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="px-5 mb-4 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#1e60f2] flex items-center justify-center shadow-[0_0_12px_rgba(30,96,242,0.6)]">
            <Box className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base tracking-tight text-white font-sans">
            SupplyIntel
          </span>
        </div>

        {/* Menu Navigation */}
        <nav className="px-3 space-y-0.5 overflow-y-auto custom-scrollbar flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'glow-blue-nav text-white font-semibold'
                    : 'text-[#7e8c9f] hover:text-[#e2e8f0] hover:bg-[#0e1624]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#64748b]'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
