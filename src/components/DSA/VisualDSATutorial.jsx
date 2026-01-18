import { useState } from 'react';
import { Play, Pause, RotateCcw, BookOpen, Home, ChevronLeft, ChevronRight } from 'lucide-react';

const VisualDSATutorial = () => {
  const [currentTopic, setCurrentTopic] = useState('arrays');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const tutorials = {
    arrays: {
      title: "📦 Arrays - Visual Guide",
      color: "from-blue-500 to-cyan-500",
      steps: [
        {
          title: "What is an Array?",
          visual: "array-intro",
          text: "An array is like a row of boxes. Each box holds one item and has a number (index).",
          code: "int[] arr = {10, 20, 30, 40, 50};",
          animation: "fade-in"
        },
        {
          title: "Accessing Elements",
          visual: "array-access",
          text: "Use the index to get items. Index starts at 0!",
          code: "arr[0] = 10  // First element\narr[2] = 30  // Third element",
          animation: "highlight"
        },
        {
          title: "Adding Elements",
          visual: "array-insert",
          text: "To add an element, we may need to shift others to make space.",
          code: "// Insert 25 at index 2\n// Shift elements right\n// Then place 25",
          animation: "slide"
        },
        {
          title: "Removing Elements",
          visual: "array-delete",
          text: "After removing, shift elements left to fill the gap.",
          code: "// Remove element at index 2\n// Shift remaining left",
          animation: "slide"
        }
      ]
    },
    linkedlist: {
      title: "🔗 Linked Lists - Visual Guide",
      color: "from-green-500 to-emerald-500",
      steps: [
        {
          title: "What is a Linked List?",
          visual: "linkedlist-intro",
          text: "Like train cars connected by links. Each car points to the next one.",
          code: "class Node {\n  int data;\n  Node next;\n}",
          animation: "fade-in"
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      {/* Tutorial content here */}
    </div>
  );
};

export default VisualDSATutorial;
