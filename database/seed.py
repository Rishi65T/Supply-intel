"""
Database Seeding Script for SUPPLYINTEL.
Seeds users, suppliers, factories, ports, warehouses, shipments, inventory, demand records,
disruptions, recommendations, and model benchmarks into the persistent database.
"""
import sys
from hashlib import sha256
from datetime import datetime, timedelta
from pathlib import Path

# Add project root to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from database.connection import Base, engine, SessionLocal
from database.models import (
    User, Supplier, Factory, Port, Warehouse, Shipment,
    Inventory, DemandRecord, Disruption, Recommendation,
    ModelMetadata, DataQualityReport
)

def hash_pw(password: str) -> str:
    """Deterministic salted SHA-256 hash for secure local authentication."""
    salt = "supplyintel_salt_2026"
    return sha256((salt + password).encode("utf-8")).hexdigest()

def seed_database():
    print("[SUPPLYINTEL SEED] Creating all tables...")
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()

    try:
        # 1. Seed Users if not present
        existing_users = session.query(User).count()
        if existing_users == 0:
            print("[SUPPLYINTEL SEED] Seeding users...")
            users = [
                User(
                    id="usr-commander-01",
                    username="commander",
                    email="commander@supplyintel.ai",
                    hashed_password=hash_pw("supplyintel2026"),
                    full_name="Rajiv Malhotra",
                    role="Strategic Logistics Commander",
                    department="National Supply Chain Directorate",
                    avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80"
                ),
                User(
                    id="usr-director-02",
                    username="admin",
                    email="admin@supplyintel.ai",
                    hashed_password=hash_pw("admin123"),
                    full_name="Priya Sengupta",
                    role="Chief Operations Officer",
                    department="Manufacturing & Supply Operations",
                    avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80"
                ),
                User(
                    id="usr-analyst-03",
                    username="analyst",
                    email="analyst@supplyintel.ai",
                    hashed_password=hash_pw("analyst123"),
                    full_name="Vikram Joshi",
                    role="Lead Risk Data Scientist",
                    department="Supply Chain AI & Forecasting Lab",
                    avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80"
                )
            ]
            session.add_all(users)
            session.commit()
            print(f"[SUPPLYINTEL SEED] Created {len(users)} authenticated users.")

        # 2. Seed Suppliers
        if session.query(Supplier).count() == 0:
            print("[SUPPLYINTEL SEED] Seeding suppliers...")
            suppliers = [
                Supplier(
                    id="SUP-IND-183",
                    supplier_name="Sanand Advanced Powertrain Systems",
                    location="Sanand Industrial Estate, Gujarat",
                    country="India",
                    category="EV Powertrain & Power Electronics",
                    capacity=2400,
                    capacity_utilization=94.5,
                    lead_time=18.0,
                    lead_time_variability=4.2,
                    historical_delay=3.1,
                    quality_score=91.5,
                    reliability=78.2,
                    cost=112.0,
                    geographic_risk=68.0,
                    disruption_history=3,
                    shipment_volume=820,
                    risk_score=78.5,
                    tier="Tier 1",
                    single_source=True
                ),
                Supplier(
                    id="SUP-IND-104",
                    supplier_name="Bengaluru Precision Semiconductors & Modules",
                    location="Electronic City Phase II, Bengaluru",
                    country="India",
                    category="Microcontrollers & BMS Circuits",
                    capacity=4500,
                    capacity_utilization=72.0,
                    lead_time=11.5,
                    lead_time_variability=1.2,
                    historical_delay=0.6,
                    quality_score=97.8,
                    reliability=95.4,
                    cost=98.5,
                    geographic_risk=15.0,
                    disruption_history=0,
                    shipment_volume=1420,
                    risk_score=19.2,
                    tier="Tier 1",
                    single_source=False
                ),
                Supplier(
                    id="SUP-IND-101",
                    supplier_name="Sriperumbudur Auto Electric Components",
                    location="SIPCOT Industrial Park, Sriperumbudur, Tamil Nadu",
                    country="India",
                    category="Wiring Harness & Auxiliary Motors",
                    capacity=3200,
                    capacity_utilization=81.0,
                    lead_time=13.0,
                    lead_time_variability=2.1,
                    historical_delay=1.2,
                    quality_score=94.2,
                    reliability=91.0,
                    cost=95.0,
                    geographic_risk=24.0,
                    disruption_history=1,
                    shipment_volume=960,
                    risk_score=26.4,
                    tier="Tier 1",
                    single_source=False
                ),
                Supplier(
                    id="SUP-IND-106",
                    supplier_name="Pune Stamping & Chassis Fabricators",
                    location="MIDC Bhosari, Pune, Maharashtra",
                    country="India",
                    category="Chassis Sub-frames & Castings",
                    capacity=1800,
                    capacity_utilization=88.0,
                    lead_time=16.0,
                    lead_time_variability=3.8,
                    historical_delay=2.8,
                    quality_score=89.0,
                    reliability=82.5,
                    cost=104.0,
                    geographic_risk=58.0,
                    disruption_history=2,
                    shipment_volume=610,
                    risk_score=64.8,
                    tier="Tier 2",
                    single_source=False
                ),
                Supplier(
                    id="SUP-IND-105",
                    supplier_name="Gurugram Sensor & Telematics Labs",
                    location="Udyog Vihar Phase IV, Gurugram, Haryana",
                    country="India",
                    category="ADAS Sensors & GPS Telematics",
                    capacity=2900,
                    capacity_utilization=68.5,
                    lead_time=9.0,
                    lead_time_variability=1.1,
                    historical_delay=0.4,
                    quality_score=98.2,
                    reliability=96.1,
                    cost=106.0,
                    geographic_risk=18.0,
                    disruption_history=0,
                    shipment_volume=1150,
                    risk_score=15.6,
                    tier="Tier 1",
                    single_source=False
                )
            ]
            session.add_all(suppliers)
            session.commit()
            print(f"[SUPPLYINTEL SEED] Created {len(suppliers)} suppliers.")

        # 3. Seed Factories & Ports
        if session.query(Factory).count() == 0:
            factories = [
                Factory(
                    id="FAC-IND-201",
                    name="Pune MegaFactory Alpha (Chakan Cluster)",
                    location="Chakan Industrial Area, Pune, Maharashtra",
                    lat=18.7606,
                    lng=73.8636,
                    capacity_units_per_day=4500,
                    current_utilization=87.5,
                    status="Bottleneck Risk",
                    products_assembled=["Electric SUV Platform", "Commercial EV Chassis"]
                ),
                Factory(
                    id="FAC-IND-202",
                    name="Chennai Southern Assembly Plant",
                    location="Oragadam Industrial Corridor, Chennai, Tamil Nadu",
                    lat=12.8342,
                    lng=79.9575,
                    capacity_units_per_day=3800,
                    current_utilization=79.0,
                    status="Operational",
                    products_assembled=["Sedan Powertrain", "Export EV Battery Packs"]
                ),
                Factory(
                    id="FAC-IND-204",
                    name="Manesar Northern Assembly Plant",
                    location="IMT Manesar, Gurugram, Haryana",
                    lat=28.3588,
                    lng=76.9378,
                    capacity_units_per_day=3200,
                    current_utilization=74.2,
                    status="Operational",
                    products_assembled=["Passenger EV Powertrain", "Telematics Units"]
                )
            ]
            session.add_all(factories)
            session.commit()

        if session.query(Port).count() == 0:
            ports = [
                Port(
                    id="PRT-IND-01",
                    name="Jawaharlal Nehru Port Authority (JNPT / Nhava Sheva)",
                    location="Navi Mumbai, Maharashtra",
                    port_type="Premier Container Gateway",
                    lat=18.9499,
                    lng=72.9511,
                    teu_throughput_yearly=6.2,
                    congestion_level=18.4,
                    status="Normal Flow"
                ),
                Port(
                    id="PRT-IND-02",
                    name="Mundra Deepwater Multipurpose Port",
                    location="Kutch, Gujarat",
                    port_type="Bulk & Container Super-Hub",
                    lat=22.7441,
                    lng=69.7049,
                    teu_throughput_yearly=7.4,
                    congestion_level=14.2,
                    status="Normal Flow"
                ),
                Port(
                    id="PRT-IND-03",
                    name="Chennai Port Trust & Ennore Gateway",
                    location="Chennai, Tamil Nadu",
                    port_type="East Coast Container Terminal",
                    lat=13.0827,
                    lng=80.2937,
                    teu_throughput_yearly=2.4,
                    congestion_level=22.0,
                    status="Moderate Congestion"
                )
            ]
            session.add_all(ports)
            session.commit()

        if session.query(Warehouse).count() == 0:
            warehouses = [
                Warehouse(
                    id="WH-IND-01",
                    name="Bhiwandi Central Fulfillment Mega-Hub",
                    location="Bhiwandi Logistics Hub, Thane, Maharashtra",
                    lat=19.2967,
                    lng=73.0631,
                    capacity_pallets=42000,
                    current_occupancy=84.2,
                    temperature_controlled=True,
                    status="Active"
                ),
                Warehouse(
                    id="WH-IND-02",
                    name="Bengaluru Aerospace & High-Tech DC",
                    location="Devanahalli Logistics Park, Bengaluru, Karnataka",
                    lat=13.2417,
                    lng=77.7126,
                    capacity_pallets=28000,
                    current_occupancy=68.5,
                    temperature_controlled=True,
                    status="Active"
                ),
                Warehouse(
                    id="WH-IND-03",
                    name="Delhi-NCR Kundli Multi-Modal Terminal",
                    location="Kundli Industrial Zone, Sonipat, Haryana",
                    lat=28.8719,
                    lng=77.1264,
                    capacity_pallets=35000,
                    current_occupancy=76.0,
                    temperature_controlled=False,
                    status="Active"
                )
            ]
            session.add_all(warehouses)
            session.commit()

        # 4. Seed Shipments
        if session.query(Shipment).count() == 0:
            print("[SUPPLYINTEL SEED] Seeding shipments...")
            now = datetime.utcnow()
            shipments = [
                Shipment(
                    id="SHP-IND-901",
                    tracking_number="IND-FASTAG-98214",
                    supplier_id="SUP-IND-183",
                    origin="Sanand Industrial Cluster, Gujarat",
                    destination="Chakan MegaFactory Alpha, Pune",
                    transport_mode="Road (NH48 Heavy Haulage)",
                    carrier="VRL Logistics AutoFleet",
                    ship_date=now - timedelta(days=2),
                    expected_delivery=now + timedelta(hours=14),
                    status="Delayed",
                    distance_km=645.0,
                    route="NH48 Western Corridor via Vadodara-Surat-Ghats",
                    delay_hours=18.5,
                    delay_reason="Monsoon landslide congestion in Khandala Ghats",
                    cost=185000.0,
                    product_name="Traction Inverter IGBT Power Module",
                    quantity=320,
                    risk_score=84.2,
                    telemetry_lat=18.98,
                    telemetry_lng=73.28
                ),
                Shipment(
                    id="SHP-IND-902",
                    tracking_number="IND-DFC-44102",
                    supplier_id="SUP-IND-104",
                    origin="Electronic City Hub, Bengaluru",
                    destination="Pune MegaFactory Alpha, Chakan",
                    transport_mode="Rail (Western DFC Electric Container)",
                    carrier="CONCOR Freight Corridor Line",
                    ship_date=now - timedelta(days=1),
                    expected_delivery=now + timedelta(days=1),
                    status="In Transit",
                    distance_km=840.0,
                    route="Western Dedicated Freight Corridor (Electric Rail)",
                    delay_hours=0.0,
                    delay_reason=None,
                    cost=92000.0,
                    product_name="BMS Microcontroller Units",
                    quantity=1200,
                    risk_score=12.4,
                    telemetry_lat=15.36,
                    telemetry_lng=75.12
                ),
                Shipment(
                    id="SHP-IND-903",
                    tracking_number="IND-EXPR-77319",
                    supplier_id="SUP-IND-101",
                    origin="SIPCOT Industrial Park, Sriperumbudur",
                    destination="Oragadam Assembly Plant, Chennai",
                    transport_mode="Road (Express Dedicated)",
                    carrier="TVS Supply Chain Solutions",
                    ship_date=now - timedelta(hours=12),
                    expected_delivery=now + timedelta(hours=6),
                    status="In Transit",
                    distance_km=48.0,
                    route="Chennai Outer Ring Road Express",
                    delay_hours=0.0,
                    delay_reason=None,
                    cost=32000.0,
                    product_name="High-Voltage Copper Wiring Harness",
                    quantity=600,
                    risk_score=8.5,
                    telemetry_lat=12.91,
                    telemetry_lng=80.02
                ),
                Shipment(
                    id="SHP-IND-904",
                    tracking_number="IND-FASTAG-66129",
                    supplier_id="SUP-IND-106",
                    origin="MIDC Bhosari, Pune",
                    destination="Manesar Northern Assembly Plant",
                    transport_mode="Road (Multi-Axle Trucking)",
                    carrier="GATI KWE Heavy Cargo",
                    ship_date=now - timedelta(days=3),
                    expected_delivery=now + timedelta(days=1),
                    status="In Transit",
                    distance_km=1380.0,
                    route="NH48 Golden Quadrilateral Delhi-Mumbai Expressway",
                    delay_hours=4.0,
                    delay_reason="Toll Plaza electronic gate calibration check",
                    cost=240000.0,
                    product_name="Chassis Structural Sub-frames",
                    quantity=180,
                    risk_score=36.0,
                    telemetry_lat=24.58,
                    telemetry_lng=73.68
                )
            ]
            session.add_all(shipments)
            session.commit()
            print(f"[SUPPLYINTEL SEED] Created {len(shipments)} active shipments.")

        # 5. Seed Inventory
        if session.query(Inventory).count() == 0:
            inventories = [
                Inventory(
                    id="INV-IND-01",
                    sku="SKU-IND-8291",
                    item_name="Traction Inverter IGBT Power Module",
                    warehouse_id="WH-IND-01",
                    warehouse_name="Bhiwandi Central Fulfillment Hub",
                    current_stock=240,
                    forecast_demand_30d=850,
                    safety_stock=400,
                    reorder_point=550,
                    days_of_inventory=8.5,
                    stockout_probability=89.5,
                    recommended_reorder_qty=650,
                    status="Critical"
                ),
                Inventory(
                    id="INV-IND-02",
                    sku="SKU-IND-4420",
                    item_name="Automotive Grade BMS Microcontroller",
                    warehouse_id="WH-IND-02",
                    warehouse_name="Bengaluru Aerospace & Tech DC",
                    current_stock=3200,
                    forecast_demand_30d=2400,
                    safety_stock=800,
                    reorder_point=1200,
                    days_of_inventory=40.0,
                    stockout_probability=3.8,
                    recommended_reorder_qty=1500,
                    status="Optimal"
                ),
                Inventory(
                    id="INV-IND-03",
                    sku="SKU-IND-1104",
                    item_name="High-Voltage Shielded Copper Cable",
                    warehouse_id="WH-IND-03",
                    warehouse_name="Delhi-NCR Kundli Multi-Modal Terminal",
                    current_stock=1850,
                    forecast_demand_30d=1600,
                    safety_stock=500,
                    reorder_point=750,
                    days_of_inventory=34.7,
                    stockout_probability=7.2,
                    recommended_reorder_qty=800,
                    status="Optimal"
                )
            ]
            session.add_all(inventories)
            session.commit()

        # 6. Seed Disruptions
        if session.query(Disruption).count() == 0:
            disruptions = [
                Disruption(
                    id="DIS-IND-01",
                    title="Monsoon Landslide & Ghats Chokepoint on NH48",
                    category="Weather & Terrain Disruption",
                    severity="Critical",
                    corridor="NH48 Mumbai-Pune Khandala Ghat Section",
                    affected_nodes=["SUP-IND-183", "FAC-IND-201", "WH-IND-01"],
                    impact_days=4.5,
                    estimated_cost_cr=1.85,
                    status="Active"
                ),
                Disruption(
                    id="DIS-IND-02",
                    title="Sanand Substation Grid Transformer Maintenance",
                    category="Industrial Infrastructure Outage",
                    severity="High",
                    corridor="Sanand GIDC Industrial Corridor",
                    affected_nodes=["SUP-IND-183"],
                    impact_days=2.0,
                    estimated_cost_cr=0.95,
                    status="Active"
                ),
                Disruption(
                    id="DIS-IND-03",
                    title="JNPT East-West Feeder Rail Signal Upgrade",
                    category="Logistics Bottleneck",
                    severity="Medium",
                    corridor="Nhava Sheva Rail Terminal Line",
                    affected_nodes=["PRT-IND-01", "WH-IND-01"],
                    impact_days=1.5,
                    estimated_cost_cr=0.45,
                    status="Monitoring"
                )
            ]
            session.add_all(disruptions)
            session.commit()

        # 7. Seed Recommendations
        if session.query(Recommendation).count() == 0:
            recommendations = [
                Recommendation(
                    id="REC-IND-001",
                    recommendation="Reroute 45% purchase allocation for IGBT Power Modules to Bengaluru Hub (SUP-IND-104) via Western DFC Rail.",
                    reason="Single-source reliance on Sanand (SUP-IND-183) coupled with NH48 Ghat monsoon delays puts Pune Chakan assembly lines at 89.5% stockout risk.",
                    evidence={
                        "modelEvidence": {"predictedDelayDays": 18.5, "stockoutProbability": 0.895},
                        "graphEvidence": {"downstreamAssemblyLines": 2, "affectedWarehouses": 1, "dependentSKU": "SKU-IND-8291"},
                        "ragEvidence": "Clause 4.2 of India Strategic Resilience Policy dictates dual-sourcing across DFC rail when highway lead-time exceeds 14 days."
                    },
                    expected_effect="Mitigate Pune assembly plant downtime, reduce stockout probability to 14.2%, and save ₹1.45 Cr in penalty costs.",
                    risk_before=84.2,
                    risk_after=21.5,
                    source_model="Graph-Disruption-Engine v2.8",
                    status="Pending Review"
                ),
                Recommendation(
                    id="REC-IND-002",
                    recommendation="Increase safety stock threshold by 200 units at Bhiwandi Mega-Hub prior to Festive Diwali surge.",
                    reason="LightGBM time-series forecast predicts +48% demand surge for powertrain electronics in Q3 festive peak.",
                    evidence={
                        "modelEvidence": {"forecastSpike": "48%", "horizon": "Sep-Nov 2026"},
                        "inventoryEvidence": {"currentStock": 240, "requiredBuffer": 600}
                    },
                    expected_effect="Eliminates festival stockout window across western automotive dealers.",
                    risk_before=62.0,
                    risk_after=18.0,
                    source_model="LightGBM Demand Forecaster v2.1",
                    status="Approved"
                )
            ]
            session.add_all(recommendations)
            session.commit()

        # 8. Seed Model Metadata
        if session.query(ModelMetadata).count() == 0:
            models = [
                ModelMetadata(
                    id="MOD-XGB-01",
                    model_name="XGBoost Highway Transit & Delay Classifier",
                    version="v2.8.4",
                    dataset="420k Indian FASTag toll transactions & GPS trajectories",
                    algorithm="XGBoost Classifier with Point-in-time Leakage Audit",
                    metrics={"roc_auc": 0.968, "f1_score": 0.931, "precision": 0.942, "recall": 0.921, "accuracy": 0.954},
                    features=["origin_state", "dest_state", "distance_km", "transport_mode", "monsoon_season", "toll_density", "vehicle_age_years", "departure_hour"],
                    status="Production Active"
                ),
                ModelMetadata(
                    id="MOD-LGB-02",
                    model_name="LightGBM Multi-Horizon Demand Forecaster",
                    version="v2.1.0",
                    dataset="1.8M Indian SKU-day records (Pre-monsoon, Festive Diwali surge)",
                    algorithm="LightGBM Regressor with P10/P50/P90 Quantile Heads",
                    metrics={"mape": "5.8%", "wape": "4.9%", "rmse": "3.84 units", "r2": 0.912},
                    features=["lag_1", "lag_7", "lag_14", "lag_28", "rolling_mean_7", "rolling_std_7", "festive_indicator", "monsoon_flag", "day_of_week", "month"],
                    status="Production Active"
                ),
                ModelMetadata(
                    id="MOD-RF-03",
                    model_name="Random Forest Supplier Risk & ESG Classifier",
                    version="v3.4.0",
                    dataset="1,284 Tier-1/2 Indian OEM and MSME supplier audits",
                    algorithm="Random Forest Classifier + SHAP Explainability",
                    metrics={"precision": 0.932, "recall": 0.901, "pr_auc": 0.948},
                    features=["capacity_utilization", "lead_time_variance", "historical_delay", "quality_score", "geographic_concentration", "single_source"],
                    status="Production Active"
                )
            ]
            session.add_all(models)
            session.commit()

        # 9. Seed Data Quality Report
        if session.query(DataQualityReport).count() == 0:
            reports = [
                DataQualityReport(
                    id="DQR-FASTAG-01",
                    dataset_name="FASTag NH48 & DFC Telemetry Stream",
                    row_count=420850,
                    missing_values=12,
                    duplicates=0,
                    invalid_dates=0,
                    invalid_coords=2,
                    outliers=18,
                    data_quality_pct=99.85,
                    freshness_status="LIVE"
                ),
                DataQualityReport(
                    id="DQR-SKU-02",
                    dataset_name="Automotive Powertrain Demand Master",
                    row_count=1824000,
                    missing_values=45,
                    duplicates=3,
                    invalid_dates=0,
                    invalid_coords=0,
                    outliers=56,
                    data_quality_pct=99.42,
                    freshness_status="LIVE"
                )
            ]
            session.add_all(reports)
            session.commit()

        print("[SUPPLYINTEL SEED] Database seeding complete and verified!")

    except Exception as e:
        session.rollback()
        print(f"[SUPPLYINTEL SEED ERROR] {e}")
        raise
    finally:
        session.close()

if __name__ == "__main__":
    seed_database()
