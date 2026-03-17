import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PrayerTimes } from './components/PrayerTimes';
import { QuranSection } from './components/QuranSection';
import { DuaSection } from './components/DuaSection';
import { IslamicInfo } from './components/IslamicInfo';
import { Settings } from './components/Settings';
import { VoiceAssistant } from './components/VoiceAssistant';
import { ExtraFeatures } from './components/ExtraFeatures';
import { GlobalAudioPlayer } from './components/GlobalAudioPlayer';
import { fetchPrayerTimes, fetchPrayerTimesByCity } from './services/prayerService';
import { PrayerData } from './types';
import { useTheme } from './hooks/useTheme';
import { useLanguage } from './hooks/useLanguage';
import { useAudio } from './contexts/AudioContext';
import { motion, AnimatePresence } from 'motion/react';
import { locations } from './utils/locations';

export default function App() {
  const { theme } = useTheme();
  const { language, t } = useLanguage();
  const { stopAudio } = useAudio();
  const [activeSection, setActiveSection] = useState('home');
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.lang = language;
  }, [theme, language]);

  useEffect(() => {
    const getTimes = async () => {
      setLoading(true);
      const data = await fetchPrayerTimesByCity(district, 'Bangladesh');
      if (data) {
        setPrayerData(data);
      }
      setLoading(false);
    };
    getTimes();
  }, [district]);

  // Stop audio and scroll to top on section change
  useEffect(() => {
    stopAudio();
    window.scrollTo(0, 0);
  }, [activeSection]);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-islamic-bg dark:bg-dark-bg transition-colors duration-300">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mb-4"
        />
        <p className="text-primary font-bold tracking-widest uppercase animate-pulse">
          {t('bismillah')}
        </p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${theme === 'dark' ? 'bg-dark-bg text-white' : 'bg-islamic-bg text-secondary'}`}>
      <GlobalAudioPlayer />
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {activeSection === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Hero 
                prayerData={prayerData} 
                division={division} 
                setDivision={setDivision} 
                district={district}
                setDistrict={setDistrict}
                setActiveSection={setActiveSection} 
              />
              <PrayerTimes prayerData={prayerData} />
              <ExtraFeatures prayerData={prayerData} />
              <IslamicInfo />
            </motion.div>
          )}
          
          {activeSection === 'namaz' && (
            <motion.div
              key="namaz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="pt-24"
            >
              <PrayerTimes prayerData={prayerData} />
            </motion.div>
          )}

          {activeSection === 'quran' && (
            <motion.div
              key="quran"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="pt-24"
            >
              <QuranSection />
            </motion.div>
          )}

          {activeSection === 'dua' && (
            <motion.div
              key="dua"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="pt-24"
            >
              <DuaSection />
            </motion.div>
          )}

          {activeSection === 'info' && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="pt-24"
            >
              <IslamicInfo />
            </motion.div>
          )}

          {activeSection === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="pt-24"
            >
              <Settings />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-white text-secondary py-16 border-t border-primary/10 dark:bg-black/40 dark:text-white transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/40 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0 relative overflow-hidden">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-7 sm:h-7 text-primary drop-shadow-[0_0_8px_rgba(200,169,81,0.8)]">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 11.5 21.9 11 21.8 10.5C20.5 12.5 18.2 13.8 15.5 13.8C11.4 13.8 8 10.4 8 6.2C8 4.5 8.6 2.9 9.5 1.8C4.3 2.8 0.5 7.4 0.5 13C0.5 18.5 5 23 10.5 23C11 23 11.5 22.9 12 22Z" fill="currentColor" />
                    <path d="M15 22V16H17V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16V14C12 12.3431 13.3431 11 15 11H17C18.6569 11 20 12.3431 20 14V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 11V8L16 5L15.5 4L16 3L16.5 4L16 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-secondary dark:text-white">{t('appName')}</h2>
              </div>
              <p className="text-secondary/60 dark:text-white/60 max-w-md leading-relaxed">
                {t('mission')}
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-primary">{t('quickLinks')}</h4>
              <ul className="space-y-3 text-secondary/60 dark:text-white/60">
                <li><button onClick={() => setActiveSection('home')} className="hover:text-primary transition-colors">{t('home')}</button></li>
                <li><button onClick={() => setActiveSection('namaz')} className="hover:text-primary transition-colors">{t('namazTime')}</button></li>
                <li><button onClick={() => setActiveSection('quran')} className="hover:text-primary transition-colors">{t('quran')}</button></li>
                <li><button onClick={() => setActiveSection('info')} className="hover:text-primary transition-colors">{t('islamicInfo')}</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-primary">{t('contact')}</h4>
              <ul className="space-y-3 text-secondary/60 dark:text-white/60">
                <li>Email: info@deenersathi.com</li>
                <li>Support: help@deenersathi.com</li>
                <li>Dhaka</li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-primary/10 text-center text-secondary/40 dark:text-white/40 text-sm">
            <p>{t('copyright')} | Made by Wasin</p>
          </div>
        </div>
      </footer>

      <VoiceAssistant />
    </div>
  );
}
