import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { Globe, Moon, Sun, Volume2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [voiceLang, setVoiceLang] = useState(() => localStorage.getItem('voiceLang') || 'en');

  const handleVoiceLangChange = (lang: string) => {
    setVoiceLang(lang);
    localStorage.setItem('voiceLang', lang);
  };

  return (
    <section className="py-20 bg-islamic-bg dark:bg-dark-bg min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-secondary dark:text-white mb-8 text-center">{t('settings')}</h2>
          
          <div className="space-y-6">
            {/* Language Setting */}
            <div className="glass p-6 rounded-3xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <Globe size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-secondary dark:text-white">{t('language')}</h3>
                  <p className="text-sm text-secondary/50 dark:text-white/50">{t('bangla')} / {t('english')}</p>
                </div>
              </div>
              <div className="flex bg-secondary/5 dark:bg-white/5 p-1 rounded-xl">
                <button 
                  onClick={() => setLanguage('bn')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${language === 'bn' ? 'bg-primary text-white shadow-md' : 'text-secondary/50 dark:text-white/50'}`}
                >
                  বাংলা
                </button>
                <button 
                  onClick={() => setLanguage('en')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${language === 'en' ? 'bg-primary text-white shadow-md' : 'text-secondary/50 dark:text-white/50'}`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Theme Setting */}
            <div className="glass p-6 rounded-3xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  {theme === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
                </div>
                <div>
                  <h3 className="font-bold text-secondary dark:text-white">{t('theme')}</h3>
                  <p className="text-sm text-secondary/50 dark:text-white/50">{theme === 'dark' ? t('darkMode') : t('lightMode')}</p>
                </div>
              </div>
              <button 
                onClick={toggleTheme}
                className="p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
              >
                {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
              </button>
            </div>

            {/* Voice Language Setting */}
            <div className="glass p-6 rounded-3xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <Volume2 size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-secondary dark:text-white">{t('voiceLanguage')}</h3>
                  <p className="text-sm text-secondary/50 dark:text-white/50">{t('bangla')} / {t('english')} / {t('arabic')}</p>
                </div>
              </div>
              <select 
                value={voiceLang}
                onChange={(e) => handleVoiceLangChange(e.target.value)}
                className="bg-secondary/5 dark:bg-white/5 border-none rounded-xl px-4 py-2 text-sm font-bold text-secondary dark:text-white focus:ring-2 focus:ring-primary"
              >
                <option value="bn">বাংলা</option>
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
