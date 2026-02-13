// Web Development Assignments - Industry Standard Projects
export const webAssignments = {
  beginner: [
    {
      id: 'portfolio-basic',
      title: 'Personal Portfolio Website',
      difficulty: 'Beginner',
      duration: '2-3 hours',
      category: 'HTML/CSS',
      description: 'Create a responsive personal portfolio with sections for About, Projects, Skills, and Contact.',
      requirements: [
        'Responsive design (mobile, tablet, desktop)',
        'Navigation menu with smooth scrolling',
        'Project showcase grid',
        'Contact form with validation',
        'Social media links',
        'Professional color scheme'
      ],
      testCases: [
        { test: 'Has semantic HTML5 tags', points: 10 },
        { test: 'Responsive on all screen sizes', points: 20 },
        { test: 'Navigation works correctly', points: 15 },
        { test: 'Form validation implemented', points: 15 },
        { test: 'Clean CSS organization', points: 10 },
        { test: 'Accessibility features (ARIA)', points: 15 },
        { test: 'Cross-browser compatibility', points: 15 }
      ],
      starterCode: {
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Portfolio</title>
</head>
<body>
  <!-- Build your portfolio here -->
  <nav>
    <!-- Navigation -->
  </nav>
  
  <section id="about">
    <!-- About section -->
  </section>
  
  <section id="projects">
    <!-- Projects section -->
  </section>
  
  <section id="contact">
    <!-- Contact form -->
  </section>
</body>
</html>`,
        css: `/* Add your styles here */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}`,
        js: `// Add interactivity here
document.addEventListener('DOMContentLoaded', () => {
  // Your code
});`
      },
      industryStandards: [
        'Mobile-first approach',
        'Semantic HTML',
        'BEM CSS methodology',
        'Accessibility (WCAG 2.1)',
        'Performance optimization'
      ],
      resources: [
        'MDN Web Docs - HTML',
        'CSS Tricks - Flexbox Guide',
        'Web.dev - Responsive Design'
      ]
    },
    {
      id: 'landing-page',
      title: 'Product Landing Page',
      difficulty: 'Beginner',
      duration: '3-4 hours',
      category: 'HTML/CSS/JS',
      description: 'Build a modern landing page for a product with hero section, features, pricing, and CTA.',
      requirements: [
        'Hero section with CTA button',
        'Features section with icons',
        'Pricing cards',
        'Testimonials slider',
        'Newsletter signup form',
        'Smooth animations'
      ],
      testCases: [
        { test: 'Hero section is eye-catching', points: 15 },
        { test: 'Features clearly displayed', points: 15 },
        { test: 'Pricing cards are interactive', points: 15 },
        { test: 'Form validation works', points: 15 },
        { test: 'Animations are smooth', points: 15 },
        { test: 'Mobile responsive', points: 15 },
        { test: 'Fast loading time', points: 10 }
      ],
      starterCode: {
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Product Landing Page</title>
</head>
<body>
  <header>
    <!-- Navigation -->
  </header>
  
  <section class="hero">
    <!-- Hero section -->
  </section>
  
  <section class="features">
    <!-- Features -->
  </section>
  
  <section class="pricing">
    <!-- Pricing cards -->
  </section>
</body>
</html>`,
        css: `/* Modern landing page styles */`,
        js: `// Add interactivity`
      },
      industryStandards: [
        'Conversion-focused design',
        'Fast loading (<3s)',
        'Clear CTAs',
        'Social proof',
        'Mobile optimization'
      ]
    }
  ],
  intermediate: [
    {
      id: 'todo-app',
      title: 'Advanced Todo Application',
      difficulty: 'Intermediate',
      duration: '4-6 hours',
      category: 'JavaScript/LocalStorage',
      description: 'Build a feature-rich todo app with categories, priorities, due dates, and local storage.',
      requirements: [
        'Add, edit, delete todos',
        'Categories and tags',
        'Priority levels (high, medium, low)',
        'Due dates with reminders',
        'Search and filter functionality',
        'Local storage persistence',
        'Dark mode toggle',
        'Export to JSON'
      ],
      testCases: [
        { test: 'CRUD operations work', points: 20 },
        { test: 'Data persists in localStorage', points: 15 },
        { test: 'Filter and search work', points: 15 },
        { test: 'Categories implemented', points: 10 },
        { test: 'Dark mode toggle', points: 10 },
        { test: 'Export functionality', points: 10 },
        { test: 'Clean UI/UX', points: 10 },
        { test: 'Error handling', points: 10 }
      ],
      starterCode: {
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Todo App</title>
</head>
<body>
  <div class="app">
    <header>
      <h1>My Tasks</h1>
      <button id="darkModeToggle">🌙</button>
    </header>
    
    <div class="add-task">
      <!-- Add task form -->
    </div>
    
    <div class="filters">
      <!-- Filters -->
    </div>
    
    <div class="tasks-list">
      <!-- Tasks will be rendered here -->
    </div>
  </div>
</body>
</html>`,
        css: `/* Todo app styles */`,
        js: `// Todo app logic
class TodoApp {
  constructor() {
    this.todos = this.loadTodos();
    this.init();
  }
  
  loadTodos() {
    // Load from localStorage
  }
  
  saveTodos() {
    // Save to localStorage
  }
  
  addTodo(todo) {
    // Add todo
  }
  
  deleteTodo(id) {
    // Delete todo
  }
  
  init() {
    // Initialize app
  }
}

const app = new TodoApp();`
      },
      industryStandards: [
        'MVC architecture',
        'State management',
        'Data persistence',
        'Error handling',
        'Code organization'
      ]
    },
    {
      id: 'weather-dashboard',
      title: 'Weather Dashboard',
      difficulty: 'Intermediate',
      duration: '5-7 hours',
      category: 'API Integration',
      description: 'Create a weather dashboard using OpenWeatherMap API with current weather, forecast, and location search.',
      requirements: [
        'Current weather display',
        '5-day forecast',
        'Location search',
        'Geolocation support',
        'Weather icons and animations',
        'Temperature unit toggle (C/F)',
        'Recent searches history',
        'Responsive design'
      ],
      testCases: [
        { test: 'API integration works', points: 20 },
        { test: 'Search functionality', points: 15 },
        { test: 'Geolocation works', points: 15 },
        { test: 'Forecast display', points: 15 },
        { test: 'Unit conversion', points: 10 },
        { test: 'Error handling', points: 10 },
        { test: 'Loading states', points: 10 },
        { test: 'Responsive design', points: 5 }
      ],
      starterCode: {
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weather Dashboard</title>
</head>
<body>
  <div class="weather-app">
    <div class="search-bar">
      <input type="text" placeholder="Search city..." id="citySearch">
      <button id="searchBtn">Search</button>
      <button id="locationBtn">📍 My Location</button>
    </div>
    
    <div class="current-weather">
      <!-- Current weather -->
    </div>
    
    <div class="forecast">
      <!-- 5-day forecast -->
    </div>
  </div>
</body>
</html>`,
        css: `/* Weather dashboard styles */`,
        js: `// Weather API integration
const API_KEY = 'YOUR_API_KEY'; // Get from openweathermap.org

async function getWeather(city) {
  // Fetch weather data
}

async function getForecast(city) {
  // Fetch forecast data
}

// Initialize app`
      },
      industryStandards: [
        'Async/await patterns',
        'Error handling',
        'Loading states',
        'API rate limiting',
        'Environment variables'
      ]
    }
  ],
  advanced: [
    {
      id: 'ecommerce-cart',
      title: 'E-Commerce Shopping Cart',
      difficulty: 'Advanced',
      duration: '8-10 hours',
      category: 'Full Stack',
      description: 'Build a complete e-commerce cart system with products, cart management, checkout, and payment integration.',
      requirements: [
        'Product catalog with filtering',
        'Shopping cart functionality',
        'Quantity management',
        'Price calculations',
        'Discount codes',
        'Checkout process',
        'Order summary',
        'Payment gateway integration (Stripe)',
        'Order history',
        'Responsive design'
      ],
      testCases: [
        { test: 'Product display and filtering', points: 15 },
        { test: 'Add/remove from cart', points: 15 },
        { test: 'Cart calculations correct', points: 15 },
        { test: 'Discount codes work', points: 10 },
        { test: 'Checkout flow complete', points: 15 },
        { test: 'Payment integration', points: 15 },
        { test: 'State management', points: 10 },
        { test: 'Error handling', points: 5 }
      ],
      starterCode: {
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>E-Commerce Store</title>
</head>
<body>
  <nav>
    <div class="logo">MyStore</div>
    <div class="cart-icon">
      🛒 <span id="cartCount">0</span>
    </div>
  </nav>
  
  <div class="container">
    <aside class="filters">
      <!-- Product filters -->
    </aside>
    
    <main class="products">
      <!-- Product grid -->
    </main>
    
    <div class="cart-sidebar">
      <!-- Shopping cart -->
    </div>
  </div>
</body>
</html>`,
        css: `/* E-commerce styles */`,
        js: `// E-commerce logic
class ShoppingCart {
  constructor() {
    this.items = [];
    this.total = 0;
  }
  
  addItem(product) {
    // Add to cart
  }
  
  removeItem(productId) {
    // Remove from cart
  }
  
  updateQuantity(productId, quantity) {
    // Update quantity
  }
  
  calculateTotal() {
    // Calculate total
  }
  
  applyDiscount(code) {
    // Apply discount
  }
}

const cart = new ShoppingCart();`
      },
      industryStandards: [
        'State management patterns',
        'Payment security',
        'Cart persistence',
        'Inventory management',
        'Transaction handling'
      ]
    },
    {
      id: 'social-dashboard',
      title: 'Social Media Dashboard',
      difficulty: 'Advanced',
      duration: '10-12 hours',
      category: 'React/API',
      description: 'Create a social media analytics dashboard with real-time data, charts, and user management.',
      requirements: [
        'User authentication',
        'Real-time analytics',
        'Interactive charts (Chart.js)',
        'Post scheduling',
        'Engagement metrics',
        'Multi-platform support',
        'Export reports',
        'Dark/light theme',
        'Responsive design'
      ],
      testCases: [
        { test: 'Authentication system', points: 15 },
        { test: 'Data visualization', points: 20 },
        { test: 'Real-time updates', points: 15 },
        { test: 'Post scheduling', points: 15 },
        { test: 'Export functionality', points: 10 },
        { test: 'Theme switching', points: 10 },
        { test: 'Performance optimization', points: 10 },
        { test: 'Error handling', points: 5 }
      ],
      starterCode: {
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Social Dashboard</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <div class="dashboard">
    <aside class="sidebar">
      <!-- Navigation -->
    </aside>
    
    <main class="content">
      <div class="stats-grid">
        <!-- Stats cards -->
      </div>
      
      <div class="charts">
        <!-- Charts -->
      </div>
      
      <div class="recent-posts">
        <!-- Recent posts -->
      </div>
    </main>
  </div>
</body>
</html>`,
        css: `/* Dashboard styles */`,
        js: `// Dashboard logic with Chart.js
class SocialDashboard {
  constructor() {
    this.data = {};
    this.charts = {};
    this.init();
  }
  
  async fetchAnalytics() {
    // Fetch analytics data
  }
  
  renderCharts() {
    // Render charts
  }
  
  updateRealtime() {
    // Real-time updates
  }
  
  init() {
    // Initialize dashboard
  }
}

const dashboard = new SocialDashboard();`
      },
      industryStandards: [
        'Component architecture',
        'Real-time data handling',
        'Data visualization',
        'Performance optimization',
        'Security best practices'
      ]
    }
  ],
  expert: [
    {
      id: 'video-streaming',
      title: 'Video Streaming Platform',
      difficulty: 'Expert',
      duration: '15-20 hours',
      category: 'Full Stack',
      description: 'Build a Netflix-like video streaming platform with video player, playlists, recommendations, and user profiles.',
      requirements: [
        'Custom video player',
        'Video upload and processing',
        'Playlist management',
        'User profiles',
        'Watch history',
        'Recommendations algorithm',
        'Comments and ratings',
        'Subtitles support',
        'Adaptive streaming',
        'Admin dashboard'
      ],
      testCases: [
        { test: 'Video player functionality', points: 20 },
        { test: 'Upload and processing', points: 15 },
        { test: 'User authentication', points: 10 },
        { test: 'Playlist management', points: 10 },
        { test: 'Recommendations work', points: 15 },
        { test: 'Comments system', points: 10 },
        { test: 'Performance optimization', points: 10 },
        { test: 'Security measures', points: 10 }
      ],
      industryStandards: [
        'Video encoding',
        'CDN integration',
        'Adaptive bitrate streaming',
        'DRM protection',
        'Scalable architecture'
      ]
    },
    {
      id: 'collaborative-editor',
      title: 'Real-Time Collaborative Code Editor',
      difficulty: 'Expert',
      duration: '20-25 hours',
      category: 'WebSockets/Real-time',
      description: 'Create a collaborative code editor like Google Docs but for code, with real-time collaboration, syntax highlighting, and execution.',
      requirements: [
        'Real-time collaboration (WebSockets)',
        'Syntax highlighting',
        'Code execution',
        'Multiple language support',
        'User cursors and selections',
        'Chat system',
        'Version history',
        'File management',
        'Share and permissions',
        'AI code suggestions'
      ],
      testCases: [
        { test: 'Real-time sync works', points: 25 },
        { test: 'Code execution', points: 15 },
        { test: 'Multi-user support', points: 15 },
        { test: 'Syntax highlighting', points: 10 },
        { test: 'Version control', points: 10 },
        { test: 'Chat functionality', points: 10 },
        { test: 'Performance at scale', points: 10 },
        { test: 'Security measures', points: 5 }
      ],
      industryStandards: [
        'Operational transformation',
        'WebSocket optimization',
        'Conflict resolution',
        'State synchronization',
        'Security and permissions'
      ]
    }
  ]
};

// Industry project templates
export const industryProjects = [
  {
    id: 'startup-landing',
    name: 'Startup Landing Page',
    industry: 'Tech Startup',
    description: 'Modern SaaS landing page with animations',
    difficulty: 'Intermediate',
    estimatedTime: '6-8 hours',
    skills: ['HTML', 'CSS', 'JavaScript', 'Animations'],
    features: [
      'Hero section with video background',
      'Feature showcase',
      'Pricing tables',
      'Customer testimonials',
      'Newsletter signup',
      'Live chat integration'
    ]
  },
  {
    id: 'restaurant-website',
    name: 'Restaurant Website',
    industry: 'Food & Beverage',
    description: 'Full-featured restaurant website with online ordering',
    difficulty: 'Advanced',
    estimatedTime: '10-12 hours',
    skills: ['React', 'Node.js', 'MongoDB', 'Payment Integration'],
    features: [
      'Menu with categories',
      'Online ordering system',
      'Table reservation',
      'Payment integration',
      'Order tracking',
      'Admin dashboard'
    ]
  },
  {
    id: 'fitness-tracker',
    name: 'Fitness Tracking App',
    industry: 'Health & Fitness',
    description: 'Progressive web app for fitness tracking',
    difficulty: 'Advanced',
    estimatedTime: '12-15 hours',
    skills: ['PWA', 'IndexedDB', 'Charts', 'Geolocation'],
    features: [
      'Workout logging',
      'Progress charts',
      'Calorie tracking',
      'Exercise library',
      'Goal setting',
      'Offline support'
    ]
  },
  {
    id: 'real-estate-portal',
    name: 'Real Estate Portal',
    industry: 'Real Estate',
    description: 'Property listing and search platform',
    difficulty: 'Expert',
    estimatedTime: '15-20 hours',
    skills: ['React', 'Maps API', 'Search', 'Filters'],
    features: [
      'Property listings',
      'Advanced search and filters',
      'Map integration',
      'Virtual tours',
      'Mortgage calculator',
      'Agent profiles'
    ]
  }
];

// Evaluation criteria
export const evaluationCriteria = {
  functionality: {
    weight: 30,
    checks: [
      'All features work as expected',
      'No console errors',
      'Proper error handling',
      'Edge cases handled'
    ]
  },
  codeQuality: {
    weight: 25,
    checks: [
      'Clean and readable code',
      'Proper naming conventions',
      'DRY principle followed',
      'Comments where needed',
      'Modular structure'
    ]
  },
  design: {
    weight: 20,
    checks: [
      'Responsive design',
      'Consistent styling',
      'Good UX/UI',
      'Accessibility',
      'Cross-browser compatibility'
    ]
  },
  performance: {
    weight: 15,
    checks: [
      'Fast loading time',
      'Optimized assets',
      'Efficient algorithms',
      'No memory leaks'
    ]
  },
  bestPractices: {
    weight: 10,
    checks: [
      'Security considerations',
      'SEO optimization',
      'Progressive enhancement',
      'Industry standards followed'
    ]
  }
};
