import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Code, 
  Brain, 
  Lightbulb, 
  Award, 
  Play, 
  FileText, 
  Layers,
  CheckCircle,
  Users,
  Trophy,
  Zap,
  Target,
  BookOpen,
  Video,
  Github,
  Download,
  Share2,
  Sparkles,
  Terminal,
  Globe,
  Shield,
  Cpu,
  ArrowRight,
  ExternalLink,
  Star,
  TrendingUp,
  Clock,
  Flame
} from 'lucide-react';

const InteractiveFeatureShowcase = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [animation