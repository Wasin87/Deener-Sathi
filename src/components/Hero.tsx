import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Calendar, Bell, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format, differenceInSeconds, parse, addDays, isBefore } from 'date-fns';
import { PrayerData } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { locationTranslations } from '../utils/locationTranslations';
import { locations } from '../utils/locations';

import { useRealTimeDates, toBnDigits } from '../hooks/useRealTimeDates';

interface HeroProps {
  prayerData: PrayerData | null;
  division: string;
  district: string;
  onLocationChange: (div: string, dist: string) => void;
  prayerLoading: boolean;
  setActiveSection: (section: string) => void;
}

const format12Hour = (time24: string, language: string) => {
  if (!time24) return '--:--';
  const [hours, minutes] = time24.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? (language === 'bn' ? 'পিএম' : 'PM') : (language === 'bn' ? 'এএম' : 'AM');
  const h12 = h % 12 || 12;
  const timeStr = `${h12}:${minutes}`;
  return language === 'bn' ? `${toBnDigits(timeStr)} ${ampm}` : `${timeStr} ${ampm}`;
};

export const Hero: React.FC<HeroProps> = ({ prayerData, division, district, onLocationChange, prayerLoading, setActiveSection }) => {
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; countdown: string } | null>(null);
  const { t, language } = useLanguage();
  const { gregorianDate, hijriDate } = useRealTimeDates(language);

  const [tempDivision, setTempDivision] = useState(division);
  const [tempDistrict, setTempDistrict] = useState(district);

  const divisions = Object.keys(locations);
  const currentDistricts = locations[tempDivision as keyof typeof locations] || [];

  const hasChanges = tempDivision !== division || tempDistrict !== district;

  useEffect(() => {
    setTempDivision(division);
    setTempDistrict(district);
  }, [division, district]);

  useEffect(() => {
    if (!prayerData) return;

    const timer = setInterval(() => {
      const now = new Date();
      const timings = prayerData.timings;
      const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
      
      let found = false;
      for (const name of prayerNames) {
        const prayerTimeStr = timings[name as keyof typeof timings];
        const prayerTime = parse(prayerTimeStr, 'HH:mm', now);
        
        if (isBefore(now, prayerTime)) {
          const diff = differenceInSeconds(prayerTime, now);
          const hours = Math.floor(diff / 3600);
          const minutes = Math.floor((diff % 3600) / 60);
          const seconds = diff % 60;
          
          setNextPrayer({
            name,
            time: prayerTimeStr,
            countdown: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
          });
          found = true;
          break;
        }
      }

      if (!found) {
        // Next prayer is Fajr tomorrow
        const fajrTimeStr = timings.Fajr;
        const fajrTime = addDays(parse(fajrTimeStr, 'HH:mm', now), 1);
        const diff = differenceInSeconds(fajrTime, now);
        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;

        setNextPrayer({
          name: 'Fajr',
          time: fajrTimeStr,
          countdown: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [prayerData]);

  return (
    <section className="pt-48 pb-24 relative overflow-hidden flex flex-col items-center justify-center text-center min-h-screen bg-transparent">
      {/* Islamic Banner Background Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-dark-bg/50 overflow-hidden">
        {/* Soft Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-50" />
        
        {/* Crescent Moon */}
        <div className="absolute top-20 right-[20%] w-32 h-32 rounded-full shadow-[inset_20px_-10px_0_0_rgba(200,169,81,0.8)] opacity-80 rotate-[-20deg] blur-[1px]" />
        
        {/* Stars */}
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-primary rounded-full animate-pulse"
            style={{
              width: Math.random() * 4 + 1 + 'px',
              height: Math.random() * 4 + 1 + 'px',
              top: Math.random() * 50 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.5 + 0.2,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}

        {/* Mosque Silhouette */}
        <div className="absolute bottom-0 left-0 w-full h-64 opacity-20 pointer-events-none flex items-end justify-center overflow-hidden">
          <svg viewBox="0 0 1200 300" className="w-full h-full object-cover object-bottom min-w-[1200px]" preserveAspectRatio="none">
            <path d="M0,300 L1200,300 L1200,250 C1180,250 1170,230 1170,200 C1170,170 1150,150 1130,150 C1110,150 1090,170 1090,200 C1090,230 1080,250 1060,250 L1000,250 C980,250 970,230 970,200 C970,150 950,100 900,100 C850,100 830,150 830,200 C830,230 820,250 800,250 L750,250 C730,250 720,230 720,200 C720,170 700,150 680,150 C660,150 640,170 640,200 C640,230 630,250 610,250 L550,250 C530,250 520,230 520,200 C520,120 480,50 400,50 C320,50 280,120 280,200 C280,230 270,250 250,250 L200,250 C180,250 170,230 170,200 C170,170 150,150 130,150 C110,150 90,170 90,200 C90,230 80,250 60,250 L0,250 Z" fill="#C8A951" />
            <path d="M400,20 L400,50 M900,70 L900,100 M1130,120 L1130,150 M680,120 L680,150 M130,120 L130,150" stroke="#C8A951" strokeWidth="4" />
            <circle cx="400" cy="15" r="5" fill="#C8A951" />
            <circle cx="900" cy="65" r="5" fill="#C8A951" />
          </svg>
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Live Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(200,169,81,0.2)]">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(200,169,81,0.8)]" />
            {t('liveNamazTime')}
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] tracking-tight">
            <span className="inline-block text-primary drop-shadow-[0_0_20px_rgba(200,169,81,0.3)]">{t('bangladesh')}</span>
            <span className="inline-block ml-4">{t('namazSomoysuchi')}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-primary/90 font-medium mb-12 tracking-wider max-w-2xl mx-auto leading-relaxed">
            {t('performPrayerOnTime')}
          </p>

          {/* Arabic Calligraphy & Sub-text */}
          <div className="mb-16 space-y-6">
            <p className="text-5xl md:text-7xl font-arabic text-primary opacity-90 drop-shadow-[0_0_25px_rgba(200,169,81,0.4)] leading-relaxed">
              {t('prayerIsBetterThanSleep')}
            </p>
            <p className={`text-xl md:text-2xl text-white/80 font-medium italic tracking-wide ${language === 'bn' ? 'font-bangla' : 'font-sans'}`}>
              {t('prayerIsBetterThanSleepSub')}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-6">
            <button 
              onClick={() => setActiveSection('namaz')}
              className="px-10 py-5 bg-primary text-secondary rounded-2xl font-bold shadow-2xl shadow-primary/30 hover:scale-105 transition-all flex items-center gap-3 text-lg"
            >
              <span className="text-2xl">🕌</span>
              {t('namazTime')}
            </button>
            <button 
              onClick={() => setActiveSection('quran')}
              className="px-10 py-5 bg-black/40 text-white border border-primary/30 rounded-2xl font-bold backdrop-blur-md hover:bg-primary/10 transition-all flex items-center gap-3 text-lg"
            >
              <span className="text-2xl">📖</span>
              {t('quran')}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Floating Prayer Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-24 w-full max-w-5xl px-4 relative z-10"
      >
          <div className="grid md:grid-cols-2 gap-8 items-center rounded-[40px]">
            <div className="text-left space-y-6">
              <div>
                <p className="text-primary font-bold tracking-widest uppercase text-xs mb-2">{t('nextPrayer')}</p>
                <h2 className="text-4xl font-bold text-white">{nextPrayer ? t(nextPrayer.name.toLowerCase() as any) || nextPrayer.name : '---'}</h2>
              </div>
              
              <div className="space-y-3">
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{t('selectDivision')} & {t('selectDistrict')}</p>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative w-full">
                      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 cursor-pointer hover:bg-white/10 transition-colors">
                        <MapPin size={16} className="text-primary" />
                        <select 
                          value={tempDivision}
                          onChange={(e) => {
                            setTempDivision(e.target.value);
                            setTempDistrict(locations[e.target.value as keyof typeof locations][0]);
                          }}
                          className="bg-transparent text-white font-medium appearance-none outline-none cursor-pointer pr-6 w-full"
                        >
                          {divisions.map(div => (
                            <option key={div} value={div} className="bg-dark-card text-white">
                              {locationTranslations[div]?.[language] || div}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="text-white/50 absolute right-4 pointer-events-none" />
                      </div>
                    </div>

                    <div className="relative w-full">
                      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 cursor-pointer hover:bg-white/10 transition-colors">
                        <MapPin size={16} className="text-primary" />
                        <select 
                          value={tempDistrict}
                          onChange={(e) => setTempDistrict(e.target.value)}
                          className="bg-transparent text-white font-medium appearance-none outline-none cursor-pointer pr-6 w-full"
                        >
                          {currentDistricts.map(dist => (
                            <option key={dist} value={dist} className="bg-dark-card text-white">
                              {locationTranslations[dist]?.[language] || dist}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="text-white/50 absolute right-4 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {hasChanges && (
                      <motion.button
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onClick={() => onLocationChange(tempDivision, tempDistrict)}
                        disabled={prayerLoading}
                        className="w-full py-4 bg-primary text-secondary rounded-xl font-bold shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {prayerLoading ? (
                          <div className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>📍</span>
                            {language === 'bn' ? 'লোকেশন সেট করুন' : 'Set Location'}
                          </>
                        )}
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Iftar & Sehri Times */}
              <div className="pt-4 border-t border-white/5">
                <p className="text-primary font-bold tracking-widest uppercase text-xs mb-4">{t('todayIftarSehri')}</p>
                <div className="flex gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      🌙
                    </div>
                    <div>
                      <p className="text-white/40 text-[10px] uppercase font-bold tracking-wider">{t('sehri')}</p>
                      <p className="text-lg font-bold text-white">{prayerData ? format12Hour(prayerData.timings.Fajr, language) : '--:--'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      ☀️
                    </div>
                    <div>
                      <p className="text-white/40 text-[10px] uppercase font-bold tracking-wider">{t('iftar')}</p>
                      <p className="text-lg font-bold text-white">{prayerData ? format12Hour(prayerData.timings.Maghrib, language) : '--:--'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center space-y-8">
              <div className="text-center">
                <div className="text-6xl md:text-7xl font-mono font-bold tracking-tighter text-primary drop-shadow-[0_0_20px_rgba(200,169,81,0.5)]">
                  {language === 'bn' ? toBnDigits(nextPrayer?.countdown || '00:00:00') : (nextPrayer?.countdown || '00:00:00')}
                </div>
                <p className="text-white/40 text-xs uppercase mt-2 tracking-widest font-bold">{t('timeRemaining')}</p>
              </div>

              <div className="grid grid-cols-1 gap-4 w-full">
                <div className="islamic-card p-5 flex flex-col items-center justify-center border-l-4 border-l-primary">
                  <div className="flex items-center gap-3 text-primary mb-1">
                    <Calendar size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{t('englishDate')}</span>
                  </div>
                  <p className="text-lg font-bold text-white">
                    {gregorianDate}
                  </p>
                </div>
                <div className="islamic-card p-5 flex flex-col items-center justify-center border-l-4 border-l-primary">
                  <div className="flex items-center gap-3 text-primary mb-1">
                    <Calendar size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{t('hijriDateLabel')}</span>
                  </div>
                  <p className="text-lg font-bold text-white">
                    {hijriDate.display}
                  </p>
                </div>
              </div>
            </div>
          </div>
      </motion.div>
    </section>
  );
};

