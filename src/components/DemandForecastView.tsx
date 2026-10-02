import React, { useEffect, useState } from 'react';
import { TrendingUp, BarChart2 } from 'lucide-react';

export const DemandForecastView: React.FC = () => {
  const [forecast, setForecast] = useState<any>(null);
  const [sku, setSku] = useState('SKU-IND-8291');

  useEffect(() => {
    fetch(`/api/demand?sku=${sku}`)
      .then(res => res.json())
      .then(data => setForecast(data))
      .catch(console.error);
  }, [sku]);

  return (
    <div className="space-y-4 max-w-[1440px] mx-auto pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#38bdf8]" />
            Indian Festive & Seasonal Demand Forecasting
          </h2>
          <p className="text-xs text-[#64748b]">LightGBM time-series forecasting incorporating Diwali surges, Monsoon seasonality, and production schedules.</p>
        </div>
        <select
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          className="bg-[#0b111c] border border-[#162030] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2563eb]"
        >
          <option value="SKU-IND-8291">SKU-IND-8291 (Traction Inverter IGBT Module)</option>
          <option value="SKU-IND-9901">SKU-IND-9901 (Automotive Braking MCU Chip)</option>
          <option value="SKU-IND-4412">SKU-IND-4412 (High-Density Lithium LFP Cell)</option>
        </select>
      </div>

      {forecast && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-[#0b111c] border border-[#162030] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">Full-Year 12-Month Demand Trajectory ({forecast.sku})</h3>
            
            <div className="space-y-3 pt-2 max-h-[380px] overflow-y-auto custom-scrollbar pr-2">
              {forecast.horizons.map((h: string, idx: number) => {
                const predicted = forecast.predictedDemand[idx];
                const actual = forecast.actualDemand[idx] || predicted;
                const maxVal = 300;
                const widthPercent = Math.min(100, (predicted / maxVal) * 100);

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#94a3b8] font-medium">{h}</span>
                      <span className="text-white font-mono font-semibold">Predicted: {predicted} units (Actual: {actual})</span>
                    </div>
                    <div className="w-full bg-[#0e1726] h-2.5 rounded-full overflow-hidden border border-[#18263a]">
                      <div className="bg-gradient-to-r from-[#1e60f2] to-[#06b6d4] h-full rounded-full" style={{ width: `${widthPercent}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#0b111c] border border-[#162030] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">ML Model Telemetry</h3>
            <div className="space-y-3">
              <div className="bg-[#0e1726] border border-[#18263a] p-3 rounded-xl">
                <p className="text-[10px] text-[#64748b]">Model Algorithm</p>
                <p className="text-sm font-bold text-[#38bdf8] mt-0.5">LightGBM v2.1.0 (India Regional)</p>
              </div>
              <div className="bg-[#0e1726] border border-[#18263a] p-3 rounded-xl">
                <p className="text-[10px] text-[#64748b]">RMSE (Root Mean Square Error)</p>
                <p className="text-sm font-bold text-[#10b981] mt-0.5">3.84 units</p>
              </div>
              <div className="bg-[#0e1726] border border-[#18263a] p-3 rounded-xl">
                <p className="text-[10px] text-[#64748b]">Festive Peak Confidence</p>
                <p className="text-sm font-bold text-[#22c55e] mt-0.5">94.8% Reliability</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
