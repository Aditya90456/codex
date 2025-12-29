import { useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  FileText, 
  ChevronRight, 
  ChevronDown,
  Plus,
  Search
} from 'lucide-react';

const FileExplorer = ({ onFileSelect, isVisible }) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['src']));
  const [searchTerm, setSearchTerm] = useState('');

  // Mock file structure
  const fileStructure = {
    name: 'project',
    type: 'folder',
    children: [
      {
        name: 'src',
        type: 'folder',
        children: [
          { name: 'App.jsx', type: 'file', language: 'javascript' },
          { name: 'main.jsx', type: 'file', language: 'javascript' },
          { name: 'index.css', type: 'file', language: 'css' },
          {
            name: 'components',
            type: 'folder',
            children: [
              { name: 'CodexEditor.jsx', type: 'file', language: 'javascript' },
              { name: 'WelcomeScreen.jsx', type: 'file', language: 'javascript' },
              { name: 'FileExplorer.jsx', type: 'file', language: 'javascript' },
            ]
          },
          {
            name: 'utils',
            type: 'folder',
            children: [
              { name: 'helpers.js', type: 'file', language: 'javascript' },
              { name: 'constants.js', type: 'file', language: 'javascript' },
            ]
          }
        ]
      },
      { name: 'package.json', type: 'file', language: 'json' },
      { name: 'README.md', type: 'file', language: 'markdown' },
      { name: 'vite.config.js', type: 'file', language: 'javascript' },
    ]
  };

  const toggleFolder = (folderPath) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath);
    } else {
      newExpanded.add(folderPath);
    }
    setExpandedFolders(newExpanded);
  };

  const getFileIcon = (fileName) => {
    return <FileText size={16} className="text-blue-400" />;
  };

  const renderFileTree = (node, path = '', level = 0) => {
    const fullPath = path ? `${path}/${node.name}` : node.name;
    const isExpanded = expandedFolders.has(fullPath);
    
    if (searchTerm && !node.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return null;
    }

    return (
      <div key={fullPath}>
        <div
          className={`flex items-center py-1 px-2 hover:bg-gray-700 cursor-pointer text-sm`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(fullPath);
            } else {
              onFileSelect?.(node);
            }
          }}
        >
          {node.type === 'folder' ? (
            <>
              {isExpanded ? (
                <ChevronDown size={16} className="text-gray-400 mr-1" />
              ) : (
                <ChevronRight size={16} className="text-gray-400 mr-1" />
              )}
              {isExpanded ? (
                <FolderOpen size={16} className="text-yellow-400 mr-2" />
              ) : (
                <Folder size={16} className="text-yellow-400 mr-2" />
              )}
            </>
          ) : (
            <>
              <div className="w-4 mr-1" />
              {getFileIcon(node.name)}
              <span className="ml-2" />
            </>
          )}
          <span className="text-gray-200">{node.name}</span>
        </div>
        
        {node.type === 'folder' && isExpanded && node.children && (
          <div>
            {node.children.map(child => renderFileTree(child, fullPath, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (!isVisible) return null;

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-3 border-b border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-200">Explorer</h3>
          <button className="text-gray-400 hover:text-white">
            <Plus size={16} />
          </button>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-700 text-white text-xs px-7 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {renderFileTree(fileStructure)}
      </div>
    </div>
  );
};

export default FileExplorer;