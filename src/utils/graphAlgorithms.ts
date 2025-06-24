import type { GraphData, DFSResult, SCCResult, EdgeClassification, EdgeType } from '../types/graph';

export const runDFS = (graphData: GraphData, startNode?: string): DFSResult => {
  const visited: string[] = [];
  const edgeClassifications: EdgeClassification[] = [];
  const discoveryTime: { [key: string]: number } = {};
  const finishTime: { [key: string]: number } = {};
  let time = 0;

  // Create adjacency list
  const adjacencyList: { [key: string]: string[] } = {};
  graphData.nodes.forEach(node => {
    adjacencyList[node.id] = [];
  });

  graphData.edges.forEach(edge => {
    adjacencyList[edge.source].push(edge.target);
  });

  const dfsVisit = (nodeId: string) => {
    visited.push(nodeId);
    discoveryTime[nodeId] = ++time;

    adjacencyList[nodeId].forEach(neighborId => {
      const edgeId = `${nodeId}-${neighborId}`;

      if (!visited.includes(neighborId)) {
        // Tree edge
        edgeClassifications.push({ edgeId, type: 'tree' });
        dfsVisit(neighborId);
      } else if (discoveryTime[neighborId] && !finishTime[neighborId]) {
        // Back edge (ancestor)
        edgeClassifications.push({ edgeId, type: 'back' });
      } else if (discoveryTime[neighborId] && finishTime[neighborId]) {
        if (discoveryTime[neighborId] < discoveryTime[nodeId]) {
          // Forward edge (descendant)
          edgeClassifications.push({ edgeId, type: 'forward' });
        } else {
          // Cross edge (unrelated)
          edgeClassifications.push({ edgeId, type: 'cross' });
        }
      }
    });

    finishTime[nodeId] = ++time;
  };

  // Start DFS from the specified node or the first node
  const start = startNode || graphData.nodes[0]?.id;
  if (start) {
    dfsVisit(start);
  }

  // Visit any remaining unvisited nodes
  graphData.nodes.forEach(node => {
    if (!visited.includes(node.id)) {
      dfsVisit(node.id);
    }
  });

  return {
    visited,
    edgeClassifications,
    discoveryTime,
    finishTime
  };
};

export const findSCCs = (graphData: GraphData): SCCResult => {
  if (graphData.nodes.length === 0) {
    return { components: [] };
  }

  // Create adjacency list
  const adjacencyList: { [key: string]: string[] } = {};
  const reverseAdjacencyList: { [key: string]: string[] } = {};

  graphData.nodes.forEach(node => {
    adjacencyList[node.id] = [];
    reverseAdjacencyList[node.id] = [];
  });

  graphData.edges.forEach(edge => {
    adjacencyList[edge.source].push(edge.target);
    reverseAdjacencyList[edge.target].push(edge.source);
  });

  // First DFS to get finish times
  const visited: Set<string> = new Set();
  const finishOrder: string[] = [];

  const dfs1 = (nodeId: string) => {
    visited.add(nodeId);
    adjacencyList[nodeId].forEach(neighborId => {
      if (!visited.has(neighborId)) {
        dfs1(neighborId);
      }
    });
    finishOrder.push(nodeId);
  };

  // Run first DFS on all nodes
  graphData.nodes.forEach(node => {
    if (!visited.has(node.id)) {
      dfs1(node.id);
    }
  });

  // Second DFS on reversed graph
  const components: string[][] = [];
  visited.clear();

  const dfs2 = (nodeId: string, component: string[]) => {
    visited.add(nodeId);
    component.push(nodeId);
    reverseAdjacencyList[nodeId].forEach(neighborId => {
      if (!visited.has(neighborId)) {
        dfs2(neighborId, component);
      }
    });
  };

  // Run second DFS in reverse finish order
  for (let i = finishOrder.length - 1; i >= 0; i--) {
    const nodeId = finishOrder[i];
    if (!visited.has(nodeId)) {
      const component: string[] = [];
      dfs2(nodeId, component);
      components.push(component);
    }
  }

  return { components };
};

// Helper function to get edge type color
export const getEdgeTypeColor = (type: EdgeType): string => {
  switch (type) {
    case 'tree': return '#10b981';
    case 'back': return '#ef4444';
    case 'forward': return '#3b82f6';
    case 'cross': return '#f59e0b';
    default: return '#6b7280';
  }
};
