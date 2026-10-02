import React, { useState } from 'react';
import { Package, Plus, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { indianInventory } from '../data/mockData';

export const InventoryView: React.FC = () => {
  const [inventoryList, setInventoryList] = useState(indianInventory);
  const [replenishedSku, setReplenishedSku] = useState<string | null>(null);

  const handleReplenish = (sku: string) => {
    setReplenishedSku(sku);
    setTimeout(() => {
      setInventoryList(prev => prev.map(item => {
        if (item.sku === sku) {
          return {
            ...item,
            currentStock: item.currentStock + 500,
            status: 'Healthy',
            stockoutProbability: '2.1%',
            daysRemaining: item.daysRemaining + 15
          };
        }
        return item;
      }));
      setReplenishedSku(null);
    }, 1200);
  };

  return (
    <div className="space-y-4 max-w-[1440px] mx-auto pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-[#38bdf8]" />
            Indian DC & Plant Inventory Intelligence
          </h2>
          <p className="text-xs text-[#64748b]">Multi-echelon stock levels, safety buffer, and stockout probability across Bhiwandi, Bengaluru & Chennai.</p>
        </div>
      </div>

      <div className="bg-[#0b111c] border border-[#162030] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] text-[#64748b] font-medium border-b border-[#141d2b] bg-[#0e1624]/60">
                <th className="py-3 px-4">SKU / Item Name</th>
                <th className="py-3 px-4">Warehouse Location</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Reorder Point</th>
                <th className="py-3 px-4">Stockout Risk</th>
                <th className="py-3 px-4">Total Value</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#131b28] text-xs">
              {inventoryList.map((item) => (
                <tr key={item.sku} className="hover:bg-[#0e1624] transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono text-[#38bdf8] font-bold block">{item.sku}</span>
                    <span className="text-white font-medium">{item.name}</span>
                    <span className="text-[10px] text-[#64748b] block">{item.category}</span>
                  </td>
                  <td className="py-3 px-4 text-[#94a3b8]">
                    {item.warehouse}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-white font-bold">{item.currentStock.toLocaleString('en-IN')} units</span>
                    <span className="text-[10px] text-[#64748b] block">Days supply: {item.daysRemaining}d</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[#cbd5e1]">
                    {item.reorderPoint.toLocaleString('en-IN')} units
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                      item.status === 'Critical' ? 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/40' :
                      item.status === 'Warning' ? 'bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/40' :
                      'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/40'
                    }`}>
                      {item.stockoutProbability}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-[#22c55e]">
                    {item.totalValue}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleReplenish(item.sku)}
                      disabled={replenishedSku === item.sku}
                      className="px-3 py-1.5 rounded-lg bg-[#152338] text-[#38bdf8] hover:bg-[#1e60f2] hover:text-white transition-all text-xs font-semibold disabled:opacity-50"
                    >
                      {replenishedSku === item.sku ? 'PO Generating...' : 'Replenish Stock'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
