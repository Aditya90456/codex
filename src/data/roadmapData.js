export const roadmapStructure = {
  web: {
    title: "Full Stack Web Development",
    description: "Complete roadmap from frontend to backend mastery",
    estimatedTime: "12-18 months",
    difficulty: "Beginner to Advanced",
    prerequisites: ["Basic computer skills", "Problem-solving mindset"],
    careerPaths: ["Frontend Developer", "Backend Developer", "Full Stack Developer", "DevOps Engineer"],
    
    phases: [
      {
        id: "foundation",
        title: "Web Fundamentals",
        duration: "2-3 months",
        description: "Build strong foundation in web technologies",
        skills: ["HTML5", "CSS3", "JavaScript ES6+", "Responsive Design"],
        projects: [
          "Personal Portfolio Website",
          "Responsive Landing Page",
          "Interactive Calculator",
          "Todo List Application"
        ],
        resources: [
          { type: "course", title: "MDN Web Docs", url: "https://developer.mozilla.org" },
          { type: "practice", title: "FreeCodeCamp", url: "https://freecodecamp.org" },
          { type: "book", title: "Eloquent JavaScript", url: "https://eloquentjavascript.net" }
        ]
      },
      {
        id: "frontend-frameworks",
        title: "Modern Frontend",
        duration: "3-4 months",
        description: "Master modern frontend frameworks and tools",
        skills: ["React.js", "State Management", "Component Architecture", "Build Tools"],
        projects: [
          "E-commerce Product Catalog",
          "Social Media Dashboard",
          "Real-time Chat Application",
          "Weather App with API Integration"
        ],
        resources: [
          { type: "course", title: "React Official Docs", url: "https://react.dev" },
          { type: "practice", title: "React Challenges", url: "https://reactchallenges.com" }
        ]
      },
      {
        id: "backend-development",
        title: "Backend & APIs",
        duration: "4-5 months",
        description: "Server-side development and database management",
        skills: ["Node.js", "Express.js", "Database Design", "API Development"],
        projects: [
          "RESTful API Server",
          "User Authentication System",
          "Blog CMS Backend",
          "Real-time Notification System"
        ]
      },
      {
        id: "advanced-topics",
        title: "Production Ready",
        duration: "3-4 months",
        description: "Advanced concepts for production applications",
        skills: ["Testing", "Deployment", "Performance", "Security"],
        projects: [
          "Microservices Architecture",
          "CI/CD Pipeline Setup",
          "Performance Optimized App",
          "Scalable Web Application"
        ]
      }
    ]
  },

  android: {
    title: "Android App Development",
    description: "Native Android development with modern tools and practices",
    estimatedTime: "10-15 months",
    difficulty: "Intermediate",
    prerequisites: ["Java/Kotlin basics", "OOP concepts", "Basic programming experience"],
    careerPaths: ["Android Developer", "Mobile App Developer", "Cross-platform Developer"],
    
    phases: [
      {
        id: "android-basics",
        title: "Android Fundamentals",
        duration: "2-3 months",
        description: "Core Android concepts and development environment",
        skills: ["Android Studio", "Activities & Fragments", "Layouts", "Intents"],
        projects: [
          "Hello World App",
          "Calculator App",
          "Note Taking App",
          "Image Gallery App"
        ]
      },
      {
        id: "ui-ux",
        title: "User Interface Design",
        duration: "3-4 months",
        description: "Creating beautiful and intuitive user interfaces",
        skills: ["Material Design", "Custom Views", "Animations", "Navigation"],
        projects: [
          "Material Design App",
          "Custom Animation Demo",
          "Navigation Drawer App",
          "Responsive UI App"
        ]
      },
      {
        id: "data-networking",
        title: "Data & Networking",
        duration: "3-4 months",
        description: "Working with data, APIs, and local storage",
        skills: ["Room Database", "Retrofit", "JSON Parsing", "Offline Support"],
        projects: [
          "News Reader App",
          "Weather Forecast App",
          "Social Media Client",
          "Offline-First App"
        ]
      },
      {
        id: "advanced-android",
        title: "Advanced Features",
        duration: "4-5 months",
        description: "Modern Android development with Jetpack",
        skills: ["Jetpack Compose", "MVVM Architecture", "Dependency Injection", "Testing"],
        projects: [
          "Compose UI App",
          "Architecture Components Demo",
          "Unit & UI Testing Suite",
          "Play Store Ready App"
        ]
      }
    ]
  },

  dsa: {
    title: "Data Structures & Algorithms",
    description: "Master problem-solving for coding interviews and competitive programming",
    estimatedTime: "8-12 months",
    difficulty: "Intermediate to Advanced",
    prerequisites: ["Programming fundamentals", "Basic mathematics", "Logical thinking"],
    careerPaths: ["Software Engineer", "Competitive Programmer", "Technical Interviewer"],
    
    phases: [
      {
        id: "fundamentals",
        title: "DSA Fundamentals",
        duration: "2-3 months",
        description: "Basic data structures and algorithm analysis",
        skills: ["Big O Notation", "Arrays", "Linked Lists", "Stacks & Queues"],
        projects: [
          "Array Manipulation Problems",
          "Linked List Implementation",
          "Stack-based Calculator",
          "Queue Simulation"
        ],
        practiceProblems: [
          "Two Sum", "Valid Parentheses", "Merge Two Sorted Lists",
          "Remove Duplicates", "Implement Stack using Queues"
        ]
      },
      {
        id: "intermediate-structures",
        title: "Trees & Graphs",
        duration: "3-4 months",
        description: "Hierarchical and network data structures",
        skills: ["Binary Trees", "BST", "Heaps", "Graph Basics"],
        projects: [
          "Binary Tree Visualizer",
          "Heap Sort Implementation",
          "Graph Traversal Demo",
          "Decision Tree Builder"
        ],
        practiceProblems: [
          "Binary Tree Inorder Traversal", "Validate BST", "Kth Largest Element",
          "Number of Islands", "Course Schedule"
        ]
      },
      {
        id: "algorithms",
        title: "Algorithm Techniques",
        duration: "4-5 months",
        description: "Core algorithmic problem-solving techniques",
        skills: ["Sorting", "Searching", "Recursion", "Dynamic Programming"],
        projects: [
          "Sorting Algorithm Visualizer",
          "Binary Search Variants",
          "Recursive Problem Solver",
          "DP Problem Collection"
        ],
        practiceProblems: [
          "Merge Sort", "Binary Search", "Fibonacci DP",
          "Longest Common Subsequence", "Coin Change Problem"
        ]
      },
      {
        id: "advanced-topics",
        title: "Advanced Algorithms",
        duration: "3-4 months",
        description: "Advanced techniques for complex problems",
        skills: ["Graph Algorithms", "Greedy", "Advanced Trees", "System Design"],
        projects: [
          "Shortest Path Visualizer",
          "Greedy Algorithm Suite",
          "Trie Implementation",
          "Mini System Design"
        ],
        practiceProblems: [
          "Dijkstra's Algorithm", "Activity Selection", "Implement Trie",
          "Design Twitter", "LRU Cache"
        ]
      }
    ]
  }
};

export const skillLevels = {
  beginner: {
    color: "green",
    description: "New to this concept",
    timeRange: "1-4 weeks"
  },
  intermediate: {
    color: "yellow", 
    description: "Some experience required",
    timeRange: "2-6 weeks"
  },
  advanced: {
    color: "red",
    description: "Requires solid foundation",
    timeRange: "4-8 weeks"
  }
};

export const projectTypes = {
  portfolio: {
    icon: "🎨",
    description: "Showcase your skills"
  },
  practical: {
    icon: "🛠️", 
    description: "Real-world application"
  },
  learning: {
    icon: "📚",
    description: "Concept demonstration"
  },
  interview: {
    icon: "💼",
    description: "Interview preparation"
  }
};

export const learningResources = {
  documentation: {
    icon: "📖",
    description: "Official documentation"
  },
  course: {
    icon: "🎓",
    description: "Structured learning"
  },
  practice: {
    icon: "💪",
    description: "Hands-on practice"
  },
  community: {
    icon: "👥",
    description: "Community support"
  },
  book: {
    icon: "📚",
    description: "In-depth reading"
  }
};