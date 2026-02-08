import { useState } from 'react';
import { Brain, Lightbulb, Target, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

const ThinkingProcessGuide = ({ problemTitle, problemDescription, onStepComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userInputs, setUserInputs] = useState({});
  const [showHint, setShowHint] = useState(false);
  const [isGeneratingHint, setIsGeneratingHint] = useState(false);

  const thinkingSteps = [
    {
      id: 'understand',
      title: '1. Understand the Problem',
      icon: Brain,
      color: 'blue',
      questions: [
        'What is the input?',
        'What is th