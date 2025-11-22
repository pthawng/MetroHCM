import { Injectable } from '@nestjs/common';
import { SegmentRepository } from '../../segment/infrastructure/segment.repository';
import { TransferRepository } from '../../transfer/infrastructure/transfer.repository';
import { AdjacencyList, Edge, MetroGraph, NodeId } from '../../../core/graph/graph';

@Injectable()
export class GraphBuilderService {
  constructor(
    private readonly segmentRepository: SegmentRepository,
    private readonly transferRepository: TransferRepository,
  ) {}

  /**
   * Builds the adjacency list representing the metro network.
   * Nodes are (StationID:LineID) tuples.
   */
  async build(): Promise<AdjacencyList> {
    const adjacencyList: AdjacencyList = new Map<NodeId, Edge[]>();

    // 1. Load all segments and add them as edges
    const segments = await this.segmentRepository.findAll();
    for (const segment of segments) {
      const fromNodeId = MetroGraph.createNodeId(segment.fromStationId, segment.lineId);
      const toNodeId = MetroGraph.createNodeId(segment.toStationId, segment.lineId);

      this.addEdge(adjacencyList, fromNodeId, {
        to: toNodeId,
        weight: segment.travelTimeSec,
        type: 'segment',
      });
    }

    // 2. Load all transfers and add them as edges
    const transfers = await this.transferRepository.findAll();
    for (const transfer of transfers) {
      const fromNodeId = MetroGraph.createNodeId(transfer.fromStationId, transfer.fromLineId);
      const toNodeId = MetroGraph.createNodeId(transfer.toStationId, transfer.toLineId);

      this.addEdge(adjacencyList, fromNodeId, {
        to: toNodeId,
        weight: transfer.walkingTimeSec,
        type: 'transfer',
      });

      // Transfers are usually bidirectional in physical space, 
      // but were defined as unique in DB. Ensure we handle the reverse if applicable.
      // Based on UNIQUE constraint in SQL, we might need to add reverse edge 
      // if the system allows bidirectional transfer via same record or distinct records.
      // SQL UNIQUE: (from_station_id, to_station_id, from_line_id, to_line_id)
      // Usually, another record would exist for the reverse direction.
    }

    return adjacencyList;
  }

  private addEdge(list: AdjacencyList, from: NodeId, edge: Edge): void {
    if (!list.has(from)) {
      list.set(from, []);
    }
    list.get(from)!.push(edge);
    
    // Ensure the 'to' node is also in the list as a key (even if it has no outbound edges)
    if (!list.has(edge.to)) {
      list.set(edge.to, []);
    }
  }
}
