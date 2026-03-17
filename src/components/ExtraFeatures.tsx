import React from 'react';
import { motion } from 'motion/react';
import { Quote, Calendar, Timer } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { PrayerData } from '../types';

import { useRealTimeDates, hijriMonthKeys, toBnDigits } from '../hooks/useRealTimeDates';

interface ExtraFeaturesProps {
  prayerData: PrayerData | null;
}

export const ExtraFeatures: React.FC<ExtraFeaturesProps> = ({ prayerData }) => {
  const { t, language } = useLanguage();
  const { gregorianDate, hijriDate } = useRealTimeDates(language);
  
  const hadith = {
    text: t('wisdomQuote'),
    source: t('wisdomSource')
  };

  const hData = hijriDate.data;
  const isRamadan = hData?.month.number === 9 || hData?.month.en === 'Ramadān' || hData?.month.en === 'Ramadan';
  const ramadanDay = isRamadan ? parseInt(hData?.day || '0') : 0;
  const daysInRamadan = 30; // Assuming 30 days for simplicity
  const remainingRamadanDays = isRamadan ? daysInRamadan - ramadanDay : 0;

  // Calculate days to next Ramadan if not currently Ramadan
  const currentHijriMonth = hData?.month.number || 1;
  const currentHijriDay = parseInt(hData?.day || '1');
  
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
    <section className="py-20 bg-transparent text-secondary relative overflow-hidden dark:text-white transition-colors duration-300">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Daily Hadith */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="islamic-card p-8"
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
            className="bg-primary p-8 rounded-[32px] shadow-[0_20px_50px_rgba(176,141,62,0.3)] flex flex-col justify-between text-secondary"
          >
            <div className="flex items-center gap-3 mb-6">
              <Timer size={24} />
              <h3 className="text-xl font-bold">{isRamadan ? t('ramadanDay') : t('ramadanCountdown')}</h3>
            </div>
            <div className="text-center py-4">
              <span className="text-7xl font-bold">{language === 'bn' ? toBnDigits((isRamadan ? ramadanDay : (daysToRamadan > 0 ? daysToRamadan : 0)).toString()) : (isRamadan ? ramadanDay : (daysToRamadan > 0 ? daysToRamadan : 0))}</span>
              <p className="text-secondary/80 font-bold uppercase tracking-widest mt-2">
                {isRamadan ? t('ramadanDay') : t('daysRemaining')}
              </p>
            </div>
            {isRamadan ? (
              <p className="text-sm text-secondary/90 text-center mt-4 font-bold bg-white/20 py-3 rounded-xl">
                {language === 'bn' ? toBnDigits(remainingRamadanDays.toString()) : remainingRamadanDays} {t('ramadanRemaining')} <br/>
                <span className="text-xs opacity-80 uppercase tracking-tighter">{t('eidCountdown')}</span>
              </p>
            ) : (
              <p className="text-sm text-secondary/70 text-center mt-4 italic font-medium">
                {t('prepareHeart')}
              </p>
            )}
          </motion.div>

          {/* Islamic Calendar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="islamic-card p-8"
          >
            <div className="flex items-center gap-3 mb-6 text-primary">
              <Calendar size={24} />
              <h3 className="text-xl font-bold">{t('islamicCalendar')}</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-white/40 text-xs font-bold uppercase tracking-wider">{language === 'bn' ? 'মাস' : 'Month'}</span>
                <span className="font-bold text-white">
                  {hijriDate.data ? `${t(hijriMonthKeys[hijriDate.data.month.number] as any)} ${language === 'bn' ? toBnDigits(hijriDate.data.year) : hijriDate.data.year}` : '---'}
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-white/40 text-xs font-bold uppercase tracking-wider">{language === 'bn' ? 'আজ' : 'Today'}</span>
                <span className="font-bold text-white">
                  {gregorianDate}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/40 text-xs font-bold uppercase tracking-wider">{t('hijriDateLabel')}</span>
                <span className="font-bold text-primary">
                  {hijriDate.display}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
