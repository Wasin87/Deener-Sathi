import React, { createContext, useState, useEffect, useContext } from 'react';
import { translations } from '../utils/translations';

type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
  n: (num: string | number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const bnDigits: { [key: string]: string } = {
  '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'en' || saved === 'bn') ? saved : 'bn';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: keyof typeof translations.en) => {
    return translations[language][key] || key;
  };

  const n = (num: string | number) => {
    const str = num.toString();
    if (language === 'en') return str;
    return str.replace(/\d/g, d => bnDigits[d] || d);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, n }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
};
