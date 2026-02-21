import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, UserButton } from '@clerk/clerk-react';
import { useTheme } from '../../contexts/ThemeContext';
import useResponsiveTheme from '../../hooks/useResponsiveTheme';
import { 
  Code2, List, Search, Filter, Home, Trophy, 
  BarChart3, Calendar, Target, Zap
} from 'lucide-react';
import { dsaProblems } from '../../data/dsaProblems';

const LeetCodeHeader = ({ 
  selectedProblem, 
  onProblemSelect, 
  showProblemList, 
  setShowProblemList 
}) => {
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const { theme } = useTheme();
  const { isMobile, getThemeClasses } = useResponsiveTheme();

  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');

  const filteredProblems = dsaProblems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'All' || problem.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-red-400';
      default: return theme.text;
    }
  };

  return (
    <>
      {/* Header */}
      <div 
        className="h-16 flex items-center justify-between px-4 border-b"
        style={{ 
          borderColor: theme.border.replace('border-', ''),
          background: `linear-gradient(135deg, ${theme.card})`
        }}
      >
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 ${theme.text}`}
          >
            <Home className="w-5 h-5" />
            {!isMobile && <span className="font-semibold">CP-AI</span>}
          </button>

          <div className="h-8 w-px bg-white/20" />

          <button
            onClick={() => setShowProblemList(!showProblemList)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 ${theme.text}`}
          >
            <List className="w-5 h-5" />
            {!isMobile && <span>Problems</span>}
          </button>

          {!isMobile && selectedProblem && (
            <>
              <div className="h-8 w-px bg-white/20" />
              <div className="flex items-center gap-2">
                <span className={`text-sm ${theme.textSecondary}`}>
                  {selectedProblem.id}.
                </span>
                <span className={`font-medium ${theme.text}`}>
                  {selectedProblem.title}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(selectedProblem.difficulty)}`}>
                  {selectedProblem.difficulty}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {!isMobile && (
            <>
              <button className={`p-2 rounded-lg hover:bg-white/10 ${theme.text}`}>
                <Trophy className="w-5 h-5" />
              </button>
              <button className={`p-2 rounded-lg hover:bg-white/10 ${theme.text}`}>
                <BarChart3 className="w-5 h-5" />
              </button>
              <button className={`p-2 rounded-lg hover:bg-white/10 ${theme.text}`}>
                <Calendar className="w-5 h-5" />
              </button>
            </>
          )}

          {isSignedIn && <UserButton afterSignOutUrl="/" />}
        </div>
      </div>

      {/* Problem List Modal */}
      {showProblemList && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowProblemList(false)}
        >
          <div 
            className="w-full max-w-4xl max-h-[80vh] rounded-xl overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${theme.card})` }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b" style={{ borderColor: theme.border.replace('border-', '') }}>
              <h2 className={`text-xl font-bold ${theme.text} mb-4`}>
                Problem List
              </h2>

              {/* Search and Filter */}
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme.textSecondary}`} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search problems..."
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${theme.border} ${theme.text}`}
                    style={{ background: 'rgba(0,0,0,0.2)' }}
                  />
                </div>

                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className={`px-4 py-2 rounded-lg border ${theme.border} ${theme.text}`}
                  style={{ background: 'rgba(0,0,0,0.2)' }}
                >
                  <option value="All">All Levels</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            {/* Problem List */}
            <div className="overflow-y-auto max-h-[60vh] p-4">
              <div className="space-y-2">
                {filteredProblems.map((problem) => (
                  <button
                    key={problem.id}
                    onClick={() => {
                      onProblemSelect(problem);
                      setShowProblemList(false);
                    }}
                    className={`w-full p-4 rounded-lg border ${theme.border} hover:bg-white/5 transition-all text-left ${
                      selectedProblem?.id === problem.id ? 'bg-white/10' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className={`text-sm ${theme.textSecondary}`}>
                          {problem.id}.
                        </span>
                        <span className={`font-medium ${theme.text}`}>
                          {problem.title}
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {problem.tags?.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className={`text-xs px-2 py-1 rounded ${theme.textSecondary}`}
                          style={{ background: 'rgba(255,255,255,0.1)' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LeetCodeHeader;
