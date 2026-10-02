import React, { useState } from 'react';
import { Database, RefreshCw, CheckCircle, Wifi, Cpu } from 'lucide-react';

export const DataIngestionView: React.FC = () => {
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const streams = [
    { id: 'STREAM-01', name: 'National Electronic Toll Collection (FASTag API)', protocol: 'REST / Webhook', status: 'Live Connected', eventsPerMin: '4,280 msgs/min', latency: '48 ms' },
    { id: 'STREAM-02', name: 'GST e-Way Bill Gateway (NIC India Portal)', protocol: 'SOAP / XML Pipeline', status: 'Live Connected', eventsPerMin: '1,890 msgs/min', latency: '112 ms' },
    { id: 'STREAM-03', name: 'Western DFC Railway Telemetry & GPS Stream', protocol: 'MQTT IoT Broker', status: 'Live Connected', eventsPerMin: '620 msgs/min', latency: '24 ms' },
    { id: 'STREAM-04', name: 'JNPT Port Container Terminal Operating System (TOS)', protocol: 'EDIFACT / EDI 315', status: 'Live Connected', eventsPerMin: '340 msgs/min', latency: '95 ms' },
    { id: 'STREAM-05', name: 'Enterprise SAP S/4HANA Supply Chain Connector', protocol: 'OData v4', status: 'Live Connected', eventsPerMin: '2,400 msgs/min', latency: '35 ms' }
  ];

  const handleSync = (id: string) => {
    setSyncingId(id);
    setTimeout(() => {
      setSyncingId(null);
    }, 1500);
  };

  return (
    <div className="space-y-4 max-w-[1440px] mx-auto pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-[#38bdf8]" />
            Indian Supply Chain Telemetry Ingestion Hub
          </h2>
          <p className="text-xs text-[#64748b]">Live data pipelines from FASTag toll plazas, NIC e-Way bills, DFC rail IoT, and SAP ERP.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {streams.map((s) => (
          <div key={s.id} className="bg-[#0b111c] border border-[#162030] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#38bdf8] font-bold">{s.id}</span>
                <span className="text-xs font-bold text-white">{s.name}</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
                  {s.status}
                </span>
              </div>
              <p className="text-xs text-[#94a3b8]">Protocol: {s.protocol} • Throughput: <strong className="text-white">{s.eventsPerMin}</strong> • Latency: <strong className="text-[#38bdf8]">{s.latency}</strong></p>
            </div>

            <button
              onClick={() => handleSync(s.id)}
              disabled={syncingId === s.id}
              className="px-4 py-2 rounded-xl bg-[#152338] text-xs font-semibold text-[#38bdf8] hover:bg-[#1e60f2] hover:text-white transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncingId === s.id ? 'animate-spin' : ''}`} />
              {syncingId === s.id ? 'Syncing Pipeline...' : 'Manual Sync'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
