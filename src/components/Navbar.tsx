import React, { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X, Home, Clock, BookOpen, Heart, Info, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, setActiveSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: t('home'), icon: Home },
    { id: 'namaz', label: t('namazTime'), icon: Clock },
    { id: 'quran', label: t('quran'), icon: BookOpen },
    { id: 'dua', label: t('dua'), icon: Heart },
    { id: 'info', label: t('islamicInfo'), icon: Info },
    { id: 'settings', label: t('settings'), icon: Settings },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
      <div className="container mx-auto px-4">
        <div className={`bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl flex items-center justify-between px-3 sm:px-6 py-3 ${isScrolled ? 'shadow-2xl shadow-black/50' : ''}`}>
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => setActiveSection('home')}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/40 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0 relative overflow-hidden">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-7 sm:h-7 text-primary drop-shadow-[0_0_8px_rgba(200,169,81,0.8)]">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 11.5 21.9 11 21.8 10.5C20.5 12.5 18.2 13.8 15.5 13.8C11.4 13.8 8 10.4 8 6.2C8 4.5 8.6 2.9 9.5 1.8C4.3 2.8 0.5 7.4 0.5 13C0.5 18.5 5 23 10.5 23C11 23 11.5 22.9 12 22Z" fill="currentColor" />
                <path d="M15 22V16H17V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 16V14C12 12.3431 13.3431 11 15 11H17C18.6569 11 20 12.3431 20 14V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 11V8L16 5L15.5 4L16 3L16.5 4L16 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-sm sm:text-lg font-bold text-white leading-tight tracking-tight">{t('appName')}</h1>
              <p className="text-[9px] sm:text-[10px] text-primary font-medium tracking-[0.2em] uppercase opacity-80">{language === 'bn' ? 'ইসলামিক প্ল্যাটফর্ম' : 'Islamic Platform'}</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1 bg-black/20 p-1 rounded-xl border border-white/5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeSection === item.id 
                    ? 'bg-primary/20 text-primary border border-primary/30' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/10 text-primary text-sm font-bold flex items-center gap-2 hover:bg-primary/20 transition-all"
            >
              <span className="text-xs">🌐</span> {language.toUpperCase()}
            </button>
            <button 
              className="lg:hidden p-2 rounded-lg bg-primary/10 text-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 right-0 p-4"
          >
            <div className="glass rounded-2xl p-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 transition-all ${
                    activeSection === item.id 
                      ? 'bg-primary text-white' 
                      : 'text-secondary/70 dark:text-white/70 hover:bg-primary/5'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

