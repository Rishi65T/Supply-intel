import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { KPIGrid } from './components/KPIGrid';
import { GlobalGlobe3D } from './components/GlobalGlobe3D';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { ShipmentsTable } from './components/ShipmentsTable';
import { Warehouse3D } from './components/Warehouse3D';
import { SuppliersView } from './components/SuppliersView';
import { FactoriesView } from './components/FactoriesView';
import { InventoryView } from './components/InventoryView';
import { DemandForecastView } from './components/DemandForecastView';
import { RiskIntelligenceView } from './components/RiskIntelligenceView';
import { DisruptionsView } from './components/DisruptionsView';
import { ScenarioLab } from './components/ScenarioLab';
import { AnalyticsView } from './components/AnalyticsView';
import { ModelCenter } from './components/ModelCenter';
import { DataIngestionView } from './components/DataIngestionView';
import { SettingsView } from './components/SettingsView';
import { EntityDrawer } from './components/EntityDrawer';
import { AIAdvisorModal } from './components/AIAdvisorModal';
import { LoginPage } from './components/LoginPage';
import { Globe, Share2, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('supplyintel_user');
  });

  const [currentUser, setCurrentUser] = useState<any>(() => {
    const saved = localStorage.getItem('supplyintel_user');
    return saved ? JSON.parse(saved) : {
      username: 'commander',
      fullName: 'Rajiv Malhotra',
      role: 'Strategic Logistics Commander',
      department: 'National Supply Chain Directorate',
      email: 'commander@supplyintel.ai'
    };
  });

  const handleLogout = () => {
    localStorage.removeItem('supplyintel_user');
    localStorage.removeItem('supplyintel_token');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <LoginPage 
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthenticated(true);
        }}
        onBypass={() => {
          setIsAuthenticated(true);
        }}
      />
    );
  }

  return (
    <div className="flex h-screen bg-[#060910] text-[#F8FAFC] font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedEntity(null);
        }} 
        onOpenAI={() => setIsAiModalOpen(true)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#060910]">
        {/* Top Search & Profile Bar */}
        <Header 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          onOpenAI={() => setIsAiModalOpen(true)}
          activeTab={activeTab}
          onSelectEntity={(entity) => setSelectedEntity(entity)}
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenLogin={() => setIsAuthenticated(false)}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar">
          {activeTab === 'overview' && (
            <div className="space-y-4 max-w-[1440px] mx-auto pb-6">
              {/* Page Title & Holographic Globe Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
                    Supply Chain Intelligence
                  </h1>
                  <p className="text-xs text-[#5277aa] font-medium mt-0.5">
                    AI-Powered Supply Chain Control Tower (India Operations)
                  </p>
                </div>

                {/* Holographic globe badge in top right */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0b1322] border border-[#17253b] text-[#38bdf8]">
                  <Globe className="w-4 h-4 animate-spin-slow" />
                  <span className="text-[11px] font-mono text-[#94a3b8]">INDIA DIGITAL TWIN</span>
                  <button 
                    onClick={() => setIsAiModalOpen(true)}
                    className="cursor-pointer hover:text-white" 
                    title="Open AI Control Tower"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#64748b] ml-1" />
                  </button>
                </div>
              </div>

              {/* 5 KPI Cards Row */}
              <KPIGrid />

              {/* Central Large 3D Global Supply Visualization */}
              <div className="w-full h-[380px]">
                <GlobalGlobe3D onSelectNode={(node) => setSelectedEntity(node)} />
              </div>

              {/* Row of 4 Lower Analytics Cards */}
              <AnalyticsCharts />

              {/* Bottom Row: Active Shipments Table (60%) + 3D Warehouse View (40%) */}
              <div className="grid grid-cols-12 gap-3 min-h-[220px]">
                <div className="col-span-7">
                  <ShipmentsTable onSelectShipment={(s) => setSelectedEntity(s)} />
                </div>
                <div className="col-span-5">
                  <Warehouse3D />
                </div>
              </div>

              {/* Glowing Neon Footer Bar / Button */}
              <div className="pt-2 flex justify-center">
                <button
                  onClick={() => setIsAiModalOpen(true)}
                  className="px-12 py-2.5 rounded-full glow-footer-btn text-white text-xs font-bold tracking-widest uppercase transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-2xl flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#22d3ee]" />
                  Supply Chain Intelligence
                </button>
              </div>
            </div>
          )}

          {activeTab === 'network' && (
            <div className="h-[calc(100vh-100px)] flex flex-col space-y-3">
              <div>
                <h2 className="text-xl font-bold text-white">Supply Network Digital Twin (India Subcontinent)</h2>
                <p className="text-xs text-[#5277aa]">Interactive topological network map connecting Golden Quadrilateral, Western DFC, and Maritime corridors.</p>
              </div>
              <div className="flex-1 rounded-xl overflow-hidden border border-[#162030]">
                <GlobalGlobe3D onSelectNode={(node) => setSelectedEntity(node)} />
              </div>
            </div>
          )}

          {activeTab === 'suppliers' && <SuppliersView onSelectSupplier={(s) => setSelectedEntity(s)} />}
          {activeTab === 'factories' && <FactoriesView />}
          {activeTab === 'shipments' && (
            <div className="space-y-4 max-w-[1440px] mx-auto">
              <div>
                <h2 className="text-xl font-bold text-white">Active Freight Shipments Intelligence</h2>
                <p className="text-xs text-[#5277aa]">Live GPS & FASTag toll tracking across Indian highway and railway routes.</p>
              </div>
              <ShipmentsTable onSelectShipment={(s) => setSelectedEntity(s)} />
            </div>
          )}
          {activeTab === 'inventory' && <InventoryView />}
          {activeTab === 'demand' && <DemandForecastView />}
          {activeTab === 'risk' && <RiskIntelligenceView />}
          {activeTab === 'disruptions' && <DisruptionsView />}
          {activeTab === 'scenarios' && <ScenarioLab />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'models' && <ModelCenter />}
          {activeTab === 'data' && <DataIngestionView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Right Contextual Entity Drawer */}
      {selectedEntity && (
        <EntityDrawer 
          node={selectedEntity} 
          onClose={() => setSelectedEntity(null)} 
        />
      )}

      {/* Gemini AI Assistant Modal */}
      <AIAdvisorModal 
        isOpen={isAiModalOpen} 
        onClose={() => setIsAiModalOpen(false)} 
      />
    </div>
  );
}
