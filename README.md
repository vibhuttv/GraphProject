# Graph Theory Visualizer

An interactive React application for visualizing graph theory concepts, designed specifically for competitive programmers. Built with Cytoscape.js and Tailwind CSS.

## Features

### 🎯 Core Functionality
- **Interactive Graph Visualization**: Render graphs using Cytoscape.js with smooth animations
- **Split-Screen Layout**:
  - Left side: Interactive graph view
  - Right side: Graph editor and algorithm controls
- **Graph Types**: Support for both directed and undirected graphs
- **Weighted Graphs**: Optional edge weights for weighted graph algorithms

### 📊 Graph Operations
- **Node Management**: Add/remove nodes with custom labels
- **Edge Management**: Add/remove edges with optional weights
- **Auto-Node Creation**: Automatically create nodes when adding edges
- **Isolated Nodes**: Render nodes without edges

### 🔍 Algorithm Visualizations
- **Depth-First Search (DFS)**:
  - Visualize traversal order
  - Edge classification (Tree, Back, Forward, Cross edges)
  - Color-coded edge types
- **Strongly Connected Components (SCC)**:
  - Kosaraju's algorithm implementation
  - Highlight SCCs with distinct colors
  - Component grouping display

### 🎨 Visual Features
- **Color-Coded Elements**:
  - Tree edges: Green
  - Back edges: Red
  - Forward edges: Blue
  - Cross edges: Yellow
  - Visited nodes: Cyan
  - SCC nodes: Purple
- **Interactive Elements**: Click on nodes and edges for debugging
- **Responsive Design**: Works on desktop and tablet devices

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd GraphProject
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Creating a Graph

1. **Add Nodes**: Use the "Add Nodes" section to create nodes
   - Enter a node ID and click "Add"
   - Nodes will appear in the graph visualization

2. **Add Edges**: Use the "Add Edges" section to create connections
   - Enter source and target node IDs
   - Optionally add a weight for weighted graphs
   - Nodes will be auto-created if they don't exist

3. **Graph Settings**: Toggle between:
   - Directed/Undirected graphs
   - Weighted/Unweighted graphs

### Running Algorithms

1. **DFS Visualization**:
   - Click "Run DFS" to start depth-first search
   - View the traversal order in the results panel
   - See edge classifications with color coding

2. **SCC Detection**:
   - Enable "Directed Graph" setting
   - Click "Find SCCs" to identify strongly connected components
   - View component groupings in the results panel

3. **Clear Results**: Use "Clear Results" to reset visualizations

## Project Structure

```
src/
├── components/
│   ├── GraphView.tsx          # Main graph visualization component
│   ├── GraphEditor.tsx        # Node/edge input forms
│   └── AlgorithmControls.tsx  # Settings and algorithm controls
├── types/
│   └── graph.ts              # TypeScript interfaces
├── utils/
│   └── graphAlgorithms.ts    # DFS and SCC implementations
├── App.tsx                   # Main application component
└── index.css                # Global styles and Tailwind imports
```

## Technologies Used

- **React 19** with TypeScript
- **Cytoscape.js** for graph visualization
- **Tailwind CSS** for styling
- **Vite** for build tooling

## Algorithm Details

### DFS Implementation
- Uses recursive depth-first search
- Tracks discovery and finish times
- Classifies edges based on DFS tree structure:
  - **Tree Edge**: Edge to unvisited node
  - **Back Edge**: Edge to ancestor in DFS tree
  - **Forward Edge**: Edge to descendant in DFS tree
  - **Cross Edge**: Edge between unrelated subtrees

### SCC Implementation (Kosaraju's Algorithm)
- Two-pass DFS approach
- First pass: Compute finish times
- Second pass: DFS on reversed graph in finish time order
- Groups nodes into strongly connected components

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Future Enhancements

- [ ] Breadth-First Search (BFS) visualization
- [ ] Shortest path algorithms (Dijkstra, Bellman-Ford)
- [ ] Minimum Spanning Tree algorithms
- [ ] Graph import/export functionality
- [ ] Custom graph layouts
- [ ] Animation controls for algorithm steps
- [ ] Performance metrics display

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Cytoscape.js team for the excellent graph visualization library
- Tailwind CSS for the utility-first CSS framework
- The competitive programming community for inspiration
