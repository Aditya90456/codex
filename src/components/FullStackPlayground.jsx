import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { 
  Code, Server, Database, Layers, Play, Save, Download, Share2,
  CheckCircle, Trophy, Zap, Rocket, Terminal, Globe, Lock, Unlock
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const FullStackPlayground = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('frontend');
  const [frontendCode, setFrontendCode] = useState('');
  const [backendCode, setBackendCode] = useState('');
  const [databaseSchema, setDatabaseSchema] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  const loadProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/api/fullstack/projects/${user.id}`);
      const data = await response.json();
      if (data.success) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const runFullStackApp = async () => {
    setIsRunning(true);
    setOutput('Building and running your full-stack application...\n');
    
    try {
      const response = await fetch(`${API_URL}/api/fullstack/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          frontend: frontendCode,
            
          backend: backendCode,
          database: databaseSchema
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setOutput(prev => prev + '\n✅ Application running successfully!\n' + data.output);
      } else {
        setOutput(prev => prev + '\n❌ Error: ' + data.error);
      }
    } catch (error) {
      setOutput(prev => prev + '\n❌ Error: ' + error.message);
    } finally {
      setIsRunning(false);
    }
  };

  const saveProject = async () => {
    try {
      const response = await fetch(`${API_URL}/api/fullstack/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          projectName: selectedProject?.name || 'New Project',
          frontend: frontendCode,
          backend: backendCode,
          database: databaseSchema
        })
      });
      
      const data = await response.json();
      if (data.success) {
        alert('✅ Project saved successfully!');
        loadProjects();
      }
    } catch (error) {
      alert('❌ Failed to save project');
    }
  };

  const fullStackProjects = [
    {
      id: 'blog-platform',
      name: 'Blog Platform',
      difficulty: 'Intermediate',
      description: 'Full-stack blog with authentication, CRUD operations, and comments',
      frontend: `<!-- React Blog Frontend -->
<div id="app"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script>
  function BlogApp() {
    const [posts, setPosts] = React.useState([]);
    
    React.useEffect(() => {
      fetch('/api/posts')
        .then(res => res.json())
        .then(data => setPosts(data));
    }, []);
    
    return React.createElement('div', { className: 'blog-container' },
      React.createElement('h1', null, 'My Blog'),
      posts.map(post => 
        React.createElement('article', { key: post.id },
          React.createElement('h2', null, post.title),
          React.createElement('p', null, post.content)
        )
      )
    );
  }
  
  ReactDOM.render(React.createElement(BlogApp), document.getElementById('app'));
</script>`,
      backend: `// Express.js Backend
const express = require('express');
const app = express();

app.use(express.json());

// In-memory storage
let posts = [];

// Get all posts
app.get('/api/posts', (req, res) => {
  res.json(posts);
});

// Create post
app.post('/api/posts', (req, res) => {
  const post = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date()
  };
  posts.push(post);
  res.json(post);
});

// Update post
app.put('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  const index = posts.findIndex(p => p.id == id);
  if (index >= 0) {
    posts[index] = { ...posts[index], ...req.body };
    res.json(posts[index]);
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

// Delete post
app.delete('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  posts = posts.filter(p => p.id != id);
  res.json({ success: true });
});

app.listen(3000, () => console.log('Server running on port 3000'));`,
      database: `-- PostgreSQL Schema
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_posts_user ON posts(user_id);
CREATE INDEX idx_comments_post ON comments(post_id);`
    },
    {
      id: 'ecommerce-api',
      name: 'E-Commerce API',
      difficulty: 'Advanced',
      description: 'Complete e-commerce backend with products, cart, orders, and payments',
      backend: `// E-Commerce API
const express = require('express');
const app = express();

app.use(express.json());

// Mock database
const db = {
  products: [],
  carts: {},
  orders: []
};

// Products
app.get('/api/products', (req, res) => {
  res.json(db.products);
});

app.post('/api/products', (req, res) => {
  const product = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date()
  };
  db.products.push(product);
  res.json(product);
});

// Cart
app.get('/api/cart/:userId', (req, res) => {
  const cart = db.carts[req.params.userId] || { items: [], total: 0 };
  res.json(cart);
});

app.post('/api/cart/:userId/add', (req, res) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;
  
  if (!db.carts[userId]) {
    db.carts[userId] = { items: [], total: 0 };
  }
  
  const product = db.products.find(p => p.id == productId);
  if (product) {
    db.carts[userId].items.push({
      product,
      quantity,
      subtotal: product.price * quantity
    });
    db.carts[userId].total = db.carts[userId].items.reduce((sum, item) => sum + item.subtotal, 0);
  }
  
  res.json(db.carts[userId]);
});

// Orders
app.post('/api/orders', (req, res) => {
  const order = {
    id: Date.now(),
    ...req.body,
    status: 'pending',
    createdAt: new Date()
  };
  db.orders.push(order);
  res.json(order);
});

app.listen(3000);`,
      database: `-- E-Commerce Database Schema
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER DEFAULT 0,
  category VARCHAR(50),
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100),
  address TEXT,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);`
    },
    {
      id: 'social-network',
      name: 'Social Network API',
      difficulty: 'Expert',
      description: 'Social media backend with posts, likes, comments, and followers',
      backend: `// Social Network API
const express = require('express');
const app = express();

app.use(express.json());

const db = {
  users: [],
  posts: [],
  likes: [],
  comments: [],
  followers: []
};

// Users
app.post('/api/users', (req, res) => {
  const user = {
    id: Date.now(),
    ...req.body,
    followers: 0,
    following: 0,
    createdAt: new Date()
  };
  db.users.push(user);
  res.json(user);
});

// Posts
app.get('/api/posts', (req, res) => {
  res.json(db.posts);
});

app.post('/api/posts', (req, res) => {
  const post = {
    id: Date.now(),
    ...req.body,
    likes: 0,
    comments: 0,
    createdAt: new Date()
  };
  db.posts.push(post);
  res.json(post);
});

// Likes
app.post('/api/posts/:id/like', (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  
  const like = {
    postId: id,
    userId,
    createdAt: new Date()
  };
  db.likes.push(like);
  
  const post = db.posts.find(p => p.id == id);
  if (post) post.likes++;
  
  res.json({ success: true });
});

// Comments
app.post('/api/posts/:id/comment', (req, res) => {
  const { id } = req.params;
  const comment = {
    id: Date.now(),
    postId: id,
    ...req.body,
    createdAt: new Date()
  };
  db.comments.push(comment);
  
  const post = db.posts.find(p => p.id == id);
  if (post) post.comments++;
  
  res.json(comment);
});

// Follow
app.post('/api/users/:id/follow', (req, res) => {
  const { id } = req.params;
  const { followerId } = req.body;
  
  db.followers.push({
    userId: id,
    followerId,
    createdAt: new Date()
  });
  
  res.json({ success: true });
});

app.listen(3000);`,
      database: `-- Social Network Schema
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  bio TEXT,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  content TEXT NOT NULL,
  image_url VARCHAR(500),
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, post_id)
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE followers (
  id SERIAL PRIMARY KEY,
  follower_id INTEGER REFERENCES users(id),
  following_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(follower_id, following_id)
);`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Layers className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Full Stack Playground
                </h1>
                <p className="text-gray-400 text-lg">
                  Build complete applications with Frontend + Backend + Database
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Project Templates */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Choose a Project Template</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fullStackProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => {
                  setSelectedProject(project);
                  setFrontendCode(project.frontend || '');
                  setBackendCode(project.backend || '');
                  setDatabaseSchema(project.database || '');
                }}
                className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-gray-700 hover:border-purple-500 transition-all cursor-pointer hover:transform hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold group-hover:text-purple-400 transition-colors">
                    {project.name}
                  </h3>
                  <span className="px-3 py-1 bg-purple-600 rounded-full text-xs font-bold">
                    {project.difficulty}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-4">{project.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Rocket className="w-4 h-4" />
                  <span>Click to start</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Code Editors */}
        {selectedProject && (
          <div className="bg-gray-800 rounded-2xl overflow-hidden border-2 border-gray-700">
            {/* Tabs */}
            <div className="flex items-center gap-2 bg-gray-900 p-4 border-b border-gray-700">
              <button
                onClick={() => setActiveTab('frontend')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'frontend'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                <Globe className="w-4 h-4" />
                Frontend
              </button>
              <button
                onClick={() => setActiveTab('backend')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'backend'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                <Server className="w-4 h-4" />
                Backend
              </button>
              <button
                onClick={() => setActiveTab('database')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'database'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                <Database className="w-4 h-4" />
                Database
              </button>
              
              <div className="flex-1"></div>
              
              <button
                onClick={saveProject}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={runFullStackApp}
                disabled={isRunning}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                <Play className="w-4 h-4" />
                {isRunning ? 'Running...' : 'Run App'}
              </button>
            </div>

            {/* Editor */}
            <div className="p-6">
              {activeTab === 'frontend' && (
                <textarea
                  value={frontendCode}
                  onChange={(e) => setFrontendCode(e.target.value)}
                  className="w-full h-96 bg-gray-900 text-white font-mono text-sm p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your frontend code here..."
                />
              )}
              {activeTab === 'backend' && (
                <textarea
                  value={backendCode}
                  onChange={(e) => setBackendCode(e.target.value)}
                  className="w-full h-96 bg-gray-900 text-white font-mono text-sm p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Write your backend code here..."
                />
              )}
              {activeTab === 'database' && (
                <textarea
                  value={databaseSchema}
                  onChange={(e) => setDatabaseSchema(e.target.value)}
                  className="w-full h-96 bg-gray-900 text-white font-mono text-sm p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Write your database schema here..."
                />
              )}
            </div>

            {/* Output */}
            {output && (
              <div className="border-t border-gray-700 p-6">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  <Terminal className="w-5 h-5" />
                  Output
                </h3>
                <pre className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg overflow-auto max-h-64">
                  {output}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FullStackPlayground;
