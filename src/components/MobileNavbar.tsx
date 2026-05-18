import React from 'react';
import { motion } from 'motion/react';
import { Home, Clock, BookOpen, Sparkles, Heart, Compass, Settings as SettingsIcon } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useAssistant } from '../contexts/AssistantContext';

interface MobileNavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const MobileNavbar: React.FC<MobileNavbarProps> = ({ activeSection, setActiveSection }) => {
  const { t } = useLanguage();
  const { toggleAssistant } = useAssistant();

  const navItems = [
    { id: 'home', label: t('bottomHome'), icon: Home },
    { id: 'namaz', label: t('bottomPrayerTimes'), icon: Clock },
    { id: 'quran', label: t('bottomQuran'), icon: BookOpen },
    { id: 'assistant', label: t('bottomAssistant'), icon: Sparkles, isCenter: true },
    { id: 'dua', label: t('bottomDua'), icon: Heart },
    { id: 'info', label: t('bottomInfo'), icon: Compass },
    { id: 'settings', label: t('bottomSettings'), icon: SettingsIcon },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] px-1 pb-3">
      <div className="relative bg-white/95 dark:bg-[#1A120A]/95 backdrop-blur-xl border border-primary/20 shadow-[0_-8px_30px_rgba(0,0,0,0.2)] rounded-[35px] h-[78px] flex items-center justify-between px-1 pointer-events-auto">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          
          if (item.isCenter) {
            return (
              <div key={item.id} className="relative -top-8 mx-0.5">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleAssistant}
                  className="w-[64px] h-[64px] bg-primary rounded-[24px] flex items-center justify-center shadow-[0_10px_25px_rgba(218,182,91,0.5)] border-[6px] border-[#FDFCF9] dark:border-[#0D0905] transition-all relative group"
                >
                  <item.icon size={26} className="text-white relative z-10" />
                </motion.button>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-bold text-primary whitespace-nowrap uppercase tracking-tighter">
                  {item.label}
                </span>
              </div>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className="relative flex flex-col items-center justify-center gap-1 w-[46px] transition-all"
            >
              <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-primary/15' : ''}`}>
                <item.icon 
                  size={20} 
                  className={isActive ? 'text-primary' : 'text-secondary/50 dark:text-white/50'} 
                />
              </div>
              <span className={`text-[8px] font-bold transition-all line-clamp-1 text-center px-0.5 ${isActive ? 'text-primary' : 'text-secondary/50 dark:text-white/50'}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="w-1.5 h-1.5 bg-primary rounded-full absolute -bottom-1"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
