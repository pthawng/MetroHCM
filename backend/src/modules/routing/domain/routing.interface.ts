import { NodeId } from '../../../core/graph/graph';

export interface RouteLeg {
  lineId: string | null; // null for transfers
  fromStationId: string;
  toStationId: string;
  durationSec: number;
  type: 'segment' | 'transfer';
}

export interface PlannedPath {
  nodes: NodeId[];
  legs: RouteLeg[];
  totalDurationSec: number;
  transferCount: number;
}
