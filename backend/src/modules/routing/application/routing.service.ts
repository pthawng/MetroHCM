import { Injectable } from '@nestjs/common';
import { GraphBuilderService } from './graph-builder.service';
import { Dijkstra } from '../../../core/algorithms/dijkstra';
import { MetroGraph, NodeId } from '../../../core/graph/graph';
import { PlannedPath, RouteLeg } from '../domain/routing.interface';

@Injectable()
export class RoutingService {
  constructor(private readonly graphBuilder: GraphBuilderService) {}

  /**
   * Finds the shortest path (in time) between two stations.
   * Considers all lines passing through start and end stations.
   */
  async findPath(fromStationId: string, toStationId: string): Promise<PlannedPath | null> {
    const adjacencyList = await this.graphBuilder.build();
    
    // 1. Identify all nodes belonging to the start and end stations
    const startNodes: NodeId[] = [];
    const endNodes: NodeId[] = [];

    for (const nodeId of adjacencyList.keys()) {
      const { stationId } = MetroGraph.parseNodeId(nodeId);
      if (stationId === fromStationId) {
        startNodes.push(nodeId);
      }
      if (stationId === toStationId) {
        endNodes.push(nodeId);
      }
    }

    if (startNodes.length === 0 || endNodes.length === 0) {
      return null;
    }

    let bestPath: PlannedPath | null = null;

    // 2. Run Dijkstra from each potential start node
    for (const startNode of startNodes) {
      const result = Dijkstra.findShortestPath(startNode, adjacencyList);

      for (const endNode of endNodes) {
        const dist = result.distances.get(endNode) ?? Infinity;
        if (dist === Infinity) continue;

        if (!bestPath || dist < bestPath.totalDurationSec) {
          const pathNodes = Dijkstra.reconstructPath(endNode, result.previous);
          bestPath = {
            nodes: pathNodes,
            legs: this.buildLegs(pathNodes, adjacencyList),
            totalDurationSec: dist,
            transferCount: this.countTransfers(pathNodes, adjacencyList),
          };
        }
      }
    }

    return bestPath;
  }

  private buildLegs(nodes: NodeId[], adjacencyList: any): RouteLeg[] {
    const legs: RouteLeg[] = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      const from = nodes[i];
      const to = nodes[i + 1];
      const edges = adjacencyList.get(from) || [];
      const edge = edges.find((e: any) => e.to === to);

      if (edge) {
        const fromInfo = MetroGraph.parseNodeId(from);
        const toInfo = MetroGraph.parseNodeId(to);

        legs.push({
          lineId: fromInfo.lineId === toInfo.lineId ? fromInfo.lineId : null,
          fromStationId: fromInfo.stationId,
          toStationId: toInfo.stationId,
          durationSec: edge.weight,
          type: edge.type,
        });
      }
    }
    return legs;
  }

  private countTransfers(nodes: NodeId[], adjacencyList: any): number {
    let count = 0;
    for (let i = 0; i < nodes.length - 1; i++) {
      const from = nodes[i];
      const to = nodes[i+1];
      const edge = (adjacencyList.get(from) || []).find((e: any) => e.to === to);
      if (edge?.type === 'transfer') {
        count++;
      }
    }
    return count;
  }
}
