import React, { useEffect, useRef, useState } from 'react';
import type { GraphData, GraphSettings, DFSResult, SCCResult } from '../types/graph';

interface GraphViewProps {
  graphData: GraphData;
  settings: GraphSettings;
  dfsResult?: DFSResult;
  sccResult?: SCCResult;
  onNodeClick?: (nodeId: string) => void;
  onEdgeClick?: (edgeId: string) => void;
  bridges?: [string, string][];
  articulationPoints?: string[];
  shortestPathEdges?: string[];
  mstEdges?: string[];
}

interface CytoscapeEvent {
  target: {
    id: () => string;
  };
}

const GraphView: React.FC<GraphViewProps> = ({
  graphData,
  settings,
  dfsResult,
  sccResult,
  onNodeClick,
  onEdgeClick,
  bridges = [],
  articulationPoints = [],
  shortestPathEdges = [],
  mstEdges = [],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cytoscapeInstance, setCytoscapeInstance] = useState<cytoscape.Core | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initCytoscape = async () => {
      try {
        const cytoscape = await import('cytoscape');
        const sccColors = [
          '#f87171', // red
          '#fbbf24', // yellow
          '#34d399', // green
          '#60a5fa', // blue
          '#a78bfa', // purple
          '#f472b6', // pink
          '#38bdf8', // sky
          '#facc15', // amber
          '#4ade80', // emerald
          '#c084fc', // violet
        ];
        const sccStyles = sccColors.map((color, idx) => ({
          selector: `.scc-${idx}`,
          style: {
            'background-color': color,
            'border-color': '#fff',
            'border-width': 4,
            'transition-property': 'background-color, border-color',
            'transition-duration': 300
          }
        }));
        const bridgeStyle = {
          selector: '.edge-bridge',
          style: {
            'line-color': '#ef4444',
            'width': 3,
            'opacity': 1,
            'target-arrow-color': settings.isDirected ? '#ef4444' : 'transparent',
            'target-arrow-shape': settings.isDirected ? 'triangle' : 'none'
          }
        };
        const highlightStyle = {
          selector: '.scc-highlight',
          style: {
            'border-color': '#fff',
            'border-width': 8
          }
        };
        const articulationStyle = {
          selector: '.node-articulation',
          style: {
            'border-color': 'rgba(249, 102, 43, 0.8)',
            // 'border-width': 8,
            'background-color': 'inherit',
            'transition-property': 'border-color, border-width',
            'transition-duration': 300,

          }
        };
        const shortestPathStyle = {
          selector: '.edge-shortest-path',
          style: {
            'line-color': '#a855f7',
            'width': 4,
            'opacity': 1,
            'target-arrow-color': settings.isDirected ? '#a855f7' : 'transparent',
            'target-arrow-shape': settings.isDirected ? 'triangle' : 'none'
          }
        };
        const mstStyle = {
          selector: '.edge-mst',
          style: {
            'line-color': '#22c55e',
            'width': 4,
            'opacity': 1,
            'target-arrow-color': settings.isDirected ? '#22c55e' : 'transparent',
            'target-arrow-shape': settings.isDirected ? 'triangle' : 'none'
          }
        };
        const cy = cytoscape.default({
          container: containerRef.current,
          elements: {
            nodes: graphData.nodes.map(node => ({
              data: {
                id: node.id,
                label: node.label || node.id,
                x: node.x,
                y: node.y
              }
            })),
            edges: graphData.edges.map(edge => ({
              data: {
                id: edge.id,
                source: edge.source,
                target: edge.target,
                weight: edge.weight,
                label: settings.isWeighted && edge.weight !== undefined ? String(edge.weight) : ''
              }
            }))
          },
          style: [
            {
              selector: 'node',
              style: {
                'background-color': '#3b82f6',
                'border-color': '#1d4ed8',
                'border-width': 2,
                'label': 'data(label)',
                'color': '#ffffff',
                'font-size': 12,
                'text-valign': 'center',
                'text-halign': 'center',
                'width': 40,
                'height': 40
              }
            },
            {
              selector: 'edge',
              style: {
                'width': 2,
                'line-color': '#6b7280',
                'target-arrow-color': settings.isDirected ? '#6b7280' : 'transparent',
                'target-arrow-shape': settings.isDirected ? 'triangle' : 'none',
                'curve-style': 'bezier',
                'label': settings.isWeighted ? 'data(weight)' : '',
                'font-size': 10,
                'color': '#facc15',
                'text-margin-x': 12,
                'text-margin-y': -8
              }
            },
            {
              selector: '.edge-tree',
              style: {
                'line-color': '#6b7280',
                'width': 3,
                'target-arrow-color': settings.isDirected ? '#6b7280' : 'transparent',
                'target-arrow-shape': settings.isDirected ? 'triangle' : 'none'
              }
            },
            {
              selector: '.edge-back',
              style: {
                'line-color': '#3b82f6',
                'width': 3,
                'target-arrow-color': settings.isDirected ? '#3b82f6' : 'transparent',
                'target-arrow-shape': settings.isDirected ? 'triangle' : 'none'
              }
            },
            {
              selector: '.edge-forward',
              style: {
                'line-color': '#22c55e',
                'width': 3,
                'target-arrow-color': settings.isDirected ? '#22c55e' : 'transparent',
                'target-arrow-shape': settings.isDirected ? 'triangle' : 'none'
              }
            },
            {
              selector: '.edge-cross',
              style: {
                'line-color': '#ef4444',
                'width': 3,
                'target-arrow-color': settings.isDirected ? '#ef4444' : 'transparent',
                'target-arrow-shape': settings.isDirected ? 'triangle' : 'none'
              }
            },
            {
              selector: '.node-visited',
              style: {
                'background-color': '#06b6d4',
                'border-color': '#0891b2'
              }
            },
            ...sccStyles,
            bridgeStyle,
            articulationStyle,
            highlightStyle,
            shortestPathStyle,
            mstStyle
          ],
          layout: {
            name: 'cose',
            animate: true,
            animationDuration: 1000,
            nodeDimensionsIncludeLabels: true
          }
        });

        // Add event listeners
        if (onNodeClick) {
          cy.on('tap', 'node', (evt: CytoscapeEvent) => {
            onNodeClick(evt.target.id());
          });
        }

        if (onEdgeClick) {
          cy.on('tap', 'edge', (evt: CytoscapeEvent) => {
            onEdgeClick(evt.target.id());
          });
        }

        setCytoscapeInstance(cy);
        setError(null);
      } catch (err) {
        console.error('Failed to initialize Cytoscape:', err);
        setError('Failed to load graph visualization');
      }
    };

    if (containerRef.current) {
      initCytoscape();
    }

    return () => {
      if (cytoscapeInstance) {
        cytoscapeInstance.destroy();
        setCytoscapeInstance(null);
      }
    };
  }, [settings]);

  // Update graph when data changes
  useEffect(() => {
    if (!cytoscapeInstance) return;

    // Clear existing elements
    cytoscapeInstance.elements().remove();

    // Add new elements
    const nodes = graphData.nodes.map(node => ({
      group: 'nodes' as const,
      data: {
        id: node.id,
        label: node.label || node.id,
        x: node.x,
        y: node.y
      }
    }));

    const edges = graphData.edges.map(edge => ({
      group: 'edges' as const,
      data: {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        weight: edge.weight,
        label: settings.isWeighted && edge.weight !== undefined ? String(edge.weight) : ''
      }
    }));

    cytoscapeInstance.add([...nodes, ...edges]);
    cytoscapeInstance.layout({ name: 'cose', animate: true }).run();
  }, [graphData, cytoscapeInstance]);

  // Apply DFS styling
  useEffect(() => {
    if (!cytoscapeInstance) return;

    // Clear previous styling
    cytoscapeInstance.elements().removeClass('node-visited edge-tree edge-back edge-forward edge-cross');

    // Only apply DFS styling if DFS results exist
    if (dfsResult) {
      // Apply visited node styling
      dfsResult.visited.forEach(nodeId => {
        const node = cytoscapeInstance.getElementById(nodeId);
        if (node.length > 0) {
          node.addClass('node-visited');
        }
      });

      // Apply edge classifications (let CSS handle the colors)
      dfsResult.edgeClassifications.forEach(classification => {
        const edge = cytoscapeInstance.getElementById(classification.edgeId);
        if (edge.length > 0) {
          edge.addClass(`edge-${classification.type}`);
        }
      });
    }
  }, [dfsResult, cytoscapeInstance]);

  // Apply SCC styling
  useEffect(() => {
    if (!cytoscapeInstance) return;

    // Remove all previous SCC classes
    cytoscapeInstance.nodes().forEach(node => {
      let classStr: string;
      const nodeClasses = node.classes();
      if (Array.isArray(nodeClasses)) {
        classStr = nodeClasses.join(' ');
      } else if (typeof nodeClasses === 'string') {
        classStr = nodeClasses;
      } else {
        classStr = '';
      }
      classStr.split(' ').forEach((cls: string) => {
        if (cls.startsWith('scc-')) node.removeClass(cls);
      });
      node.removeClass('scc-highlight');
    });

    if (!sccResult) return;

    // Assign SCC classes
    sccResult.components.forEach((component, idx) => {
      component.forEach(nodeId => {
        const node = cytoscapeInstance.getElementById(nodeId);
        if (node.length > 0) {
          node.addClass(`scc-${idx}`);
        }
      });
    });
  }, [sccResult, cytoscapeInstance]);

  // Interactive SCC highlight on node click
  useEffect(() => {
    if (!cytoscapeInstance || !sccResult) return;

    const handler = (evt: any) => {
      // Remove previous highlights
      cytoscapeInstance.nodes().removeClass('scc-highlight');
      const nodeId = evt.target.id();
      // Find which SCC this node belongs to
      const sccIdx = sccResult.components.findIndex(component => component.includes(nodeId));
      if (sccIdx !== -1) {
        sccResult.components[sccIdx].forEach(id => {
          const node = cytoscapeInstance.getElementById(id);
          if (node.length > 0) node.addClass('scc-highlight');
        });
      }
    };
    cytoscapeInstance.on('tap', 'node', handler);
    return () => {
      cytoscapeInstance.removeListener('tap', 'node', handler);
    };
  }, [cytoscapeInstance, sccResult]);

  // Highlight bridge edges
  useEffect(() => {
    if (!cytoscapeInstance) return;
    // Remove previous bridge classes
    cytoscapeInstance.edges().removeClass('edge-bridge');
    // Add bridge class to bridge edges
    bridges.forEach(([source, target]) => {
      // Try both source-target and target-source (since undirected)
      const edge1 = cytoscapeInstance.getElementById(`${source}-${target}`);
      const edge2 = cytoscapeInstance.getElementById(`${target}-${source}`);
      if (edge1.length > 0) edge1.addClass('edge-bridge');
      if (edge2.length > 0) edge2.addClass('edge-bridge');
    });
  }, [bridges, cytoscapeInstance]);

  // Highlight articulation points
  useEffect(() => {
    if (!cytoscapeInstance) return;
    cytoscapeInstance.nodes().removeClass('node-articulation');
    articulationPoints.forEach(nodeId => {
      const node = cytoscapeInstance.getElementById(nodeId);
      if (node.length > 0) node.addClass('node-articulation');
    });
  }, [articulationPoints, cytoscapeInstance]);

  // Highlight shortest path edges
  useEffect(() => {
    if (!cytoscapeInstance) return;
    cytoscapeInstance.edges().removeClass('edge-shortest-path');
    shortestPathEdges.forEach(edgeId => {
      const edge = cytoscapeInstance.getElementById(edgeId);
      if (edge.length > 0) edge.addClass('edge-shortest-path');
    });
  }, [shortestPathEdges, cytoscapeInstance]);

  // Highlight MST edges
  useEffect(() => {
    if (!cytoscapeInstance) return;
    cytoscapeInstance.edges().removeClass('edge-mst');
    mstEdges.forEach(edgeId => {
      const edge = cytoscapeInstance.getElementById(edgeId);
      if (edge.length > 0) edge.addClass('edge-mst');
    });
  }, [mstEdges, cytoscapeInstance]);

  if (error) {
    return (
      <div className="w-full h-full bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-4">Graph Visualization</h3>
          <p className="text-red-400 mb-4">{error}</p>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-300 text-sm">
              Graph Type: {settings.isDirected ? 'Directed' : 'Undirected'}
              {settings.isWeighted && ' | Weighted'}
            </p>
            <p className="text-gray-300 text-sm mt-2">
              Nodes: {graphData.nodes.length} | Edges: {graphData.edges.length}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      <div
        ref={containerRef}
        className="cytoscape-container w-full h-full"
      />
    </div>
  );
};

export default GraphView;
