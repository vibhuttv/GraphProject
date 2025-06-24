import { useState, useEffect } from 'react';
// import React, { useState } from 'react';
import GraphView from './components/GraphView';
import GraphEditor from './components/GraphEditor';
import AlgorithmControls from './components/AlgorithmControls';
import type { GraphData, GraphSettings, DFSResult, SCCResult } from './types/graph';
import { runDFS, findSCCs, findBridges, findArticulationPoints } from './utils/graphAlgorithms';
import './App.css';

function App() {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
  const [settings, setSettings] = useState<GraphSettings>({
    isDirected: false,
    isWeighted: false
  });
  const [dfsResult, setDfsResult] = useState<DFSResult | undefined>();
  const [sccResult, setSccResult] = useState<SCCResult | undefined>();
  const [bridgesOn, setBridgesOn] = useState(false);
  const [bridges, setBridges] = useState<[string, string][]>([]);
  const [articulationOn, setArticulationOn] = useState(false);
  const [articulationPoints, setArticulationPoints] = useState<string[]>([]);

  const handleRunDFS = () => {
    if (graphData.nodes.length > 0) {
      const result = runDFS(graphData);
      setDfsResult(result);
      setSccResult(undefined); // Clear SCC results when running DFS
    }
  };

  const handleRunSCC = () => {
    if (graphData.nodes.length > 0 && settings.isDirected) {
      const result = findSCCs(graphData);
      setSccResult(result);
      setDfsResult(undefined); // Clear DFS results when running SCC
    }
  };

  const handleClearResults = () => {
    setDfsResult(undefined);
    setSccResult(undefined);
    setBridges([]);
    setBridgesOn(false);
    setArticulationPoints([]);
    setArticulationOn(false);
  };

  const handleToggleBridges = (on: boolean) => {
    setBridgesOn(on);
    if (on) {
      const { bridges } = findBridges(graphData);
      setBridges(bridges);
    } else {
      setBridges([]);
    }
  };

  const handleToggleArticulation = (on: boolean) => {
    setArticulationOn(on);
    if (on) {
      const { points } = findArticulationPoints(graphData);
      setArticulationPoints(points);
    } else {
      setArticulationPoints([]);
    }
  };

  const handleNodeClick = (nodeId: string) => {
    console.log('Node clicked:', nodeId);
  };

  const handleEdgeClick = (edgeId: string) => {
    console.log('Edge clicked:', edgeId);
  };

  // Recompute bridges when graph updates and bridgesOn is true
  useEffect(() => {
    if (bridgesOn) {
      const { bridges } = findBridges(graphData);
      setBridges(bridges);
    }
    if (articulationOn) {
      const { points } = findArticulationPoints(graphData);
      setArticulationPoints(points);
    }
  }, [graphData, bridgesOn, articulationOn]);

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/10 backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-white drop-shadow">Graph Theory Visualizer</h1>
          <p className="text-white/80 mt-1 drop-shadow">Interactive visualization for competitive programming graph algorithms</p>
        </div>
      </header>

      {/* Main Content */}

      <main className="container mx-auto px-6 py-6 h-[calc(100vh-120px)]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Left Side - Graph View */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg p-4 flex flex-col h-[500px]">
              <h2 className="text-xl font-semibold text-white mb-4 drop-shadow">Graph Visualization</h2>
              <div className="flex-1 min-h-0 h-full">
                <GraphView
                  graphData={graphData}
                  settings={settings}
                  dfsResult={dfsResult}
                  sccResult={sccResult}
                  onNodeClick={handleNodeClick}
                  onEdgeClick={handleEdgeClick}
                  bridges={bridgesOn ? bridges : []}
                  articulationPoints={articulationOn ? articulationPoints : []}
                />
              </div>
            </div>
          </div>

          {/* Right Side - Controls */}
          <div className="space-y-6 overflow-y-auto">
            {/* Graph Editor */}
            <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg p-4">
              <h2 className="text-xl font-semibold text-white mb-4 drop-shadow">Graph Editor</h2>
              <GraphEditor graphData={graphData} onGraphDataChange={setGraphData} />
            </div>

            {/* Algorithm Controls */}
            <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg p-4">
              <h2 className="text-xl font-semibold text-white mb-4 drop-shadow">Controls</h2>
              <AlgorithmControls
                settings={settings}
                onSettingsChange={setSettings}
                graphData={graphData}
                onRunDFS={handleRunDFS}
                onRunSCC={handleRunSCC}
                onClearResults={handleClearResults}
                dfsResult={dfsResult}
                sccResult={sccResult}
                bridgesOn={bridgesOn}
                onToggleBridges={handleToggleBridges}
                articulationOn={articulationOn}
                onToggleArticulation={handleToggleArticulation}
              />
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}

export default App;
