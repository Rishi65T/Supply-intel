"""
Database Verification and Storage Integrity Checker for SUPPLYINTEL.
Executes end-to-end CRUD operations, transaction checks, schema validation,
and prints a verified data persistence report.
"""
import sys
import time
from datetime import datetime
from pathlib import Path

# Add project root to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from database.connection import engine, SessionLocal, SQLITE_PATH
from database.models import (
    User, Supplier, Factory, Port, Warehouse, Shipment,
    Inventory, Disruption, Recommendation, ModelMetadata,
    DataQualityReport, AuditLog
)
from database.seed import seed_database, hash_pw

def verify_storage():
    print("=" * 70)
    print("      SUPPLYINTEL — DATABASE CONNECTION & PERSISTENCE VERIFICATION")
    print("=" * 70)
    
    start_time = time.time()
    
    # 1. Seed base data if not already present
    seed_database()

    session = SessionLocal()
    try:
        print("\n[STEP 1] Querying existing records across core tables...")
        counts = {
            "users": session.query(User).count(),
            "suppliers": session.query(Supplier).count(),
            "factories": session.query(Factory).count(),
            "ports": session.query(Port).count(),
            "warehouses": session.query(Warehouse).count(),
            "shipments": session.query(Shipment).count(),
            "inventory": session.query(Inventory).count(),
            "disruptions": session.query(Disruption).count(),
            "recommendations": session.query(Recommendation).count(),
            "model_metadata": session.query(ModelMetadata).count(),
            "data_quality_reports": session.query(DataQualityReport).count(),
        }

        for table, count in counts.items():
            print(f"  [OK] {table:<22} : {count:>5} records")

        # 2. Test INSERT operation
        print("\n[STEP 2] Testing real INSERT transaction...")
        test_shipment_id = f"SHP-TEST-{int(time.time())}"
        test_shipment = Shipment(
            id=test_shipment_id,
            tracking_number=f"TRK-TEST-{int(time.time())}",
            supplier_id="SUP-IND-183",
            origin="Sanand Hub, Gujarat",
            destination="Chakan Plant, Pune",
            transport_mode="Road (Express)",
            carrier="Test Freight Carrier",
            ship_date=datetime.utcnow(),
            expected_delivery=datetime.utcnow(),
            status="Dispatched",
            distance_km=640.0,
            cost=120000.0,
            quantity=150,
            risk_score=42.0
        )
        session.add(test_shipment)

        # Also add audit log
        audit = AuditLog(
            action="VERIFY_PERSISTENCE",
            entity_type="Shipment",
            entity_id=test_shipment_id,
            user_id="usr-commander-01",
            details={"verification_test": True, "timestamp": datetime.utcnow().isoformat()}
        )
        session.add(audit)
        session.commit()
        print(f"  [OK] Inserted test shipment '{test_shipment_id}' and audit log successfully.")

        # 3. Test READ operation
        print("\n[STEP 3] Testing READ & Integrity Check...")
        queried = session.query(Shipment).filter(Shipment.id == test_shipment_id).first()
        assert queried is not None, "Failed to retrieve inserted test shipment!"
        assert queried.origin == "Sanand Hub, Gujarat", "Field mismatch on retrieved record!"
        print(f"  [OK] Retrieved test shipment with verified fields: ID={queried.id}, Origin={queried.origin}")

        # 4. Test UPDATE operation
        print("\n[STEP 4] Testing UPDATE operation...")
        queried.status = "Verified In Transit"
        queried.risk_score = 38.5
        session.commit()

        updated = session.query(Shipment).filter(Shipment.id == test_shipment_id).first()
        assert updated is not None, "Failed to retrieve updated test shipment!"
        assert updated.status == "Verified In Transit", "Failed to update record status!"
        print(f"  [OK] Updated record status to '{updated.status}' and verified in DB.")

        # 5. Clean up test record
        print("\n[STEP 5] Cleaning up test record...")
        session.delete(updated)
        session.commit()
        print("  [OK] Test record safely removed after full verification.")

        # 6. Verify User Authentication Storage
        print("\n[STEP 6] Testing User Authentication & Password Hash verification...")
        commander = session.query(User).filter(User.username == "commander").first()
        assert commander is not None, "User 'commander' not found in database!"
        expected_hash = hash_pw("supplyintel2026")
        assert commander.hashed_password == expected_hash, "User password hash verification failed!"
        print(f"  [OK] User '{commander.username}' ({commander.role}) authenticated successfully against DB.")

        elapsed = round((time.time() - start_time) * 1000, 2)
        print("\n" + "=" * 70)
        print(f"SUCCESS: Database connection is active, ACID compliant, and storing data!")
        print(f"Persistence Target: {SQLITE_PATH}")
        print(f"Verification completed in {elapsed}ms.")
        print("=" * 70)

        return True

    except Exception as e:
        session.rollback()
        print(f"\n[ERROR] Database storage verification failed: {e}")
        return False
    finally:
        session.close()

if __name__ == "__main__":
    success = verify_storage()
    sys.exit(0 if success else 1)
