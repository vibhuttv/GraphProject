import React from 'react';
import type { GraphSettings, GraphData, DFSResult, SCCResult } from '../types/graph';
import styles from './AlgorithmControls.module.css';

interface AlgorithmControlsProps {
  settings: GraphSettings;
  onSettingsChange: (settings: GraphSettings) => void;
  graphData: GraphData;
  onRunDFS: () => void;
  onRunSCC: () => void;
  onClearResults: () => void;
  dfsResult?: DFSResult;
  sccResult?: SCCResult;
  bridgesOn: boolean;
  onToggleBridges: (on: boolean) => void;
  articulationOn: boolean;
  onToggleArticulation: (on: boolean) => void;
}

const AlgorithmControls: React.FC<AlgorithmControlsProps> = ({
  settings,
  onSettingsChange,
  graphData,
  onRunDFS,
  onRunSCC,
  onClearResults,
  dfsResult,
  sccResult,
  bridgesOn,
  onToggleBridges,
  articulationOn,
  onToggleArticulation
}) => {
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
            onClick={onRunDFS}
            disabled={graphData.nodes.length === 0}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Run DFS
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
            onClick={onClearResults}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Clear Results
          </button>
        </div>
      </div>

      {/* Results Display */}
      {(dfsResult || sccResult) && (
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
                          classification.type === 'tree' ? 'bg-green-500' :
                          classification.type === 'back' ? 'bg-red-500' :
                          classification.type === 'forward' ? 'bg-blue-500' :
                          'bg-yellow-500'
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
        </div>
      )}

      {/* Legend */}
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
      </div>
    </div>
  );
};

export default AlgorithmControls;
