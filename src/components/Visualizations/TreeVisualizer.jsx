import { useState } from 'react';

const TreeNode = ({ node, x, y, level, onNodeClick, highlighted }) => {
  if (!node) return null;

  const nodeRadius = 25;
  const levelHeight = 80;
  const horizontalSpacing = 100 / Math.pow(2, level);

  return (
    <g>
      {/* Lines to children */}
      {node.left && (
        <line
          x1={x}
          y1={y}
          x2={x - horizontalSpacing}
          y2={y + levelHeight}
          stroke="#8b5cf6"
          strokeWidth="2"
          className="transition-all duration-300"
        />
      )}
      {node.right && (
        <line
          x1={x}
          y1={y}
          x2={x + horizontalSpacing}
          y2={y + levelHeight}
          stroke="#8b5cf6"
          strokeWidth="2"
          className="transition-all duration-300"
        />
      )}

      {/* Current Node */}
      <circle
        cx={x}
        cy={y}
        r={nodeRadius}
        fill={highlighted ? '#fbbf24' : '#8b5cf6'}
        stroke="#fff"
        strokeWidth="2"
        className="cursor-pointer transition-all duration-300 hover:fill-purple-400"
        onClick={() => onNodeClick && onNodeClick(node)}
      />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dy=".3em"
        fill="white"
        fontSize="14"
        fontWeight="bold"
        className="pointer-events-none"
      >
        {node.val}
      </text>

      {/* Render children */}
      {node.left && (
        <TreeNode
          node={node.left}
          x={x - horizontalSpacing}
          y={y + levelHeight}
          level={level + 1}
          onNodeClick={onNodeClick}
          highlighted={highlighted}
        />
      )}
      {node.right && (
        <TreeNode
          node={node.right}
          x={x + horizontalSpacing}
          y={y + levelHeight}
          level={level + 1}
          onNodeClick={onNodeClick}
          highlighted={highlighted}
        />
      )}
    </g>
  );
};

const TreeVisualizer = ({ tree, traversalOrder = [], currentNode = null }) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [viewBox, setViewBox] = useState('0 0 800 600');

  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-purple-500/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Binary Tree Visualization</h3>
        <div className="flex items-center gap-4">
          {traversalOrder.length > 0 && (
            <div className="text-sm text-gray-400">
              Traversal: {traversalOrder.join(' → ')}
            </div>
          )}
        </div>
      </div>

      {/* SVG Tree */}
      <div className="bg-slate-900/50 rounded-lg p-4 overflow-auto">
        <svg
          viewBox={viewBox}
          className="w-full h-[400px]"
          style={{ minHeight: '400px' }}
        >
          {tree && (
            <TreeNode
              node={tree}
              x={400}
              y={50}
              level={0}
              onNodeClick={handleNodeClick}
              highlighted={currentNode === tree.val}
            />
          )}
        </svg>
      </div>

      {/* Node Info */}
      {selectedNode && (
        <div className="mt-4 bg-slate-900/50 rounded-lg p-4 border border-purple-500/20">
          <h4 className="text-sm font-bold text-purple-400 mb-2">Selected Node</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Value:</span>
              <span className="ml-2 text-white font-bold">{selectedNode.val}</span>
            </div>
            <div>
              <span className="text-gray-400">Left:</span>
              <span className="ml-2 text-white">{selectedNode.left?.val || 'null'}</span>
            </div>
            <div>
              <span className="text-gray-400">Right:</span>
              <span className="ml-2 text-white">{selectedNode.right?.val || 'null'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tree Info */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="bg-slate-900/50 rounded-lg p-3 border border-purple-500/20">
          <div className="text-xs text-gray-400 mb-1">Height</div>
          <div className="text-lg font-bold text-white">{calculateHeight(tree)}</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3 border border-purple-500/20">
          <div className="text-xs text-gray-400 mb-1">Nodes</div>
          <div className="text-lg font-bold text-white">{countNodes(tree)}</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3 border border-purple-500/20">
          <div className="text-xs text-gray-400 mb-1">Balanced</div>
          <div className="text-lg font-bold text-white">{isBalanced(tree) ? 'Yes' : 'No'}</div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
function calculateHeight(node) {
  if (!node) return 0;
  return 1 + Math.max(calculateHeight(node.left), calculateHeight(node.right));
}

function countNodes(node) {
  if (!node) return 0;
  return 1 + countNodes(node.left) + countNodes(node.right);
}

function isBalanced(node) {
  if (!node) return true;
  const leftHeight = calculateHeight(node.left);
  const rightHeight = calculateHeight(node.right);
  return Math.abs(leftHeight - rightHeight) <= 1 && isBalanced(node.left) && isBalanced(node.right);
}

export default TreeVisualizer;
