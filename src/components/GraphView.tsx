import React, { useEffect, useRef, useState } from 'react';
import type { GraphData, GraphSettings, DFSResult, SCCResult } from '../types/graph';

interface GraphViewProps {
  graphData: GraphData;
  settings: GraphSettings;
  dfsResult?: DFSResult;
  sccResult?: SCCResult;
  onNodeClick?: (nodeId: string) => void;
  onEdgeClick?: (edgeId: string) => void;
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
  onEdgeClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cytoscapeInstance, setCytoscapeInstance] = useState<cytoscape.Core | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initCytoscape = async () => {
      try {
        const cytoscape = await import('cytoscape');
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
                label: edge.label || `${edge.source}->${edge.target}`
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
                'color': '#6b7280'
              }
            },
            {
              selector: '.edge-tree',
              style: {
                'line-color': '#10b981',
                'target-arrow-color': settings.isDirected ? '#10b981' : 'transparent'
              }
            },
            {
              selector: '.edge-back',
              style: {
                'line-color': '#ef4444',
                'target-arrow-color': settings.isDirected ? '#ef4444' : 'transparent'
              }
            },
            {
              selector: '.edge-forward',
              style: {
                'line-color': '#3b82f6',
                'target-arrow-color': settings.isDirected ? '#3b82f6' : 'transparent'
              }
            },
            {
              selector: '.edge-cross',
              style: {
                'line-color': '#f59e0b',
                'target-arrow-color': settings.isDirected ? '#f59e0b' : 'transparent'
              }
            },
            {
              selector: '.node-visited',
              style: {
                'background-color': '#06b6d4',
                'border-color': '#0891b2'
              }
            },
            {
              selector: '.node-scc',
              style: {
                'background-color': '#8b5cf6',
                'border-color': '#a855f7'
              }
            }
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
  }, []);

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
        label: edge.label || `${edge.source}->${edge.target}`
      }
    }));

    cytoscapeInstance.add([...nodes, ...edges]);
    cytoscapeInstance.layout({ name: 'cose', animate: true }).run();
  }, [graphData, cytoscapeInstance]);

  // Apply DFS styling
  useEffect(() => {
    if (!cytoscapeInstance || !dfsResult) return;

    // Clear previous styling
    cytoscapeInstance.elements().removeClass('node-visited edge-tree edge-back edge-forward edge-cross');

    // Apply visited node styling
    dfsResult.visited.forEach(nodeId => {
      const node = cytoscapeInstance.getElementById(nodeId);
      if (node.length > 0) {
        node.addClass('node-visited');
      }
    });

    // Apply edge classifications
    dfsResult.edgeClassifications.forEach(classification => {
      const edge = cytoscapeInstance.getElementById(classification.edgeId);
      if (edge.length > 0) {
        edge.addClass(`edge-${classification.type}`);
      }
    });
  }, [dfsResult, cytoscapeInstance]);

  // Apply SCC styling
  useEffect(() => {
    if (!cytoscapeInstance || !sccResult) return;

    // Clear previous SCC styling
    cytoscapeInstance.elements().removeClass('node-scc');

    // Apply SCC styling
    sccResult.components.forEach(component => {
      component.forEach(nodeId => {
        const node = cytoscapeInstance.getElementById(nodeId);
        if (node.length > 0) {
          node.addClass('node-scc');
        }
      });
    });
  }, [sccResult, cytoscapeInstance]);

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
