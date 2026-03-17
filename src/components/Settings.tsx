import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Moon, Sun, Globe, Volume2, Bell, Shield, Info, ChevronRight, Check } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';

export const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  
  const [voiceLanguage, setVoiceLanguage] = useState<'bn' | 'en'>(() => {
    return (localStorage.getItem('voiceLanguage') as 'bn' | 'en') || language;
  });
  
  const [prayerAlerts, setPrayerAlerts] = useState<boolean>(() => {
    return localStorage.getItem('prayerAlerts') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('voiceLanguage', voiceLanguage);
  }, [voiceLanguage]);

  useEffect(() => {
    localStorage.setItem('prayerAlerts', String(prayerAlerts));
  }, [prayerAlerts]);

  const settingsGroups = [
    {
      title: t('appearance'),
      items: [
        {
          icon: <Globe size={20} />,
          label: t('language'),
          action: (
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'bn')}
              className="bg-transparent font-bold text-primary focus:outline-none cursor-pointer"
            >
              <option value="bn" className="bg-dark-card">বাংলা</option>
              <option value="en" className="bg-dark-card">English</option>
            </select>
          )
        }
      ]
    },
    {
      title: t('audioAndVoice'),
      items: [
        {
          icon: <Volume2 size={20} />,
          label: t('voiceLanguage'),
          action: (
            <div className="flex gap-2 bg-secondary/5 dark:bg-white/5 p-1 rounded-xl">
              <button 
                onClick={() => setVoiceLanguage('bn')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${voiceLanguage === 'bn' ? 'bg-primary text-white shadow-md' : 'text-secondary/60 dark:text-white/60 hover:text-primary'}`}
              >
                {t('bangla')}
              </button>
              <button 
                onClick={() => setVoiceLanguage('en')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${voiceLanguage === 'en' ? 'bg-primary text-white shadow-md' : 'text-secondary/60 dark:text-white/60 hover:text-primary'}`}
              >
                {t('english')}
              </button>
            </div>
          )
        }
      ]
    },
    {
      title: t('notifications'),
      items: [
        {
          icon: <Bell size={20} />,
          label: t('prayerAlerts'),
          action: (
            <button 
              onClick={() => setPrayerAlerts(!prayerAlerts)}
              className={`w-14 h-8 rounded-full transition-colors relative ${prayerAlerts ? 'bg-primary' : 'bg-secondary/20 dark:bg-white/20'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform ${prayerAlerts ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          )
        }
      ]
    }
  ];

  return (
    <section className="py-20 bg-islamic-bg dark:bg-dark-bg min-h-screen">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-secondary dark:text-white mb-4">{t('settings')}</h2>
          <p className="text-secondary/60 dark:text-white/60">{t('settingsDesc')}</p>
        </div>

        <div className="space-y-8">
          {settingsGroups.map((group, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-8 rounded-[32px]"
            >
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-6">{group.title}</h3>
              <div className="space-y-6">
                {group.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                        {item.icon}
                      </div>
                      <span className="font-bold text-secondary dark:text-white">{item.label}</span>
                    </div>
                    {item.action}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass p-8 rounded-[32px] flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <Info size={20} />
              </div>
              <div>
                <h4 className="font-bold text-secondary dark:text-white">{t('aboutApp')}</h4>
                <p className="text-xs text-secondary/50 dark:text-white/50">{t('appVersion')}</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-secondary/20 group-hover:text-primary transition-colors" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
