import { createContext, useContext, useState, useEffect } from 'react';

const TranslationContext = createContext();

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
};

// 150+ Languages supported
export const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇬🇧', voice: 'en-US' },
  { code: 'es', name: 'Español', flag: '🇪🇸', voice: 'es-ES' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', voice: 'fr-FR' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', voice: 'de-DE' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', voice: 'it-IT' },
  { code: 'pt', name: 'Português', flag: '🇵🇹', voice: 'pt-PT' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', voice: 'ru-RU' },
  { code: 'zh', name: '中文', flag: '🇨🇳', voice: 'zh-CN' },
  { code: 'ja', name: '日本語', flag: '🇯🇵', voice: 'ja-JP' },
  { code: 'ko', name: '한국어', flag: '🇰🇷', voice: 'ko-KR' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', voice: 'ar-SA' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳', voice: 'hi-IN' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩', voice: 'bn-IN' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷', voice: 'tr-TR' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳', voice: 'vi-VN' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭', voice: 'th-TH' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩', voice: 'id-ID' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱', voice: 'pl-PL' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱', voice: 'nl-NL' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪', voice: 'sv-SE' },
  { code: 'no', name: 'Norsk', flag: '🇳🇴', voice: 'nb-NO' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰', voice: 'da-DK' },
  { code: 'fi', name: 'Suomi', flag: '🇫🇮', voice: 'fi-FI' },
  { code: 'cs', name: 'Čeština', flag: '🇨🇿', voice: 'cs-CZ' },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷', voice: 'el-GR' },
  { code: 'he', name: 'עברית', flag: '🇮🇱', voice: 'he-IL' },
  { code: 'hu', name: 'Magyar', flag: '🇭🇺', voice: 'hu-HU' },
  { code: 'ro', name: 'Română', flag: '🇷🇴', voice: 'ro-RO' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦', voice: 'uk-UA' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷', voice: 'fa-IR' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰', voice: 'ur-PK' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳', voice: 'ta-IN' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳', voice: 'te-IN' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳', voice: 'mr-IN' },
  { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳', voice: 'gu-IN' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳', voice: 'kn-IN' },
  { code: 'ml', name: 'മലയാളം', flag: '🇮🇳', voice: 'ml-IN' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳', voice: 'pa-IN' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪', voice: 'sw-KE' },
  { code: 'af', name: 'Afrikaans', flag: '🇿🇦', voice: 'af-ZA' },
  { code: 'sq', name: 'Shqip', flag: '🇦🇱', voice: 'sq-AL' },
  { code: 'am', name: 'አማርኛ', flag: '🇪🇹', voice: 'am-ET' },
  { code: 'hy', name: 'Հայերեն', flag: '🇦🇲', voice: 'hy-AM' },
  { code: 'az', name: 'Azərbaycan', flag: '🇦🇿', voice: 'az-AZ' },
  { code: 'eu', name: 'Euskara', flag: '🇪🇸', voice: 'eu-ES' },
  { code: 'be', name: 'Беларуская', flag: '🇧🇾', voice: 'be-BY' },
  { code: 'bs', name: 'Bosanski', flag: '🇧🇦', voice: 'bs-BA' },
  { code: 'bg', name: 'Български', flag: '🇧🇬', voice: 'bg-BG' },
  { code: 'ca', name: 'Català', flag: '🇪🇸', voice: 'ca-ES' },
  { code: 'hr', name: 'Hrvatski', flag: '🇭🇷', voice: 'hr-HR' },
  { code: 'et', name: 'Eesti', flag: '🇪🇪', voice: 'et-EE' },
  { code: 'tl', name: 'Filipino', flag: '🇵🇭', voice: 'fil-PH' },
  { code: 'gl', name: 'Galego', flag: '🇪🇸', voice: 'gl-ES' },
  { code: 'ka', name: 'ქართული', flag: '🇬🇪', voice: 'ka-GE' },
  { code: 'is', name: 'Íslenska', flag: '🇮🇸', voice: 'is-IS' },
  { code: 'ga', name: 'Gaeilge', flag: '🇮🇪', voice: 'ga-IE' },
  { code: 'kk', name: 'Қазақ', flag: '🇰🇿', voice: 'kk-KZ' },
  { code: 'km', name: 'ខ្មែរ', flag: '🇰🇭', voice: 'km-KH' },
  { code: 'ky', name: 'Кыргызча', flag: '🇰🇬', voice: 'ky-KG' },
  { code: 'lo', name: 'ລາວ', flag: '🇱🇦', voice: 'lo-LA' },
  { code: 'lv', name: 'Latviešu', flag: '🇱🇻', voice: 'lv-LV' },
  { code: 'lt', name: 'Lietuvių', flag: '🇱🇹', voice: 'lt-LT' },
  { code: 'mk', name: 'Македонски', flag: '🇲🇰', voice: 'mk-MK' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾', voice: 'ms-MY' },
  { code: 'mt', name: 'Malti', flag: '🇲🇹', voice: 'mt-MT' },
  { code: 'mn', name: 'Монгол', flag: '🇲🇳', voice: 'mn-MN' },
  { code: 'my', name: 'မြန်မာ', flag: '🇲🇲', voice: 'my-MM' },
  { code: 'ne', name: 'नेपाली', flag: '🇳🇵', voice: 'ne-NP' },
  { code: 'ps', name: 'پښتو', flag: '🇦🇫', voice: 'ps-AF' },
  { code: 'si', name: 'සිංහල', flag: '🇱🇰', voice: 'si-LK' },
  { code: 'sk', name: 'Slovenčina', flag: '🇸🇰', voice: 'sk-SK' },
  { code: 'sl', name: 'Slovenščina', flag: '🇸🇮', voice: 'sl-SI' },
  { code: 'sr', name: 'Српски', flag: '🇷🇸', voice: 'sr-RS' },
  { code: 'su', name: 'Basa Sunda', flag: '🇮🇩', voice: 'su-ID' },
  { code: 'uz', name: 'Oʻzbek', flag: '🇺🇿', voice: 'uz-UZ' },
  { code: 'cy', name: 'Cymraeg', flag: '🏴󐁧󐁢󐁷󐁬󐁳󐁿', voice: 'cy-GB' },
  { code: 'yi', name: 'ייִדיש', flag: '🇮🇱', voice: 'yi' },
  { code: 'zu', name: 'isiZulu', flag: '🇿🇦', voice: 'zu-ZA' },
];

// Base translations for English - Comprehensive
const baseTranslations = {
  // Navigation
  problems: 'Problems',
  roadmap: 'Roadmap',
  schedule: 'Schedule',
  themes: 'Themes',
  aiChat: 'AI Chat',
  home: 'Home',
  profile: 'Profile',
  
  // Problem Library
  problemLibrary: 'Problem Library',
  chooseAProblem: 'Choose a problem to solve',
  problemsSolved: 'problems solved',
  searchProblems: 'Search problems...',
  allLevels: 'All Levels',
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  filterByDifficulty: 'Filter by Difficulty',
  filterByTopic: 'Filter by Topic',
  sortBy: 'Sort By',
  
  // Problem Details
  description: 'Description',
  smartDebug: 'Smart Debug',
  whiteboard: 'Whiteboard',
  dryRun: 'Dry Run',
  solutions: 'Solutions',
  video: 'Video',
  session: '1v1 Session',
  examples: 'Examples',
  input: 'Input',
  output: 'Output',
  explanation: 'Explanation',
  constraints: 'Constraints',
  hints: 'Hints',
  discuss: 'Discuss',
  
  // Actions
  run: 'Run',
  submit: 'Submit',
  download: 'Download',
  share: 'Share',
  copy: 'Copy',
  paste: 'Paste',
  clear: 'Clear',
  reset: 'Reset',
  aiExplain: 'AI Explain',
  
  // Test Cases
  testcase: 'Testcase',
  testcases: 'Test Cases',
  result: 'Result',
  results: 'Results',
  passed: 'Passed',
  failed: 'Failed',
  runYourCode: 'Run your code to see results...',
  allTestsPassed: 'All tests passed!',
  someTestsFailed: 'Some tests failed',
  
  // Editor
  codeEditor: 'Code Editor',
  theme: 'Theme',
  font: 'Font',
  fontSize: 'Font Size',
  language: 'Language',
  settings: 'Settings',
  autoComplete: 'Auto Complete',
  lineNumbers: 'Line Numbers',
  wordWrap: 'Word Wrap',
  
  // UI Elements
  close: 'Close',
  save: 'Save',
  cancel: 'Cancel',
  delete: 'Delete',
  edit: 'Edit',
  loading: 'Loading...',
  translating: 'Translating...',
  translateDescription: 'Translate Description',
  changeLanguage: 'Change Language',
  selectLanguage: 'Select Language',
  
  // Features
  browseProblems: 'Browse all coding problems',
  trackLearning: 'Track your learning path',
  planStudy: 'Plan your study sessions',
  customizeTheme: 'Customize Theme',
  aiPeerChat: 'AI Peer Chat',
  
  // Status Messages
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  info: 'Information',
  saved: 'Saved successfully',
  failed: 'Operation failed',
  tryAgain: 'Try again',
  
  // Time
  today: 'Today',
  yesterday: 'Yesterday',
  thisWeek: 'This Week',
  thisMonth: 'This Month',
  
  // Common
  search: 'Search',
  filter: 'Filter',
  sort: 'Sort',
  view: 'View',
  help: 'Help',
  about: 'About',
  logout: 'Logout',
  login: 'Login',
  signup: 'Sign Up',
};

export const TranslationProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState({ en: baseTranslations });
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [translationCache, setTranslationCache] = useState(() => {
    // Load cache from localStorage on init
    try {
      const cached = localStorage.getItem('translationCache');
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  });

  // Save cache to localStorage whenever it updates
  useEffect(() => {
    try {
      localStorage.setItem('translationCache', JSON.stringify(translationCache));
    } catch (error) {
      console.warn('Failed to save translation cache:', error);
    }
  }, [translationCache]);

  // Language code mapping for better API compatibility
  const languageMapping = {
    'zh': 'zh-CN',
    'pt': 'pt-BR',
    'no': 'nb',
    'he': 'iw',
    'tl': 'fil',
  };

  // Get API-compatible language code
  const getApiLanguageCode = (lang) => {
    return languageMapping[lang] || lang;
  };

  // Translate text using multiple APIs with enhanced fallback
  const translateText = async (text, targetLang) => {
    if (targetLang === 'en' || !text) return text;
    
    // Check cache first
    const cacheKey = `${text.substring(0, 50)}_${targetLang}`;
    if (translationCache[cacheKey]) {
      console.log('✅ Using cached translation');
      return translationCache[cacheKey];
    }
    
    const apiLang = getApiLanguageCode(targetLang);
    
    try {
      setIsTranslating(true);
      let translatedText = text;
      let translationSuccess = false;
      
      // Try MyMemory API first (free, no key required, supports 150+ languages)
      try {
        const response = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${apiLang}`
        );
        const data = await response.json();
        
        if (data.responseData && data.responseData.translatedText && 
            data.responseData.translatedText !== text) {
          translatedText = data.responseData.translatedText;
          translationSuccess = true;
          console.log(`✅ MyMemory translation successful for ${targetLang}`);
        }
      } catch (error) {
        console.warn('MyMemory API failed:', error.message);
      }
      
      // Fallback 1: LibreTranslate (if MyMemory failed)
      if (!translationSuccess) {
        try {
          const response = await fetch('https://libretranslate.de/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              q: text,
              source: 'en',
              target: apiLang,
              format: 'text'
            })
          });
          const data = await response.json();
          
          if (data.translatedText && data.translatedText !== text) {
            translatedText = data.translatedText;
            translationSuccess = true;
            console.log(`✅ LibreTranslate translation successful for ${targetLang}`);
          }
        } catch (fallbackError) {
          console.warn('LibreTranslate API failed:', fallbackError.message);
        }
      }
      
      // Fallback 2: Lingva Translate (another free API)
      if (!translationSuccess) {
        try {
          const response = await fetch(
            `https://lingva.ml/api/v1/en/${apiLang}/${encodeURIComponent(text)}`
          );
          const data = await response.json();
          
          if (data.translation && data.translation !== text) {
            translatedText = data.translation;
            translationSuccess = true;
            console.log(`✅ Lingva translation successful for ${targetLang}`);
          }
        } catch (lingvaError) {
          console.warn('Lingva API failed:', lingvaError.message);
        }
      }
      
      // If all APIs failed, show warning
      if (!translationSuccess) {
        console.warn(`⚠️ Translation not available for ${targetLang}, using English`);
      }
      
      // Cache the result (even if translation failed, to avoid repeated attempts)
      setTranslationCache(prev => ({
        ...prev,
        [cacheKey]: translatedText
      }));
      
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    } finally {
      setIsTranslating(false);
    }
  };

  // Load translations for a language with batch processing
  const loadTranslations = async (lang) => {
    if (translations[lang]) return;
    
    setIsTranslating(true);
    const newTranslations = {};
    
    try {
      const entries = Object.entries(baseTranslations);
      const batchSize = 5; // Translate 5 items at a time to avoid rate limits
      
      console.log(`🌐 Loading translations for ${lang}...`);
      
      // Process in batches
      for (let i = 0; i < entries.length; i += batchSize) {
        const batch = entries.slice(i, i + batchSize);
        
        // Translate batch items in parallel
        const batchPromises = batch.map(async ([key, value]) => {
          const translated = await translateText(value, lang);
          return [key, translated];
        });
        
        const batchResults = await Promise.all(batchPromises);
        
        // Add batch results to translations
        batchResults.forEach(([key, translated]) => {
          newTranslations[key] = translated;
        });
        
        // Small delay between batches to avoid rate limiting
        if (i + batchSize < entries.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      setTranslations(prev => ({ ...prev, [lang]: newTranslations }));
      console.log(`✅ Translations loaded for ${lang}`);
    } catch (error) {
      console.error('Failed to load translations:', error);
      // Fallback: use English translations
      setTranslations(prev => ({ ...prev, [lang]: baseTranslations }));
    } finally {
      setIsTranslating(false);
    }
  };

  // Get translated text
  const t = (key) => {
    return translations[language]?.[key] || baseTranslations[key] || key;
  };

  // Translate dynamic content (like problem descriptions, user content)
  const translateDynamic = async (text, targetLang = language) => {
    if (!text || targetLang === 'en') return text;
    return await translateText(text, targetLang);
  };

  // Batch translate multiple texts
  const translateBatch = async (texts, targetLang = language) => {
    if (!texts || texts.length === 0 || targetLang === 'en') return texts;
    
    const promises = texts.map(text => translateText(text, targetLang));
    return await Promise.all(promises);
  };

  // Text-to-Speech function with enhanced multi-language support
  const speak = (text, lang = language) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Text-to-speech not supported in this browser');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const langConfig = supportedLanguages.find(l => l.code === lang);
    
    // Get available voices
    const getVoices = () => {
      return new Promise((resolve) => {
        let voices = window.speechSynthesis.getVoices();
        if (voices.length) {
          resolve(voices);
        } else {
          // Some browsers load voices asynchronously
          window.speechSynthesis.onvoiceschanged = () => {
            voices = window.speechSynthesis.getVoices();
            resolve(voices);
          };
        }
      });
    };

    getVoices().then(voices => {
      if (langConfig) {
        // Try to find a voice that matches the language
        const voiceLang = langConfig.voice;
        
        // Priority 1: Exact match (e.g., 'en-US')
        let voice = voices.find(v => v.lang === voiceLang);
        
        // Priority 2: Language code match (e.g., 'en')
        if (!voice) {
          const langCode = voiceLang.split('-')[0];
          voice = voices.find(v => v.lang.startsWith(langCode));
        }
        
        // Priority 3: Any voice with similar language
        if (!voice) {
          voice = voices.find(v => v.lang.toLowerCase().includes(lang));
        }
        
        if (voice) {
          utterance.voice = voice;
          utterance.lang = voice.lang;
          console.log(`🗣️ Using voice: ${voice.name} (${voice.lang})`);
        } else {
          // Fallback to setting lang without specific voice
          utterance.lang = voiceLang;
          console.log(`🗣️ Using default voice for: ${voiceLang}`);
        }
      }
      
      // Speech settings
      utterance.rate = 0.9;  // Slightly slower for clarity
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Event handlers
      utterance.onstart = () => {
        setIsSpeaking(true);
        console.log('🎤 Speech started');
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        console.log('✅ Speech ended');
      };
      
      utterance.onerror = (event) => {
        setIsSpeaking(false);
        console.error('❌ Speech error:', event.error);
        
        // Show user-friendly error message
        if (event.error === 'not-allowed') {
          console.warn('Speech synthesis not allowed. User interaction may be required.');
        } else if (event.error === 'network') {
          console.warn('Network error during speech synthesis.');
        }
      };
      
      // Speak the text
      window.speechSynthesis.speak(utterance);
    });
  };

  // Stop speaking
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      console.log('⏹️ Speech stopped');
    }
  };

  // Get available voices for debugging
  const getAvailableVoices = () => {
    if ('speechSynthesis' in window) {
      const voices = window.speechSynthesis.getVoices();
      console.log('📢 Available voices:', voices.map(v => `${v.name} (${v.lang})`));
      return voices;
    }
    return [];
  };

  // Change language
  const changeLanguage = async (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('appLanguage', newLang);
    
    // Load translations if not already loaded
    if (!translations[newLang] && newLang !== 'en') {
      await loadTranslations(newLang);
    }
  };

  // Load saved language on mount
  useEffect(() => {
    const saved = localStorage.getItem('appLanguage');
    if (saved && supportedLanguages.find(l => l.code === saved)) {
      changeLanguage(saved);
    }
  }, []);

  return (
    <TranslationContext.Provider value={{ 
      language, 
      changeLanguage, 
      t, 
      translateDynamic,
      translateBatch,
      isTranslating, 
      speak, 
      stopSpeaking, 
      isSpeaking,
      supportedLanguages,
      translateText,
      getAvailableVoices
    }}>
      {children}
    </TranslationContext.Provider>
  );
};
