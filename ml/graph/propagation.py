"""
Disruption Propagation Engine for SUPPLYINTEL.
Calculates downstream topological impacts, affected nodes, stockout exposure,
and revenue risks when an actual risk event is introduced to the network.
"""
import sys
from pathlib import Path
import networkx as nx  # type: ignore

BASE_DIR = Path(__file__).resolve().parent.parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from ml.graph.build import build_supply_graph

def propagate_disruption(source_node_id: str, severity_factor: float = 0.5) -> dict:
    """
    Traverses DAG downstream from disrupted node.
    Calculates downstream dependencies, inventory exposure, and expected delay.
    """
    G = build_supply_graph()

    if source_node_id not in G:
        return {"error": f"Node {source_node_id} not found in topological network."}

    # BFS Downstream Reachable Nodes (Section 18 & 19)
    downstream_nodes = list(nx.descendants(G, source_node_id))
    all_affected = [source_node_id] + downstream_nodes

    affected_details = []
    total_revenue_exposure_cr = 0.0
    accumulated_delay_days = 0.0

    for idx, node in enumerate(all_affected):
        node_attr = G.nodes[node]
        node_type = node_attr.get("type", "Unknown")
        label = node_attr.get("label", node)

        if node == source_node_id:
            delay = round(14.0 * severity_factor, 1)
            impact = f"Epicenter: {int(severity_factor * 100)}% capacity disruption"
            accumulated_delay_days += delay
        else:
            delay = round(accumulated_delay_days * 0.85, 1)
            impact = f"Downstream Cascade Level {idx}: Assembly starvation risk"
            total_revenue_exposure_cr += round(1.2 * severity_factor, 2)

        affected_details.append({
            "nodeId": node,
            "name": label,
            "type": node_type,
            "impact": impact,
            "expectedDelayDays": delay,
            "status": "Critical Impact" if idx <= 1 else "Elevated Vulnerability"
        })

    network_risk_index = min(98.5, round(38.0 + (len(downstream_nodes) * 12.0) + (severity_factor * 35.0), 1))

    return {
        "sourceNode": source_node_id,
        "affectedNodeCount": len(all_affected),
        "affectedNodes": affected_details,
        "totalDownstreamDependencies": len(downstream_nodes),
        "estimatedDelayDays": accumulated_delay_days,
        "revenueExposureCr": round(total_revenue_exposure_cr + (severity_factor * 0.8), 2),
        "networkRiskIndex": network_risk_index,
        "criticalPathAffected": "FAC-IND-201" in downstream_nodes
    }

if __name__ == "__main__":
    result = propagate_disruption("SUP-IND-183", 0.6)
    print("\n[DISRUPTION PROPAGATION RESULT]")
    print(f"  Source: {result['sourceNode']}")
    print(f"  Affected Nodes: {result['affectedNodeCount']}")
    print(f"  Network Risk Index: {result['networkRiskIndex']}%")
    for n in result["affectedNodes"]:
        print(f"   -> {n['name']} [{n['type']}]: {n['impact']} (+{n['expectedDelayDays']} days)")
