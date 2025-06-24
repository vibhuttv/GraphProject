import React, { useState, useEffect } from 'react';
import type { Node, Edge, GraphData } from '../types/graph';

interface GraphEditorProps {
  graphData: GraphData;
  onGraphDataChange: (data: GraphData) => void;
}

const GraphEditor: React.FC<GraphEditorProps> = ({ graphData, onGraphDataChange }) => {
  const [bulkInput, setBulkInput] = useState('');

  // Parse bulk input and update graph on every change
  useEffect(() => {
    const lines = bulkInput.split('\n').map(line => line.trim()).filter(Boolean);
    const nodes: Record<string, Node> = {};
    const edges: Edge[] = [];
    for (const line of lines) {
      const parts = line.split(/\s+/);
      if (parts.length === 1) {
        // Node
        const id = parts[0];
        nodes[id] = { id, label: id };
      } else if (parts.length === 2 || parts.length === 3) {
        // Edge (with optional weight)
        const [source, target, weightStr] = parts;
        nodes[source] = { id: source, label: source };
        nodes[target] = { id: target, label: target };
        const edge: Edge = {
          id: `${source}-${target}`,
          source,
          target,
        };
        if (weightStr !== undefined && !isNaN(Number(weightStr))) {
          edge.weight = parseFloat(weightStr);
        }
        edges.push(edge);
      }
      // Ignore lines with more than 3 parts
    }
    // Only update if different from current graphData
    const newNodes = Object.values(nodes);
    const isSameNodes = newNodes.length === graphData.nodes.length && newNodes.every(n => graphData.nodes.some(g => g.id === n.id));
    const isSameEdges = edges.length === graphData.edges.length && edges.every(e => graphData.edges.some(g => g.id === e.id && g.source === e.source && g.target === e.target && g.weight === e.weight));
    if (!isSameNodes || !isSameEdges) {
      onGraphDataChange({ nodes: newNodes, edges });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bulkInput]);


  return (
    <div className="space-y-6">
      {/* Bulk Input Section */}
      <div className="p-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-3 drop-shadow">Bulk Input (Nodes & Edges)</h3>
        <textarea
          value={bulkInput}
          onChange={e => setBulkInput(e.target.value)}
          placeholder={`A\nB\nA B\nA B 5`}
          rows={6}
          className="w-full px-3 py-2 bg-white/20 text-white rounded-lg border border-white/30 focus:border-blue-400 focus:outline-none resize-none mb-2 backdrop-blur placeholder:text-white/60 shadow-inner"
          style={{boxShadow: '0 4px 32px 0 rgba(31, 38, 135, 0.15)'}}
        />
        <div className="text-xs text-white/70">One node or edge per line. For edges: <code>source target [weight]</code>. For nodes: <code>id</code>.</div>
      </div>
    </div>
  );
};

export default GraphEditor;
