import { useState, useEffect } from 'react';
import { BookOpen, Clock, Search, ChevronRight, Star, TrendingUp, Award, Zap, ArrowLeft, Code, Lightbulb, Target } from 'lucide-react';
import { dsaArticlesEnhanced as dsaArticles, getAllArticles, searchArticles } from '../data/dsaArticlesEnhanced';

const DSAArticlesViewer = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const categories = [
    { id: 'all', name: 'All Articles', icon: '�', color: 'from-blue-600 to-cyan-600', bgColor: 'bg-blue-600/10' },
    { id: 'arrays', name: 'Arrays', icon: '�', color: 'from-green-600 to-emerald-600', bgColor: 'bg-green-600/10' },
    { id: 'strings', name: 'Strings', icon: '📝', color: 'from-yellow-600 to-orange-600', bgColor: 'bg-yellow-600/10' },
    { id: 'linkedLists', name: 'Linked Lists', icon: '�', color: 'from-purple-600 to-pink-600', bgColor: 'bg-purple-600/10' },
    { id: 'trees', name: 'Trees', icon: '🌳', color: 'from-emerald-600 to-teal-600', bgColor: 'bg-emerald-600/10' },
    { id: 'dynamicProgramming', name: 'Dynamic Programming', icon: '🎯', color: 'from-red-600 to-rose-600', bgColor: 'bg-red-600/10' },
    { id: 'graphs', name: 'Graphs', icon: '🕸️', color: 'from-indigo-600 to-purple-600', bgColor: 'bg-indigo-600/10' },
    { id: 'stackQueue', name: 'Stack & Queue', icon: '📚', color: 'from-pink-600 to-fuchsia-600', bgColor: 'bg-pink-600/10' }
  ];

  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const getFilteredArticles = () => {
    let articles = selectedCategory === 'all' 
      ? getAllArticles() 
      : dsaArticles[selectedCategory] || [];

    if (searchQuery) {
      articles = searchArticles(searchQuery);
    }

    if (difficultyFilter !== 'all') {
      articles = articles.filter(a => a.difficulty === difficultyFilter);
    }

    return articles;
  };

  const filteredArticles = getFilteredArticles();

  // Render markdown-like content
  const renderContent = (content) => {
    return content
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-4xl font-bold mb-6 mt-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{line.slice(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-3xl font-bold mb-4 mt-6 text-blue-300">{line.slice(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-2xl font-semibold mb-3 mt-4 text-purple-300">{line.slice(4)}</h3>;
        }
        
        // Code blocks
        if (line.startsWith('```')) {
          return null; // Handle in separate logic
        }
        
        // Lists
        if (line.startsWith('- ')) {
          return (
            <li key={index} className="ml-6 mb-2 text-gray-300 flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>{line.slice(2)}</span>
            </li>
          );
        }
        
        // Inline code
        if (line.includes('`')) {
          const parts = line.split('`');
          return (
            <p key={index} className="mb-3 text-gray-300 leading-relaxed">
              {parts.map((part, i) => 
                i % 2 === 0 ? part : <code key={i} className="px-2 py-1 bg-gray-800 rounded text-blue-300 text-sm">{part}</code>
              )}
            </p>
          );
        }
        
        // Regular paragraph
        if (line.trim()) {
          return <p key={index} className="mb-3 text-gray-300 leading-relaxed">{line}</p>;
        }
        
        return <br key={index} />;
      });
  };

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-y-auto">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Article View */}
        <div className="relative max-w-5xl mx-auto p-6 animate-fade-in">
          <button
            onClick={() => setSelectedArticle(null)}
            className="mb-6 flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-all hover:gap-3 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Articles
          </button>

          <article className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
            {/* Article Header */}
            <div className="mb-8 pb-6 border-b border-gray-700/50">
              <div className="flex items-start gap-6 mb-6">
                <div className="text-6xl animate-bounce-slow">{selectedArticle.thumbnail}</div>
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {selectedArticle.title}
                  </h1>
                  <p className="text-gray-400 text-lg mb-4">{selectedArticle.summary}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      {selectedArticle.readTime}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedArticle.difficulty === 'Beginner' ? 'bg-green-600/20 text-green-400 border border-green-600/30' :
                      selectedArticle.difficulty === 'Intermediate' ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30' :
                      'bg-red-600/20 text-red-400 border border-red-600/30'
                    }`}>
                      {selectedArticle.difficulty}
                    </span>
                    <span className="text-gray-500">{selectedArticle.date}</span>
                    <span className="text-gray-500">by {selectedArticle.author}</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {selectedArticle.tags.map((tag, index) => (
                  <span 
                    key={tag} 
                    className="px-3 py-1 bg-gray-700/50 hover:bg-gray-700 rounded-full text-xs text-gray-300 border border-gray-600/30 transition-all hover:scale-105 cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-invert max-w-none">
              {renderContent(selectedArticle.content)}
            </div>

            {/* Article Footer */}
            <div className="mt-12 pt-6 border-t border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg transition-all hover:scale-105">
                    <Star className="w-4 h-4" />
                    Bookmark
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 rounded-lg transition-all hover:scale-105">
                    <Award className="w-4 h-4" />
                    Mark Complete
                  </button>
                </div>
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all hover:scale-105"
                >
                  Read Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 overflow-y-auto transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header with Animation */}
        <div className="mb-8 text-center animate-slide-down">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            DSA Learning Articles
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Master Data Structures & Algorithms with comprehensive guides, code examples, and visual explanations
          </p>
          
          {/* Stats */}
          <div className="flex justify-center gap-8 mt-6">
            <div className="flex items-center gap-2 text-gray-400">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <span>{getAllArticles().length} Articles</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span>7 Categories</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span>3 Difficulty Levels</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
            <input
              type="text"
              placeholder="Search articles by title, topic, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-6 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
          >
            {difficulties.map(diff => (
              <option key={diff} value={diff} className="bg-gray-800">
                {diff === 'all' ? 'All Levels' : diff}
              </option>
            ))}
          </select>
        </div>

        {/* Categories */}
        <div className="mb-8 flex gap-3 overflow-x-auto pb-2 scrollbar-hide animate-fade-in" style={{ animationDelay: '400ms' }}>
          {categories.map((cat, index) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-xl whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === cat.id
                  ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                  : 'bg-gray-800/50 backdrop-blur-sm text-gray-400 hover:bg-gray-700/50 border border-gray-700'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Articles Grid with Stagger Animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, index) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="group bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                  {article.thumbnail}
                </div>
                <div className="flex flex-col gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    article.difficulty === 'Beginner' ? 'bg-green-600/20 text-green-400' :
                    article.difficulty === 'Intermediate' ? 'bg-yellow-600/20 text-yellow-400' :
                    'bg-red-600/20 text-red-400'
                  }`}>
                    {article.difficulty}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                {article.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {article.summary}
              </p>

              {/* Card Footer */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {article.readTime}
                </span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {article.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-400">
                    #{tag}
                  </span>
                ))}
                {article.tags.length > 3 && (
                  <span className="px-2 py-1 text-xs text-gray-500">
                    +{article.tags.length - 3}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-400">No articles found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setDifficultyFilter('all');
                setSelectedCategory('all');
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all hover:scale-105"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Learning Tips */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '600ms' }}>
          <div className="bg-gradient-to-br from-blue-600/10 to-cyan-600/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-600/20">
            <Code className="w-10 h-10 text-blue-400 mb-4" />
            <h4 className="text-lg font-semibold mb-2">Code Examples</h4>
            <p className="text-sm text-gray-400">Every article includes working code examples with explanations</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-600/20">
            <Lightbulb className="w-10 h-10 text-purple-400 mb-4" />
            <h4 className="text-lg font-semibold mb-2">Visual Learning</h4>
            <p className="text-sm text-gray-400">Understand concepts with diagrams and step-by-step breakdowns</p>
          </div>
          <div className="bg-gradient-to-br from-green-600/10 to-emerald-600/10 backdrop-blur-sm rounded-2xl p-6 border border-green-600/20">
            <Target className="w-10 h-10 text-green-400 mb-4" />
            <h4 className="text-lg font-semibold mb-2">Complexity Analysis</h4>
            <p className="text-sm text-gray-400">Learn time and space complexity for every algorithm</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSAArticlesViewer;
