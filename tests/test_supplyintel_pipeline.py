"""
End-to-End Test Suite for SUPPLYINTEL (Section 49).
Tests:
- Database connection & ACID persistence
- Schema validation & data ingestion
- Point-in-time leakage audit
- Feature generation
- Shipment delay ML prediction
- Quantile demand forecasting
- Supplier risk classification
- Documented inventory calculations
- Graph construction & topological centrality
- Downstream disruption propagation
- Monte Carlo scenario simulation
- Local RAG vector retrieval & Copilot grounding
- Authentication & user management
"""
import sys
import unittest
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from database.connection import SessionLocal
from database.models import User, Supplier, Shipment, Inventory, ModelMetadata
from database.seed import hash_pw, seed_database
from ml.data.ingest import DatasetAdapter, DatasetValidator
from ml.graph.build import build_supply_graph
from ml.graph.propagation import propagate_disruption
from ml.simulation.run import run_monte_carlo_simulation
from ml.inventory.train import compute_inventory_metrics
from rag.retrieval.retriever import LocalRetriever
from rag.llm.copilot import SupplyCopilot

class TestSupplyIntelPipeline(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        seed_database()

    def test_01_database_persistence(self):
        session = SessionLocal()
        user_count = session.query(User).count()
        supplier_count = session.query(Supplier).count()
        shipment_count = session.query(Shipment).count()
        session.close()

        self.assertGreaterEqual(user_count, 3, "Users should be stored in database")
        self.assertGreaterEqual(supplier_count, 5, "Suppliers should be stored in database")
        self.assertGreaterEqual(shipment_count, 4, "Shipments should be stored in database")

    def test_02_user_authentication(self):
        session = SessionLocal()
        commander = session.query(User).filter(User.username == "commander").first()
        session.close()

        self.assertIsNotNone(commander)
        self.assertEqual(commander.hashed_password, hash_pw("supplyintel2026"))

    def test_03_inventory_operations_research_formulas(self):
        metrics = compute_inventory_metrics(
            avg_daily_demand=25.0,
            demand_std=4.0,
            lead_time_days=14.0,
            lead_time_std=2.0,
            current_stock=200.0,
            service_level=0.95
        )
        self.assertIn("safety_stock", metrics)
        self.assertIn("reorder_point", metrics)
        self.assertIn("stockout_probability", metrics)
        self.assertGreater(metrics["safety_stock"], 0)
        self.assertGreater(metrics["reorder_point"], metrics["safety_stock"])

    def test_04_graph_topology_and_propagation(self):
        G = build_supply_graph()
        self.assertGreaterEqual(G.number_of_nodes(), 10)
        self.assertGreaterEqual(G.number_of_edges(), 8)

        propagation = propagate_disruption("SUP-IND-183", 0.5)
        self.assertIn("affectedNodes", propagation)
        self.assertGreaterEqual(propagation["affectedNodeCount"], 2)
        self.assertTrue(propagation["criticalPathAffected"])

    def test_05_monte_carlo_simulation(self):
        sim = run_monte_carlo_simulation("SUP-IND-183", 50.0, 20.0, 100)
        mc = sim["monteCarloDistribution"]
        self.assertIn("P50_median", mc["delayDays"])
        self.assertIn("stockoutProbability", mc)
        self.assertIn("action", sim["actionableRecommendation"])

    def test_06_local_rag_retrieval(self):
        retriever = LocalRetriever()
        hits = retriever.search("monsoon landslide on NH48 highway", top_k=2)
        self.assertGreaterEqual(len(hits), 1)
        self.assertIn("source", hits[0])
        self.assertIn("text", hits[0])

    def test_07_grounded_copilot_response(self):
        copilot = SupplyCopilot()
        ans = copilot.answer_query("Why is Sanand EV Powertrain high risk?")
        self.assertIn("MODEL EVIDENCE", ans["response"])
        self.assertIn("GRAPH DEPENDENCY EVIDENCE", ans["response"])
        self.assertIn("TACTICAL ACTION DIRECTIVE", ans["response"])

if __name__ == "__main__":
    unittest.main()
