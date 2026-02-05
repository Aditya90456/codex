import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import { 
  Flame, 
  Trophy, 
  Target, 
  Zap, 
  Star, 
  Crown, 
  Medal, 
  Award,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  Gift,
  Sparkles,
  Heart,
  Brain,
  Rocket,
  Diamond,
  Shield,
  Sword,
  Magic,
  Timer,
  BarChart3,
  Users,
  Lightning,
  Fire
} from 'lucide-react';

const LeetCodeAddictionSystem = ({ 
  onProblemSolved, 
  currentStreak, 
  totalProblems, 
  todayProblems,
  weeklyGoal = 7,
  isVisible = true 
}) => {
  const { user } = useUser();
  const [showCelebration, setShowCelebration] = useState(f