import type { GraphData, DFSResult, SCCResult, EdgeClassification, EdgeType, GraphSettings } from '../types/graph';

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

// Find bridges in an undirected graph using DFS (Tarjan's algorithm)
export function findBridges(graphData: GraphData): { bridges: [string, string][] } {
//   const n = graphData.nodes.length;
  const adj: Record<string, string[]> = {};
  graphData.nodes.forEach(node => { adj[node.id] = []; });
  graphData.edges.forEach(edge => {
    adj[edge.source].push(edge.target);
    adj[edge.target].push(edge.source);
  });
  const visited: Record<string, boolean> = {};
  const tin: Record<string, number> = {};
  const low: Record<string, number> = {};
  let timer = 0;
  const bridges: [string, string][] = [];

  function dfs(v: string, p: string | null) {
    visited[v] = true;
    tin[v] = low[v] = ++timer;
    for (const to of adj[v]) {
      if (to === p) continue;
      if (visited[to]) {
        low[v] = Math.min(low[v], tin[to]);
      } else {
        dfs(to, v);
        low[v] = Math.min(low[v], low[to]);
        if (low[to] > tin[v]) {
          bridges.push([v, to]);
        }
      }
    }
  }

  for (const node of graphData.nodes) {
    if (!visited[node.id]) dfs(node.id, null);
  }
  return { bridges };
}

// Find articulation points in an undirected graph using DFS (Tarjan's algorithm)
export function findArticulationPoints(graphData: GraphData): { points: string[] } {
  const adj: Record<string, string[]> = {};
  graphData.nodes.forEach(node => { adj[node.id] = []; });
  graphData.edges.forEach(edge => {
    adj[edge.source].push(edge.target);
    adj[edge.target].push(edge.source);
  });
  const visited: Record<string, boolean> = {};
  const tin: Record<string, number> = {};
  const low: Record<string, number> = {};
  let timer = 0;
  const points = new Set<string>();

  function dfs(v: string, p: string | null) {
    visited[v] = true;
    tin[v] = low[v] = ++timer;
    let children = 0;
    for (const to of adj[v]) {
      if (to === p) continue;
      if (visited[to]) {
        low[v] = Math.min(low[v], tin[to]);
      } else {
        dfs(to, v);
        low[v] = Math.min(low[v], low[to]);
        if (low[to] >= tin[v] && p !== null) {
          points.add(v);
        }
        ++children;
      }
    }
    if (p === null && children > 1) {
      points.add(v);
    }
  }

  for (const node of graphData.nodes) {
    if (!visited[node.id]) dfs(node.id, null);
  }
  return { points: Array.from(points) };
}

// Find shortest path using Dijkstra's algorithm (for weighted graphs)
export function findShortestPathDijkstra(
  graphData: GraphData,
  startNode: string,
  endNode: string,
  settings: GraphSettings
): { path: string[], distance: number, edges: string[] } | null {
  const distances: { [key: string]: number } = {};
  const previous: { [key: string]: string | null } = {};
  const visited: Set<string> = new Set();

  // Initialize distances
  graphData.nodes.forEach(node => {
    distances[node.id] = Infinity;
    previous[node.id] = null;
  });
  distances[startNode] = 0;

  // Create adjacency list with weights
  const adjacencyList: { [key: string]: { node: string; weight: number }[] } = {};
  graphData.nodes.forEach(node => {
    adjacencyList[node.id] = [];
  });

  graphData.edges.forEach(edge => {
    const weight = edge.weight || 1; // Default weight of 1 if not specified
    adjacencyList[edge.source].push({ node: edge.target, weight });
  });

  while (visited.size < graphData.nodes.length) {
    // Find unvisited node with minimum distance
    let minNode = '';
    let minDistance = Infinity;

    for (const nodeId in distances) {
      if (!visited.has(nodeId) && distances[nodeId] < minDistance) {
        minDistance = distances[nodeId];
        minNode = nodeId;
      }
    }

    if (minNode === '') break; // No path exists

    visited.add(minNode);

    // Update distances to neighbors
    adjacencyList[minNode].forEach(({ node, weight }) => {
      const newDistance = distances[minNode] + weight;
      if (newDistance < distances[node]) {
        distances[node] = newDistance;
        previous[node] = minNode;
      }
    });
  }

  // Reconstruct path
  if (distances[endNode] === Infinity) {
    return null; // No path exists
  }

  const path: string[] = [];
  const edges: string[] = [];
  let current = endNode;

  while (current !== null) {
    path.unshift(current);
    const prev = previous[current];
    if (prev !== null) {
      // Find the edge between prev and current
      const edge = graphData.edges.find(e =>
        (e.source === prev && e.target === current) ||
        (!settings.isDirected && e.source === current && e.target === prev)
      );
      if (edge) {
        edges.unshift(edge.id);
      }
    }
    current = prev!;
  }

  return {
    path,
    distance: distances[endNode],
    edges
  };
}

// Find shortest path using BFS (for unweighted graphs)
export function findShortestPathBFS(
  graphData: GraphData,
  startNode: string,
  endNode: string,
  settings: GraphSettings
): { path: string[], distance: number, edges: string[] } | null {
  const queue: { node: string; path: string[]; edges: string[] }[] = [];
  const visited: Set<string> = new Set();

  queue.push({ node: startNode, path: [startNode], edges: [] });
  visited.add(startNode);

  // Create adjacency list
  const adjacencyList: { [key: string]: string[] } = {};
  graphData.nodes.forEach(node => {
    adjacencyList[node.id] = [];
  });

  graphData.edges.forEach(edge => {
    adjacencyList[edge.source].push(edge.target);
    if (!settings.isDirected) {
      adjacencyList[edge.target].push(edge.source);
    }
  });

  while (queue.length > 0) {
    const { node, path, edges } = queue.shift()!;

    if (node === endNode) {
      return {
        path,
        distance: path.length - 1,
        edges
      };
    }

    adjacencyList[node].forEach(neighbor => {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);

        // Find the edge between node and neighbor
        const edge = graphData.edges.find(e =>
          (e.source === node && e.target === neighbor) ||
          (!settings.isDirected && e.source === neighbor && e.target === node)
        );

        const newEdges = edge ? [...edges, edge.id] : edges;
        queue.push({
          node: neighbor,
          path: [...path, neighbor],
          edges: newEdges
        });
      }
    });
  }

  return null; // No path exists
}

// Main shortest path function that chooses algorithm based on graph type
export function findShortestPath(
  graphData: GraphData,
  startNode: string,
  endNode: string,
  settings: GraphSettings
): { path: string[], distance: number, edges: string[] } | null {
  if (graphData.nodes.length === 0) return null;

  // Use Dijkstra for weighted graphs, BFS for unweighted
  if (settings.isWeighted) {
    return findShortestPathDijkstra(graphData, startNode, endNode, settings);
  } else {
    return findShortestPathBFS(graphData, startNode, endNode, settings);
  }
}

// Find Minimum Spanning Tree using Kruskal's algorithm
export function findMST(graphData: GraphData): { edges: string[], totalWeight: number } {
  if (graphData.nodes.length === 0) {
    return { edges: [], totalWeight: 0 };
  }

  // Create edges with weights (default to 1 if not specified)
  const edgesWithWeights = graphData.edges.map(edge => ({
    ...edge,
    weight: edge.weight || 1
  }));

  // Sort edges by weight
  edgesWithWeights.sort((a, b) => a.weight - b.weight);

  // Union-Find data structure for cycle detection
  const parent: { [key: string]: string } = {};
  const rank: { [key: string]: number } = {};

  // Initialize Union-Find
  graphData.nodes.forEach(node => {
    parent[node.id] = node.id;
    rank[node.id] = 0;
  });

  // Find function for Union-Find
  const find = (x: string): string => {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]);
    }
    return parent[x];
  };

  // Union function for Union-Find
  const union = (x: string, y: string): boolean => {
    const rootX = find(x);
    const rootY = find(y);

    if (rootX === rootY) return false; // Already in same set

    if (rank[rootX] < rank[rootY]) {
      parent[rootX] = rootY;
    } else if (rank[rootX] > rank[rootY]) {
      parent[rootY] = rootX;
    } else {
      parent[rootY] = rootX;
      rank[rootX]++;
    }
    return true;
  };

  const mstEdges: string[] = [];
  let totalWeight = 0;

  // Process edges in ascending order of weight
  for (const edge of edgesWithWeights) {
    if (union(edge.source, edge.target)) {
      mstEdges.push(edge.id);
      totalWeight += edge.weight;
    }
  }

  return { edges: mstEdges, totalWeight };
}
