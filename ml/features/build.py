"""
Feature Engineering Pipeline for SUPPLYINTEL.
Constructs lag features, rolling statistics, calendar harmonics,
and point-in-time logistics risk features.
"""
import sys
from pathlib import Path
import pandas as pd
import numpy as np

BASE_DIR = Path(__file__).resolve().parent.parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

PROCESSED_DIR = BASE_DIR / "ml" / "data" / "processed"
FEATURES_DIR = BASE_DIR / "ml" / "data" / "features"
FEATURES_DIR.mkdir(parents=True, exist_ok=True)

def build_demand_features():
    train_df = pd.read_parquet(PROCESSED_DIR / "demand_train.parquet")
    val_df = pd.read_parquet(PROCESSED_DIR / "demand_val.parquet")
    test_df = pd.read_parquet(PROCESSED_DIR / "demand_test.parquet")

    full_df = pd.concat([train_df, val_df, test_df], ignore_index=True)
    full_df["date"] = pd.to_datetime(full_df["date"])
    full_df = full_df.sort_values(["sku", "warehouse_id", "date"]).reset_index(drop=True)

    # Feature Engineering per SKU + Warehouse group
    grouped = full_df.groupby(["sku", "warehouse_id"])

    # Lags (Section 10)
    full_df["lag_1"] = grouped["quantity"].shift(1)
    full_df["lag_7"] = grouped["quantity"].shift(7)
    full_df["lag_14"] = grouped["quantity"].shift(14)
    full_df["lag_28"] = grouped["quantity"].shift(28)

    # Rolling statistics
    full_df["rolling_mean_7"] = grouped["quantity"].transform(lambda x: x.shift(1).rolling(7, min_periods=1).mean())
    full_df["rolling_std_7"] = grouped["quantity"].transform(lambda x: x.shift(1).rolling(7, min_periods=1).std().fillna(0))
    full_df["rolling_mean_28"] = grouped["quantity"].transform(lambda x: x.shift(1).rolling(28, min_periods=1).mean())

    # Calendar & Trend
    full_df["day_of_week"] = full_df["date"].dt.dayofweek
    full_df["month"] = full_df["date"].dt.month
    full_df["sin_doy"] = np.sin(2 * np.pi * full_df["date"].dt.dayofyear / 365.25)
    full_df["cos_doy"] = np.cos(2 * np.pi * full_df["date"].dt.dayofyear / 365.25)

    # Drop early warm-up periods where lag_28 is null
    full_df = full_df.dropna(subset=["lag_28"]).reset_index(drop=True)

    # Re-split by original timestamps
    train_feat = full_df[full_df["date"].isin(train_df["date"])]
    val_feat = full_df[full_df["date"].isin(val_df["date"])]
    test_feat = full_df[full_df["date"].isin(test_df["date"])]

    train_feat.to_parquet(FEATURES_DIR / "demand_feat_train.parquet")
    val_feat.to_parquet(FEATURES_DIR / "demand_feat_val.parquet")
    test_feat.to_parquet(FEATURES_DIR / "demand_feat_test.parquet")
    print(f"[FEATURES] Demand feature matrices built: Train={len(train_feat)}, Val={len(val_feat)}, Test={len(test_feat)}")

def build_shipment_features():
    train_df = pd.read_parquet(PROCESSED_DIR / "shipments_train.parquet")
    val_df = pd.read_parquet(PROCESSED_DIR / "shipments_val.parquet")
    test_df = pd.read_parquet(PROCESSED_DIR / "shipments_test.parquet")

    # One-hot encode transport mode & corridor with consistent categories
    full_df = pd.concat([train_df, val_df, test_df], ignore_index=True)
    full_df = pd.get_dummies(full_df, columns=["transport_mode", "corridor"], drop_first=True)

    n_train = len(train_df)
    n_val = len(val_df)

    train_feat = full_df.iloc[:n_train]
    val_feat = full_df.iloc[n_train:n_train + n_val]
    test_feat = full_df.iloc[n_train + n_val:]

    train_feat.to_parquet(FEATURES_DIR / "shipments_feat_train.parquet")
    val_feat.to_parquet(FEATURES_DIR / "shipments_feat_val.parquet")
    test_feat.to_parquet(FEATURES_DIR / "shipments_feat_test.parquet")
    print(f"[FEATURES] Shipment feature matrices built: Train={len(train_feat)}, Val={len(val_feat)}, Test={len(test_feat)}")

def run_feature_build():
    print("=" * 70)
    print("      SUPPLYINTEL FEATURE ENGINEERING ENGINE")
    print("=" * 70)
    build_demand_features()
    build_shipment_features()
    print("[OK] Feature engineering complete.")
    return True

if __name__ == "__main__":
    run_feature_build()
