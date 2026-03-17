import React from 'react';
import { motion } from 'motion/react';
import { Clock, Bell, Info } from 'lucide-react';
import { PrayerData } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { useRealTimeDates, toBnDigits } from '../hooks/useRealTimeDates';

interface PrayerTimesProps {
  prayerData: PrayerData | null;
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

export const PrayerTimes: React.FC<PrayerTimesProps> = ({ prayerData }) => {
  const { t, language } = useLanguage();
  if (!prayerData) return null;

  const prayers = [
    { name: 'Fajr', time: prayerData.timings.Fajr, icon: '🌅' },
    { name: 'Sunrise', time: prayerData.timings.Sunrise, icon: '☀️' },
    { name: 'Dhuhr', time: prayerData.timings.Dhuhr, icon: '🌞' },
    { name: 'Asr', time: prayerData.timings.Asr, icon: '🌤️' },
    { name: 'Maghrib', time: prayerData.timings.Maghrib, icon: '🌇' },
    { name: 'Isha', time: prayerData.timings.Isha, icon: '🌙' },
  ];

  const getJamatTime = (azan: string) => {
    const [h, m] = azan.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m + 15);
    return format12Hour(`${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`, language);
  };

  const getLastTime = (name: string, azan: string) => {
    const [h, m] = azan.split(':').map(Number);
    if (name === 'Fajr') return format12Hour(prayerData.timings.Sunrise, language);
    if (name === 'Maghrib') return format12Hour(prayerData.timings.Isha, language);
    return format12Hour(`${(h + 2) % 24}:${m.toString().padStart(2, '0')}`, language);
  };

  return (
    <section id="namaz" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">{t('dailyNamazSchedule')}</h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            {t('prayerTimingsDesc')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prayers.map((prayer, index) => (
            <motion.div
              key={prayer.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="islamic-card p-8 group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {prayer.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{t(prayer.name.toLowerCase() as any) || prayer.name}</h3>
                    <p className="text-sm text-primary font-medium">{t('azanTime')}: {format12Hour(prayer.time, language)}</p>
                  </div>
                </div>
                <button className="p-3 rounded-xl bg-white/5 text-white/40 hover:bg-primary hover:text-white transition-all">
                  <Bell size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-sm text-white/40 flex items-center gap-2">
                    <Clock size={14} /> {t('jamatTime')}
                  </span>
                  <span className="font-bold text-white">{getJamatTime(prayer.time)}</span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-sm text-white/40 flex items-center gap-2">
                    <Info size={14} /> {t('lastTime')}
                  </span>
                  <span className="font-bold text-white">{getLastTime(prayer.name, prayer.time)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

