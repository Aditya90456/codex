import { useState, useEffect } from 'react';
import { 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Clock, 
  Award,
  Play,
  RotateCcw,
  ChevronRight,
  CheckCircle,
  XCircle,
  Lightbulb,
  TrendingUp,
  Heart
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Game Header with Navigation */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-12 h-12 text-yellow-400" />
            <h1 className="text-5xl font-bold text-white">DSA Master</h1>
          </div>
          <p className="text-blue-200 text-lg">Test your Data Structures & Algorithms knowledge!</p>
          
          {/* Game Navigation */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all border border-white/20"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Game</span>
            </button>
            
            {!isPlaying && !gameOver && (
              <button
                onClick={startGame}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all font-semibold"
              >
                <Play className="w-4 h-4" />
                <span>Start New Game</span>
              </button>
            )}
            
            {gameOver && (
              <button
                onClick={startGame}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all font-semibold"
              >
                <Play className="w-4 h-4" />
                <span>Play Again</span>
              </button>
            )}
          </div>
        </div>

        {/* Game Stats Bar */}
        {isPlaying && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-xs text-blue-200">Level</p>
                  <p className="text-xl font-bold text-white">{currentLevel}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-xs text-blue-200">Score</p>
                  <p className="text-xl font-bold text-white">{score}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-xs text-blue-200">Lives</p>
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <Heart 
                        key={i} 
                        className={`w-4 h-4 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-500'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-xs text-blue-200">Time</p>
                  <p className={`text-xl font-bold ${timeLeft < 10 ? 'text-red-400' : 'text-white'}`}>
                    {timeLeft}s
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="text-xs text-blue-200">Streak</p>
                  <p className="text-xl font-bold text-white">{streak}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Game Area */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          {!isPlaying && !gameOver && (
            <div className="text-center py-12">
              <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Master DSA?</h2>
              <p className="text-blue-200 mb-8 max-w-md mx-auto">
                Answer questions correctly to level up! Earn bonus points for speed and streaks.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
                <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-400/30">
                  <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">6 Levels</p>
                  <p className="text-sm text-blue-200">Progress through topics</p>
                </div>
                <div className="bg-green-500/20 rounded-lg p-4 border border-green-400/30">
                  <Zap className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">Streak Bonus</p>
                  <p className="text-sm text-green-200">3+ correct = +5 points</p>
                </div>
                <div className="bg-purple-500/20 rounded-lg p-4 border border-purple-400/30">
                  <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">High Score</p>
                  <p className="text-sm text-purple-200">{highScore} points</p>
                </div>
              </div>

              <button
                onClick={startGame}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto"
              >
                <Play className="w-6 h-6" />
                Start Game
              </button>
            </div>
          )}

          {isPlaying && currentChallenge && (
            <div className="space-y-6">
              {/* Category Badge */}
              <div className="flex items-center justify-between">
                <span className="bg-purple-500/30 text-purple-200 px-4 py-2 rounded-full text-sm font-semibold border border-purple-400/50">
                  {currentChallenge.category}
                </span>
                <span className="text-blue-200 text-sm">
                  {currentChallenge.points} points {streak >= 3 && '+ 5 bonus!'}
                </span>
              </div>

              {/* Question */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-4">
                  {currentChallenge.question}
                </h3>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-3">
                {currentChallenge.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === currentChallenge.correct;
                  const showCorrect = showResult && isCorrect;
                  const showWrong = showResult && isSelected && !isCorrect;

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={showResult}
                      className={`
                        p-4 rounded-xl text-left font-semibold transition-all transform hover:scale-102
                        ${!showResult && 'bg-white/10 hover:bg-white/20 text-white border border-white/20'}
                        ${showCorrect && 'bg-green-500/30 text-green-100 border-2 border-green-400'}
                        ${showWrong && 'bg-red-500/30 text-red-100 border-2 border-red-400'}
                        ${showResult && !isSelected && !isCorrect && 'bg-white/5 text-gray-400 border border-white/10'}
                        disabled:cursor-not-allowed
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {showCorrect && <CheckCircle className="w-6 h-6 text-green-400" />}
                        {showWrong && <XCircle className="w-6 h-6 text-red-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {showResult && (
                <div className={`
                  p-4 rounded-xl border-2 animate-fadeIn
                  ${selectedAnswer === currentChallenge.correct 
                    ? 'bg-green-500/20 border-green-400/50' 
                    : 'bg-red-500/20 border-red-400/50'}
                `}>
                  <div className="flex items-start gap-3">
                    <Lightbulb className={`w-6 h-6 flex-shrink-0 ${
                      selectedAnswer === currentChallenge.correct ? 'text-green-400' : 'text-red-400'
                    }`} />
                    <div>
                      <p className={`font-semibold mb-1 ${
                        selectedAnswer === currentChallenge.correct ? 'text-green-100' : 'text-red-100'
                      }`}>
                        {selectedAnswer === currentChallenge.correct ? 'Correct!' : 'Incorrect'}
                      </p>
                      <p className="text-white/90 text-sm">{currentChallenge.explanation}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {gameOver && (
            <div className="text-center py-12">
              <Award className="w-24 h-24 text-yellow-400 mx-auto mb-6" />
              <h2 className="text-4xl font-bold text-white mb-4">Game Over!</h2>
              
              <div className="bg-white/5 rounded-xl p-6 mb-8 max-w-md mx-auto border border-white/10">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">Final Score:</span>
                    <span className="text-3xl font-bold text-white">{score}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">Level Reached:</span>
                    <span className="text-2xl font-bold text-purple-400">{currentLevel}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">Best Streak:</span>
                    <span className="text-2xl font-bold text-orange-400">{streak}</span>
                  </div>
                  {score > highScore && (
                    <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-3 mt-4">
                      <p className="text-yellow-300 font-bold flex items-center justify-center gap-2">
                        <Trophy className="w-5 h-5" />
                        New High Score!
                      </p>
                    </div>
                  )}
                  {score === highScore && highScore > 0 && (
                    <div className="text-blue-200 text-sm">
                      High Score: {highScore}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Play Again
                </button>
                <button
                  onClick={resetGame}
                  className="bg-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-all border border-white/20 flex items-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Main Menu
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Progress to Next Level */}
        {isPlaying && !gameOver && (
          <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <div className="flex justify-between items-center mb-2">
              <span className="text-blue-200 text-sm">Progress to Level {currentLevel + 1}</span>
              <span className="text-white font-semibold">{score} / {currentLevel * 50}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${Math.min((score / (currentLevel * 50)) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DSAGame;
