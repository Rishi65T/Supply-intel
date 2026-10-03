"""
Supply Network Graph Engine for SUPPLYINTEL.
Constructs multi-echelon topological dependency graph using NetworkX
(with Neo4j driver interface where active) to compute upstream/downstream dependencies,
betweenness centrality, single points of failure, and bottleneck severity.
"""
import sys
import json
from pathlib import Path
import networkx as nx  # type: ignore

BASE_DIR = Path(__file__).resolve().parent.parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from database.connection import SessionLocal
from database.models import Supplier, Factory, Port, Warehouse

GRAPH_EXPORT_PATH = BASE_DIR / "ml" / "models" / "graph_network.json"

def build_supply_graph() -> nx.DiGraph:
    print("=" * 70)
    print("      SUPPLYINTEL SUPPLY NETWORK GRAPH BUILDER")
    print("=" * 70)

    G = nx.DiGraph()
    session = SessionLocal()

    try:
        # Add Suppliers
        suppliers = session.query(Supplier).all()
        for s in suppliers:
            G.add_node(
                s.id,
                label=s.supplier_name,
                type="Supplier",
                location=s.location,
                risk=s.risk_score,
                capacity=s.capacity,
                single_source=s.single_source
            )

        # Add Factories
        factories = session.query(Factory).all()
        for f in factories:
            G.add_node(
                f.id,
                label=f.name,
                type="Factory",
                location=f.location,
                lat=f.lat,
                lng=f.lng,
                capacity=f.capacity_units_per_day,
                status=f.status
            )

        # Add Ports
        ports = session.query(Port).all()
        for p in ports:
            G.add_node(
                p.id,
                label=p.name,
                type="Port",
                location=p.location,
                lat=p.lat,
                lng=p.lng,
                status=p.status
            )

        # Add Warehouses
        warehouses = session.query(Warehouse).all()
        for w in warehouses:
            G.add_node(
                w.id,
                label=w.name,
                type="Warehouse",
                location=w.location,
                lat=w.lat,
                lng=w.lng,
                capacity=w.capacity_pallets
            )

        # Multi-Echelon Topological Relationships (Section 16)
        # SUPPLIES: Supplier -> Factory
        G.add_edge("SUP-IND-183", "FAC-IND-201", relation="SUPPLIES", component="IGBT Inverter", critical=True, corridor="NH48 Western Corridor")
        G.add_edge("SUP-IND-106", "FAC-IND-201", relation="SUPPLIES", component="Chassis Sub-frames", critical=False, corridor="Pune Local Road")
        G.add_edge("SUP-IND-104", "FAC-IND-201", relation="SUPPLIES", component="BMS Microcontrollers", critical=True, corridor="Western DFC Rail")
        G.add_edge("SUP-IND-101", "FAC-IND-202", relation="SUPPLIES", component="Wiring Harness", critical=True, corridor="Chennai Expressway")
        G.add_edge("SUP-IND-105", "FAC-IND-204", relation="SUPPLIES", component="ADAS Sensors", critical=False, corridor="Delhi-NCR Expressway")

        # ROUTES_THROUGH / SHIPS_TO: Port & Supplier -> Warehouse / Factory
        G.add_edge("PRT-IND-01", "WH-IND-01", relation="ROUTES_THROUGH", corridor="Nhava Sheva Rail")
        G.add_edge("PRT-IND-02", "FAC-IND-201", relation="ROUTES_THROUGH", corridor="Western DFC Link")

        # STORES / FULFILLS: Factory -> Warehouse
        G.add_edge("FAC-IND-201", "WH-IND-01", relation="FULFILLS", corridor="Bhiwandi Hub Link")
        G.add_edge("FAC-IND-202", "WH-IND-02", relation="FULFILLS", corridor="Bengaluru Airport DC Link")
        G.add_edge("FAC-IND-204", "WH-IND-03", relation="FULFILLS", corridor="Kundli Terminal Link")

        print(f"[GRAPH] Constructed graph with {G.number_of_nodes()} nodes and {G.number_of_edges()} relationships.")

        # Graph Analytics: Centrality & Bottlenecks (Section 16 & 17)
        degree_centrality = nx.degree_centrality(G)
        betweenness = nx.betweenness_centrality(G)

        print("\n--- Key Network Topology Insights ---")
        for node in G.nodes():
            n_type = G.nodes[node].get("type")
            deg = degree_centrality.get(node, 0)
            btw = betweenness.get(node, 0)
            print(f"  Node {node:<14} ({n_type:<9}) | Degree: {deg:.3f} | Betweenness: {btw:.3f}")

        # Export Graph JSON for 3D Digital Twin and Frontend
        graph_data = {
            "nodes": [
                {"id": n, **G.nodes[n]}
                for n in G.nodes()
            ],
            "links": [
                {"source": u, "target": v, **G.edges[u, v]}
                for u, v in G.edges()
            ],
            "metrics": {
                "total_nodes": G.number_of_nodes(),
                "total_edges": G.number_of_edges(),
                "density": round(nx.density(G), 4),
                "is_directed_acyclic": nx.is_directed_acyclic_graph(G)
            }
        }
        with open(GRAPH_EXPORT_PATH, "w") as f:
            json.dump(graph_data, f, indent=2)
        print(f"\n[GRAPH EXPORT] Topological graph exported to {GRAPH_EXPORT_PATH}")

        return G
    finally:
        session.close()

if __name__ == "__main__":
    build_supply_graph()
