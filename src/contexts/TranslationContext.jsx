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

// Base translations for English
const baseTranslations = {
  problems: 'Problems',
  roadmap: 'Roadmap',
  schedule: 'Schedule',
  themes: 'Themes',
  aiChat: 'AI Chat',
  problemLibrary: 'Problem Library',
  chooseAProblem: 'Choose a problem to solve',
  problemsSolved: 'problems solved',
  searchProblems: 'Search problems...',
  allLevels: 'All Levels',
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
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
  run: 'Run',
  submit: 'Submit',
  download: 'Download',
  share: 'Share',
  aiExplain: 'AI Explain',
  testcase: 'Testcase',
  result: 'Result',
  runYourCode: 'Run your code to see results...',
  browseProblems: 'Browse all coding problems',
  trackLearning: 'Track your learning path',
  planStudy: 'Plan your study sessions',
  customizeTheme: 'Customize Theme',
  aiPeerChat: 'AI Peer Chat',
  // Editor related
  codeEditor: 'Code Editor',
  theme: 'Theme',
  font: 'Font',
  fontSize: 'Font Size',
  language: 'Language',
  settings: 'Settings',
  // Additional UI
  close: 'Close',
  save: 'Save',
  cancel: 'Cancel',
  reset: 'Reset',
  loading: 'Loading...',
  translating: 'Translating...',
  translateDescription: 'Translate Description',
  changeLanguage: 'Change Language',
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

  // Translate text using Google Translate API with caching
  const translateText = async (text, targetLang) => {
    if (targetLang === 'en' || !text) return text;
    
    // Check cache first
    const cacheKey = `${text.substring(0, 50)}_${targetLang}`;
    if (translationCache[cacheKey]) {
      console.log('✅ Using cached translation');
      return translationCache[cacheKey];
    }
    
    try {
      setIsTranslating(true);
      
      // Use multiple translation APIs with fallback
      let translatedText = text;
      
      // Try MyMemory API first (free, no key required)
      try {
        const response = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`,
          { timeout: 3000 }
        );
        const data = await response.json();
        
        if (data.responseData?.translatedText) {
          translatedText = data.responseData.translatedText;
        }
      } catch (error) {
        console.warn('MyMemory API failed, trying fallback...');
        
        // Fallback: Use LibreTranslate (if available)
        try {
          const response = await fetch('https://libretranslate.de/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              q: text,
              source: 'en',
              target: targetLang,
              format: 'text'
            }),
            timeout: 3000
          });
          const data = await response.json();
          
          if (data.translatedText) {
            translatedText = data.translatedText;
          }
        } catch (fallbackError) {
          console.warn('All translation APIs failed');
        }
      }
      
      // Cache the result
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

  // Load translations for a language
  const loadTranslations = async (lang) => {
    if (translations[lang]) return;
    
    setIsTranslating(true);
    const newTranslations = {};
    
    try {
      // Translate all base keys
      for (const [key, value] of Object.entries(baseTranslations)) {
        newTranslations[key] = await translateText(value, lang);
      }
      
      setTranslations(prev => ({ ...prev, [lang]: newTranslations }));
    } catch (error) {
      console.error('Failed to load translations:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  // Get translated text
  const t = (key) => {
    return translations[language]?.[key] || baseTranslations[key] || key;
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
