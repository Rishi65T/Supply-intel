export interface Supplier {
  id: string;
  name: string;
  location: string;
  state: string;
  lat: number;
  lng: number;
  type: string;
  category: string;
  capacity: number;
  utilization: number;
  reliability: number;
  leadTimeDays: number;
  qualityScore: number;
  riskScore: number;
  status: 'Healthy' | 'Warning' | 'Critical';
  affectedSkus: number;
  activeShips: number;
  annualVolume: string;
  contactPerson: string;
  gstin: string;
}

export interface Factory {
  id: string;
  name: string;
  location: string;
  state: string;
  lat: number;
  lng: number;
  type: string;
  status: 'Optimal' | 'Degraded' | 'Maintenance';
  throughput: string;
  inventoryDays: number;
  risk: number;
  oee: string;
  activeLines: number;
  totalLines: number;
}

export interface Shipment {
  id: string;
  origin: string;
  destination: string;
  corridor: string;
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
  mode: 'Road Freight' | 'Rail DFC' | 'Coastal Maritime' | 'Air Cargo';
  carrier: string;
  shipDate: string;
  expectedDelivery: string;
  actualDelivery: string | null;
  status: 'In Transit' | 'At Risk' | 'On Time' | 'Delayed' | 'Delivered';
  riskScore: number;
  delayProbability: string;
  delayDays: number;
  reason: string;
  ewayBillNo: string;
  fastTagStatus: string;
  cargoValue: string;
}

export interface InventoryItem {
  sku: string;
  name: string;
  category: string;
  warehouse: string;
  state: string;
  currentStock: number;
  safetyStock: number;
  reorderPoint: number;
  dailyDemand: number;
  stockoutProbability: string;
  daysRemaining: number;
  status: 'Healthy' | 'Warning' | 'Critical';
  unitCost: string;
  totalValue: string;
}

export interface Disruption {
  id: string;
  title: string;
  severity: 'Critical' | 'Warning' | 'Info';
  entity: string;
  location: string;
  corridor: string;
  impact: string;
  status: string;
  timestamp: string;
  rootCause: string;
  recommendedAction: string;
}

export interface Recommendation {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  description: string;
  predictedImprovement: string;
  costImpact: string;
  roi: string;
  actionType: 'Reroute' | 'Alternate Vendor' | 'Expedite Freight' | 'Stock Buffer';
}
