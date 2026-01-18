import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Clock, 
  Award,
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  Lightbulb,
  TrendingUp,
  Heart,
  ArrowUp,
  Sparkles,
  Flame
} from 'lucide-react';

const DSAGame = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      setScrollProgress(scrollPercent);
      setShowScrollTop(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // DSA Challenges Database
  const challenges = [
    // Level 1 - Arrays
    {
      id: 1,
      level: 1,
      category: 'Arrays',
      question: 'What is the time complexity of accessing an element in an array by index?',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
      correct: 0,
      explanation: 'Array access by index is O(1) because arrays store elements in contiguous memory locations.',
      points: 10
    },
    {
      id: 2,
      level: 1,
      category: 'Arrays',
      question: 'Which operation is most efficient on an array?',
      options: ['Insert at beginning', 'Access by index', 'Delete from middle', 'Search unsorted'],
      correct: 1,
      explanation: 'Accessing by index is O(1), while other operations require shifting elements.',
      points: 10
    },
    // Level 2 - Linked Lists
    {
      id: 3,
      level: 2,
      category: 'Linked Lists',
      question: 'What is the time complexity of inserting at the head of a linked list?',
      options: ['O(n)', 'O(1)', 'O(log n)', 'O(n log n)'],
      correct: 1,
      explanation: 'Inserting at the head only requires updating pointers, which is O(1).',
      points: 15
    },
    {
      id: 4,
      level: 2,
      category: 'Linked Lists',
      question: 'What advantage does a doubly linked list have over a singly linked list?',
      options: ['Uses less memory', 'Faster forward traversal', 'Can traverse backwards', 'Better cache locality'],
      correct: 2,
      explanation: 'Doubly linked lists can traverse in both directions due to prev pointers.',
      points: 15
    },
    // Level 3 - Stacks & Queues
    {
      id: 5,
      level: 3,
      category: 'Stacks',
      question: 'Which data structure follows LIFO (Last In First Out)?',
      options: ['Queue', 'Stack', 'Array', 'Tree'],
      correct: 1,
      explanation: 'Stack follows LIFO - the last element added is the first one removed.',
      points: 20
    },
    {
      id: 6,
      level: 3,
      category: 'Queues',
      question: 'What is the time complexity of enqueue operation in a queue?',
      options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
      correct: 2,
      explanation: 'Enqueue adds an element to the rear, which is O(1) with proper implementation.',
      points: 20
    },
    // Level 4 - Trees
    {
      id: 7,
      level: 4,
      category: 'Binary Trees',
      question: 'In a complete binary tree with n nodes, what is the height?',
      options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
      correct: 1,
      explanation: 'A complete binary tree has height O(log n) as each level doubles the nodes.',
      points: 25
    },
    {
      id: 8,
      level: 4,
      category: 'BST',
      question: 'What is the average time complexity for search in a balanced BST?',
      options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
      correct: 1,
      explanation: 'Balanced BST search is O(log n) by eliminating half the tree each step.',
      points: 25
    },
    // Level 5 - Graphs
    {
      id: 9,
      level: 5,
      category: 'Graphs',
      question: 'Which algorithm is used to find the shortest path in an unweighted graph?',
      options: ['DFS', 'BFS', 'Dijkstra', 'Prim'],
      correct: 1,
      explanation: 'BFS finds shortest path in unweighted graphs by exploring level by level.',
      points: 30
    },
    {
      id: 10,
      level: 5,
      category: 'Graphs',
      question: 'What is the time complexity of DFS traversal?',
      options: ['O(V)', 'O(E)', 'O(V + E)', 'O(V * E)'],
      correct: 2,
      explanation: 'DFS visits all vertices (V) and edges (E), resulting in O(V + E).',
      points: 30
    },
    // Level 6 - Sorting
    {
      id: 11,
      level: 6,
      category: 'Sorting',
      question: 'Which sorting algorithm has the best average time complexity?',
      options: ['Bubble Sort', 'Quick Sort', 'Selection Sort', 'Insertion Sort'],
      correct: 1,
      explanation: 'Quick Sort has O(n log n) average time, better than O(n²) algorithms.',
      points: 35
    },
    {
      id: 12,
      level: 6,
      category: 'Sorting',
      question: 'Which sorting algorithm is stable?',
      options: ['Quick Sort', 'Heap Sort', 'Merge Sort', 'Selection Sort'],
      correct: 2,
      explanation: 'Merge Sort maintains relative order of equal elements (stable).',
      points: 35
    }
  ];

  // Timer effect
  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0 && !gameOver) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, gameOver]);

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dsaGameHighScore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setCurrentLevel(1);
    setStreak(0);
    setTimeLeft(60);
    loadChallenge(1);
  };

  const loadChallenge = (level) => {
    const levelChallenges = challenges.filter(c => c.level === level);
    if (levelChallenges.length > 0) {
      const randomChallenge = levelChallenges[Math.floor(Math.random() * levelChallenges.length)];
      setCurrentChallenge(randomChallenge);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleAnswer = (answerIndex) => {
    if (showResult || !isPlaying) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);

    const isCorrect = answerIndex === currentChallenge.correct;
    
    if (isCorrect) {
      const bonusPoints = streak >= 3 ? 5 : 0;
      const timeBonus = timeLeft > 45 ? 10 : timeLeft > 30 ? 5 : 0;
      const totalPoints = currentChallenge.points + bonusPoints + timeBonus;
      
      setScore(prev => prev + totalPoints);
      setStreak(prev => prev + 1);
      setTimeLeft(prev => Math.min(prev + 10, 60)); // Bonus time
      
      setTimeout(() => {
        if (score + totalPoints >= currentLevel * 50) {
          levelUp();
        } else {
          loadChallenge(currentLevel);
        }
      }, 2000);
    } else {
      setLives(prev => prev - 1);
      setStreak(0);
      
      setTimeout(() => {
        if (lives - 1 <= 0) {
          endGame();
        } else {
          loadChallenge(currentLevel);
        }
      }, 2000);
    }
  };

  const levelUp = () => {
    if (currentLevel < 6) {
      setCurrentLevel(prev => prev + 1);
      setTimeLeft(60);
      loadChallenge(currentLevel + 1);
    } else {
      endGame(true);
    }
  };

  const handleTimeout = () => {
    setLives(prev => prev - 1);
    setStreak(0);
    if (lives - 1 <= 0) {
      endGame();
    } else {
      setTimeLeft(60);
      loadChallenge(currentLevel);
    }
  };

  const endGame = (won = false) => {
    setIsPlaying(false);
    setGameOver(true);
    
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('dsaGameHighScore', score.toString());
    }
  };

  const resetGame = () => {
    setIsPlaying(false);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setCurrentLevel(1);
    setStreak(0);
    setTimeLeft(60);
    setCurrentChallenge(null);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-800/50 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"
          style={{ width: `${scrollProgress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <div className="max-w-5xl mx-auto p-6 relative z-10">
        {/* Game Header with Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Trophy className="w-14 h-14 text-yellow-400" />
            </motion.div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              DSA Master
            </h1>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-10 h-10 text-pink-400" />
            </motion.div>
          </div>
          <p className="text-blue-200 text-xl mb-6">Test your Data Structures & Algorithms knowledge!</p>
          
          {/* Game Navigation */}
          <div className="flex flex-wrap justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetGame}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-sm text-white rounded-xl transition-all border border-slate-700 shadow-lg"
            >
              <RotateCcw className="w-5 h-5" />
              <span className="font-semibold">Reset Game</span>
            </motion.button>
            
            {!isPlaying && !gameOver && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all font-bold shadow-2xl shadow-green-500/50"
              >
                <Play className="w-5 h-5" />
                <span>Start New Game</span>
              </motion.button>
            )}
            
            {gameOver && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all font-bold shadow-2xl shadow-green-500/50"
              >
                <Play className="w-5 h-5" />
                <span>Play Again</span>
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Game Stats Bar */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-slate-700/50 shadow-2xl"
            >
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3 bg-blue-500/10 rounded-xl p-3 border border-blue-500/20"
                >
                  <Target className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="text-xs text-blue-300">Level</p>
                    <p className="text-2xl font-bold text-white">{currentLevel}</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3 bg-yellow-500/10 rounded-xl p-3 border border-yellow-500/20"
                >
                  <Star className="w-6 h-6 text-yellow-400" />
                  <div>
                    <p className="text-xs text-yellow-300">Score</p>
                    <p className="text-2xl font-bold text-white">{score}</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3 bg-red-500/10 rounded-xl p-3 border border-red-500/20"
                >
                  <Heart className="w-6 h-6 text-red-400" />
                  <div>
                    <p className="text-xs text-red-300">Lives</p>
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Heart 
                            className={`w-5 h-5 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} 
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className={`flex items-center gap-3 rounded-xl p-3 border ${
                    timeLeft < 10 
                      ? 'bg-red-500/20 border-red-500/30' 
                      : 'bg-green-500/10 border-green-500/20'
                  }`}
                >
                  <Clock className={`w-6 h-6 ${timeLeft < 10 ? 'text-red-400' : 'text-green-400'}`} />
                  <div>
                    <p className={`text-xs ${timeLeft < 10 ? 'text-red-300' : 'text-green-300'}`}>Time</p>
                    <p className={`text-2xl font-bold ${timeLeft < 10 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                      {timeLeft}s
                    </p>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3 bg-orange-500/10 rounded-xl p-3 border border-orange-500/20"
                >
                  <Flame className="w-6 h-6 text-orange-400" />
                  <div>
                    <p className="text-xs text-orange-300">Streak</p>
                    <p className="text-2xl font-bold text-white">{streak} 🔥</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Game Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl"
        >
          {!isPlaying && !gameOver && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Trophy className="w-28 h-28 text-yellow-400 mx-auto mb-6 drop-shadow-2xl" />
              </motion.div>
              <h2 className="text-4xl font-bold text-white mb-4">Ready to Master DSA?</h2>
              <p className="text-blue-200 text-lg mb-8 max-w-md mx-auto">
                Answer questions correctly to level up! Earn bonus points for speed and streaks.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
                {[
                  { icon: Target, color: 'blue', title: '6 Levels', desc: 'Progress through topics' },
                  { icon: Zap, color: 'green', title: 'Streak Bonus', desc: '3+ correct = +5 points' },
                  { icon: TrendingUp, color: 'purple', title: 'High Score', desc: `${highScore} points` }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={`bg-${item.color}-500/20 rounded-xl p-6 border border-${item.color}-400/30 backdrop-blur-sm`}
                  >
                    <item.icon className={`w-10 h-10 text-${item.color}-400 mx-auto mb-3`} />
                    <p className="text-white font-bold text-lg">{item.title}</p>
                    <p className={`text-sm text-${item.color}-200 mt-1`}>{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-2xl shadow-green-500/50 flex items-center gap-3 mx-auto"
              >
                <Play className="w-7 h-7" />
                Start Game
              </motion.button>
            </motion.div>
          )}

          {isPlaying && currentChallenge && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Category Badge */}
              <div className="flex items-center justify-between">
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-200 px-6 py-3 rounded-full text-sm font-bold border-2 border-purple-400/50 backdrop-blur-sm shadow-lg"
                >
                  📚 {currentChallenge.category}
                </motion.span>
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  className="text-blue-200 text-sm font-semibold bg-blue-500/20 px-4 py-2 rounded-full border border-blue-400/30"
                >
                  ⭐ {currentChallenge.points} points {streak >= 3 && '+ 🔥 5 bonus!'}
                </motion.span>
              </div>

              {/* Question */}
              <motion.div 
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-2xl p-8 border-2 border-slate-600/50 shadow-2xl backdrop-blur-sm"
              >
                <h3 className="text-2xl font-bold text-white leading-relaxed">
                  {currentChallenge.question}
                </h3>
              </motion.div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-4">
                {currentChallenge.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === currentChallenge.correct;
                  const showCorrect = showResult && isCorrect;
                  const showWrong = showResult && isSelected && !isCorrect;

                  return (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: showResult ? 1 : 1.02, x: showResult ? 0 : 5 }}
                      whileTap={{ scale: showResult ? 1 : 0.98 }}
                      onClick={() => handleAnswer(index)}
                      disabled={showResult}
                      className={`
                        p-5 rounded-2xl text-left font-semibold transition-all transform border-2
                        ${!showResult && 'bg-gradient-to-r from-slate-700/50 to-slate-800/50 hover:from-slate-600/50 hover:to-slate-700/50 text-white border-slate-600/50 hover:border-blue-400/50 shadow-lg hover:shadow-blue-500/20'}
                        ${showCorrect && 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-100 border-green-400 shadow-2xl shadow-green-500/50'}
                        ${showWrong && 'bg-gradient-to-r from-red-500/30 to-pink-500/30 text-red-100 border-red-400 shadow-2xl shadow-red-500/50'}
                        ${showResult && !isSelected && !isCorrect && 'bg-slate-800/30 text-gray-500 border-slate-700/30'}
                        disabled:cursor-not-allowed
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className={`
                            w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                            ${!showResult && 'bg-slate-600/50 text-slate-300'}
                            ${showCorrect && 'bg-green-500 text-white'}
                            ${showWrong && 'bg-red-500 text-white'}
                            ${showResult && !isSelected && !isCorrect && 'bg-slate-700/50 text-slate-500'}
                          `}>
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="text-lg">{option}</span>
                        </div>
                        {showCorrect && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500 }}
                          >
                            <CheckCircle className="w-8 h-8 text-green-400" />
                          </motion.div>
                        )}
                        {showWrong && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500 }}
                          >
                            <XCircle className="w-8 h-8 text-red-400" />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    className={`
                      p-6 rounded-2xl border-2 backdrop-blur-sm shadow-2xl
                      ${selectedAnswer === currentChallenge.correct 
                        ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/50' 
                        : 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-400/50'}
                    `}
                  >
                    <div className="flex items-start gap-4">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <Lightbulb className={`w-8 h-8 flex-shrink-0 ${
                          selectedAnswer === currentChallenge.correct ? 'text-green-400' : 'text-red-400'
                        }`} />
                      </motion.div>
                      <div>
                        <p className={`font-bold text-xl mb-2 ${
                          selectedAnswer === currentChallenge.correct ? 'text-green-100' : 'text-red-100'
                        }`}>
                          {selectedAnswer === currentChallenge.correct ? '🎉 Correct! Well done!' : '❌ Incorrect - Keep learning!'}
                        </p>
                        <p className="text-white/90 text-base leading-relaxed">{currentChallenge.explanation}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {gameOver && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, -10, 10, 0],
                  scale: [1, 1.1, 1.1, 1.1, 1.1, 1]
                }}
                transition={{ duration: 1 }}
              >
                <Award className="w-32 h-32 text-yellow-400 mx-auto mb-6 drop-shadow-2xl" />
              </motion.div>
              <h2 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent mb-6">
                Game Over!
              </h2>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-2xl p-8 mb-8 max-w-md mx-auto border-2 border-slate-600/50 shadow-2xl backdrop-blur-sm"
              >
                <div className="space-y-6">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex justify-between items-center p-4 bg-yellow-500/10 rounded-xl border border-yellow-400/30"
                  >
                    <span className="text-blue-200 text-lg font-semibold">Final Score:</span>
                    <span className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">{score}</span>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex justify-between items-center p-4 bg-purple-500/10 rounded-xl border border-purple-400/30"
                  >
                    <span className="text-blue-200 text-lg font-semibold">Level Reached:</span>
                    <span className="text-3xl font-bold text-purple-400">{currentLevel}</span>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex justify-between items-center p-4 bg-orange-500/10 rounded-xl border border-orange-400/30"
                  >
                    <span className="text-blue-200 text-lg font-semibold">Best Streak:</span>
                    <span className="text-3xl font-bold text-orange-400">{streak} 🔥</span>
                  </motion.div>
                  {score > highScore && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400/50 rounded-xl p-4 mt-4"
                    >
                      <p className="text-yellow-300 font-bold text-xl flex items-center justify-center gap-3">
                        <Trophy className="w-7 h-7" />
                        🎉 New High Score! 🎉
                      </p>
                    </motion.div>
                  )}
                  {score === highScore && highScore > 0 && (
                    <div className="text-blue-200 text-sm bg-blue-500/10 rounded-lg p-3 border border-blue-400/30">
                      Previous High Score: {highScore}
                    </div>
                  )}
                </div>
              </motion.div>

              <div className="flex gap-4 justify-center flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startGame}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-2xl shadow-green-500/50 flex items-center gap-3"
                >
                  <Play className="w-6 h-6" />
                  Play Again
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetGame}
                  className="bg-slate-700/50 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-600/50 transition-all border-2 border-slate-600 flex items-center gap-3 backdrop-blur-sm"
                >
                  <RotateCcw className="w-6 h-6" />
                  Main Menu
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Progress to Next Level */}
        <AnimatePresence>
          {isPlaying && !gameOver && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-6 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-blue-200 font-semibold">Progress to Level {currentLevel + 1}</span>
                <span className="text-white font-bold text-lg">{score} / {currentLevel * 50}</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-4 overflow-hidden border border-slate-600">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((score / (currentLevel * 50)) * 100, 100)}%` }}
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-full transition-all duration-500 rounded-full"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all group"
          >
            <ArrowUp className="w-6 h-6 text-white group-hover:animate-bounce" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DSAGame;
