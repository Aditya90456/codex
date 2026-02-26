# 🎮 Live 3D Dry Run - Real-Time Algorithm Visualization

## 🌟 Overview

Experience algorithms in stunning 3D as you type! Watch data structures come alive with real-time visualization using Three.js and React Three Fiber.

## ✨ Features

### 1. 3D Data Structure Visualization
- **Arrays**: Animated 3D boxes with indices
- **Stacks**: Vertical tower with push/pop animations
- **Trees**: Binary tree with connected nodes
- **Graphs**: Network visualization with edges

### 2. Real-Time Code Parsing
- Detects data structures as you type
- Auto-switches visualization type
- Instant feedback on code changes

### 3. Interactive 3D Controls
- Orbit camera (drag to rotate)
- Zoom in/out (scroll wheel)
- Auto-rotate mode
- Fullscreen toggle

### 4. Step-by-Step Execution
- Play/Pause controls
- Step through algorithm
- Progress tracking
- Execution descriptions

## 🎯 Supported Data Structures

### Arrays
```javascript
const nums = [2, 7, 11, 15];
for (let i = 0; i < nums.length; i++) {
  // 3D boxes appear with values
}
```

### Stacks
```javascript
const stack = [];
stack.push(10);  // Watch it grow upward
stack.push(20);
stack.pop();     // See it shrink
```

### Binary Trees
```javascript
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}
// 3D spheres with connecting lines
```

### Graphs
```javascript
const graph = {
  nodes: ['A', 'B', 'C'],
  edges: [[0,1], [1,2]]
};
// 3D network visualization
```

## 🎨 Visual Elements

### Color Coding
- **Blue (#3b82f6)**: Normal array elements
- **Purple (#a855f7)**: Highlighted/active elements
- **Green (#10b981)**: Tree nodes
- **Orange (#f59e0b)**: Current tree node
- **Red (#ef4444)**: Stack top
- **Cyan (#06b6d4)**: Graph nodes
- **Pink (#ec4899)**: Active graph node

### Animations
- Rotation on highlight
- Smooth transitions
- Glow effects
- Float animations

## 🎮 Controls

### Camera Controls
- **Left Click + Drag**: Rotate view
- **Right Click + Drag**: Pan view
- **Scroll Wheel**: Zoom in/out
- **Auto-Rotate**: Toggle automatic rotation

### Playback Controls
- **Play ▶️**: Start automatic execution
- **Pause ⏸️**: Stop automatic execution
- **Reset 🔄**: Return to beginning
- **Progress Bar**: Jump to specific step

### View Controls
- **Eye 👁️**: Toggle auto-rotate
- **Maximize ⛶**: Toggle fullscreen
- **Close ✕**: Hide visualization

## 📦 Installation

```bash
npm install three @react-three/fiber @react-three/drei
```

## 🔧 Integration

### In LeetCode Editor

```jsx
import LiveTyping3DDryRun from './components/LiveTyping3DDryRun';

const [show3D, setShow3D] = useState(false);

<LiveTyping3DDryRun
  code={code}
  language={language}
  isVisible={show3D}
  onClose={() => setShow3D(false)}
/>
```

### Toggle Button

```jsx
<button onClick={() => setShow3D(!show3D)}>
  <Activity className="w-5 h-5" />
  3D Dry Run
</button>
```

## 🎬 How It Works

### 1. Code Detection
```javascript
function parseCodeTo3DData(code, language) {
  // Detects keywords: array, stack, tree, graph
  // Extracts data from code
  // Generates visualization steps
}
```

### 2. 3D Rendering
```javascript
<Canvas camera={{ position: [0, 5, 10] }}>
  <Scene3D
    visualizationType="array"
    data={data}
    highlightIndex={currentIndex}
  />
</Canvas>
```

### 3. Step Generation
```javascript
const steps = [
  {
    data: { array: [1, 2, 3] },
    highlightIndex: 0,
    description: "Accessing array[0]"
  },
  // ... more steps
];
```

## 🎨 Customization

### Change Colors
```jsx
<meshStandardMaterial
  color="#your-color"
  emissive="#glow-color"
  emissiveIntensity={0.5}
/>
```

### Adjust Spacing
```javascript
const spacing = 1.5; // Distance between elements
```

### Camera Position
```jsx
<Canvas camera={{ position: [x, y, z], fov: 50 }}>
```

## 🚀 Performance Tips

1. **Limit Elements**: Keep arrays under 20 items
2. **Reduce Quality**: Lower sphere segments for mobile
3. **Disable Auto-Rotate**: On slower devices
4. **Use LOD**: Level of Detail for complex scenes

## 📱 Responsive Design

### Desktop
- Full controls
- Large canvas
- High quality rendering

### Tablet
- Touch controls
- Medium canvas
- Optimized quality

### Mobile
- Simplified controls
- Compact view
- Lower quality for performance

## 🎯 Use Cases

### Learning
- Understand algorithm flow
- Visualize data transformations
- See complexity in action

### Debugging
- Spot logic errors
- Track variable changes
- Identify edge cases

### Teaching
- Demonstrate concepts
- Interactive presentations
- Student engagement

### Interview Prep
- Practice explanations
- Visualize solutions
- Build intuition

## 🔥 Advanced Features

### Custom Data Structures
```javascript
// Add your own visualization
case 'heap':
  return <Heap3D data={data} />;
```

### Animation Speed
```javascript
const [speed, setSpeed] = useState(1000); // ms per step
```

### Export View
```javascript
// Capture 3D scene as image
const screenshot = canvas.toDataURL();
```

## 🎉 Benefits

- **Intuitive**: See algorithms in 3D space
- **Interactive**: Control camera and playback
- **Real-time**: Updates as you type
- **Beautiful**: Smooth animations and effects
- **Educational**: Perfect for learning
- **Professional**: Production-ready quality

## 🌈 Example Scenarios

### Two Sum Problem
```javascript
const nums = [2, 7, 11, 15];
const target = 9;
// See array in 3D, watch indices highlight
```

### Binary Search
```javascript
// Watch the search space shrink in 3D
```

### Tree Traversal
```javascript
// Follow the path through 3D tree nodes
```

### Graph BFS/DFS
```javascript
// See the exploration pattern in 3D space
```

Your algorithms now live in 3D! 🎮✨
