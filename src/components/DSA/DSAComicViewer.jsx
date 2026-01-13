import { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCcw, 
  BookOpen,
  ArrowRight,
  Home,
  Menu,
  X,
  ChevronUp,
  ChevronDown,
  Navigation
} from 'lucide-react';

const DSAComicViewer = ({ onBack }) => {
  const [currentTopic, setCurrentTopic] = useState('arrays');
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [showSidebar, setShowSidebar] = useState(false);
  const [completedPages, setCompletedPages] = useState(new Set());

  // Full screen scrolling functions
  const scrollPageUp = () => {
    const currentScroll = window.pageYOffset;
    const viewportHeight = window.innerHeight;
    const scrollAmount = viewportHeight * 0.9;
    window.scrollTo({ 
      top: Math.max(0, currentScroll - scrollAmount), 
      behavior: 'smooth' 
    });
  };

  const scrollPageDown = () => {
    const currentScroll = window.pageYOffset;
    const viewportHeight = window.innerHeight;
    const scrollAmount = viewportHeight * 0.9;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ 
      top: Math.min(maxScroll, currentScroll + scrollAmount), 
      behavior: 'smooth' 
    });
  };

  // Page navigation
  const goToNextPage = () => {
    const maxPages = currentTopicData.pages.length - 1;
    if (currentPage < maxPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Full screen scrolling
      if (e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
        e.preventDefault();
        scrollPageDown();
      } else if (e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
        e.preventDefault();
        scrollPageUp();
      } 
      // Page navigation
      else if (e.key === 'ArrowRight' && e.ctrlKey) {
        e.preventDefault();
        goToNextPage();
      } else if (e.key === 'ArrowLeft' && e.ctrlKey) {
        e.preventDefault();
        goToPrevPage();
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
  }, [currentPage]);

  // DSA Topics with comic-style content
  const dsaTopics = {
    arrays: {
      title: "🏠 Arrays: The Neighborhood",
      description: "Meet the Array family - houses in a row!",
      color: "from-blue-500 to-cyan-500",
      pages: [
        {
          title: "Welcome to Array Street! 🏘️",
          content: "Once upon a time, in the land of Data Structures, there was a special street called Array Street...",
          diagram: "arrayIntro",
          narration: "Arrays are like houses on a street - each house has an address (index) and stores one family (element)!"
        },
        {
          title: "The Index Adventure 🗝️",
          content: "Each house has a special number - starting from 0! Let's visit house number 2...",
          diagram: "arrayIndexing",
          narration: "Array indexing starts at 0, just like counting floors in some buildings!"
        },
        {
          title: "Adding New Neighbors 👥",
          content: "When new families move in, we need to make space. Sometimes we need a bigger street!",
          diagram: "arrayInsertion",
          narration: "Inserting elements can be tricky - we might need to move everyone down!"
        },
        {
          title: "The Great Moving Day 📦",
          content: "When someone moves out, everyone shifts up to fill the gap!",
          diagram: "arrayDeletion",
          narration: "Deletion requires shifting elements to maintain the neighborhood order."
        }
      ]
    },
    linkedlists: {
      title: "🚂 Linked Lists: The Train Journey",
      description: "All aboard the Linked List Express!",
      color: "from-green-500 to-emerald-500",
      pages: [
        {
          title: "The Magical Train 🚂",
          content: "In a world where trains don't need tracks, each car knows where the next car is...",
          diagram: "linkedListIntro",
          narration: "Linked Lists are like train cars connected by magical links!"
        },
        {
          title: "The Conductor's Journey 🎫",
          content: "To reach car number 5, the conductor must walk through cars 1, 2, 3, and 4...",
          diagram: "linkedListTraversal",
          narration: "Unlike arrays, we can't jump directly to any car - we must follow the links!"
        },
        {
          title: "Adding New Cars 🚃",
          content: "Adding a new car is easy - just connect the links!",
          diagram: "linkedListInsertion",
          narration: "Insertion is simple: break one link, add the new car, connect two links!"
        },
        {
          title: "Removing Cars 🔧",
          content: "To remove a car, we simply reconnect the links around it!",
          diagram: "linkedListDeletion",
          narration: "Deletion is elegant - just bypass the unwanted car!"
        }
      ]
    },
    stacks: {
      title: "🥞 Stacks: The Pancake Tower",
      description: "The Last In, First Out pancake adventure!",
      color: "from-yellow-500 to-orange-500",
      pages: [
        {
          title: "The Pancake Chef 👨‍🍳",
          content: "Chef Stack only serves pancakes from the top of the pile...",
          diagram: "stackIntro",
          narration: "Stacks follow LIFO - Last In, First Out, just like a stack of pancakes!"
        },
        {
          title: "Stacking Pancakes 🥞",
          content: "Each new pancake goes on top - that's a PUSH operation!",
          diagram: "stackPush",
          narration: "Push adds elements to the top of the stack!"
        },
        {
          title: "Serving Pancakes 🍽️",
          content: "We can only take the top pancake - that's a POP operation!",
          diagram: "stackPop",
          narration: "Pop removes and returns the top element!"
        },
        {
          title: "The Undo Magic ↩️",
          content: "Stacks power the 'Undo' button in your favorite apps!",
          diagram: "stackUndo",
          narration: "Real-world example: Every action you do gets pushed onto a stack!"
        }
      ]
    },
    queues: {
      title: "🎢 Queues: The Fair Ride Line",
      description: "First come, first served at the amusement park!",
      color: "from-purple-500 to-pink-500",
      pages: [
        {
          title: "The Fair Queue 🎡",
          content: "At the magical fair, everyone waits in line for the roller coaster...",
          diagram: "queueIntro",
          narration: "Queues follow FIFO - First In, First Out, like a fair line!"
        },
        {
          title: "Joining the Line 🚶‍♂️",
          content: "New visitors join at the back - that's ENQUEUE!",
          diagram: "queueEnqueue",
          narration: "Enqueue adds people to the rear of the queue!"
        },
        {
          title: "Riding the Ride 🎢",
          content: "The person at the front gets to ride first - that's DEQUEUE!",
          diagram: "queueDequeue",
          narration: "Dequeue removes people from the front of the queue!"
        },
        {
          title: "The Printer Queue 🖨️",
          content: "Your computer uses queues to manage print jobs!",
          diagram: "queuePrinter",
          narration: "Real-world example: Print jobs are processed in order!"
        }
      ]
    },
    trees: {
      title: "🌳 Trees: The Family Tree",
      description: "Exploring the branching world of tree structures!",
      color: "from-green-600 to-teal-500",
      pages: [
        {
          title: "The Great Family Tree 👨‍👩‍👧‍👦",
          content: "In the village of Treeland, every family has a special structure...",
          diagram: "treeIntro",
          narration: "Trees have roots, branches, and leaves - just like family trees!"
        },
        {
          title: "The Binary Family 👫",
          content: "In Binary families, each parent has at most 2 children...",
          diagram: "binaryTree",
          narration: "Binary trees are special - each node has at most two children!"
        },
        {
          title: "Visiting Relatives 🚶‍♀️",
          content: "There are different ways to visit all family members...",
          diagram: "treeTraversal",
          narration: "Tree traversal: In-order, Pre-order, and Post-order visits!"
        },
        {
          title: "The Search Adventure 🔍",
          content: "Binary Search Trees help us find family members quickly!",
          diagram: "binarySearchTree",
          narration: "BST property: left children are smaller, right children are larger!"
        }
      ]
    },
    graphs: {
      title: "🗺️ Graphs: The Social Network",
      description: "Connecting friends in the digital world!",
      color: "from-indigo-500 to-purple-500",
      pages: [
        {
          title: "The Social Network 👥",
          content: "In the land of Graphville, everyone is connected to everyone else...",
          diagram: "graphIntro",
          narration: "Graphs represent relationships - like social media connections!"
        },
        {
          title: "Making Friends 🤝",
          content: "Friendships can be one-way (directed) or mutual (undirected)...",
          diagram: "graphTypes",
          narration: "Directed graphs have one-way relationships, undirected are mutual!"
        },
        {
          title: "Finding Paths 🛤️",
          content: "How do we find the shortest path between two friends?",
          diagram: "graphTraversal",
          narration: "BFS finds the shortest path, DFS explores deeply!"
        },
        {
          title: "The GPS Adventure 🗺️",
          content: "Your GPS uses graphs to find the best route!",
          diagram: "graphGPS",
          narration: "Real-world example: Roads are edges, intersections are vertices!"
        }
      ]
    }
  };

  // Animation components for each diagram type
  const AnimatedDiagram = ({ type, isPlaying, speed }) => {
    const [step, setStep] = useState(0);
    
    // Reset step when type changes
    useEffect(() => {
      setStep(0);
    }, [type]);
    
    useEffect(() => {
      if (!isPlaying) return;
      
      const interval = setInterval(() => {
        setStep(prev => (prev + 1) % getMaxSteps(type));
      }, 1000 / speed);
      
      return () => clearInterval(interval);
    }, [isPlaying, speed, type]);

    const getMaxSteps = (diagramType) => {
      const steps = {
        arrayIntro: 4,
        arrayIndexing: 5,
        arrayInsertion: 6,
        arrayDeletion: 5,
        linkedListIntro: 4,
        linkedListTraversal: 6,
        linkedListInsertion: 5,
        linkedListDeletion: 4,
        stackIntro: 4,
        stackPush: 5,
        stackPop: 4,
        stackUndo: 6,
        queueIntro: 4,
        queueEnqueue: 5,
        queueDequeue: 4,
        queuePrinter: 6,
        treeIntro: 4,
        binaryTree: 5,
        treeTraversal: 7,
        binarySearchTree: 6,
        graphIntro: 4,
        graphTypes: 5,
        graphTraversal: 8,
        graphGPS: 6
      };
      return steps[diagramType] || 4;
    };

    // Render different diagram types
    switch (type) {
      case 'arrayIntro':
        return <ArrayIntroAnimation step={step} />;
      case 'arrayIndexing':
        return <ArrayIndexingAnimation step={step} />;
      case 'arrayInsertion':
        return <ArrayInsertionAnimation step={step} />;
      case 'arrayDeletion':
        return <ArrayDeletionAnimation step={step} />;
      case 'linkedListIntro':
        return <LinkedListIntroAnimation step={step} />;
      case 'linkedListTraversal':
        return <LinkedListTraversalAnimation step={step} />;
      case 'stackIntro':
        return <StackIntroAnimation step={step} />;
      case 'stackPush':
        return <StackPushAnimation step={step} />;
      case 'queueIntro':
        return <QueueIntroAnimation step={step} />;
      case 'treeIntro':
        return <TreeIntroAnimation step={step} />;
      case 'graphIntro':
        return <GraphIntroAnimation step={step} />;
      default:
        return <DefaultAnimation step={step} />;
    }
  };

  // Individual animation components
  const ArrayIntroAnimation = ({ step }) => (
    <div className="flex items-center justify-center space-x-2 p-8">
      {[0, 1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className={`w-16 h-16 border-2 border-blue-400 rounded-lg flex items-center justify-center text-white font-bold transition-all duration-500 ${
            step > index ? 'bg-blue-500 scale-110' : 'bg-gray-700'
          }`}
          style={{
            animationDelay: `${index * 0.2}s`
          }}
        >
          {step > index ? index : '?'}
        </div>
      ))}
      <div className="ml-4 text-blue-400">
        <ArrowRight size={24} className={step >= 4 ? 'animate-pulse' : ''} />
      </div>
    </div>
  );

  const ArrayIndexingAnimation = ({ step }) => (
    <div className="p-8">
      <div className="flex items-center justify-center space-x-2 mb-4">
        {[10, 20, 30, 40, 50].map((value, index) => (
          <div key={index} className="text-center">
            <div
              className={`w-16 h-16 border-2 rounded-lg flex items-center justify-center text-white font-bold transition-all duration-500 ${
                step === index + 1 ? 'bg-yellow-500 border-yellow-400 scale-125 animate-bounce' : 
                step > index + 1 ? 'bg-blue-500 border-blue-400' : 'bg-gray-700 border-gray-600'
              }`}
            >
              {value}
            </div>
            <div className={`text-sm mt-2 transition-colors duration-300 ${
              step === index + 1 ? 'text-yellow-400 font-bold' : 'text-gray-400'
            }`}>
              [{index}]
            </div>
          </div>
        ))}
      </div>
      {step > 0 && (
        <div className="text-center text-lg text-white animate-fade-in">
          {step === 1 && "👆 Index 0 contains value 10"}
          {step === 2 && "👆 Index 1 contains value 20"}
          {step === 3 && "👆 Index 2 contains value 30"}
          {step === 4 && "👆 Index 3 contains value 40"}
          {step === 5 && "👆 Index 4 contains value 50"}
        </div>
      )}
    </div>
  );

  const ArrayInsertionAnimation = ({ step }) => {
    const initialArray = [10, 20, 40, 50];
    const newElement = 30;
    const insertIndex = 2;

    return (
      <div className="p-8">
        <div className="text-center mb-4 text-white">
          <h3 className="text-lg font-bold">Inserting {newElement} at index {insertIndex}</h3>
        </div>
        
        <div className="flex items-center justify-center space-x-2 mb-8">
          {step === 0 && initialArray.map((value, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-blue-500 border-2 border-blue-400 rounded-lg flex items-center justify-center text-white font-bold">
                {value}
              </div>
              <div className="text-sm mt-2 text-gray-400">[{index}]</div>
            </div>
          ))}
          
          {step >= 1 && (
            <>
              {[10, 20].map((value, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-500 border-2 border-blue-400 rounded-lg flex items-center justify-center text-white font-bold">
                    {value}
                  </div>
                  <div className="text-sm mt-2 text-gray-400">[{index}]</div>
                </div>
              ))}
              
              {step >= 2 && (
                <div className="text-center">
                  <div className={`w-16 h-16 border-2 rounded-lg flex items-center justify-center text-white font-bold transition-all duration-500 ${
                    step >= 3 ? 'bg-green-500 border-green-400' : 'bg-yellow-500 border-yellow-400 animate-pulse'
                  }`}>
                    {newElement}
                  </div>
                  <div className="text-sm mt-2 text-yellow-400">[2]</div>
                </div>
              )}
              
              {step >= 4 && [40, 50].map((value, index) => (
                <div key={index + 3} className="text-center">
                  <div className={`w-16 h-16 bg-blue-500 border-2 border-blue-400 rounded-lg flex items-center justify-center text-white font-bold transition-all duration-500 ${
                    step >= 5 ? 'transform translate-x-0' : 'transform translate-x-4'
                  }`}>
                    {value}
                  </div>
                  <div className="text-sm mt-2 text-gray-400">[{index + 3}]</div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="text-center text-white">
          {step === 0 && "Original array"}
          {step === 1 && "Making space for new element..."}
          {step === 2 && "New element ready to insert!"}
          {step === 3 && "Element inserted!"}
          {step === 4 && "Shifting remaining elements..."}
          {step === 5 && "Insertion complete! 🎉"}
        </div>
      </div>
    );
  };

  const ArrayDeletionAnimation = ({ step }) => (
    <div className="p-8">
      <div className="text-center mb-4 text-white">
        <h3 className="text-lg font-bold">Deleting element at index 2</h3>
      </div>
      
      <div className="flex items-center justify-center space-x-2 mb-8">
        {[10, 20, 30, 40, 50].map((value, index) => (
          <div key={index} className="text-center">
            <div
              className={`w-16 h-16 border-2 rounded-lg flex items-center justify-center text-white font-bold transition-all duration-500 ${
                index === 2 && step >= 1 ? 
                  (step === 1 ? 'bg-red-500 border-red-400 animate-pulse' : 'opacity-0 scale-0') :
                index > 2 && step >= 3 ?
                  'bg-blue-500 border-blue-400 transform -translate-x-18' :
                'bg-blue-500 border-blue-400'
              }`}
            >
              {index === 2 && step >= 2 ? '' : value}
            </div>
            <div className={`text-sm mt-2 transition-colors duration-300 ${
              index === 2 && step >= 1 ? 'text-red-400' : 'text-gray-400'
            }`}>
              [{index > 2 && step >= 4 ? index - 1 : index}]
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-white">
        {step === 0 && "Original array"}
        {step === 1 && "Marking element for deletion..."}
        {step === 2 && "Element removed!"}
        {step === 3 && "Shifting elements left..."}
        {step === 4 && "Deletion complete! Array size reduced."}
      </div>
    </div>
  );

  const LinkedListIntroAnimation = ({ step }) => (
    <div className="p-8">
      <div className="flex items-center justify-center space-x-4">
        {[1, 2, 3, 4].map((value, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-20 h-16 border-2 rounded-lg flex items-center justify-center transition-all duration-500 ${
                step > index ? 'bg-green-500 border-green-400 text-white' : 'bg-gray-700 border-gray-600 text-gray-400'
              }`}
            >
              <div className="text-center">
                <div className="font-bold">{step > index ? value : '?'}</div>
                <div className="text-xs">Node</div>
              </div>
            </div>
            {index < 3 && (
              <ArrowRight 
                size={20} 
                className={`mx-2 transition-colors duration-500 ${
                  step > index + 1 ? 'text-green-400' : 'text-gray-600'
                }`} 
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-center mt-6 text-white">
        {step === 0 && "Each node contains data and a pointer to the next node"}
        {step === 1 && "Node 1 points to Node 2"}
        {step === 2 && "Node 2 points to Node 3"}
        {step === 3 && "Node 3 points to Node 4"}
        {step === 4 && "Node 4 points to NULL (end of list)"}
      </div>
    </div>
  );

  const LinkedListTraversalAnimation = ({ step }) => {
    const nodes = [10, 20, 30, 40];
    
    return (
      <div className="p-8">
        <div className="flex items-center justify-center space-x-4 mb-6">
          {nodes.map((value, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`w-20 h-16 border-2 rounded-lg flex items-center justify-center transition-all duration-500 ${
                  step - 1 === index ? 'bg-yellow-500 border-yellow-400 scale-110' : 'bg-green-500 border-green-400'
                } text-white font-bold`}
              >
                {value}
              </div>
              {index < nodes.length - 1 && (
                <ArrowRight size={20} className="mx-2 text-green-400" />
              )}
            </div>
          ))}
        </div>
        
        {/* Conductor character */}
        <div className="flex justify-center mb-4">
          <div 
            className="text-4xl transition-all duration-500"
            style={{
              transform: `translateX(${(step - 1) * 96}px)`
            }}
          >
            🚶‍♂️
          </div>
        </div>

        <div className="text-center text-white">
          {step === 0 && "Starting traversal from the head node"}
          {step === 1 && "Visiting node 1 (value: 10)"}
          {step === 2 && "Moving to node 2 (value: 20)"}
          {step === 3 && "Moving to node 3 (value: 30)"}
          {step === 4 && "Moving to node 4 (value: 40)"}
          {step === 5 && "Reached the end of the list!"}
        </div>
      </div>
    );
  };

  const StackIntroAnimation = ({ step }) => {
    const pancakes = ['🥞', '🥞', '🥞', '🥞'];
    
    return (
      <div className="p-8 flex flex-col items-center">
        <div className="relative">
          {/* Plate */}
          <div className="w-32 h-4 bg-gray-600 rounded-full mb-2"></div>
          
          {/* Pancakes stack */}
          <div className="flex flex-col-reverse items-center">
            {pancakes.slice(0, step).map((pancake, index) => (
              <div
                key={index}
                className={`text-4xl transition-all duration-500 ${
                  index === step - 1 ? 'animate-bounce' : ''
                }`}
                style={{
                  transform: `translateY(${index * -8}px)`
                }}
              >
                {pancake}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center text-white">
          {step === 0 && "Empty stack - ready for pancakes!"}
          {step === 1 && "First pancake added to the stack"}
          {step === 2 && "Second pancake stacked on top"}
          {step === 3 && "Third pancake - stack is growing!"}
          {step === 4 && "Fourth pancake - LIFO principle in action!"}
        </div>
      </div>
    );
  };

  const StackPushAnimation = ({ step }) => (
    <div className="p-8 flex flex-col items-center">
      <div className="relative mb-8">
        {/* New pancake coming in */}
        {step >= 1 && (
          <div 
            className="text-4xl absolute transition-all duration-1000"
            style={{
              transform: `translate(${step === 1 ? '100px' : '0px'}, ${step === 1 ? '-50px' : step >= 2 ? '-40px' : '0px'})`,
              opacity: step >= 1 ? 1 : 0
            }}
          >
            🆕🥞
          </div>
        )}
        
        {/* Existing stack */}
        <div className="flex flex-col-reverse items-center">
          <div className="w-32 h-4 bg-gray-600 rounded-full mb-2"></div>
          {['🥞', '🥞', '🥞'].map((pancake, index) => (
            <div
              key={index}
              className="text-4xl"
              style={{
                transform: `translateY(${index * -8 + (step >= 3 ? -8 : 0)}px)`
              }}
            >
              {pancake}
            </div>
          ))}
        </div>
      </div>

      <div className="text-center text-white">
        {step === 0 && "Current stack with 3 pancakes"}
        {step === 1 && "New pancake approaching the stack!"}
        {step === 2 && "Pancake positioned above the stack"}
        {step === 3 && "PUSH complete! New pancake is now on top"}
        {step === 4 && "Stack size increased by 1"}
      </div>
    </div>
  );

  const QueueIntroAnimation = ({ step }) => {
    const people = ['👨', '👩', '🧒', '👴'];
    
    return (
      <div className="p-8">
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className="text-2xl">🎢</div>
          <ArrowLeft size={24} className="text-blue-400" />
          
          {people.slice(0, step).map((person, index) => (
            <div
              key={index}
              className={`text-3xl transition-all duration-500 ${
                index === step - 1 ? 'animate-bounce' : ''
              }`}
            >
              {person}
            </div>
          ))}
          
          <div className="text-sm text-gray-400 ml-4">
            ← FRONT | REAR →
          </div>
        </div>

        <div className="text-center text-white">
          {step === 0 && "Empty queue - no one in line yet!"}
          {step === 1 && "First person joins the queue"}
          {step === 2 && "Second person joins at the rear"}
          {step === 3 && "Third person joins the line"}
          {step === 4 && "Fourth person - queue is getting longer!"}
        </div>
      </div>
    );
  };

  const TreeIntroAnimation = ({ step }) => (
    <div className="p-8 flex flex-col items-center">
      <div className="relative">
        {/* Root */}
        {step >= 1 && (
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold animate-pulse">
              A
            </div>
          </div>
        )}
        
        {/* Level 1 */}
        {step >= 2 && (
          <div className="flex justify-center space-x-16 mb-8">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
              B
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
              C
            </div>
          </div>
        )}
        
        {/* Level 2 */}
        {step >= 3 && (
          <div className="flex justify-center space-x-8">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
              D
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
              E
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
              F
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
              G
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-white">
        {step === 0 && "Let's build a family tree!"}
        {step === 1 && "A is the root - the family patriarch"}
        {step === 2 && "B and C are A's children"}
        {step === 3 && "D, E, F, G are the grandchildren"}
        {step === 4 && "Complete binary tree family! 👨‍👩‍👧‍👦"}
      </div>
    </div>
  );

  const GraphIntroAnimation = ({ step }) => {
    const nodes = [
      { id: 'A', x: 100, y: 50 },
      { id: 'B', x: 50, y: 150 },
      { id: 'C', x: 150, y: 150 },
      { id: 'D', x: 200, y: 50 }
    ];

    const edges = [
      { from: 'A', to: 'B', step: 1 },
      { from: 'A', to: 'C', step: 2 },
      { from: 'B', to: 'C', step: 3 },
      { from: 'C', to: 'D', step: 4 }
    ];

    return (
      <div className="p-8 flex flex-col items-center">
        <div className="relative w-64 h-48 mb-8">
          <svg className="absolute inset-0 w-full h-full">
            {edges.map((edge, index) => {
              const fromNode = nodes.find(n => n.id === edge.from);
              const toNode = nodes.find(n => n.id === edge.to);
              
              return step >= edge.step && (
                <line
                  key={index}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="#60A5FA"
                  strokeWidth="2"
                  className="animate-pulse"
                />
              );
            })}
          </svg>
          
          {nodes.map((node, index) => (
            <div
              key={node.id}
              className={`absolute w-12 h-12 rounded-full flex items-center justify-center text-white font-bold transition-all duration-500 ${
                step > index ? 'bg-blue-500 animate-bounce' : 'bg-gray-600'
              }`}
              style={{
                left: node.x - 24,
                top: node.y - 24
              }}
            >
              {node.id}
            </div>
          ))}
        </div>

        <div className="text-center text-white">
          {step === 0 && "Welcome to the social network!"}
          {step === 1 && "A and B become friends"}
          {step === 2 && "A and C connect"}
          {step === 3 && "B and C are mutual friends"}
          {step === 4 && "C introduces D to the network"}
        </div>
      </div>
    );
  };

  const DefaultAnimation = ({ step }) => (
    <div className="p-8 flex items-center justify-center">
      <div className="text-6xl animate-bounce">
        {['🤔', '💡', '🚀', '✨'][step % 4]}
      </div>
    </div>
  );

  // Navigation functions
  const nextPage = () => {
    const topic = dsaTopics[currentTopic];
    console.log('Next page clicked:', { 
      currentPage, 
      totalPages: topic.pages.length,
      currentTitle: topic.pages[currentPage]?.title,
      nextTitle: topic.pages[currentPage + 1]?.title
    });
    
    if (currentPage < topic.pages.length - 1) {
      // Mark current page as completed before moving to next
      setCompletedPages(prev => new Set([...prev, `${currentTopic}-${currentPage}`]));
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      console.log('Moving to page:', newPage, 'New title:', topic.pages[newPage]?.title);
    } else {
      console.log('Already at last page');
    }
  };

  const prevPage = () => {
    const topic = dsaTopics[currentTopic];
    console.log('Previous page clicked:', { 
      currentPage,
      currentTitle: topic.pages[currentPage]?.title,
      prevTitle: topic.pages[currentPage - 1]?.title
    });
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      console.log('Moving to page:', newPage, 'New title:', topic.pages[newPage]?.title);
    } else {
      console.log('Already at first page');
    }
  };

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    // Reset animation step
  };

  const currentTopicData = dsaTopics[currentTopic];
  const currentPageData = currentTopicData.pages[currentPage];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden flex flex-col scroll-smooth">
      {/* DSA Comic Scrolling Navigation */}
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

          {/* Previous page */}
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 0}
            className={`p-2 rounded-lg transition-all duration-200 ${
              currentPage === 0 
                ? 'text-gray-600 cursor-not-allowed' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
            title="Previous page (Ctrl+←)"
          >
            <Navigation size={16} className="rotate-180" />
          </button>

          {/* Page indicators */}
          <div className="flex flex-col space-y-2 max-h-64 overflow-y-auto">
            {currentTopicData.pages.map((page, index) => {
              const isActive = currentPage === index;
              const isCompleted = completedPages.has(index);
              
              return (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`group relative p-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' 
                      : isCompleted
                      ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                  title={page.title}
                >
                  <div className="flex items-center justify-center">
                    <span className="text-xs font-medium">
                      {index + 1}
                    </span>
                  </div>

                  {/* Tooltip */}
                  <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 
                    bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 
                    transition-opacity duration-200 pointer-events-none z-50 shadow-lg border border-gray-700 max-w-48">
                    <div className="font-medium">{page.title}</div>
                    <div className="text-gray-400 text-xs mt-1 truncate">{page.narration}</div>
                    
                    {/* Arrow */}
                    <div className="absolute top-1/2 transform -translate-y-1/2 -right-1 w-2 h-2 bg-gray-900 border-gray-700 rotate-45 border-l border-t"></div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Next page */}
          <button
            onClick={goToNextPage}
            disabled={currentPage === currentTopicData.pages.length - 1}
            className={`p-2 rounded-lg transition-all duration-200 ${
              currentPage === currentTopicData.pages.length - 1
                ? 'text-gray-600 cursor-not-allowed' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
            title="Next page (Ctrl+→)"
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
            <div className="text-xs font-medium text-purple-400">
              {completedPages.size}/{currentTopicData.pages.length}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${(completedPages.size / currentTopicData.pages.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Page info and shortcuts */}
        <div className="mt-2 text-center">
          <div className="text-xs text-gray-500 mb-1">
            Page {currentPage + 1} / {currentTopicData.pages.length}
          </div>
          <div className="text-xs text-gray-600">
            Space/PgDn: Page scroll
          </div>
        </div>
      </div>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-gray-900/95 backdrop-blur-xl border-r border-gray-700/50 transform transition-transform duration-300 z-50 ${
        showSidebar ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">DSA Comic Topics</h2>
            <button
              onClick={() => setShowSidebar(false)}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/50"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-3">
            {Object.entries(dsaTopics).map(([key, topic]) => (
              <button
                key={key}
                onClick={() => {
                  setCurrentTopic(key);
                  setCurrentPage(0);
                  setShowSidebar(false);
                }}
                className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                  currentTopic === key 
                    ? `bg-gradient-to-r ${topic.color} shadow-lg` 
                    : 'bg-gray-800/50 hover:bg-gray-700/50'
                }`}
              >
                <div className="font-semibold text-white">{topic.title}</div>
                <div className="text-sm text-gray-300 mt-1">{topic.description}</div>
                <div className="flex items-center mt-2 space-x-2">
                  <div className="text-xs text-gray-400">
                    {topic.pages.filter((_, index) => completedPages.has(`${key}-${index}`)).length}/{topic.pages.length} completed
                  </div>
                  <div className="flex space-x-1">
                    {topic.pages.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          completedPages.has(`${key}-${index}`) ? 'bg-green-400' : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50 bg-black/20 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onBack && onBack()}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/50 transition-colors"
            >
              <Home size={20} />
            </button>
            <button
              onClick={() => setShowSidebar(true)}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/50 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                DSA Comic Book
              </h1>
              <p className="text-gray-400 text-sm">Learn Data Structures like reading comics!</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Animation controls */}
            <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg p-2">
              <button
                onClick={toggleAnimation}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700/50 transition-colors"
                title={isAnimating ? 'Pause Animation' : 'Play Animation'}
              >
                {isAnimating ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button
                onClick={resetAnimation}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700/50 transition-colors"
                title="Reset Animation"
              >
                <RotateCcw size={16} />
              </button>
              <select
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600"
              >
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
            </div>
          </div>
        </div>

        {/* Comic page */}
        <div className="max-w-6xl mx-auto p-6 flex-1">
          {/* Topic header */}
          <div className="text-center mb-8">
            <div className={`inline-block px-6 py-3 rounded-2xl bg-gradient-to-r ${currentTopicData.color} shadow-lg mb-4`}>
              <h2 className="text-2xl font-bold text-white">{currentTopicData.title}</h2>
            </div>
            <p className="text-gray-300 text-lg">{currentTopicData.description}</p>
            
            {/* Debug info */}
            <div className="mt-4 text-xs text-gray-500 bg-gray-800/30 rounded-lg p-2 inline-block">
              Debug: Topic={currentTopic}, Page={currentPage}, Title="{currentPageData.title}"
            </div>
          </div>

          {/* Comic panel */}
          <div key={`comic-${currentTopic}-${currentPage}`} className="bg-white/5 backdrop-blur-sm rounded-3xl border border-gray-700/50 overflow-hidden shadow-2xl">
            {/* Panel header - Fixed height */}
            <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 p-6 border-b border-gray-700/50 h-32 flex items-center">
              <div className="flex items-center justify-between w-full">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                    {currentPageData.title}
                  </h3>
                  <p className="text-gray-300 text-sm line-clamp-2">
                    {currentPageData.content}
                  </p>
                </div>
                <div className="text-right ml-6 flex-shrink-0">
                  <div className="text-sm text-gray-400">Page {currentPage + 1} of {currentTopicData.pages.length}</div>
                  <div className="flex space-x-1 mt-2">
                    {currentTopicData.pages.map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full ${
                          index === currentPage ? 'bg-blue-400' : 
                          index < currentPage ? 'bg-green-400' : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Animation panel - Fixed height */}
            <div className="h-96 flex items-center justify-center bg-gradient-to-br from-gray-800/30 to-gray-900/30 relative overflow-hidden">
              <div key={`animation-${currentTopic}-${currentPage}`} className="transition-all duration-300 ease-in-out">
                <AnimatedDiagram 
                  key={`diagram-${currentTopic}-${currentPage}-${currentPageData.diagram}`}
                  type={currentPageData.diagram} 
                  isPlaying={isAnimating} 
                  speed={animationSpeed}
                />
              </div>
            </div>

            {/* Narration panel - Fixed height */}
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-6 border-t border-gray-700/50 h-24 flex items-center">
              <div className="flex items-center space-x-3 w-full">
                <BookOpen className="text-blue-400 flex-shrink-0" size={20} />
                <p key={`narration-${currentTopic}-${currentPage}`} className="text-gray-200 italic text-sm line-clamp-2 flex-1">
                  {currentPageData.narration}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation - Fixed height */}
          <div className="flex items-center justify-between mt-8 h-16">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                prevPage();
              }}
              disabled={currentPage === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                currentPage === 0 
                  ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              <ChevronLeft size={20} />
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-4">
              <div className="text-gray-400 text-sm whitespace-nowrap">
                Page {currentPage + 1} of {currentTopicData.pages.length}
              </div>
              <div className="flex space-x-2">
                {currentTopicData.pages.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Page button clicked:', index);
                      setCurrentPage(index);
                    }}
                    className={`w-8 h-8 rounded-full font-semibold text-sm transition-all duration-200 transform hover:scale-110 active:scale-95 ${
                      index === currentPage 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : index < currentPage 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Next button clicked - Current page:', currentPage, 'Total pages:', currentTopicData.pages.length);
                nextPage();
              }}
              disabled={currentPage === currentTopicData.pages.length - 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                currentPage === currentTopicData.pages.length - 1
                  ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              <span>Next</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for sidebar */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Custom styles for layout stability */}
      <style jsx>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default DSAComicViewer;