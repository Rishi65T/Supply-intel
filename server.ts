import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { 
  indianSuppliers, 
  indianFactories, 
  indianShipments, 
  indianInventory, 
  indianDisruptions, 
  indianRecommendations 
} from './src/data/mockData.ts';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

// Initialize Gemini client if API key is present
const geminiApiKey = process.env.GEMINI_API_KEY || '';
const ai = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

// --- API ROUTES (Indianized) ---
app.get('/api/suppliers', (req, res) => {
  res.json(indianSuppliers);
});

app.get('/api/suppliers/:id', (req, res) => {
  const supplier = indianSuppliers.find(s => s.id === req.params.id);
  if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
  res.json(supplier);
});

app.get('/api/factories', (req, res) => {
  res.json(indianFactories);
});

app.get('/api/shipments', (req, res) => {
  res.json(indianShipments);
});

app.get('/api/shipments/:id', (req, res) => {
  const shipment = indianShipments.find(s => s.id === req.params.id);
  if (!shipment) return res.status(404).json({ error: 'Shipment not found' });
  res.json(shipment);
});

app.get('/api/inventory', (req, res) => {
  res.json(indianInventory);
});

app.get('/api/demand', (req, res) => {
  const sku = (req.query.sku as string) || 'SKU-IND-8291';
  const forecast = {
    sku,
    title: sku === 'SKU-IND-8291' ? 'Traction Inverter IGBT Power Module' : 'Automotive Component',
    horizons: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul (Pre-Festive)', 'Aug', 'Sep (Diwali Surge)', 'Oct', 'Nov', 'Dec'],
    actualDemand: [110, 115, 108, 122, 130, 125, 142, 158, 210, 195, 140, 130],
    predictedDemand: [112, 118, 115, 134, 148, 162, 180, 220, 265, 230, 160, 145],
    confidenceUpper: [120, 130, 128, 150, 170, 185, 210, 250, 290, 260, 180, 160],
    confidenceLower: [104, 106, 102, 118, 126, 139, 150, 190, 240, 200, 140, 130]
  };
  res.json(forecast);
});

app.get('/api/disruptions', (req, res) => {
  res.json(indianDisruptions);
});

app.get('/api/risk', (req, res) => {
  res.json({
    overallNetworkRisk: 32.0,
    corridorRisks: [
      { name: 'NH48 Mumbai-Pune Expressway', risk: 78, status: 'High Risk (Monsoon Ghats)' },
      { name: 'Western Dedicated Freight Corridor', risk: 14, status: 'Low Risk (Electric Rail)' },
      { name: 'Golden Quadrilateral Delhi-Kolkata', risk: 42, status: 'Moderate Risk' },
      { name: 'Chennai-Bengaluru Industrial Corridor', risk: 18, status: 'Low Risk' },
      { name: 'West Coast Coastal Maritime Lane', risk: 65, status: 'Elevated Sea Swell' }
    ],
    supplierRisk: 36.5,
    inventoryRisk: 28.0,
    regulatoryRisk: 12.5,
    trend: 'Declining (-3.8% with DFC rail shift)'
  });
});

app.get('/api/supply-network', (req, res) => {
  res.json({
    nodes: [...indianSuppliers, ...indianFactories],
    links: [
      { source: 'SUP-IND-106', target: 'FAC-IND-201', value: 85, status: 'critical', corridor: 'NH48' },
      { source: 'SUP-IND-183', target: 'FAC-IND-201', value: 40, status: 'critical', corridor: 'Western DFC' },
      { source: 'SUP-IND-101', target: 'FAC-IND-202', value: 92, status: 'healthy', corridor: 'Chennai Expressway' },
      { source: 'SUP-IND-104', target: 'FAC-IND-202', value: 65, status: 'healthy', corridor: 'Hosur Link' },
      { source: 'SUP-IND-105', target: 'FAC-IND-204', value: 55, status: 'healthy', corridor: 'Air Cargo' },
      { source: 'SUP-IND-107', target: 'FAC-IND-204', value: 78, status: 'healthy', corridor: 'Delhi-NCR Road' }
    ]
  });
});

app.post('/api/simulate', (req, res) => {
  const { supplierId, capacityReduction, demandSpike } = req.body;
  const reduction = capacityReduction !== undefined ? Number(capacityReduction) : 50;
  const spike = demandSpike !== undefined ? Number(demandSpike) : 20;

  const stockoutProb = Math.min(99.9, Math.round((89.5 * (100 - reduction) / 50 + spike * 0.4) * 10) / 10);
  const expectedDelayDays = Math.round((18 * (100 - reduction) / 100) * 10) / 10;
  const revenueExposureCr = (reduction * 0.08 + spike * 0.04).toFixed(2);
  const affectedSkusCount = Math.round(28 * (100 - reduction) / 50);

  res.json({
    simulationId: `SIM-IND-${Math.floor(Math.random() * 90000 + 10000)}`,
    supplierId: supplierId || 'SUP-IND-183',
    capacityReduction: reduction,
    demandSpike: spike,
    results: {
      stockoutProbability: `${stockoutProb}%`,
      expectedDelayDays: `${expectedDelayDays} days`,
      revenueExposure: `₹${revenueExposureCr} Cr`,
      affectedSkus: affectedSkusCount,
      networkRiskIndex: Math.min(98, Math.round(42 + (100 - reduction) * 0.4 + spike * 0.2)),
      propagationImpact: [
        { node: 'SUP-IND-183 (Sanand EV Powertrain, Gujarat)', status: 'Critical Capacity Contraction', capacity: `${reduction}% Output` },
        { node: 'FAC-IND-201 (Pune MegaFactory Alpha, Chakan)', status: 'Assembly Bottleneck (Line 2 & 3)', delay: `+${expectedDelayDays} days delay` },
        { node: 'Bhiwandi Central Logistics DC, Mumbai', status: 'Buffer Stock Depleted', risk: `${stockoutProb}% stockout risk` }
      ]
    },
    recommendation: {
      action: 'Divert 40% component procurement to Electronic City (SUP-IND-104) and activate Western DFC high-speed freight roll-on service.',
      confidence: '97.2%',
      estimatedSavings: `₹1.45 Cr cost mitigation`
    }
  });
});

app.get('/api/recommendations', (req, res) => {
  res.json(indianRecommendations);
});

app.get('/api/model-performance', (req, res) => {
  res.json([
    { modelName: 'XGBoost Indian Highway Transit Predictor (NH48/NH44)', version: 'v2.8.4', dataset: '420k FASTag + GPS legs', accuracy: '95.4%', f1Score: '0.931', rocAuc: '0.968', status: 'Production Active', lastTrained: '2026-10-01' },
    { modelName: 'LightGBM Festive Demand Forecaster (Diwali & Monsoon)', version: 'v2.1.0', dataset: '1.8M Indian SKU-day records', rmse: '3.84 units', mape: '5.8%', r2Score: '0.912', status: 'Production Active', lastTrained: '2026-09-30' },
    { modelName: 'Random Forest Vendor Risk & GST Compliance Classifier', version: 'v3.4.0', dataset: '1,284 Indian MSME/OEM profiles', precision: '93.2%', recall: '90.1%', status: 'Production Active', lastTrained: '2026-10-02' }
  ]);
});

// Gemini AI Chat / Intelligence endpoint with Indian Supply Chain knowledge
app.post('/api/ai/query', async (req, res) => {
  try {
    const { prompt, context } = req.body;
    if (!ai) {
      return res.json({
        response: `[SupplyIntel AI Control Tower - India Operations] For ${context?.id || 'Indian Logistics Network'}: Current NH48 Ghat section monsoon hold-ups and Sanand substation transformer maintenance indicate immediate vulnerability for Pune Chakan lines. Recommended immediate action: Switch 45% purchase allocation to Bengaluru Electronic City Hub (SUP-IND-104) and leverage Western DFC electric rail wagons to save ₹1.45 Cr in stockout damages.`
      });
    }

    const fullPrompt = `You are SUPPLYINTEL AI, an expert enterprise supply chain control tower director specialized in Indian Logistics, Manufacturing, Golden Quadrilateral, DFC Rail Corridors, GST e-Way bills, FASTag tracking, Monsoon supply disruption management, and vendor diversification across Chennai, Pune, Bengaluru, Gujarat, Mumbai, and Delhi NCR. Context: ${JSON.stringify(context || {})}. User query: ${prompt}. Give actionable, concise, data-driven Indian supply chain recommendations formatted clearly.`;
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt
    });
    res.json({ response: result.text || 'Analysis generated successfully.' });
  } catch (err: any) {
    console.error('Gemini API Error:', err);
    res.status(500).json({ error: err.message || 'AI generation failed' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' }
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`SupplyIntel India Server running on port ${PORT}`);
  });
}

startServer();
