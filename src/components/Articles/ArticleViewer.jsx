import { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Calendar,
  Share2,
  Bookmark,
  Eye,
  ThumbsUp,
  MessageCircle,
  Tag,
  Search,
  Filter,
  ChevronRight,
  Star,
  TrendingUp,
  Zap,
  CheckCircle2,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  Sparkles,
  Award,
  Target,
  Timer,
  BookmarkCheck,
  Heart,
  Coffee,
  Lightbulb,
  Flame,
  Navigation,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const ArticleViewer = ({ onBack }) => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [bookmarkedArticles, setBookmarkedArticles] = useState(new Set());
  const [readingProgress, setReadingProgress] = useState({});
  const [readingTimer, setReadingTimer] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [showReadingStats, setShowReadingStats] = useState(false);
  const [likedArticles, setLikedArticles] = useState(new Set());
  const [sortBy, setSortBy] = useState('newest'); // newest, popular, trending
  
  const sectionRefs = useRef([]);
  const articleContentRef = useRef(null);

  // Sample articles data
  const articles = [
    {
      id: 'react-hooks-guide',
      title: 'Complete Guide to React Hooks',
      category: 'React',
      author: 'Sarah Johnson',
      publishDate: '2024-01-10',
      readTime: '12 min read',
      views: 2847,
      likes: 156,
      comments: 23,
      tags: ['React', 'Hooks', 'JavaScript', 'Frontend'],
      description: 'Master React Hooks with practical examples and best practices',
      sections: [
        {
          id: 'introduction',
          title: 'Introduction to Hooks',
          description: 'Understanding the basics of React Hooks',
          duration: '2 min',
          content: `
            <h2>What are React Hooks?</h2>
            <p>React Hooks are functions that let you "hook into" React state and lifecycle features from function components. They were introduced in React 16.8 and have revolutionized how we write React applications.</p>
            
            <h3>Why Hooks?</h3>
            <ul>
              <li>Simpler component logic</li>
              <li>Better code reuse</li>
              <li>Easier testing</li>
              <li>No more class components needed</li>
            </ul>

            <div class="code-block">
              <pre><code>import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    &lt;div&gt;
      &lt;p&gt;You clicked {count} times&lt;/p&gt;
      &lt;button onClick={() =&gt; setCount(count + 1)}&gt;
        Click me
      &lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
            </div>
          `
        },
        {
          id: 'usestate',
          title: 'useState Hook',
          description: 'Managing state in functional components',
          duration: '3 min',
          content: `
            <h2>useState Hook</h2>
            <p>The useState Hook lets you add state to functional components. It returns an array with two elements: the current state value and a function to update it.</p>
            
            <h3>Basic Usage</h3>
            <div class="code-block">
              <pre><code>const [state, setState] = useState(initialValue);</code></pre>
            </div>

            <h3>Multiple State Variables</h3>
            <div class="code-block">
              <pre><code>function UserProfile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);
  
  return (
    &lt;form&gt;
      &lt;input 
        value={name} 
        onChange={(e) =&gt; setName(e.target.value)} 
        placeholder="Name" 
      /&gt;
      &lt;input 
        value={email} 
        onChange={(e) =&gt; setEmail(e.target.value)} 
        placeholder="Email" 
      /&gt;
      &lt;input 
        type="number"
        value={age} 
        onChange={(e) =&gt; setAge(parseInt(e.target.value))} 
        placeholder="Age" 
      /&gt;
    &lt;/form&gt;
  );
}</code></pre>
            </div>
          `
        },
        {
          id: 'useeffect',
          title: 'useEffect Hook',
          description: 'Handling side effects and lifecycle events',
          duration: '4 min',
          content: `
            <h2>useEffect Hook</h2>
            <p>The useEffect Hook lets you perform side effects in functional components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount combined.</p>
            
            <h3>Basic Effect</h3>
            <div class="code-block">
              <pre><code>useEffect(() =&gt; {
  // Effect logic here
  document.title = \`You clicked \${count} times\`;
});</code></pre>
            </div>

            <h3>Effect with Cleanup</h3>
            <div class="code-block">
              <pre><code>useEffect(() =&gt; {
  const timer = setInterval(() =&gt; {
    setCount(prevCount =&gt; prevCount + 1);
  }, 1000);
  
  return () =&gt; clearInterval(timer);
}, []);</code></pre>
            </div>

            <h3>Conditional Effects</h3>
            <div class="code-block">
              <pre><code>useEffect(() =&gt; {
  fetchUserData(userId);
}, [userId]); // Only re-run when userId changes</code></pre>
            </div>
          `
        },
        {
          id: 'custom-hooks',
          title: 'Custom Hooks',
          description: 'Creating reusable stateful logic',
          duration: '3 min',
          content: `
            <h2>Custom Hooks</h2>
            <p>Custom Hooks are JavaScript functions whose names start with "use" and that may call other Hooks. They let you extract component logic into reusable functions.</p>
            
            <h3>Example: useCounter Hook</h3>
            <div class="code-block">
              <pre><code>function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () =&gt; setCount(count + 1);
  const decrement = () =&gt; setCount(count - 1);
  const reset = () =&gt; setCount(initialValue);
  
  return { count, increment, decrement, reset };
}

// Usage
function Counter() {
  const { count, increment, decrement, reset } = useCounter(0);
  
  return (
    &lt;div&gt;
      &lt;p&gt;Count: {count}&lt;/p&gt;
      &lt;button onClick={increment}&gt;+&lt;/button&gt;
      &lt;button onClick={decrement}&gt;-&lt;/button&gt;
      &lt;button onClick={reset}&gt;Reset&lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
            </div>
          `
        }
      ]
    },
    {
      id: 'javascript-async-patterns',
      title: 'Modern JavaScript Async Patterns',
      category: 'JavaScript',
      author: 'Mike Chen',
      publishDate: '2024-01-08',
      readTime: '15 min read',
      views: 1923,
      likes: 89,
      comments: 12,
      tags: ['JavaScript', 'Async', 'Promises', 'ES6+'],
      description: 'Deep dive into modern asynchronous JavaScript patterns',
      sections: [
        {
          id: 'promises-intro',
          title: 'Understanding Promises',
          description: 'The foundation of async JavaScript',
          duration: '4 min',
          content: `
            <h2>JavaScript Promises</h2>
            <p>Promises represent the eventual completion (or failure) of an asynchronous operation and its resulting value.</p>
            
            <h3>Promise States</h3>
            <ul>
              <li><strong>Pending:</strong> Initial state, neither fulfilled nor rejected</li>
              <li><strong>Fulfilled:</strong> Operation completed successfully</li>
              <li><strong>Rejected:</strong> Operation failed</li>
            </ul>

            <div class="code-block">
              <pre><code>const promise = new Promise((resolve, reject) =&gt; {
  setTimeout(() =&gt; {
    if (Math.random() &gt; 0.5) {
      resolve('Success!');
    } else {
      reject('Error occurred');
    }
  }, 1000);
});

promise
  .then(result =&gt; console.log(result))
  .catch(error =&gt; console.error(error));</code></pre>
            </div>
          `
        },
        {
          id: 'async-await',
          title: 'Async/Await Syntax',
          description: 'Cleaner asynchronous code with async/await',
          duration: '5 min',
          content: `
            <h2>Async/Await</h2>
            <p>Async/await makes asynchronous code look and behave more like synchronous code, making it easier to read and debug.</p>
            
            <h3>Basic Async Function</h3>
            <div class="code-block">
              <pre><code>async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}</code></pre>
            </div>

            <h3>Parallel Execution</h3>
            <div class="code-block">
              <pre><code>async function fetchMultipleData() {
  try {
    const [users, posts, comments] = await Promise.all([
      fetch('/api/users').then(r =&gt; r.json()),
      fetch('/api/posts').then(r =&gt; r.json()),
      fetch('/api/comments').then(r =&gt; r.json())
    ]);
    
    return { users, posts, comments };
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}</code></pre>
            </div>
          `
        },
        {
          id: 'error-handling',
          title: 'Error Handling Patterns',
          description: 'Robust error handling in async code',
          duration: '3 min',
          content: `
            <h2>Error Handling in Async Code</h2>
            <p>Proper error handling is crucial for robust applications. Here are common patterns for handling errors in asynchronous JavaScript.</p>
            
            <h3>Try-Catch with Async/Await</h3>
            <div class="code-block">
              <pre><code>async function safeApiCall() {
  try {
    const response = await fetch('/api/data');
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      console.error('Network error:', error.message);
    } else {
      console.error('API error:', error.message);
    }
    
    // Return default value or re-throw
    return null;
  }
}</code></pre>
            </div>

            <h3>Promise Error Handling</h3>
            <div class="code-block">
              <pre><code>fetch('/api/data')
  .then(response =&gt; {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data =&gt; console.log(data))
  .catch(error =&gt; {
    console.error('Fetch error:', error);
  });</code></pre>
            </div>
          `
        },
        {
          id: 'advanced-patterns',
          title: 'Advanced Async Patterns',
          description: 'Complex async patterns and best practices',
          duration: '3 min',
          content: `
            <h2>Advanced Async Patterns</h2>
            <p>Explore advanced patterns for complex asynchronous scenarios.</p>
            
            <h3>Retry Pattern</h3>
            <div class="code-block">
              <pre><code>async function retryOperation(operation, maxRetries = 3) {
  for (let i = 0; i &lt; maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const delay = Math.pow(2, i) * 1000; // Exponential backoff
      await new Promise(resolve =&gt; setTimeout(resolve, delay));
    }
  }
}</code></pre>
            </div>

            <h3>Timeout Pattern</h3>
            <div class="code-block">
              <pre><code>function withTimeout(promise, timeoutMs) {
  const timeout = new Promise((_, reject) =&gt;
    setTimeout(() =&gt; reject(new Error('Operation timed out')), timeoutMs)
  );
  
  return Promise.race([promise, timeout]);
}

// Usage
const result = await withTimeout(
  fetch('/api/slow-endpoint'),
  5000 // 5 second timeout
);</code></pre>
            </div>
          `
        }
      ]
    },
    {
      id: 'css-grid-flexbox',
      title: 'CSS Grid vs Flexbox: When to Use What',
      category: 'CSS',
      author: 'Emma Wilson',
      publishDate: '2024-01-05',
      readTime: '10 min read',
      views: 3421,
      likes: 234,
      comments: 45,
      tags: ['CSS', 'Grid', 'Flexbox', 'Layout'],
      description: 'Complete comparison of CSS Grid and Flexbox with practical examples',
      sections: [
        {
          id: 'layout-overview',
          title: 'Layout Systems Overview',
          description: 'Understanding modern CSS layout systems',
          duration: '2 min',
          content: `
            <h2>Modern CSS Layout Systems</h2>
            <p>CSS Grid and Flexbox are two powerful layout systems that solve different problems. Understanding when to use each is key to creating efficient, maintainable layouts.</p>
            
            <h3>Key Differences</h3>
            <ul>
              <li><strong>Flexbox:</strong> One-dimensional layout (row or column)</li>
              <li><strong>Grid:</strong> Two-dimensional layout (rows and columns)</li>
            </ul>

            <div class="comparison-table">
              <table>
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Flexbox</th>
                    <th>CSS Grid</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Dimension</td>
                    <td>1D (row or column)</td>
                    <td>2D (rows and columns)</td>
                  </tr>
                  <tr>
                    <td>Best for</td>
                    <td>Component layout</td>
                    <td>Page layout</td>
                  </tr>
                  <tr>
                    <td>Browser Support</td>
                    <td>Excellent</td>
                    <td>Good (IE11+)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          `
        },
        {
          id: 'flexbox-deep-dive',
          title: 'Flexbox Deep Dive',
          description: 'Master flexbox properties and use cases',
          duration: '4 min',
          content: `
            <h2>Flexbox Properties</h2>
            <p>Flexbox excels at distributing space and aligning items in a single dimension.</p>
            
            <h3>Container Properties</h3>
            <div class="code-block">
              <pre><code>.flex-container {
  display: flex;
  flex-direction: row; /* row, column, row-reverse, column-reverse */
  justify-content: center; /* flex-start, flex-end, center, space-between, space-around */
  align-items: center; /* flex-start, flex-end, center, stretch, baseline */
  flex-wrap: wrap; /* nowrap, wrap, wrap-reverse */
}</code></pre>
            </div>

            <h3>Item Properties</h3>
            <div class="code-block">
              <pre><code>.flex-item {
  flex-grow: 1; /* How much to grow */
  flex-shrink: 1; /* How much to shrink */
  flex-basis: auto; /* Initial size */
  align-self: center; /* Override container's align-items */
}</code></pre>
            </div>

            <h3>Common Patterns</h3>
            <div class="code-block">
              <pre><code>/* Center content */
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Equal width columns */
.equal-columns {
  display: flex;
}
.equal-columns > * {
  flex: 1;
}</code></pre>
            </div>
          `
        },
        {
          id: 'grid-deep-dive',
          title: 'CSS Grid Deep Dive',
          description: 'Master CSS Grid for complex layouts',
          duration: '4 min',
          content: `
            <h2>CSS Grid Properties</h2>
            <p>CSS Grid provides precise control over two-dimensional layouts.</p>
            
            <h3>Grid Container</h3>
            <div class="code-block">
              <pre><code>.grid-container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr; /* Flexible columns */
  grid-template-rows: auto 1fr auto; /* Header, content, footer */
  gap: 20px; /* Space between items */
  
  /* Named grid lines */
  grid-template-areas: 
    "header header header"
    "sidebar main aside"
    "footer footer footer";
}</code></pre>
            </div>

            <h3>Grid Items</h3>
            <div class="code-block">
              <pre><code>.grid-item {
  grid-column: 1 / 3; /* Span from line 1 to 3 */
  grid-row: 2 / 4; /* Span from line 2 to 4 */
  
  /* Or use named areas */
  grid-area: header;
  
  /* Alignment within grid cell */
  justify-self: center;
  align-self: center;
}</code></pre>
            </div>

            <h3>Responsive Grid</h3>
            <div class="code-block">
              <pre><code>.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}</code></pre>
            </div>
          `
        }
      ]
    }
  ];

  const categories = ['all', 'React', 'JavaScript', 'CSS', 'Node.js', 'Python'];

  // Filter articles based on search and category
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.views - a.views;
      case 'trending':
        return b.likes - a.likes;
      case 'newest':
      default:
        return new Date(b.publishDate) - new Date(a.publishDate);
    }
  });

  // Reading timer effect
  useEffect(() => {
    let interval;
    if (isReading && selectedArticle) {
      interval = setInterval(() => {
        setReadingTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isReading, selectedArticle]);

  // Start reading timer when article is selected
  useEffect(() => {
    if (selectedArticle) {
      setIsReading(true);
      setReadingTimer(0);
    } else {
      setIsReading(false);
    }
  }, [selectedArticle]);

  // Format reading time
  const formatReadingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle section scrolling - Welcome page style
  const scrollToSection = (sectionIndex) => {
    setCurrentSection(sectionIndex);
    
    if (sectionRefs.current[sectionIndex]) {
      sectionRefs.current[sectionIndex].scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
    }
  };

  // Scroll to next/previous section
  const scrollToNext = () => {
    const nextSection = Math.min(currentSection + 1, selectedArticle.sections.length - 1);
    scrollToSection(nextSection);
  };

  const scrollToPrev = () => {
    const prevSection = Math.max(currentSection - 1, 0);
    scrollToSection(prevSection);
  };

  // Full screen scrolling functions
  const scrollPageUp = () => {
    const currentScroll = window.pageYOffset;
    const viewportHeight = window.innerHeight;
    const scrollAmount = viewportHeight * 0.9; // Scroll 90% of viewport height
    window.scrollTo({ 
      top: Math.max(0, currentScroll - scrollAmount), 
      behavior: 'smooth' 
    });
  };

  const scrollPageDown = () => {
    const currentScroll = window.pageYOffset;
    const viewportHeight = window.innerHeight;
    const scrollAmount = viewportHeight * 0.9; // Scroll 90% of viewport height
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ 
      top: Math.min(maxScroll, currentScroll + scrollAmount), 
      behavior: 'smooth' 
    });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Full screen scrolling with Page Up/Down and Space
      if (e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
        e.preventDefault();
        scrollPageDown();
      } else if (e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
        e.preventDefault();
        scrollPageUp();
      } 
      // Section navigation with arrow keys
      else if (e.key === 'ArrowDown' && e.ctrlKey) {
        e.preventDefault();
        scrollToNext();
      } else if (e.key === 'ArrowUp' && e.ctrlKey) {
        e.preventDefault();
        scrollToPrev();
      }
      // Quick navigation
      else if (e.key === 'Home' && e.ctrlKey) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (e.key === 'End' && e.ctrlKey) {
        e.preventDefault();
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
      }
    };

    if (selectedArticle) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [selectedArticle, currentSection]);

  // Toggle section completion
  const toggleSectionCompletion = (sectionId) => {
    const newCompleted = new Set(completedSections);
    if (newCompleted.has(sectionId)) {
      newCompleted.delete(sectionId);
    } else {
      newCompleted.add(sectionId);
    }
    setCompletedSections(newCompleted);
    
    // Update reading progress
    if (selectedArticle) {
      setReadingProgress(prev => ({
        ...prev,
        [selectedArticle.id]: {
          ...prev[selectedArticle.id],
          completedSections: newCompleted.size,
          totalSections: selectedArticle.sections.length,
          lastRead: new Date().toISOString()
        }
      }));
    }
  };

  // Toggle bookmark
  const toggleBookmark = (articleId) => {
    const newBookmarks = new Set(bookmarkedArticles);
    if (newBookmarks.has(articleId)) {
      newBookmarks.delete(articleId);
    } else {
      newBookmarks.add(articleId);
    }
    setBookmarkedArticles(newBookmarks);
  };

  // Toggle like
  const toggleLike = (articleId) => {
    const newLikes = new Set(likedArticles);
    if (newLikes.has(articleId)) {
      newLikes.delete(articleId);
    } else {
      newLikes.add(articleId);
    }
    setLikedArticles(newLikes);
  };

  // Detect current section while scrolling
  useEffect(() => {
    if (!selectedArticle) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      
      for (let i = sectionRefs.current.length - 1; i >= 0; i--) {
        const section = sectionRefs.current[i];
        if (section && section.offsetTop <= scrollPosition) {
          setCurrentSection(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedArticle]);

  // Full screen scrolling functions for article list
  const scrollPageUpList = () => {
    const currentScroll = window.pageYOffset;
    const viewportHeight = window.innerHeight;
    const scrollAmount = viewportHeight * 0.9; // Scroll 90% of viewport height
    window.scrollTo({ 
      top: Math.max(0, currentScroll - scrollAmount), 
      behavior: 'smooth' 
    });
  };

  const scrollPageDownList = () => {
    const currentScroll = window.pageYOffset;
    const viewportHeight = window.innerHeight;
    const scrollAmount = viewportHeight * 0.9; // Scroll 90% of viewport height
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ 
      top: Math.min(maxScroll, currentScroll + scrollAmount), 
      behavior: 'smooth' 
    });
  };

  // Keyboard navigation for article list - moved to top level
  useEffect(() => {
    // Only add keyboard listeners when in article list view
    if (selectedArticle) return;

    const handleKeyPress = (e) => {
      // Full screen scrolling with Page Up/Down and Space
      if (e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
        e.preventDefault();
        scrollPageDownList();
      } else if (e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
        e.preventDefault();
        scrollPageUpList();
      } 
      // Quick navigation
      else if (e.key === 'Home' && e.ctrlKey) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (e.key === 'End' && e.ctrlKey) {
        e.preventDefault();
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedArticle]); // Add selectedArticle as dependency

  // Article list view
  if (!selectedArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white scroll-smooth">
        {/* Welcome Page Style Navigation for Article List */}
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 shadow-2xl">
          <div className="flex flex-col space-y-3">
            {/* Scroll to top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
              title="Scroll to top (Ctrl+Home)"
            >
              <ChevronUp size={20} />
            </button>

            {/* Page Up - Full screen scroll */}
            <button
              onClick={scrollPageUpList}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
              title="Page Up (Page Up / Shift+Space)"
            >
              <ChevronUp size={16} className="opacity-75" />
            </button>

            {/* Page Down - Full screen scroll */}
            <button
              onClick={scrollPageDownList}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
              title="Page Down (Page Down / Space)"
            >
              <ChevronDown size={16} className="opacity-75" />
            </button>
            
            {/* Scroll to bottom */}
            <button
              onClick={() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
              title="Scroll to bottom (Ctrl+End)"
            >
              <ChevronDown size={20} />
            </button>
          </div>

          {/* Shortcuts info */}
          <div className="mt-4 pt-3 border-t border-gray-700 text-center">
            <div className="text-xs text-gray-600">
              Space/PgDn: Page scroll
            </div>
          </div>
        </div>
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Header */}
        <div className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-gray-700/50 sticky top-0">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button
                  onClick={onBack}
                  className="group p-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300"
                >
                  <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Programming Articles
                  </h1>
                  <p className="text-gray-400 text-sm mt-1">
                    In-depth tutorials, guides, and insights from industry experts
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-gray-800/70 transition-all duration-300 w-64"
                  />
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <TrendingUp size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="pl-10 pr-8 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer transition-all duration-300"
                  >
                    <option value="newest" className="bg-gray-800">Newest First</option>
                    <option value="popular" className="bg-gray-800">Most Popular</option>
                    <option value="trending" className="bg-gray-800">Trending</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="pl-10 pr-8 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer transition-all duration-300"
                  >
                    {categories.map(category => (
                      <option key={category} value={category} className="bg-gray-800">
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Featured Articles Section */}
          {searchTerm === '' && selectedCategory === 'all' && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Flame className="text-orange-500" size={24} />
                <h2 className="text-2xl font-bold text-white">Featured Articles</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-orange-500/50 to-transparent"></div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {filteredArticles.slice(0, 2).map(article => {
                  const progress = readingProgress[article.id];
                  const progressPercent = progress ? (progress.completedSections / progress.totalSections) * 100 : 0;
                  
                  return (
                    <div
                      key={article.id}
                      className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-300 cursor-pointer group"
                      onClick={() => setSelectedArticle(article)}
                    >
                      {/* Featured Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-xs font-bold flex items-center gap-1">
                          <Star size={12} />
                          Featured
                        </span>
                      </div>

                      <div className="p-8">
                        <div className="flex items-start justify-between mb-6">
                          <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm font-medium">
                            {article.category}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBookmark(article.id);
                              }}
                              className={`p-2 rounded-lg transition-colors ${
                                bookmarkedArticles.has(article.id)
                                  ? 'text-yellow-400 bg-yellow-400/20'
                                  : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10'
                              }`}
                            >
                              <Bookmark size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLike(article.id);
                              }}
                              className={`p-2 rounded-lg transition-colors ${
                                likedArticles.has(article.id)
                                  ? 'text-red-400 bg-red-400/20'
                                  : 'text-gray-400 hover:text-red-400 hover:bg-red-400/10'
                              }`}
                            >
                              <Heart size={16} />
                            </button>
                          </div>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                          {article.title}
                        </h3>
                        
                        <p className="text-gray-400 text-base mb-6 line-clamp-3">
                          {article.description}
                        </p>

                        <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                          <div className="flex items-center gap-2">
                            <User size={14} />
                            <span>{article.author}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={14} />
                            <span>{article.readTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye size={14} />
                            <span>{article.views}</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {progressPercent > 0 && (
                          <div className="mb-6">
                            <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                              <span>Reading Progress</span>
                              <span>{Math.round(progressPercent)}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {article.tags.slice(0, 2).map(tag => (
                              <span 
                                key={tag}
                                className="px-3 py-1 bg-gray-700/50 text-gray-400 rounded-full text-xs"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                          
                          <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* All Articles Section */}
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="text-blue-500" size={24} />
            <h2 className="text-2xl font-bold text-white">
              {searchTerm || selectedCategory !== 'all' ? 'Search Results' : 'All Articles'}
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 to-transparent"></div>
            <span className="text-gray-400 text-sm">{filteredArticles.length} articles</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(article => {
              const progress = readingProgress[article.id];
              const progressPercent = progress ? (progress.completedSections / progress.totalSections) * 100 : 0;
              
              return (
                <div
                  key={article.id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-300 cursor-pointer group hover:transform hover:scale-105"
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm font-medium">
                        {article.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(article.id);
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            bookmarkedArticles.has(article.id)
                              ? 'text-yellow-400 bg-yellow-400/20'
                              : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10'
                          }`}
                        >
                          <Bookmark size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(article.id);
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            likedArticles.has(article.id)
                              ? 'text-red-400 bg-red-400/20'
                              : 'text-gray-400 hover:text-red-400 hover:bg-red-400/10'
                          }`}
                        >
                          <Heart size={16} />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {article.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <User size={12} />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{new Date(article.publishDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{article.readTime}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {progressPercent > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                          <span>Reading Progress</span>
                          <span>{Math.round(progressPercent)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <div 
                            className="h-full bg-blue-500 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye size={12} />
                          <span>{article.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp size={12} />
                          <span>{article.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle size={12} />
                          <span>{article.comments}</span>
                        </div>
                      </div>
                      
                      <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-4">
                      {article.tags.slice(0, 3).map(tag => (
                        <span 
                          key={tag}
                          className="px-2 py-1 bg-gray-700/50 text-gray-400 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                      {article.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-700/50 text-gray-400 rounded text-xs">
                          +{article.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No articles found</div>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Article reading view
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white scroll-smooth">
      {/* Welcome Page Style Navigation */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 shadow-2xl">
        <div className="flex flex-col space-y-3">
          {/* Scroll to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
            title="Scroll to top (Ctrl+Home)"
          >
            <ChevronUp size={20} />
          </button>

          {/* Page Up - Full screen scroll */}
          <button
            onClick={scrollPageUp}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
            title="Page Up (Page Up / Shift+Space)"
          >
            <ChevronUp size={16} className="opacity-75" />
          </button>

          {/* Previous section */}
          <button
            onClick={scrollToPrev}
            disabled={currentSection === 0}
            className={`p-2 rounded-lg transition-all duration-200 ${
              currentSection === 0 
                ? 'text-gray-600 cursor-not-allowed' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
            title="Previous section (Ctrl+↑)"
          >
            <Navigation size={16} className="rotate-180" />
          </button>

          {/* Section indicators */}
          <div className="flex flex-col space-y-2 max-h-64 overflow-y-auto">
            {selectedArticle.sections.map((section, index) => {
              const isActive = currentSection === index;
              const isCompleted = completedSections.has(section.id);
              
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(index)}
                  className={`group relative p-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                      : isCompleted
                      ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                  title={section.title}
                >
                  <div className="flex items-center justify-center">
                    <span className="text-xs font-medium">
                      {index + 1}
                    </span>
                  </div>

                  {/* Tooltip */}
                  <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 
                    bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 
                    transition-opacity duration-200 pointer-events-none z-50 shadow-lg border border-gray-700">
                    <div className="font-medium">{section.title}</div>
                    {section.duration && (
                      <div className="text-gray-400 text-xs mt-1">{section.duration}</div>
                    )}
                    
                    {/* Arrow */}
                    <div className="absolute top-1/2 transform -translate-y-1/2 -right-1 w-2 h-2 bg-gray-900 border-gray-700 rotate-45 border-l border-t"></div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Next section */}
          <button
            onClick={scrollToNext}
            disabled={currentSection === selectedArticle.sections.length - 1}
            className={`p-2 rounded-lg transition-all duration-200 ${
              currentSection === selectedArticle.sections.length - 1
                ? 'text-gray-600 cursor-not-allowed' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
            title="Next section (Ctrl+↓)"
          >
            <Navigation size={16} />
          </button>

          {/* Page Down - Full screen scroll */}
          <button
            onClick={scrollPageDown}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
            title="Page Down (Page Down / Space)"
          >
            <ChevronDown size={16} className="opacity-75" />
          </button>
          
          {/* Scroll to bottom */}
          <button
            onClick={() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
            title="Scroll to bottom (Ctrl+End)"
          >
            <ChevronDown size={20} />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="mt-4 pt-3 border-t border-gray-700">
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">Progress</div>
            <div className="text-xs font-medium text-blue-400">
              {completedSections.size}/{selectedArticle.sections.length}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${(completedSections.size / selectedArticle.sections.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Section info and shortcuts */}
        <div className="mt-2 text-center">
          <div className="text-xs text-gray-500 mb-1">
            {currentSection + 1} / {selectedArticle.sections.length}
          </div>
          <div className="text-xs text-gray-600">
            Space/PgDn: Page scroll
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="">{/* Full width since no sidebar */}
        {/* Header */}
        <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-30">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedArticle(null)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Articles</span>
              </button>

              <div className="flex items-center gap-3">
                {/* Reading Timer */}
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 rounded-lg">
                  <Timer size={16} className="text-blue-400" />
                  <span className="text-sm text-gray-300">{formatReadingTime(readingTimer)}</span>
                </div>

                {/* Reading Stats Toggle */}
                <button
                  onClick={() => setShowReadingStats(!showReadingStats)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                  title="Reading Statistics"
                >
                  <Coffee size={16} />
                </button>

                <button
                  onClick={() => toggleBookmark(selectedArticle.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    bookmarkedArticles.has(selectedArticle.id)
                      ? 'text-yellow-400 bg-yellow-400/20'
                      : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10'
                  }`}
                >
                  <Bookmark size={16} />
                </button>
                
                <button
                  onClick={() => toggleLike(selectedArticle.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    likedArticles.has(selectedArticle.id)
                      ? 'text-red-400 bg-red-400/20'
                      : 'text-gray-400 hover:text-red-400 hover:bg-red-400/10'
                  }`}
                >
                  <Heart size={16} />
                </button>
                
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            {/* Reading Stats Panel */}
            {showReadingStats && (
              <div className="mt-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-400">{formatReadingTime(readingTimer)}</div>
                    <div className="text-xs text-gray-400">Reading Time</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-400">{completedSections.size}</div>
                    <div className="text-xs text-gray-400">Sections Done</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-400">{selectedArticle.sections.length - completedSections.size}</div>
                    <div className="text-xs text-gray-400">Remaining</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-400">{Math.round((completedSections.size / selectedArticle.sections.length) * 100)}%</div>
                    <div className="text-xs text-gray-400">Progress</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-6 py-8" ref={articleContentRef}>
          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm font-medium">
                {selectedArticle.category}
              </span>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <User size={14} />
                  <span>{selectedArticle.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{new Date(selectedArticle.publishDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{selectedArticle.readTime}</span>
                </div>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-white mb-4">
              {selectedArticle.title}
            </h1>
            
            <p className="text-xl text-gray-300 mb-6">
              {selectedArticle.description}
            </p>

            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Eye size={14} />
                  <span>{selectedArticle.views} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp size={14} />
                  <span>{selectedArticle.likes} likes</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle size={14} />
                  <span>{selectedArticle.comments} comments</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedArticle.tags.map(tag => (
                  <span 
                    key={tag}
                    className="px-2 py-1 bg-gray-700/50 text-gray-400 rounded text-xs flex items-center gap-1"
                  >
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Article Sections */}
          <div className="space-y-16">
            {selectedArticle.sections.map((section, index) => (
              <section
                key={section.id}
                ref={el => sectionRefs.current[index] = el}
                className={`scroll-mt-32 min-h-[80vh] py-8 transition-all duration-300 ${
                  currentSection === index ? 'ring-2 ring-blue-500/30 rounded-lg p-6 bg-blue-500/5' : ''
                }`}
                id={`section-${index}`}
              >
                {/* Section Header */}
                <div className="mb-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Section {index + 1}: {section.title}
                  </h2>
                  {section.description && (
                    <p className="text-gray-400">{section.description}</p>
                  )}
                  {section.duration && (
                    <div className="text-sm text-blue-400 mt-2">
                      ⏱️ {section.duration}
                    </div>
                  )}
                </div>

                {/* Section Content */}
                <div 
                  className="prose prose-invert prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </section>
            ))}
          </div>

          {/* Article Footer */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Completed {completedSections.size} of {selectedArticle.sections.length} sections
              </div>
              
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Back to Articles
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .prose h2 {
          color: #ffffff;
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .prose h3 {
          color: #e5e7eb;
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .prose p {
          color: #d1d5db;
          line-height: 1.7;
          margin-bottom: 1rem;
        }

        .prose ul, .prose ol {
          color: #d1d5db;
          margin-bottom: 1rem;
        }

        .prose li {
          margin-bottom: 0.5rem;
        }

        .prose strong {
          color: #ffffff;
          font-weight: 600;
        }

        .code-block {
          margin: 1.5rem 0;
          border-radius: 0.5rem;
          overflow: hidden;
          border: 1px solid #374151;
        }

        .code-block pre {
          background: #1f2937;
          padding: 1.5rem;
          margin: 0;
          overflow-x: auto;
        }

        .code-block code {
          color: #e5e7eb;
          font-family: 'Fira Code', 'Monaco', 'Cascadia Code', monospace;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .comparison-table table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          background: #1f2937;
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .comparison-table th,
        .comparison-table td {
          padding: 0.75rem 1rem;
          text-align: left;
          border-bottom: 1px solid #374151;
        }

        .comparison-table th {
          background: #374151;
          color: #ffffff;
          font-weight: 600;
        }

        .comparison-table td {
          color: #d1d5db;
        }
      `}</style>
    </div>
  );
};

export default ArticleViewer;