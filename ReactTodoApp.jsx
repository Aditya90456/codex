import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Edit3, Save, X, Filter, Calendar, Clock } from 'lucide-react';

const ReactTodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('react-todos');
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (error) {
        console.error('Error loading todos:', error);
      }
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('react-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
        priority: priority,
        dueDate: dueDate || null,
        createdAt: new Date().toISOString(),
        completedAt: null
      };
      
      setTodos([newTodo, ...todos]);
      setInputValue('');
      setPriority('medium');
      setDueDate('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id 
        ? { 
            ...todo, 
            completed: !todo.completed,
            completedAt: !todo.completed ? new Date().toISOString() : null
          } 
        : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditValue(text);
  };

  const saveEdit = () => {
    if (editValue.trim()) {
      setTodos(todos.map(todo =>
        todo.id === editingId 
          ? { ...todo, text: editValue.trim() }
          : todo
      ));
    }
    setEditingId(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      case 'high':
        return todo.priority === 'high';
      case 'medium':
        return todo.priority === 'medium';
      case 'low':
        return todo.priority === 'low';
      default:
        return true;
    }
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString();
    }
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const handleEditKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
    overdue: todos.filter(t => !t.completed && isOverdue(t.dueDate)).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            ✅ React Todo App
          </h1>
          <p className="text-gray-600">Stay organized and productive</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-orange-600">{stats.active}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <div className="text-sm text-gray-600">Overdue</div>
          </div>
        </div>

        {/* Add Todo Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a new task..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              
              <button
                onClick={addTodo}
                disabled={!inputValue.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-8">
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 mr-2">Filter:</span>
            
            {['all', 'active', 'completed', 'high', 'medium', 'low'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  filter === filterType
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
            
            {stats.completed > 0 && (
              <button
                onClick={clearCompleted}
                className="ml-auto px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium hover:bg-red-200 transition-all"
              >
                Clear Completed
              </button>
            )}
          </div>
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
              </h3>
              <p className="text-gray-500">
                {filter === 'all' 
                  ? 'Add your first task to get started!' 
                  : `Try switching to a different filter or add some ${filter} tasks.`
                }
              </p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`bg-white rounded-xl shadow-lg border-l-4 ${getPriorityColor(todo.priority)} p-4 transition-all hover:shadow-xl ${
                  todo.completed ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      todo.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-green-500'
                    }`}
                  >
                    {todo.completed && <Check className="w-4 h-4" />}
                  </button>

                  {/* Todo Content */}
                  <div className="flex-1 min-w-0">
                    {editingId === todo.id ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyPress={handleEditKeyPress}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        autoFocus
                      />
                    ) : (
                      <div>
                        <div className={`font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {todo.text}
                        </div>
                        
                        <div className="flex items-center gap-3 mt-2">
                          {/* Priority Badge */}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(todo.priority)}`}>
                            {todo.priority.toUpperCase()}
                          </span>
                          
                          {/* Due Date */}
                          {todo.dueDate && (
                            <div className={`flex items-center gap-1 text-xs ${
                              isOverdue(todo.dueDate) && !todo.completed
                                ? 'text-red-600 font-medium'
                                : 'text-gray-500'
                            }`}>
                              <Calendar className="w-3 h-3" />
                              {formatDate(todo.dueDate)}
                              {isOverdue(todo.dueDate) && !todo.completed && ' (Overdue)'}
                            </div>
                          )}
                          
                          {/* Created/Completed Time */}
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {todo.completed && todo.completedAt
                              ? `Completed ${new Date(todo.completedAt).toLocaleDateString()}`
                              : `Created ${new Date(todo.createdAt).toLocaleDateString()}`
                            }
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {editingId === todo.id ? (
                      <>
                        <button
                          onClick={saveEdit}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all"
                          title="Save"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(todo.id, todo.text)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p className="text-sm">
            Built with React.js • Data saved locally in your browser
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReactTodoApp;