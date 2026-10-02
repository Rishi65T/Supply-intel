import React, { useState } from 'react';
import { Sliders, Play, AlertTriangle, CheckCircle, ArrowRight, DollarSign, TrendingDown } from 'lucide-react';

export const ScenarioLab: React.FC = () => {
  const [supplierId, setSupplierId] = useState('SUP-IND-183');
  const [capacityReduction, setCapacityReduction] = useState(50);
  const [demandSpike, setDemandSpike] = useState(25);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supplierId, capacityReduction, demandSpike })
      });
      const data = await res.json();
      setSimulationResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-[1440px] mx-auto pb-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[#38bdf8]" />
          Indian Supply Chain Scenario Simulation Lab
        </h2>
        <p className="text-xs text-[#64748b]">Simulate vendor capacity shocks, highway monsoon blockages, and Diwali festive demand surges in real-time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Controls */}
        <div className="bg-[#0b111c] border border-[#162030] rounded-xl p-5 space-y-5">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Simulation Parameters
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-[#94a3b8] block mb-1">Target Indian Supplier Node</label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full bg-[#0e1726] border border-[#18263a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2563eb]"
              >
                <option value="SUP-IND-183">SUP-IND-183 (Sanand EV Powertrain, Gujarat)</option>
                <option value="SUP-IND-103">SUP-IND-103 (Chakan Forgings, Pune)</option>
                <option value="SUP-IND-101">SUP-IND-101 (Sriperumbudur Auto Hub, Chennai)</option>
                <option value="SUP-IND-104">SUP-IND-104 (Electronic City, Bengaluru)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#94a3b8]">Capacity Contraction</span>
                <span className="text-[#ef4444] font-bold">-{capacityReduction}% Output</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                value={capacityReduction}
                onChange={(e) => setCapacityReduction(Number(e.target.value))}
                className="w-full accent-[#ef4444]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#94a3b8]">Festive Demand Surge (Diwali/Q3)</span>
                <span className="text-[#22c55e] font-bold">+{demandSpike}% Surge</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={demandSpike}
                onChange={(e) => setDemandSpike(Number(e.target.value))}
                className="w-full accent-[#22c55e]"
              />
            </div>

            <button
              onClick={runSimulation}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#1e60f2] to-[#06b6d4] text-white font-bold text-xs hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#1e60f2]/20 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {loading ? 'Running ML Propagation Model...' : 'Run Shock Simulation'}
            </button>
          </div>
        </div>

        {/* Results Output */}
        <div className="lg:col-span-2 space-y-4">
          {simulationResult ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#0b111c] border border-[#162030] rounded-xl p-3.5">
                  <p className="text-[10px] text-[#64748b]">Stockout Probability</p>
                  <p className="text-xl font-bold text-[#ef4444] mt-1">{simulationResult.results.stockoutProbability}</p>
                </div>
                <div className="bg-[#0b111c] border border-[#162030] rounded-xl p-3.5">
                  <p className="text-[10px] text-[#64748b]">Expected Assembly Delay</p>
                  <p className="text-xl font-bold text-[#f59e0b] mt-1">{simulationResult.results.expectedDelayDays}</p>
                </div>
                <div className="bg-[#0b111c] border border-[#162030] rounded-xl p-3.5">
                  <p className="text-[10px] text-[#64748b]">Revenue Exposure</p>
                  <p className="text-xl font-bold text-white mt-1">{simulationResult.results.revenueExposure}</p>
                </div>
                <div className="bg-[#0b111c] border border-[#162030] rounded-xl p-3.5">
                  <p className="text-[10px] text-[#64748b]">Affected Indian SKUs</p>
                  <p className="text-xl font-bold text-[#38bdf8] mt-1">{simulationResult.results.affectedSkus} items</p>
                </div>
              </div>

              {/* Propagation Chain */}
              <div className="bg-[#0b111c] border border-[#162030] rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Disruption Propagation Corridor</h3>
                <div className="space-y-2">
                  {simulationResult.results.propagationImpact.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-[#0e1726] border border-[#18263a] p-3 rounded-xl">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-[#ef4444]/20 flex items-center justify-center">
                          <AlertTriangle className="w-3.5 h-3.5 text-[#ef4444]" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{item.node}</p>
                          <p className="text-[10px] text-[#94a3b8]">{item.status}</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-[#38bdf8] font-bold">{item.capacity || item.delay || item.risk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Recommendation */}
              <div className="bg-[#0b111c] border border-[#2563eb]/40 rounded-xl p-4 space-y-2">
                <p className="text-xs font-bold text-[#38bdf8]">AI Mitigation & Multi-Modal Routing</p>
                <p className="text-xs text-white leading-relaxed">{simulationResult.recommendation.action}</p>
                <div className="flex gap-4 pt-1 text-[11px] text-[#94a3b8]">
                  <span>Model Confidence: <strong className="text-[#22c55e]">{simulationResult.recommendation.confidence}</strong></span>
                  <span>Cost Mitigation: <strong className="text-[#38bdf8]">{simulationResult.recommendation.estimatedSavings}</strong></span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#0b111c] border border-[#162030] rounded-xl p-12 text-center flex flex-col items-center justify-center h-80">
              <Sliders className="w-10 h-10 text-[#38bdf8] mb-3 opacity-60" />
              <h3 className="text-sm font-bold text-white">Ready for Indian Supply Chain Simulation</h3>
              <p className="text-xs text-[#64748b] max-w-sm mt-1">Configure capacity drops or festival surges on the left and click Run Simulation to calculate impact.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
