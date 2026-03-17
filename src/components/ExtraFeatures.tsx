import React from 'react';
import { motion } from 'motion/react';
import { Quote, Calendar, Timer } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { PrayerData } from '../types';

interface ExtraFeaturesProps {
  prayerData: PrayerData | null;
}

export const ExtraFeatures: React.FC<ExtraFeaturesProps> = ({ prayerData }) => {
  const { t, language } = useLanguage();
  
  const hadith = {
    text: t('wisdomQuote'),
    source: t('wisdomSource')
  };

  const isRamadan = prayerData?.date.hijri.month.en === 'Ramadān' || prayerData?.date.hijri.month.en === 'Ramadan' || prayerData?.date.hijri.month.number === 9;
  const ramadanDay = isRamadan ? parseInt(prayerData?.date.hijri.day || '0') : 0;
  const daysInRamadan = 30; // Assuming 30 days for simplicity
  const remainingRamadanDays = isRamadan ? daysInRamadan - ramadanDay : 0;

  // Calculate days to next Ramadan if not currently Ramadan
  const currentHijriMonth = prayerData?.date.hijri.month.number || 1;
  const currentHijriDay = parseInt(prayerData?.date.hijri.day || '1');
  
  let daysToRamadan = 0;
  if (!isRamadan) {
    let monthsDiff = 0;
    if (currentHijriMonth < 9) {
      monthsDiff = 9 - currentHijriMonth;
    } else {
      monthsDiff = 12 - currentHijriMonth + 9;
    }
    // Approximate days (29.5 days per Islamic month)
    daysToRamadan = Math.floor((monthsDiff * 29.5) - currentHijriDay);
    if (daysToRamadan < 0) daysToRamadan = 0;
  }

  return (
    <section className="py-20 bg-white text-secondary relative overflow-hidden dark:bg-black/60 dark:text-white transition-colors duration-300">
      <div className="absolute top-0 left-0 w-full h-full islamic-pattern opacity-5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Daily Hadith */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-secondary/5 dark:bg-white/5 backdrop-blur-xl p-8 rounded-[32px] border border-secondary/10 dark:border-white/10"
          >
            <div className="flex items-center gap-3 mb-6 text-primary">
              <Quote size={24} />
              <h3 className="text-xl font-bold">{t('dailyHadith')}</h3>
            </div>
            <p className="text-xl italic leading-relaxed mb-6">
              "{hadith.text}"
            </p>
            <p className="text-primary font-medium">— {hadith.source}</p>
          </motion.div>

          {/* Ramadan Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-primary p-8 rounded-[32px] shadow-2xl shadow-primary/20 flex flex-col justify-between text-white"
          >
            <div className="flex items-center gap-3 mb-6">
              <Timer size={24} />
              <h3 className="text-xl font-bold">{isRamadan ? t('ramadanDay') : t('ramadanCountdown')}</h3>
            </div>
            <div className="text-center py-4">
              <span className="text-7xl font-bold">{isRamadan ? ramadanDay : (daysToRamadan > 0 ? daysToRamadan : 0)}</span>
              <p className="text-white/80 font-medium uppercase tracking-widest mt-2">
                {isRamadan ? t('ramadanDay') : t('daysRemaining')}
              </p>
            </div>
            {isRamadan ? (
              <p className="text-sm text-white/90 text-center mt-4 font-medium bg-white/10 py-2 rounded-lg">
                {remainingRamadanDays} {t('ramadanRemaining')} <br/>
                <span className="text-xs opacity-80">{t('eidCountdown')}</span>
              </p>
            ) : (
              <p className="text-sm text-white/60 text-center mt-4 italic">
                {t('prepareHeart')}
              </p>
            )}
          </motion.div>

          {/* Islamic Calendar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-secondary/5 dark:bg-white/5 backdrop-blur-xl p-8 rounded-[32px] border border-secondary/10 dark:border-white/10"
          >
            <div className="flex items-center gap-3 mb-6 text-primary">
              <Calendar size={24} />
              <h3 className="text-xl font-bold">{t('islamicCalendar')}</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-secondary/10 dark:border-white/10">
                <span className="text-secondary/60 dark:text-white/60">{language === 'bn' ? 'মাস' : 'Month'}</span>
                <span className="font-bold">{prayerData?.date.hijri.month.en} {prayerData?.date.hijri.year}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-secondary/10 dark:border-white/10">
                <span className="text-secondary/60 dark:text-white/60">{language === 'bn' ? 'আজ' : 'Today'}</span>
                <span className="font-bold">{prayerData?.date.readable}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary/60 dark:text-white/60">{language === 'bn' ? 'হিজরি' : 'Hijri'}</span>
                <span className="font-bold text-primary">{prayerData?.date.hijri.date}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
