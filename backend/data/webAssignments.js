// Backend version of web assignments for evaluation
const webAssignments = {
  beginner: [
    {
      id: 'portfolio-basic',
      title: 'Personal Portfolio Website',
      difficulty: 'Beginner',
      testCases: [
        { test: 'Has semantic HTML5 tags', points: 10 },
        { test: 'Responsive on all screen sizes', points: 20 },
        { test: 'Navigation works correctly', points: 15 },
        { test: 'Form validation implemented', points: 15 },
        { test: 'Clean CSS organization', points: 10 },
        { test: 'Accessibility features (ARIA)', points: 15 },
        { test: 'Cross-browser compatibility', points: 15 }
      ]
    },
    {
      id: 'landing-page',
      title: 'Product Landing Page',
      difficulty: 'Beginner',
      testCases: [
        { test: 'Hero section is eye-catching', points: 15 },
        { test: 'Features clearly displayed', points: 15 },
        { test: 'Pricing cards are interactive', points: 15 },
        { test: 'Form validation works', points: 15 },
        { test: 'Animations are smooth', points: 15 },
        { test: 'Mobile responsive', points: 15 },
        { test: 'Fast loading time', points: 10 }
      ]
    }
  ],
  intermediate: [
    {
      id: 'todo-app',
      title: 'Advanced Todo Application',
      difficulty: 'Intermediate',
      testCases: [
        { test: 'CRUD operations work', points: 20 },
        { test: 'Data persists in localStorage', points: 15 },
        { test: 'Filter and search work', points: 15 },
        { test: 'Categories implemented', points: 10 },
        { test: 'Dark mode toggle', points: 10 },
        { test: 'Export functionality', points: 10 },
        { test: 'Clean UI/UX', points: 10 },
        { test: 'Error handling', points: 10 }
      ]
    },
    {
      id: 'weather-dashboard',
      title: 'Weather Dashboard',
      difficulty: 'Intermediate',
      testCases: [
        { test: 'API integration works', points: 20 },
        { test: 'Search functionality', points: 15 },
        { test: 'Geolocation works', points: 15 },
        { test: 'Forecast display', points: 15 },
        { test: 'Unit conversion', points: 10 },
        { test: 'Error handling', points: 10 },
        { test: 'Loading states', points: 10 },
        { test: 'Responsive design', points: 5 }
      ]
    }
  ],
  advanced: [
    {
      id: 'ecommerce-cart',
      title: 'E-Commerce Shopping Cart',
      difficulty: 'Advanced',
      testCases: [
        { test: 'Product display and filtering', points: 15 },
        { test: 'Add/remove from cart', points: 15 },
        { test: 'Cart calculations correct', points: 15 },
        { test: 'Discount codes work', points: 10 },
        { test: 'Checkout flow complete', points: 15 },
        { test: 'Payment integration', points: 15 },
        { test: 'State management', points: 10 },
        { test: 'Error handling', points: 5 }
      ]
    },
    {
      id: 'social-dashboard',
      title: 'Social Media Dashboard',
      difficulty: 'Advanced',
      testCases: [
        { test: 'Authentication system', points: 15 },
        { test: 'Data visualization', points: 20 },
        { test: 'Real-time updates', points: 15 },
        { test: 'Post scheduling', points: 15 },
        { test: 'Export functionality', points: 10 },
        { test: 'Theme switching', points: 10 },
        { test: 'Performance optimization', points: 10 },
        { test: 'Error handling', points: 5 }
      ]
    }
  ],
  expert: [
    {
      id: 'video-streaming',
      title: 'Video Streaming Platform',
      difficulty: 'Expert',
      testCases: [
        { test: 'Video player functionality', points: 20 },
        { test: 'Upload and processing', points: 15 },
        { test: 'User authentication', points: 10 },
        { test: 'Playlist management', points: 10 },
        { test: 'Recommendations work', points: 15 },
        { test: 'Comments system', points: 10 },
        { test: 'Performance optimization', points: 10 },
        { test: 'Security measures', points: 10 }
      ]
    },
    {
      id: 'collaborative-editor',
      title: 'Real-Time Collaborative Code Editor',
      difficulty: 'Expert',
      testCases: [
        { test: 'Real-time sync works', points: 25 },
        { test: 'Code execution', points: 15 },
        { test: 'Multi-user support', points: 15 },
        { test: 'Syntax highlighting', points: 10 },
        { test: 'Version control', points: 10 },
        { test: 'Chat functionality', points: 10 },
        { test: 'Performance at scale', points: 10 },
        { test: 'Security measures', points: 5 }
      ]
    }
  ]
};

module.exports = { webAssignments };
