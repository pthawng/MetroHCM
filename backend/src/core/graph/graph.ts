/**
 * NodeId represents a unique node in the metro network graph.
 * Format: "stationId:lineId" to account for transfer costs at the same station.
 */
export type NodeId = string;

/**
 * Edge represents a connection between two nodes (either a segment on the same line or a transfer).
 */
export interface Edge {
  to: NodeId;
  weight: number; // Duration in seconds
  type: 'segment' | 'transfer';
}

/**
 * AdjacencyList maps each node to its outgoing edges.
 */
export type AdjacencyList = Map<NodeId, Edge[]>;

export class MetroGraph {
  constructor(public readonly adjacencyList: AdjacencyList) {}

  static createNodeId(stationId: string, lineId: string): NodeId {
    return `${stationId}:${lineId}`;
  }

  static parseNodeId(nodeId: NodeId): { stationId: string; lineId: string } {
    const [stationId, lineId] = nodeId.split(':');
    return { stationId, lineId };
  }
}
