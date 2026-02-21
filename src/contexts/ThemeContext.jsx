import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// Helper function to extract color values from Tailwind classes
const extractColorFromTailwind = (tailwindClass) => {
  // Handle undefined or null input
  if (!tailwindClass || typeof tailwindClass !== 'string') {
    return '#3b82f6';
  }
  
  const colorMap = {
    'blue-600': '#2563eb', 'blue-500': '#3b82f6', 'blue-400': '#60a5fa',
    'purple-600': '#9333ea', 'purple-500': '#a855f7', 'purple-400': '#c084fc',
    'pink-600': '#db2777', 'pink-500': '#ec4899', 'pink-400': '#f472b6',
    'cyan-600': '#0891b2', 'cyan-500': '#06b6d4', 'cyan-400': '#22d3ee',
    'gray-950': '#030712', 'gray-900': '#111827', 'gray-800': '#1f2937',
    'slate-950': '#020617', 'slate-900': '#0f172a', 'slate-800': '#1e293b',
    'orange-950': '#431407', 'orange-900': '#7c2d12', 'orange-500': '#f97316',
    'red-500': '#ef4444', 'green-600': '#16a34a', 'teal-500': '#14b8a6',
    'yellow-500': '#eab308', 'indigo-600': '#4f46e5'
  };
  
  const match = tailwindClass.match(/(blue|purple|pink|cyan|gray|slate|orange|red|green|teal|yellow|indigo)-(\d+)/);
  if (match) {
    const key = `${match[1]}-${match[2]}`;
    return colorMap[key] || '#3b82f6';
  }
  return '#3b82f6';
};

// Function to apply theme CSS variables
const applyThemeVariables = (theme) => {
  if (typeof document === 'undefined' || !theme) return;
  
  const root = document.documentElement;
  
  // Helper to safely split and get color
  const safeGetColor = (colorString, index) => {
    if (!colorString || typeof colorString !== 'string') return '';
    const parts = colorString.split(' ');
    return parts[index] || '';
  };
  
  // Extract colors from gradient classes with safety checks
  const primaryStart = extractColorFromTailwind(safeGetColor(theme.primary, 1));
  const primaryEnd = extractColorFromTailwind(safeGetColor(theme.primary, 2));
  const secondaryStart = extractColorFromTailwind(safeGetColor(theme.secondary, 1));
  const secondaryEnd = extractColorFromTailwind(safeGetColor(theme.secondary, 2));
  const accentStart = extractColorFromTailwind(safeGetColor(theme.accent, 1));
  const accentEnd = extractColorFromTailwind(safeGetColor(theme.accent, 2));
  const backgroundStart = extractColorFromTailwind(safeGetColor(theme.background, 1));
  const backgroundEnd = extractColorFromTailwind(safeGetColor(theme.background, 3));
  const cardStart = extractColorFromTailwind(safeGetColor(theme.card, 1));
  const cardEnd = extractColorFromTailwind(safeGetColor(theme.card, 2));
  
  // Apply CSS variables
  root.style.setProperty('--theme-primary-start', primaryStart);
  root.style.setProperty('--theme-primary-end', primaryEnd);
  root.style.setProperty('--theme-secondary-start', secondaryStart);
  root.style.setProperty('--theme-secondary-end', secondaryEnd);
  root.style.setProperty('--theme-accent-start', accentStart);
  root.style.setProperty('--theme-accent-end', accentEnd);
  root.style.setProperty('--theme-background-start', backgroundStart);
  root.style.setProperty('--theme-background-end', backgroundEnd);
  root.style.setProperty('--theme-card-start', cardStart);
  root.style.setProperty('--theme-card-end', cardEnd);
  
  // Text colors with safety checks
  const textColor = theme.text?.includes('white') ? '#ffffff' : 
                   theme.text?.includes('gray-900') ? '#111827' : '#ffffff';
  const textSecondaryColor = theme.textSecondary?.includes('gray-400') ? '#9ca3af' :
                            theme.textSecondary?.includes('gray-600') ? '#4b5563' : '#9ca3af';
  
  root.style.setProperty('--theme-text', textColor);
  root.style.setProperty('--theme-text-secondary', textSecondaryColor);
  
  // Border color
  const borderColor = extractColorFromTailwind(theme.border?.replace('border-', '') || '');
  root.style.setProperty('--theme-border', borderColor);
};

// Predefined themes
export const themes = {
  default: {
    name: 'Default Dark',
    category: 'Professional',
    primary: 'from-blue-600 to-purple-600',
    secondary: 'from-purple-600 to-pink-600',
    accent: 'from-cyan-500 to-blue-500',
    background: 'from-gray-950 via-gray-900 to-gray-950',
    card: 'from-gray-800 to-gray-900',
    text: 'text-white',
    textSecondary: 'text-gray-400',
    border: 'border-gray-700',
    editorTheme: 'vs-dark',
    pattern: 'none'
  },
  ocean: {
    name: 'Ocean Blue',
    category: 'Nature',
    primary: 'from-blue-500 to-cyan-500',
    secondary: 'from-cyan-500 to-teal-500',
    accent: 'from-blue-400 to-cyan-400',
    background: 'from-slate-950 via-blue-950 to-slate-950',
    card: 'from-slate-800 to-blue-900',
    text: 'text-white',
    textSecondary: 'text-blue-200',
    border: 'border-blue-700',
    editorTheme: 'vs-dark',
    pattern: 'waves'
  },
  sunset: {
    name: 'Sunset Orange',
    category: 'Nature',
    primary: 'from-orange-500 to-red-500',
    secondary: 'from-red-500 to-pink-500',
    accent: 'from-yellow-500 to-orange-500',
    background: 'from-gray-950 via-orange-950 to-gray-950',
    card: 'from-gray-800 to-orange-900',
    text: 'text-white',
    textSecondary: 'text-orange-200',
    border: 'border-orange-700',
    editorTheme: 'vs-dark',
    pattern: 'gradient'
  },
  forest: {
    name: 'Forest Green',
    category: 'Nature',
    primary: 'from-green-500 to-emerald-500',
    secondary: 'from-emerald-500 to-teal-500',
    accent: 'from-lime-500 to-green-500',
    background: 'from-gray-950 via-green-950 to-gray-950',
    card: 'from-gray-800 to-green-900',
    text: 'text-white',
    textSecondary: 'text-green-200',
    border: 'border-green-700',
    editorTheme: 'vs-dark',
    pattern: 'dots'
  },
  purple: {
    name: 'Purple Haze',
    category: 'Creative',
    primary: 'from-purple-500 to-violet-500',
    secondary: 'from-violet-500 to-fuchsia-500',
    accent: 'from-purple-400 to-pink-400',
    background: 'from-gray-950 via-purple-950 to-gray-950',
    card: 'from-gray-800 to-purple-900',
    text: 'text-white',
    textSecondary: 'text-purple-200',
    border: 'border-purple-700',
    editorTheme: 'vs-dark',
    pattern: 'none'
  },
  cyberpunk: {
    name: 'Cyberpunk',
    category: 'Gaming',
    primary: 'from-pink-500 to-cyan-500',
    secondary: 'from-cyan-500 to-purple-500',
    accent: 'from-yellow-400 to-pink-500',
    background: 'from-black via-purple-950 to-black',
    card: 'from-gray-900 to-purple-900',
    text: 'text-white',
    textSecondary: 'text-cyan-300',
    border: 'border-pink-500',
    editorTheme: 'vs-dark',
    pattern: 'grid',
    glow: true
  },
  light: {
    name: 'Light Mode',
    category: 'Professional',
    primary: 'from-blue-600 to-indigo-600',
    secondary: 'from-indigo-600 to-purple-600',
    accent: 'from-cyan-600 to-blue-600',
    background: 'from-gray-50 via-white to-gray-50',
    card: 'from-white to-gray-50',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-gray-300',
    editorTheme: 'vs',
    pattern: 'none'
  },
  dracula: {
    name: 'Dracula',
    category: 'Popular',
    primary: 'from-purple-600 to-pink-600',
    secondary: 'from-pink-600 to-red-600',
    accent: 'from-cyan-500 to-purple-500',
    background: 'from-[#282a36] via-[#1e1f29] to-[#282a36]',
    card: 'from-[#44475a] to-[#282a36]',
    text: 'text-[#f8f8f2]',
    textSecondary: 'text-[#6272a4]',
    border: 'border-[#44475a]',
    editorTheme: 'vs-dark',
    pattern: 'none'
  },
  monokai: {
    name: 'Monokai',
    category: 'Popular',
    primary: 'from-green-500 to-lime-500',
    secondary: 'from-yellow-500 to-orange-500',
    accent: 'from-pink-500 to-purple-500',
    background: 'from-[#272822] via-[#1e1f1c] to-[#272822]',
    card: 'from-[#3e3d32] to-[#272822]',
    text: 'text-[#f8f8f2]',
    textSecondary: 'text-[#75715e]',
    border: 'border-[#3e3d32]',
    editorTheme: 'vs-dark',
    pattern: 'none'
  },
  github: {
    name: 'GitHub Dark',
    category: 'Popular',
    primary: 'from-blue-500 to-blue-600',
    secondary: 'from-gray-600 to-gray-700',
    accent: 'from-green-500 to-green-600',
    background: 'from-[#0d1117] via-[#161b22] to-[#0d1117]',
    card: 'from-[#21262d] to-[#161b22]',
    text: 'text-[#f0f6fc]',
    textSecondary: 'text-[#7d8590]',
    border: 'border-[#30363d]',
    editorTheme: 'vs-dark',
    pattern: 'none'
  },
  vscode: {
    name: 'VS Code Dark',
    category: 'Popular',
    primary: 'from-blue-500 to-blue-600',
    secondary: 'from-purple-500 to-purple-600',
    accent: 'from-orange-500 to-orange-600',
    background: 'from-[#1e1e1e] via-[#252526] to-[#1e1e1e]',
    card: 'from-[#2d2d30] to-[#252526]',
    text: 'text-[#cccccc]',
    textSecondary: 'text-[#969696]',
    border: 'border-[#3e3e42]',
    editorTheme: 'vs-dark',
    pattern: 'none'
  },
  neon: {
    name: 'Neon Nights',
    category: 'Gaming',
    primary: 'from-pink-400 to-purple-500',
    secondary: 'from-purple-500 to-blue-500',
    accent: 'from-cyan-400 to-pink-400',
    background: 'from-black via-gray-900 to-black',
    card: 'from-gray-900 to-black',
    text: 'text-white',
    textSecondary: 'text-pink-300',
    border: 'border-pink-500',
    editorTheme: 'vs-dark',
    pattern: 'grid',
    glow: true,
    animation: 'pulse'
  },
  matrix: {
    name: 'Matrix',
    category: 'Gaming',
    primary: 'from-green-400 to-green-500',
    secondary: 'from-green-500 to-green-600',
    accent: 'from-lime-400 to-green-400',
    background: 'from-black via-green-950 to-black',
    card: 'from-gray-900 to-green-950',
    text: 'text-green-400',
    textSecondary: 'text-green-600',
    border: 'border-green-500',
    editorTheme: 'vs-dark',
    pattern: 'matrix',
    glow: true
  },
  retro: {
    name: 'Retro Wave',
    category: 'Retro',
    primary: 'from-pink-500 to-purple-600',
    secondary: 'from-purple-600 to-blue-600',
    accent: 'from-cyan-400 to-pink-500',
    background: 'from-purple-900 via-pink-900 to-purple-900',
    card: 'from-purple-800 to-pink-800',
    text: 'text-white',
    textSecondary: 'text-pink-200',
    border: 'border-pink-400',
    editorTheme: 'vs-dark',
    pattern: 'retro-grid',
    glow: true
  },
  terminal: {
    name: 'Terminal Green',
    category: 'Retro',
    primary: 'from-green-500 to-green-600',
    secondary: 'from-green-600 to-green-700',
    accent: 'from-lime-400 to-green-500',
    background: 'from-black via-gray-900 to-black',
    card: 'from-gray-900 to-black',
    text: 'text-green-400',
    textSecondary: 'text-green-600',
    border: 'border-green-500',
    editorTheme: 'vs-dark',
    pattern: 'scanlines'
  },
  minimal: {
    name: 'Minimal White',
    category: 'Professional',
    primary: 'from-gray-800 to-gray-900',
    secondary: 'from-gray-700 to-gray-800',
    accent: 'from-blue-500 to-blue-600',
    background: 'from-white via-gray-50 to-white',
    card: 'from-gray-50 to-white',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-gray-200',
    editorTheme: 'vs',
    pattern: 'none'
  },
  nord: {
    name: 'Nord',
    category: 'Popular',
    primary: 'from-blue-400 to-blue-500',
    secondary: 'from-indigo-400 to-indigo-500',
    accent: 'from-cyan-400 to-blue-400',
    background: 'from-[#2e3440] via-[#3b4252] to-[#2e3440]',
    card: 'from-[#434c5e] to-[#3b4252]',
    text: 'text-[#eceff4]',
    textSecondary: 'text-[#d8dee9]',
    border: 'border-[#4c566a]',
    editorTheme: 'vs-dark',
    pattern: 'none'
  },
  solarized: {
    name: 'Solarized Dark',
    category: 'Popular',
    primary: 'from-blue-500 to-cyan-500',
    secondary: 'from-cyan-500 to-green-500',
    accent: 'from-yellow-500 to-orange-500',
    background: 'from-[#002b36] via-[#073642] to-[#002b36]',
    card: 'from-[#073642] to-[#002b36]',
    text: 'text-[#839496]',
    textSecondary: 'text-[#586e75]',
    border: 'border-[#073642]',
    editorTheme: 'vs-dark',
    pattern: 'none'
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('default');
  const [customColors, setCustomColors] = useState([]);
  const [fontSize, setFontSize] = useState('md');
  const [fontFamily, setFontFamily] = useState('Inter');

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('userTheme');
    const savedCustomColors = localStorage.getItem('customColors');
    const savedFontSize = localStorage.getItem('fontSize');
    const savedFontFamily = localStorage.getItem('fontFamily');

    if (savedTheme) setCurrentTheme(savedTheme);
    if (savedCustomColors) setCustomColors(JSON.parse(savedCustomColors));
    if (savedFontSize) setFontSize(savedFontSize);
    if (savedFontFamily) setFontFamily(savedFontFamily);
  }, []);

  // Apply theme variables when theme changes
  useEffect(() => {
    const theme = themes[currentTheme];
    if (theme) {
      applyThemeVariables(theme);
    }
  }, [currentTheme]);

  // Save theme to localStorage and apply variables
  const setTheme = (themeName) => {
    setCurrentTheme(themeName);
    localStorage.setItem('userTheme', themeName);
    const theme = themes[themeName];
    if (theme) {
      applyThemeVariables(theme);
    }
  };

  // Save custom colors
  const setCustomTheme = (colors) => {
    setCustomColors(colors);
    localStorage.setItem('customColors', JSON.stringify(colors));
  };

  // Change font size
  const changeFontSize = (size) => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
    
    // Apply font size to root element
    const root = document.documentElement;
    const sizeMap = {
      sm: '14px',
      md: '16px', 
      lg: '18px',
      xl: '20px'
    };
    root.style.setProperty('--base-font-size', sizeMap[size] || '16px');
  };

  // Change font family
  const changeFontFamily = (family) => {
    setFontFamily(family);
    localStorage.setItem('fontFamily', family);
    
    // Apply font family to root element
    const root = document.documentElement;
    root.style.setProperty('--base-font-family', family);
  };

  const theme = themes[currentTheme] || themes.default;

  const value = {
    // Theme data
    theme,
    themes,
    currentTheme,
    
    // Theme functions
    setTheme,
    applyTheme: applyThemeVariables,
    
    // Custom colors
    customColors,
    setCustomColors: setCustomTheme,
    
    // Typography
    fontSize,
    setFontSize: changeFontSize,
    fontFamily,
    setFontFamily: changeFontFamily,
    
    // Legacy support
    changeTheme: setTheme,
    changeFontSize,
    changeFontFamily
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
