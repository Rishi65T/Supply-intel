import React, { useState } from 'react';
import { X, ExternalLink, Truck, CheckCircle, Clock } from 'lucide-react';
import { indianShipments } from '../data/mockData';

interface ShipmentsTableProps {
  onSelectShipment?: (shipment: any) => void;
}

export const ShipmentsTable: React.FC<ShipmentsTableProps> = ({ onSelectShipment }) => {
  const [selectedShipment, setSelectedShipment] = useState<any | null>(null);

  const handleRowClick = (shipment: any) => {
    setSelectedShipment(shipment);
    if (onSelectShipment) {
      onSelectShipment(shipment);
    }
  };

  return (
    <div className="bg-[#0b111c] border border-[#162030] rounded-xl p-4 flex flex-col justify-between h-full relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#e2e8f0]">Active Transit Intelligence</span>
          <span className="text-[10px] text-[#38bdf8] font-mono bg-[#0f1d33] px-2 py-0.5 rounded border border-[#182a45]">
            3,482 Active GST e-Way Bills
          </span>
        </div>
        <div className="text-[10px] text-[#64748b]">Click row for FASTag telemetry</div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] text-[#64748b] font-medium border-b border-[#141d2b]">
              <th className="pb-2 font-normal">Shipment ID</th>
              <th className="pb-2 font-normal">Origin → Destination</th>
              <th className="pb-2 font-normal">Corridor</th>
              <th className="pb-2 font-normal">ETA</th>
              <th className="pb-2 font-normal">Risk</th>
              <th className="pb-2 font-normal">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#131b28] text-[11px]">
            {indianShipments.slice(0, 5).map((r, i) => (
              <tr 
                key={i} 
                onClick={() => handleRowClick(r)}
                className="hover:bg-[#0e1624] transition-colors cursor-pointer group"
              >
                <td className="py-2 font-mono text-[#38bdf8] font-medium group-hover:underline">{r.id}</td>
                <td className="py-2 text-[#94a3b8]">{r.origin.split(',')[0]} → {r.destination.split(',')[0]}</td>
                <td className="py-2 text-[10px] text-[#64748b]">{r.corridor}</td>
                <td className="py-2 text-[#cbd5e1]">{r.expectedDelivery.slice(5)}</td>
                <td className="py-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                    r.riskScore > 0.7 ? 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/40' :
                    r.riskScore > 0.4 ? 'bg-[#f97316]/20 text-[#f97316] border-[#f97316]/40' :
                    'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/40'
                  }`}>
                    {r.riskScore.toFixed(2)}
                  </span>
                </td>
                <td className="py-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                    r.status === 'Delayed' ? 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/40' :
                    r.status === 'At Risk' ? 'bg-[#f97316]/20 text-[#f97316] border-[#f97316]/40' :
                    'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/40'
                  }`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected Shipment Modal Details */}
      {selectedShipment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b1322] border border-[#1e2d42] rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#162438] pb-3">
              <div>
                <span className="text-xs font-mono text-[#38bdf8] font-bold">{selectedShipment.id}</span>
                <h3 className="text-sm font-bold text-white mt-0.5">{selectedShipment.origin} → {selectedShipment.destination}</h3>
              </div>
              <button 
                onClick={() => setSelectedShipment(null)}
                className="p-1.5 rounded-lg text-[#64748b] hover:text-white hover:bg-[#121c2e]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-[#0e1726] border border-[#18263a]">
                <span className="text-[10px] text-[#64748b]">Transport Mode</span>
                <p className="font-bold text-white mt-0.5">{selectedShipment.mode}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0e1726] border border-[#18263a]">
                <span className="text-[10px] text-[#64748b]">Cargo Valuation</span>
                <p className="font-bold text-[#22c55e] mt-0.5">{selectedShipment.cargoValue}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0e1726] border border-[#18263a]">
                <span className="text-[10px] text-[#64748b]">GST e-Way Bill No.</span>
                <p className="font-mono text-[#38bdf8] mt-0.5">{selectedShipment.ewayBillNo}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0e1726] border border-[#18263a]">
                <span className="text-[10px] text-[#64748b]">Logistics Carrier</span>
                <p className="font-bold text-white mt-0.5">{selectedShipment.carrier}</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#0e1726] border border-[#18263a] text-xs">
              <span className="text-[10px] text-[#64748b] block mb-1">FASTag / Telemetry Status</span>
              <p className="text-[#cbd5e1] font-medium">{selectedShipment.fastTagStatus}</p>
              <p className="text-[11px] text-[#f59e0b] mt-1">Operational note: {selectedShipment.reason}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => setSelectedShipment(null)}
                className="px-4 py-1.5 rounded-lg bg-[#1e60f2] text-white text-xs font-semibold hover:bg-[#184ebd]"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
