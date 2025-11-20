import { AdjacencyList, NodeId } from '../graph/graph';

export interface DijkstraResult {
  distances: Map<NodeId, number>;
  previous: Map<NodeId, NodeId | null>;
}

export class Dijkstra {
  /**
   * Implements Dijkstra's algorithm to find shortest paths from a source node
   * @param source The starting node
   * @param adjacencyList The graph representation
   * @param target Optional target node to stop early
   */
  static findShortestPath(
    source: NodeId,
    adjacencyList: AdjacencyList,
    target?: NodeId
  ): DijkstraResult {
    const distances = new Map<NodeId, number>();
    const previous = new Map<NodeId, NodeId | null>();
    const nodes = new Set<NodeId>();

    // Initial configuration
    for (const [nodeId] of adjacencyList) {
      distances.set(nodeId, Infinity);
      previous.set(nodeId, null);
      nodes.add(nodeId);
    }
    distances.set(source, 0);

    while (nodes.size > 0) {
      // Find the node with the minimum distance
      let shortestNode: NodeId | null = null;
      for (const node of nodes) {
        if (shortestNode === null || (distances.get(node) ?? Infinity) < (distances.get(shortestNode) ?? Infinity)) {
          shortestNode = node;
        }
      }

      if (shortestNode === null || distances.get(shortestNode) === Infinity) {
        break;
      }

      // Early exit if target node is reached
      if (target && shortestNode === target) {
        break;
      }

      nodes.delete(shortestNode);

      // Explore neighbors
      const neighbors = adjacencyList.get(shortestNode) || [];
      for (const edge of neighbors) {
        if (!nodes.has(edge.to)) continue;

        const newDist = (distances.get(shortestNode) ?? 0) + edge.weight;
        if (newDist < (distances.get(edge.to) ?? Infinity)) {
          distances.set(edge.to, newDist);
          previous.set(edge.to, shortestNode);
        }
      }
    }

    return { distances, previous };
  }

  /**
   * Reconstructs the path from source to target using the 'previous' map
   */
  static reconstructPath(
    target: NodeId,
    previous: Map<NodeId, NodeId | null>
  ): NodeId[] {
    const path: NodeId[] = [];
    let current: NodeId | null = target;

    while (current !== null) {
      path.unshift(current);
      current = previous.get(current) || null;
    }

    return path;
  }
}
