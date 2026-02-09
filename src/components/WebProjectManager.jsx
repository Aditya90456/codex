import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import {
  FolderPlus,
  FolderOpen,
  File,
  MoreVertical,
  Edit2,
  Trash2,
  Copy,
  Move,
  X,
  Check,
  Search,
  Grid,
  List,
  Clock,
  Code
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const WebProjectManager = ({ onLoadProject, onClose }) => {
  const { user } = useUser();
  const [folders, setFolders] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('default');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolder, setEditingFolder] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`${API_URL}/api/web-projects/user/${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setFolders(data.folders);
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const createFolder = async () => {
    if (!newFolderName.trim() || !user) return;
    
    try {
      const response = await fetch(`${API_URL}/api/web-projects/folder/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name: newFolderName,
          color: 'blue',
          icon: '📁'
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setFolders(data.folders);
        setNewFolderName('');
        setShowNewFolder(false);
      }
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const renameFolder = async (folderId, newName) => {
    if (!user) return;
    
    try {
      const response = await fetch(`${API_URL}/api/web-projects/folder/rename`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          folderId,
          newName
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setFolders(data.folders);
        setEditingFolder(null);
      }
    } catch (error) {
      console.error('Error renaming folder:', error);
    }
  };

  const deleteFolder = async (folderId) => {
    if (!user || folderId === 'default') return;
    if (!confirm('Delete this folder? Projects will be moved to "My Projects".')) return;
    
    try {
      const response = await fetch(`${API_URL}/api/web-projects/folder/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          folderId
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setFolders(data.folders);
        setProjects(data.projects);
        if (selectedFolder === folderId) {
          setSelectedFolder('default');
        }
      }
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  const deleteProject = async (projectId) => {
    if (!user) return;
    if (!confirm('Delete this project? This cannot be undone.')) return;
    
    try {
      const response = await fetch(`${API_URL}/api/web-projects/project/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          projectId
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const duplicateProject = async (projectId) => {
    if (!user) return;
    
    try {
      const response = await fetch(`${API_URL}/api/web-projects/project/duplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          projectId
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Error duplicating project:', error);
    }
  };

  const loadProject = (project) => {
    onLoadProject(project);
    onClose();
  };

  const filteredProjects = projects.filter(p => {
    const matchesFolder = selectedFolder === 'all' || p.folderId === selectedFolder;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const getFrameworkIcon = (framework) => {
    const icons = {
      vanilla: '🍦',
      react: '⚛️',
      vue: '💚',
      angular: '🅰️',
      svelte: '🔥',
      nextjs: '▲',
      tailwind: '🎨',
      bootstrap: '🅱️'
    };
    return icons[framework] || '📄';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">Project Manager</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 hover:bg-gray-700 rounded-lg transition-all"
          >
            {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Folders */}
        <div className="w-64 border-r border-gray-700 overflow-y-auto">
          <div className="p-4 space-y-2">
            <button
              onClick={() => setSelectedFolder('all')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                selectedFolder === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-700 text-gray-300'
              }`}
            >
              <FolderOpen className="w-5 h-5" />
              <span>All Projects</span>
              <span className="ml-auto text-sm">{projects.length}</span>
            </button>

            <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase">
              Folders
            </div>

            {folders.map(folder => (
              <div key={folder.id} className="relative group">
                {editingFolder === folder.id ? (
                  <div className="flex items-center gap-2 px-3 py-2">
                    <input
                      type="text"
                      defaultValue={folder.name}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          renameFolder(folder.id, e.target.value);
                        } else if (e.key === 'Escape') {
                          setEditingFolder(null);
                        }
                      }}
                      onBlur={(e) => renameFolder(folder.id, e.target.value)}
                      autoFocus
                      className="flex-1 px-2 py-1 bg-gray-800 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                      selectedFolder === folder.id
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    <span>{folder.icon}</span>
                    <span className="flex-1 text-left truncate">{folder.name}</span>
                    <span className="text-sm">
                      {projects.filter(p => p.folderId === folder.id).length}
                    </span>
                    {folder.id !== 'default' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setContextMenu({ type: 'folder', id: folder.id, x: e.clientX, y: e.clientY });
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-600 rounded"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    )}
                  </button>
                )}
              </div>
            ))}

            {showNewFolder ? (
              <div className="flex items-center gap-2 px-3 py-2">
                <input
                  type="text"
                  placeholder="Folder name..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') createFolder();
                    if (e.key === 'Escape') {
                      setShowNewFolder(false);
                      setNewFolderName('');
                    }
                  }}
                  autoFocus
                  className="flex-1 px-2 py-1 bg-gray-800 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={createFolder}
                  className="p-1 text-green-400 hover:bg-gray-700 rounded"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setShowNewFolder(false);
                    setNewFolderName('');
                  }}
                  className="p-1 text-red-400 hover:bg-gray-700 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowNewFolder(true)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-all"
              >
                <FolderPlus className="w-5 h-5" />
                <span>New Folder</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Content - Projects */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <File className="w-16 h-16 mb-4" />
              <p className="text-lg">No projects found</p>
              <p className="text-sm">Create a new project to get started</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}>
              {filteredProjects.map(project => (
                <div
                  key={project.id}
                  onClick={() => loadProject(project)}
                  className={`group relative bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 cursor-pointer transition-all hover:scale-105 ${
                    viewMode === 'grid' ? 'p-4' : 'p-3 flex items-center gap-4'
                  }`}
                >
                  <div className={`text-4xl ${viewMode === 'list' ? 'text-2xl' : ''}`}>
                    {getFrameworkIcon(project.framework)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{project.name}</h3>
                    {project.description && (
                      <p className="text-sm text-gray-400 truncate">{project.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                      <span className="ml-auto px-2 py-1 bg-gray-700 rounded">
                        {project.framework}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setContextMenu({ type: 'project', id: project.id, x: e.clientX, y: e.clientY });
                    }}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-700 rounded transition-all"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setContextMenu(null)}
          />
          <div
            className="fixed z-50 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2 min-w-[160px]"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            {contextMenu.type === 'folder' ? (
              <>
                <button
                  onClick={() => {
                    setEditingFolder(contextMenu.id);
                    setContextMenu(null);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-700 text-left"
                >
                  <Edit2 className="w-4 h-4" />
                  Rename
                </button>
                <button
                  onClick={() => {
                    deleteFolder(contextMenu.id);
                    setContextMenu(null);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-700 text-left text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    duplicateProject(contextMenu.id);
                    setContextMenu(null);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-700 text-left"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
                <button
                  onClick={() => {
                    deleteProject(contextMenu.id);
                    setContextMenu(null);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-700 text-left text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default WebProjectManager;
