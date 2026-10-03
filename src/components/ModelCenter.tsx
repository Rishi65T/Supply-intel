import React, { useEffect, useState } from 'react';
import { Cpu, RefreshCw, CheckCircle } from 'lucide-react';

export const ModelCenter: React.FC = () => {
  const [models, setModels] = useState<any[]>([]);
  const [retrainingModel, setRetrainingModel] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/model-performance')
      .then(res => res.json())
      .then(data => setModels(data))
      .catch(console.error);
  }, []);

  const handleRetrain = async (modelName: string) => {
    setRetrainingModel(modelName);
    try {
      await fetch('/api/retrain', { method: 'POST' });
      const res = await fetch('/api/model-performance');
      const data = await res.json();
      setModels(data);
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => {
        setRetrainingModel(null);
      }, 1500);
    }
  };

  return (
    <div className="space-y-4 max-w-[1440px] mx-auto pb-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#38bdf8]" />
          Indian Logistics MLOps Model Registry
        </h2>
        <p className="text-xs text-[#64748b]">Production models for Highway FASTag delay prediction, Festive demand forecasting, and Vendor GST compliance.</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {models.map((m, idx) => (
          <div key={idx} className="bg-[#0b111c] border border-[#162030] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#38bdf8] bg-[#0e1726] px-2.5 py-1 rounded-md border border-[#18263a]">{m.version}</span>
                <h3 className="text-sm font-bold text-white">{m.modelName}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981] font-bold">{m.status}</span>
              </div>
              <p className="text-xs text-[#94a3b8]">Trained on: {m.dataset} • Last Retrained: {m.lastTrained}</p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[10px] text-[#64748b]">Validation Accuracy / Metric</p>
                <p className="text-sm font-bold text-[#22c55e] font-mono">{m.accuracy || m.rmse || m.precision}</p>
              </div>
              <button
                onClick={() => handleRetrain(m.modelName)}
                disabled={retrainingModel === m.modelName}
                className="px-4 py-2 rounded-xl bg-[#152338] border border-[#18263a] text-xs font-semibold text-[#38bdf8] hover:bg-[#1e60f2] hover:text-white transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${retrainingModel === m.modelName ? 'animate-spin' : ''}`} />
                {retrainingModel === m.modelName ? 'Retraining Weights...' : 'Retrain Pipeline'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
