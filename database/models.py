"""
SQLAlchemy ORM models for SUPPLYINTEL.
Defines entities for enterprise supply chain operations, ML predictions, and audit logs.
"""
from datetime import datetime
from typing import Any
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, Text, JSON, ForeignKey
)
from sqlalchemy.orm import relationship
from database.connection import Base

class User(Base):
    __tablename__ = "users"

    id: Any = Column(String(64), primary_key=True, index=True)
    username: Any = Column(String(64), unique=True, index=True, nullable=False)
    email: Any = Column(String(128), unique=True, index=True, nullable=False)
    hashed_password: Any = Column(String(256), nullable=False)
    full_name: Any = Column(String(128), default="Supply Chain Officer")
    role: Any = Column(String(64), default="Logistics Commander") # e.g., Operations Director, Risk Analyst
    department: Any = Column(String(128), default="Strategic Supply Chain Operations")
    avatar: Any = Column(String(256), default="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80")
    is_active: Any = Column(Boolean, default=True)
    created_at: Any = Column(DateTime, default=datetime.utcnow)
    last_login: Any = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "fullName": self.full_name,
            "role": self.role,
            "department": self.department,
            "avatar": self.avatar,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "lastLogin": self.last_login.isoformat() if self.last_login else None
        }

class Supplier(Base):
    __tablename__ = "suppliers"

    id: Any = Column(String(64), primary_key=True, index=True)
    supplier_name: Any = Column(String(128), nullable=False)
    location: Any = Column(String(128), nullable=False)
    country: Any = Column(String(64), default="India")
    category: Any = Column(String(64), nullable=False)
    capacity: Any = Column(Integer, default=1000)
    capacity_utilization: Any = Column(Float, default=75.0)
    lead_time: Any = Column(Float, default=14.0) # Days
    lead_time_variability: Any = Column(Float, default=2.5) # Std dev in days
    historical_delay: Any = Column(Float, default=1.8) # Avg delay in days
    quality_score: Any = Column(Float, default=95.0) # Out of 100
    reliability: Any = Column(Float, default=92.0) # % on-time delivery
    cost: Any = Column(Float, default=100.0) # Relative cost index
    geographic_risk: Any = Column(Float, default=25.0) # Risk index 0-100
    disruption_history: Any = Column(Integer, default=1) # Count of events in 12 months
    shipment_volume: Any = Column(Integer, default=450)
    risk_score: Any = Column(Float, default=32.0) # Overall calculated risk 0-100
    tier: Any = Column(String(16), default="Tier 1")
    single_source: Any = Column(Boolean, default=False)
    created_at: Any = Column(DateTime, default=datetime.utcnow)
    updated_at: Any = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "supplier_id": self.id,
            "supplier_name": self.supplier_name,
            "name": self.supplier_name,
            "location": self.location,
            "country": self.country,
            "category": self.category,
            "capacity": self.capacity,
            "capacity_utilization": self.capacity_utilization,
            "lead_time": self.lead_time,
            "lead_time_variability": self.lead_time_variability,
            "historical_delay": self.historical_delay,
            "quality_score": self.quality_score,
            "reliability": self.reliability,
            "cost": self.cost,
            "geographic_risk": self.geographic_risk,
            "disruption_history": self.disruption_history,
            "shipment_volume": self.shipment_volume,
            "risk_score": self.risk_score,
            "tier": self.tier,
            "single_source": self.single_source
        }

class Factory(Base):
    __tablename__ = "factories"

    id: Any = Column(String(64), primary_key=True, index=True)
    name: Any = Column(String(128), nullable=False)
    location: Any = Column(String(128), nullable=False)
    lat: Any = Column(Float, nullable=False)
    lng: Any = Column(Float, nullable=False)
    capacity_units_per_day: Any = Column(Integer, default=5000)
    current_utilization: Any = Column(Float, default=82.0)
    status: Any = Column(String(32), default="Operational") # Operational, Bottleneck, Alert
    products_assembled: Any = Column(JSON, default=list)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "location": self.location,
            "lat": self.lat,
            "lng": self.lng,
            "capacity": self.capacity_units_per_day,
            "utilization": self.current_utilization,
            "status": self.status,
            "products": self.products_assembled
        }

class Warehouse(Base):
    __tablename__ = "warehouses"

    id: Any = Column(String(64), primary_key=True, index=True)
    name: Any = Column(String(128), nullable=False)
    location: Any = Column(String(128), nullable=False)
    lat: Any = Column(Float, nullable=False)
    lng: Any = Column(Float, nullable=False)
    capacity_pallets: Any = Column(Integer, default=15000)
    current_occupancy: Any = Column(Float, default=74.5)
    temperature_controlled: Any = Column(Boolean, default=False)
    status: Any = Column(String(32), default="Active")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "location": self.location,
            "lat": self.lat,
            "lng": self.lng,
            "capacity": self.capacity_pallets,
            "occupancy": self.current_occupancy,
            "status": self.status
        }

class Port(Base):
    __tablename__ = "ports"

    id: Any = Column(String(64), primary_key=True, index=True)
    name: Any = Column(String(128), nullable=False)
    location: Any = Column(String(128), nullable=False)
    port_type: Any = Column(String(32), default="Seaport") # Seaport, Inland Container Depot, Airport Cargo
    lat: Any = Column(Float, nullable=False)
    lng: Any = Column(Float, nullable=False)
    teu_throughput_yearly: Any = Column(Float, default=5.0) # Million TEUs
    congestion_level: Any = Column(Float, default=22.0) # % congestion
    status: Any = Column(String(32), default="Normal Flow")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "location": self.location,
            "port_type": self.port_type,
            "lat": self.lat,
            "lng": self.lng,
            "throughput": self.teu_throughput_yearly,
            "congestion": self.congestion_level,
            "status": self.status
        }

class Product(Base):
    __tablename__ = "products"

    id: Any = Column(String(64), primary_key=True, index=True)
    sku: Any = Column(String(64), unique=True, index=True, nullable=False)
    name: Any = Column(String(128), nullable=False)
    category: Any = Column(String(64), nullable=False)
    unit_cost: Any = Column(Float, default=250.0)
    unit_price: Any = Column(Float, default=450.0)
    target_safety_stock: Any = Column(Integer, default=500)
    current_stock: Any = Column(Integer, default=850)
    holding_cost_annual_pct: Any = Column(Float, default=18.0)

    def to_dict(self):
        return {
            "id": self.id,
            "sku": self.sku,
            "name": self.name,
            "category": self.category,
            "unit_cost": self.unit_cost,
            "unit_price": self.unit_price,
            "current_stock": self.current_stock,
            "safety_stock": self.target_safety_stock
        }

class Shipment(Base):
    __tablename__ = "shipments"

    id: Any = Column(String(64), primary_key=True, index=True)
    tracking_number: Any = Column(String(64), unique=True, index=True, nullable=False)
    supplier_id: Any = Column(String(64), nullable=False)
    origin: Any = Column(String(128), nullable=False)
    destination: Any = Column(String(128), nullable=False)
    transport_mode: Any = Column(String(32), default="Road (Heavy Haulage)") # Road, Rail (DFC), Maritime, Air
    carrier: Any = Column(String(128), default="CONCOR DFC Express")
    ship_date: Any = Column(DateTime, nullable=False)
    expected_delivery: Any = Column(DateTime, nullable=False)
    actual_delivery: Any = Column(DateTime, nullable=True) # Available only post-arrival!
    status: Any = Column(String(32), default="In Transit") # In Transit, Delayed, Delivered, Rerouted
    distance_km: Any = Column(Float, default=520.0)
    route: Any = Column(String(128), default="NH48 Western Corridor")
    delay_hours: Any = Column(Float, default=0.0)
    delay_reason: Any = Column(String(256), nullable=True)
    cost: Any = Column(Float, default=45000.0)
    product_name: Any = Column(String(128), default="IGBT Powertrain Sub-assembly")
    quantity: Any = Column(Integer, default=120)
    risk_score: Any = Column(Float, default=18.0) # ML predicted risk 0-100
    telemetry_lat: Any = Column(Float, nullable=True)
    telemetry_lng: Any = Column(Float, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "trackingNumber": self.tracking_number,
            "supplierId": self.supplier_id,
            "origin": self.origin,
            "destination": self.destination,
            "transportMode": self.transport_mode,
            "carrier": self.carrier,
            "shipDate": self.ship_date.isoformat() if self.ship_date else None,
            "expectedDelivery": self.expected_delivery.isoformat() if self.expected_delivery else None,
            "actualDelivery": self.actual_delivery.isoformat() if self.actual_delivery else None,
            "status": self.status,
            "distanceKm": self.distance_km,
            "route": self.route,
            "delayHours": self.delay_hours,
            "delayReason": self.delay_reason,
            "cost": self.cost,
            "product": self.product_name,
            "quantity": self.quantity,
            "riskScore": self.risk_score,
            "telemetry": {"lat": self.telemetry_lat, "lng": self.telemetry_lng} if self.telemetry_lat else None
        }

class Inventory(Base):
    __tablename__ = "inventory"

    id: Any = Column(String(64), primary_key=True, index=True)
    sku: Any = Column(String(64), index=True, nullable=False)
    item_name: Any = Column(String(128), nullable=False)
    warehouse_id: Any = Column(String(64), nullable=False)
    warehouse_name: Any = Column(String(128), nullable=False)
    current_stock: Any = Column(Integer, default=1200)
    forecast_demand_30d: Any = Column(Integer, default=950)
    safety_stock: Any = Column(Integer, default=400)
    reorder_point: Any = Column(Integer, default=650)
    days_of_inventory: Any = Column(Float, default=37.8)
    stockout_probability: Any = Column(Float, default=4.2) # %
    recommended_reorder_qty: Any = Column(Integer, default=500)
    status: Any = Column(String(32), default="Optimal") # Optimal, Low Stock, Critical, Surplus

    def to_dict(self):
        return {
            "id": self.id,
            "sku": self.sku,
            "itemName": self.item_name,
            "warehouseId": self.warehouse_id,
            "warehouseName": self.warehouse_name,
            "currentStock": self.current_stock,
            "forecastDemand30d": self.forecast_demand_30d,
            "safetyStock": self.safety_stock,
            "reorderPoint": self.reorder_point,
            "daysOfInventory": self.days_of_inventory,
            "stockoutProbability": self.stockout_probability,
            "recommendedReorderQty": self.recommended_reorder_qty,
            "status": self.status
        }

class DemandRecord(Base):
    __tablename__ = "demand_records"

    id: Any = Column(Integer, primary_key=True, autoincrement=True)
    sku: Any = Column(String(64), index=True, nullable=False)
    warehouse_id: Any = Column(String(64), index=True, nullable=False)
    region: Any = Column(String(64), nullable=False)
    record_date: Any = Column(DateTime, index=True, nullable=False)
    actual_quantity: Any = Column(Float, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "sku": self.sku,
            "warehouseId": self.warehouse_id,
            "region": self.region,
            "date": self.record_date.isoformat(),
            "quantity": self.actual_quantity
        }

class Disruption(Base):
    __tablename__ = "disruptions"

    id: Any = Column(String(64), primary_key=True, index=True)
    title: Any = Column(String(128), nullable=False)
    category: Any = Column(String(64), nullable=False) # Weather, Transport, Supplier, Regulatory
    severity: Any = Column(String(32), default="Medium") # Low, Medium, High, Critical
    corridor: Any = Column(String(128), nullable=False)
    affected_nodes: Any = Column(JSON, default=list)
    impact_days: Any = Column(Float, default=3.0)
    estimated_cost_cr: Any = Column(Float, default=1.2) # Crores INR
    status: Any = Column(String(32), default="Active") # Active, Mitigated, Monitoring
    created_at: Any = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "category": self.category,
            "severity": self.severity,
            "corridor": self.corridor,
            "affectedNodes": self.affected_nodes,
            "impactDays": self.impact_days,
            "estimatedCostCr": self.estimated_cost_cr,
            "status": self.status,
            "createdAt": self.created_at.isoformat() if self.created_at else None
        }

class Recommendation(Base):
    __tablename__ = "recommendations"

    id: Any = Column(String(64), primary_key=True, index=True)
    recommendation: Any = Column(Text, nullable=False)
    reason: Any = Column(Text, nullable=False)
    evidence: Any = Column(JSON, default=dict)
    expected_effect: Any = Column(Text, nullable=False)
    risk_before: Any = Column(Float, default=75.0)
    risk_after: Any = Column(Float, default=28.0)
    source_model: Any = Column(String(64), default="Graph-Disruption-Engine v2")
    status: Any = Column(String(32), default="Pending Review") # Pending Review, Approved, Executed, Dismissed
    created_at: Any = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "recommendation": self.recommendation,
            "reason": self.reason,
            "evidence": self.evidence,
            "expectedEffect": self.expected_effect,
            "riskBefore": self.risk_before,
            "riskAfter": self.risk_after,
            "sourceModel": self.source_model,
            "status": self.status,
            "createdAt": self.created_at.isoformat() if self.created_at else None
        }

class Scenario(Base):
    __tablename__ = "scenarios"

    id: Any = Column(String(64), primary_key=True, index=True)
    name: Any = Column(String(128), nullable=False)
    supplier_id: Any = Column(String(64), nullable=True)
    capacity_reduction: Any = Column(Float, default=50.0)
    demand_spike: Any = Column(Float, default=20.0)
    lead_time_increase: Any = Column(Float, default=7.0)
    results: Any = Column(JSON, default=dict)
    created_at: Any = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "supplierId": self.supplier_id,
            "capacityReduction": self.capacity_reduction,
            "demandSpike": self.demand_spike,
            "leadTimeIncrease": self.lead_time_increase,
            "results": self.results,
            "createdAt": self.created_at.isoformat() if self.created_at else None
        }

class ModelMetadata(Base):
    __tablename__ = "model_metadata"

    id: Any = Column(String(64), primary_key=True, index=True)
    model_name: Any = Column(String(128), nullable=False)
    version: Any = Column(String(32), default="v1.0.0")
    dataset: Any = Column(String(128), nullable=False)
    algorithm: Any = Column(String(64), default="XGBoost")
    metrics: Any = Column(JSON, default=dict)
    features: Any = Column(JSON, default=list)
    status: Any = Column(String(32), default="Production Active")
    last_trained: Any = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "modelName": self.model_name,
            "version": self.version,
            "dataset": self.dataset,
            "algorithm": self.algorithm,
            "metrics": self.metrics,
            "features": self.features,
            "status": self.status,
            "lastTrained": self.last_trained.isoformat() if self.last_trained else None
        }

class DataQualityReport(Base):
    __tablename__ = "data_quality_reports"

    id: Any = Column(String(64), primary_key=True, index=True)
    dataset_name: Any = Column(String(128), nullable=False)
    row_count: Any = Column(Integer, default=0)
    missing_values: Any = Column(Integer, default=0)
    duplicates: Any = Column(Integer, default=0)
    invalid_dates: Any = Column(Integer, default=0)
    invalid_coords: Any = Column(Integer, default=0)
    outliers: Any = Column(Integer, default=0)
    data_quality_pct: Any = Column(Float, default=99.2)
    freshness_status: Any = Column(String(32), default="LIVE")
    created_at: Any = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "datasetName": self.dataset_name,
            "rowCount": self.row_count,
            "missingValues": self.missing_values,
            "duplicates": self.duplicates,
            "invalidDates": self.invalid_dates,
            "invalidCoords": self.invalid_coords,
            "outliers": self.outliers,
            "dataQualityPct": self.data_quality_pct,
            "freshnessStatus": self.freshness_status,
            "createdAt": self.created_at.isoformat() if self.created_at else None
        }

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Any = Column(Integer, primary_key=True, autoincrement=True)
    action: Any = Column(String(64), nullable=False) # LOGIN, INSERT, RETRAIN, SIMULATION, RAG_QUERY
    entity_type: Any = Column(String(64), nullable=True)
    entity_id: Any = Column(String(64), nullable=True)
    user_id: Any = Column(String(64), default="system")
    details: Any = Column(JSON, default=dict)
    timestamp: Any = Column(DateTime, default=datetime.utcnow)
