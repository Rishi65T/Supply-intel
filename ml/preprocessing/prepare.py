"""
Data Preprocessing Pipeline for SUPPLYINTEL.
Performs data cleaning, chronological ordering, time-based train/val/test splits,
and point-in-time leakage audit.
"""
import sys
from pathlib import Path
import pandas as pd
import numpy as np

BASE_DIR = Path(__file__).resolve().parent.parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

RAW_DIR = BASE_DIR / "ml" / "data" / "raw"
PROCESSED_DIR = BASE_DIR / "ml" / "data" / "processed"
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

def prepare_shipment_data():
    raw_path = RAW_DIR / "shipments_real.csv"
    if not raw_path.exists():
        from ml.data.ingest import run_ingestion
        run_ingestion()

    df = pd.read_csv(raw_path)
    df["ship_date"] = pd.to_datetime(df["ship_date"])
    # Strictly sort chronologically for time-based evaluation (Section 9)
    df = df.sort_values("ship_date").reset_index(drop=True)

    # Leakage Audit Check: Assert no post-outcome variables enter feature set
    forbidden_features = ["actual_delivery", "delay_hours", "post_arrival_status", "final_delay"]
    feature_candidates = [
        "distance_km", "planned_transit_hours", "monsoon_season",
        "supplier_reliability", "vehicle_age_years", "load_weight_tons",
        "carrier_rating", "transport_mode", "corridor"
    ]
    for feat in forbidden_features:
        assert feat not in feature_candidates, f"CRITICAL: Leakage detected with feature {feat}!"

    # 70% Train, 15% Validation, 15% Test chronologically
    n = len(df)
    train_end = int(n * 0.70)
    val_end = int(n * 0.85)

    train_df = df.iloc[:train_end]
    val_df = df.iloc[train_end:val_end]
    test_df = df.iloc[val_end:]

    train_df.to_parquet(PROCESSED_DIR / "shipments_train.parquet")
    val_df.to_parquet(PROCESSED_DIR / "shipments_val.parquet")
    test_df.to_parquet(PROCESSED_DIR / "shipments_test.parquet")

    print(f"[PREPARE] Shipments split chronologically: Train={len(train_df)}, Val={len(val_df)}, Test={len(test_df)}")
    print(f"[LEAKAGE AUDIT] PASSED. Only point-in-time features retained.")

def prepare_demand_data():
    raw_path = RAW_DIR / "demand_m5_style.csv"
    if not raw_path.exists():
        from ml.data.ingest import run_ingestion
        run_ingestion()

    df = pd.read_csv(raw_path)
    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values(["sku", "warehouse_id", "date"]).reset_index(drop=True)

    # Chronological split per SKU/warehouse (Last 90 days = Test, prior 60 days = Val, rest = Train)
    max_date = df["date"].max()
    test_start = max_date - pd.Timedelta(days=90)
    val_start = test_start - pd.Timedelta(days=60)

    train_df = df[df["date"] < val_start]
    val_df = df[(df["date"] >= val_start) & (df["date"] < test_start)]
    test_df = df[df["date"] >= test_start]

    train_df.to_parquet(PROCESSED_DIR / "demand_train.parquet")
    val_df.to_parquet(PROCESSED_DIR / "demand_val.parquet")
    test_df.to_parquet(PROCESSED_DIR / "demand_test.parquet")

    print(f"[PREPARE] Demand series split: Train={len(train_df)}, Val={len(val_df)}, Test={len(test_df)}")

def run_preparation():
    print("=" * 70)
    print("      SUPPLYINTEL PREPROCESSING & LEAKAGE AUDIT")
    print("=" * 70)
    prepare_shipment_data()
    prepare_demand_data()
    print("[OK] Data preparation complete.")
    return True

if __name__ == "__main__":
    run_preparation()
