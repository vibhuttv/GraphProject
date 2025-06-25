import React from 'react';
import type { GraphSettings, GraphData, DFSResult, SCCResult, ShortestPathResult, MSTResult } from '../types/graph';
import styles from './AlgorithmControls.module.css';

interface AlgorithmControlsProps {
  settings: GraphSettings;
  onSettingsChange: (settings: GraphSettings) => void;
  graphData: GraphData;
  dfsOn: boolean;
  onToggleDFS: (on: boolean) => void;
  onRunSCC: () => void;
  onClearResults: () => void;
  dfsResult?: DFSResult;
  sccResult?: SCCResult;
  bridgesOn: boolean;
  onToggleBridges: (on: boolean) => void;
  articulationOn: boolean;
  onToggleArticulation: (on: boolean) => void;
  shortestRouteOn: boolean;
  onToggleShortestRoute: (on: boolean) => void;
  shortestPathResult?: ShortestPathResult | null;
  startNode: string;
  endNode: string;
  onStartNodeChange: (nodeId: string) => void;
  onEndNodeChange: (nodeId: string) => void;
  mstOn: boolean;
  onToggleMST: (on: boolean) => void;
  mstResult?: MSTResult;
  bridges?: [string, string][];
  articulationPoints?: string[];
}

const AlgorithmControls: React.FC<AlgorithmControlsProps> = ({
  settings,
  onSettingsChange,
  graphData,
  dfsOn,
  onToggleDFS,
  onRunSCC,
  onClearResults,
  dfsResult,
  sccResult,
  bridgesOn,
  onToggleBridges,
  articulationOn,
  onToggleArticulation,
  shortestRouteOn,
  onToggleShortestRoute,
  shortestPathResult,
  startNode,
  endNode,
  onStartNodeChange,
  onEndNodeChange,
  mstOn,
  onToggleMST,
  mstResult,
  bridges,
  articulationPoints
}) => {
  console.log('AlgorithmControls render:', {
    shortestRouteOn,
    startNode,
    endNode,
    shortestPathResult,
    shouldShowNoRoute: shortestRouteOn && startNode && endNode && shortestPathResult === null
  });

  return (
    <div className="space-y-6">
      {/* Graph Settings */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-3">Graph Settings</h3>
        <div className="space-y-3">
          {/* Directed/Undirected Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Direction</span>
            <div className={styles.toggleGroup}>
              <button
                onClick={() => onSettingsChange({ ...settings, isDirected: true })}
                className={[
                  styles.toggleBtn,
                  settings.isDirected ? styles.active : styles.inactive
                ].join(' ')}
              >
                Directed
              </button>
              <button
                onClick={() => onSettingsChange({ ...settings, isDirected: false })}
                className={[
                  styles.toggleBtn,
                  settings.isDirected ? styles.inactive : styles.active
                ].join(' ')}
              >
                Undirected
              </button>
            </div>
          </div>
          {/* Weighted/Unweighted Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Weight</span>
            <div className={styles.toggleGroup}>
              <button
                onClick={() => onSettingsChange({ ...settings, isWeighted: true })}
                className={[
                  styles.toggleBtn,
                  styles.green,
                  settings.isWeighted ? styles.active : styles.inactive
                ].join(' ')}
              >
                Weighted
              </button>
              <button
                onClick={() => onSettingsChange({ ...settings, isWeighted: false })}
                className={[
                  styles.toggleBtn,
                  styles.green,
                  settings.isWeighted ? styles.inactive : styles.active
                ].join(' ')}
              >
                Unweighted
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Algorithm Controls */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-3">Algorithms</h3>
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => onToggleDFS(!dfsOn)}
            disabled={graphData.nodes.length === 0}
            className={[
              'w-full px-4 py-2 rounded transition-colors',
              dfsOn
                ? 'bg-gradient-to-r from-purple-500 via-purple-400 to-purple-600 text-white shadow-lg'
                : 'bg-gray-600 text-white',
              graphData.nodes.length === 0 ? 'disabled:bg-gray-600 disabled:cursor-not-allowed' : ''
            ].join(' ')}
          >
            {dfsOn ? 'DFS: ON' : 'DFS: OFF'}
          </button>
          <button
            onClick={onRunSCC}
            disabled={graphData.nodes.length === 0 || !settings.isDirected}
            className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Find SCCs
          </button>
          <button
            type="button"
            onClick={() => onToggleBridges(!bridgesOn)}
            className={[
              'w-full px-4 py-2 rounded transition-colors',
              bridgesOn
                ? 'bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-white shadow-lg'
                : 'bg-gray-600 text-white',
            ].join(' ')}
          >
            {bridgesOn ? 'Bridges: ON' : 'Bridges: OFF'}
          </button>
          <button
            type="button"
            onClick={() => onToggleArticulation(!articulationOn)}
            className={[
              'w-full px-4 py-2 rounded transition-colors',
              articulationOn
                ? 'bg-gradient-to-r from-red-500 via-red-400 to-red-600 text-white shadow-lg'
                : 'bg-gray-600 text-white',
            ].join(' ')}
          >
            {articulationOn ? 'Articulation Points: ON' : 'Articulation Points: OFF'}
          </button>
          <button
            type="button"
            onClick={() => onToggleShortestRoute(!shortestRouteOn)}
            className={[
              'w-full px-4 py-2 rounded transition-colors',
              shortestRouteOn
                ? 'bg-gradient-to-r from-purple-500 via-purple-400 to-purple-600 text-white shadow-lg'
                : 'bg-gray-600 text-white',
            ].join(' ')}
          >
            {shortestRouteOn ? 'Shortest Route: ON' : 'Shortest Route: OFF'}
          </button>
          <button
            type="button"
            onClick={() => onToggleMST(!mstOn)}
            className={[
              'w-full px-4 py-2 rounded transition-colors',
              mstOn
                ? 'bg-gradient-to-r from-green-500 via-green-400 to-green-600 text-white shadow-lg'
                : 'bg-gray-600 text-white',
            ].join(' ')}
          >
            {mstOn ? 'Show random MST: ON' : 'Show random MST: OFF'}
          </button>
          <button
            onClick={onClearResults}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Clear Results
          </button>
        </div>
      </div>

      {/* Shortest Route Controls */}
      {shortestRouteOn && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">Shortest Route</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Start Node</label>
              <select
                value={startNode}
                onChange={(e) => onStartNodeChange(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-purple-500"
              >
                <option value="">Select start node</option>
                {graphData.nodes.map(node => (
                  <option key={node.id} value={node.id}>
                    {node.label || node.id}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">End Node</label>
              <select
                value={endNode}
                onChange={(e) => onEndNodeChange(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-purple-500"
              >
                <option value="">Select end node</option>
                {graphData.nodes.map(node => (
                  <option key={node.id} value={node.id}>
                    {node.label || node.id}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results Display */}
      {(dfsResult || sccResult || shortestPathResult) && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">Results</h3>

          {dfsResult && (
            <div className="mb-4">
              <h4 className="text-md font-medium text-purple-300 mb-2">DFS Results</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-300">Visited Order: </span>
                  <span className="text-white">{dfsResult.visited.join(' → ')}</span>
                </div>
                <div>
                  <span className="text-gray-300">Edge Classifications: </span>
                  <div className="mt-1 space-y-1">
                    {dfsResult.edgeClassifications.map(classification => (
                      <div key={classification.edgeId} className="ml-4">
                        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                          classification.type === 'tree' ? 'bg-gray-500' :
                          classification.type === 'back' ? 'bg-blue-500' :
                          classification.type === 'forward' ? 'bg-green-500' :
                          'bg-red-500'
                        }`}></span>
                        <span className="text-white">{classification.edgeId}: {classification.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {sccResult && (
            <div>
              <h4 className="text-md font-medium text-orange-300 mb-2">Strongly Connected Components</h4>
              <div className="space-y-2 text-sm">
                {sccResult.components.map((component, index) => (
                  <div key={index} className="bg-gray-700 px-3 py-2 rounded">
                    <span className="text-gray-300">Component {index + 1}: </span>
                    <span className="text-white">{component.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {shortestPathResult && (
            <div>
              <h4 className="text-md font-medium text-purple-300 mb-2">Shortest Path</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-300">Path: </span>
                  <span className="text-white">{shortestPathResult.path.join(' → ')}</span>
                </div>
                <div>
                  <span className="text-gray-300">Distance: </span>
                  <span className="text-white">{shortestPathResult.distance}</span>
                </div>
              </div>
            </div>
          )}

          {shortestRouteOn && startNode && endNode && !shortestPathResult && (
            <div>
              <h4 className="text-md font-medium text-purple-300 mb-2">Shortest Path</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-300">Path: </span>
                  <span className="text-white">-</span>
                </div>
                <div>
                  <span className="text-gray-300">Distance: </span>
                  <span className="text-red-400">Shortest route not found</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MST Results */}
      {mstOn && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">MST</h3>
          <div className="space-y-3">
            {mstResult && (
              <div>
                <h4 className="text-md font-medium text-green-300 mb-2">Minimum Spanning Tree</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-300">Total Weight: </span>
                    <span className="text-white">{mstResult.totalWeight}</span>
                  </div>
                  <div>
                    <span className="text-gray-300">Edges: </span>
                    <span className="text-white">{mstResult.edges.join(', ')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bridges Results */}
      {bridgesOn && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">Bridges</h3>
          <div className="space-y-3">
            <div>
              <h4 className="text-md font-medium text-yellow-300 mb-2">Bridge Edges</h4>
              <div className="space-y-2 text-sm">
                {bridges && bridges.length > 0 ? (
                  <div>
                    <span className="text-gray-300">Found {bridges.length} bridge(s): </span>
                    <div className="mt-1 space-y-1">
                      {bridges.map(([source, target], index) => (
                        <div key={index} className="ml-4">
                          <span className="text-white">{source} - {target}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="text-gray-300">No bridges found in the graph</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Articulation Points Results */}
      {articulationOn && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">Articulation Points</h3>
          <div className="space-y-3">
            <div>
              <h4 className="text-md font-medium text-red-300 mb-2">Articulation Points</h4>
              <div className="space-y-2 text-sm">
                {articulationPoints && articulationPoints.length > 0 ? (
                  <div>
                    <span className="text-gray-300">Found {articulationPoints.length} articulation point(s): </span>
                    <div className="mt-1">
                      <span className="text-white">{articulationPoints.join(', ')}</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="text-gray-300">No articulation points found in the graph</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-3">Legend</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-gray-300">Tree Edge</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-gray-300">Back Edge</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-gray-300">Forward Edge</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-gray-300">Cross Edge</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2"></div>
            <span className="text-gray-300">Visited Node</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            <span className="text-gray-300">SCC Node</span>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default AlgorithmControls;
