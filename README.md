# 🎯 Graph Theory Visualizer

A powerful, interactive web application for visualizing and analyzing graph algorithms with real-time updates and competitive programming features.

![Graph Theory Visualizer](https://img.shields.io/badge/React-18.2.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Cytoscape.js](https://img.shields.io/badge/Cytoscape.js-3.28.1-green) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.0-38B2AC)

## ✨ Features

### 🎨 **Modern Glassmorphism UI**
- Beautiful glassmorphism design with backdrop blur effects
- Responsive layout with split-screen interface
- Pill-style toggle buttons with gradient effects
- Real-time visual feedback and animations

### 📊 **Interactive Graph Editor**
- **Bulk Input**: Add multiple nodes and edges at once
- **Live Updates**: Graph changes reflect immediately in visualizations
- **Flexible Input**: Support for both directed/undirected and weighted/unweighted graphs
- **Dynamic Layout**: Automatic graph layout with smooth animations

### 🔍 **Advanced Graph Algorithms**

#### **Depth-First Search (DFS)**
- **Live Updates**: Automatically recalculates when graph changes
- **Edge Classification**: Color-coded edges by type:
  - 🟢 Tree edges (grey)
  - 🔵 Back edges (blue)
  - 🟢 Forward edges (green)
  - 🔴 Cross edges (red)
- **Visited Nodes**: Highlighted in cyan
- **Detailed Results**: Shows traversal order and edge classifications

#### **Strongly Connected Components (SCC)**
- **Tarjan's Algorithm**: Efficient SCC detection
- **Interactive Highlighting**: Click nodes to highlight their SCC
- **Unique Colors**: Each component gets a distinct color
- **Component Count**: Shows total number of SCCs found

#### **Bridge Detection**
- **Tarjan's Bridge Algorithm**: Finds all bridge edges
- **Red Highlighting**: Bridge edges highlighted in red
- **Live Updates**: Automatically updates when graph changes
- **Results Display**: Shows count and list of bridges

#### **Articulation Points**
- **Cut Vertex Detection**: Identifies articulation points
- **Red Glow Effect**: Articulation points highlighted with red border
- **Live Updates**: Recalculates on graph changes
- **Results Display**: Shows count and list of articulation points

#### **Shortest Path**
- **Smart Algorithm Selection**: Uses Dijkstra for weighted, BFS for unweighted
- **Interactive Controls**: Select start and end nodes
- **Purple Path Highlighting**: Shortest path edges in purple
- **Distance Calculation**: Shows total path distance
- **No Route Handling**: Displays "No route found" when appropriate

#### **Minimum Spanning Tree (MST)**
- **Kruskal's Algorithm**: Efficient MST computation
- **Green Edge Highlighting**: MST edges in green
- **Total Weight**: Shows MST total weight
- **Edge List**: Displays all MST edges

### 🎛️ **Smart Controls & Mutual Exclusivity**
- **Toggle System**: All algorithms work as toggles (ON/OFF)
- **Mutual Exclusivity**: Only one algorithm can be active at a time
- **Automatic Cleanup**: Turning on one algorithm clears others
- **Live Graph Updates**: All algorithms update automatically when graph changes

### 📱 **Responsive Design**
- **Mobile-Friendly**: Works on all screen sizes
- **Split Layout**: Graph view on left, controls on right
- **Scrollable Controls**: Handles many algorithm results
- **Touch Support**: Works with touch devices

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GraphProject
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📖 Usage Guide

### Creating a Graph

1. **Add Nodes**: Use the bulk input to add multiple nodes
   ```
   A,B,C,D,E
   ```

2. **Add Edges**: Specify edges with optional weights
   ```
   A-B:2,B-C:3,C-D:1,D-E:4
   ```

3. **Toggle Graph Settings**:
   - **Directed/Undirected**: Choose graph direction
   - **Weighted/Unweighted**: Enable/disable edge weights

### Running Algorithms

#### **DFS Analysis**
1. Click "DFS: OFF" to turn it on
2. View colored edges and visited nodes
3. Check results panel for traversal details

#### **SCC Detection** (Directed graphs only)
1. Ensure graph is directed
2. Click "Find SCCs"
3. Click nodes to highlight their components

#### **Bridge Detection**
1. Click "Bridges: OFF" to turn it on
2. Red edges indicate bridges
3. View bridge count and list

#### **Articulation Points**
1. Click "Articulation Points: OFF" to turn it on
2. Red-bordered nodes are articulation points
3. Check results for count and list

#### **Shortest Path**
1. Click "Shortest Route: OFF" to turn it on
2. Select start and end nodes
3. Purple path shows shortest route
4. View distance in results

#### **MST**
1. Click "Show random MST: OFF" to turn it on
2. Green edges form the MST
3. Check total weight in results

### Tips for Best Experience

- **Start Simple**: Begin with small graphs to understand features
- **Use Bulk Input**: Efficient for creating complex graphs
- **Toggle Settings**: Experiment with directed/undirected modes
- **Check Results**: Always review the results panel for detailed information
- **Live Updates**: Modify graphs while algorithms are running to see real-time changes

## 🛠️ Technical Stack

- **Frontend**: React 18 with TypeScript
- **Graph Visualization**: Cytoscape.js
- **Styling**: Tailwind CSS with custom glassmorphism
- **Build Tool**: Vite
- **Package Manager**: npm

## 🎯 Key Algorithms Implemented

| Algorithm | Complexity | Use Case |
|-----------|------------|----------|
| DFS | O(V + E) | Graph traversal, cycle detection |
| Tarjan's SCC | O(V + E) | Strongly connected components |
| Tarjan's Bridges | O(V + E) | Bridge edge detection |
| Articulation Points | O(V + E) | Cut vertex detection |
| Dijkstra's | O((V + E) log V) | Shortest path (weighted) |
| BFS | O(V + E) | Shortest path (unweighted) |
| Kruskal's MST | O(E log E) | Minimum spanning tree |

## 🔧 Development

### Project Structure
```
src/
├── components/
│   ├── AlgorithmControls.tsx    # Algorithm controls and results
│   ├── GraphEditor.tsx          # Graph input interface
│   ├── GraphView.tsx            # Cytoscape.js visualization
│   └── AlgorithmControls.module.css
├── types/
│   └── graph.ts                 # TypeScript type definitions
├── utils/
│   └── graphAlgorithms.ts       # Algorithm implementations
└── App.tsx                      # Main application component
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎨 UI/UX Features

- **Glassmorphism Design**: Modern frosted glass effect
- **Smooth Animations**: 300ms transitions for all interactions
- **Color-Coded Results**: Intuitive color scheme for different algorithms
- **Responsive Layout**: Adapts to different screen sizes
- **Interactive Elements**: Hover effects and visual feedback

## 🚀 Performance Features

- **Efficient Algorithms**: Optimized implementations for large graphs
- **Live Updates**: Real-time recalculation without performance impact
- **Memory Management**: Proper cleanup of Cytoscape instances
- **Debounced Updates**: Prevents excessive recalculations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Cytoscape.js** for powerful graph visualization
- **Tailwind CSS** for utility-first styling
- **React** for component-based architecture
- **Vite** for fast development experience

---

**Built with ❤️ for competitive programming and graph theory enthusiasts**
