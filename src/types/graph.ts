export interface Node {
  id: string;
  label?: string;
  x?: number;
  y?: number;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  weight?: number;
  label?: string;
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

export type EdgeType = 'tree' | 'back' | 'forward' | 'cross';

export interface EdgeClassification {
  edgeId: string;
  type: EdgeType;
}

export interface GraphSettings {
  isDirected: boolean;
  isWeighted: boolean;
}

export interface DFSResult {
  visited: string[];
  edgeClassifications: EdgeClassification[];
  discoveryTime: { [key: string]: number };
  finishTime: { [key: string]: number };
}

export interface SCCResult {
  components: string[][];
}

export interface ShortestPathResult {
  path: string[];
  distance: number;
  edges: string[];
}

export interface MSTResult {
  edges: string[];
  totalWeight: number;
}
