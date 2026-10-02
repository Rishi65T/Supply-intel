import React, { useState } from 'react';
import { Settings, Save, CheckCircle } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [currency, setCurrency] = useState('INR (₹ Cr / Lakhs)');
  const [timezone, setTimezone] = useState('Asia/Kolkata (IST +5:30)');
  const [autoEwaySync, setAutoEwaySync] = useState(true);
  const [monsoonAlerts, setMonsoonAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4 max-w-[1440px] mx-auto pb-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#38bdf8]" />
          SupplyIntel Control Tower Settings
        </h2>
        <p className="text-xs text-[#64748b]">Configure Indian logistics regional formatting, e-Way bill sync, and alert thresholds.</p>
      </div>

      <div className="bg-[#0b111c] border border-[#162030] rounded-xl p-6 space-y-6 max-w-2xl">
        <div className="space-y-4 text-xs">
          <div>
            <label className="text-[#94a3b8] block mb-1.5 font-medium">Default Currency & Number Formatting</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-[#0e1726] border border-[#18263a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#2563eb]"
            >
              <option value="INR (₹ Cr / Lakhs)">INR (₹ Cr / Lakhs) - Indian Numbering System</option>
              <option value="USD ($ Millions)">USD ($ Millions)</option>
            </select>
          </div>

          <div>
            <label className="text-[#94a3b8] block mb-1.5 font-medium">Operations Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full bg-[#0e1726] border border-[#18263a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#2563eb]"
            >
              <option value="Asia/Kolkata (IST +5:30)">Asia/Kolkata (IST +5:30)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>

          <div className="pt-2 space-y-3">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={autoEwaySync}
                onChange={(e) => setAutoEwaySync(e.target.checked)}
                className="w-4 h-4 accent-[#2563eb] rounded"
              />
              <span className="text-white font-medium">Auto-reconcile GST e-Way bills with FASTag toll passings</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={monsoonAlerts}
                onChange={(e) => setMonsoonAlerts(e.target.checked)}
                className="w-4 h-4 accent-[#2563eb] rounded"
              />
              <span className="text-white font-medium">Enable IMD Real-Time Monsoon Weather & Ghat Landslide Alerts</span>
            </label>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-[#1e60f2] text-white text-xs font-bold hover:bg-[#184ebd] transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#1e60f2]/20"
        >
          <Save className="w-4 h-4" />
          {saved ? '✓ Settings Saved' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
};
