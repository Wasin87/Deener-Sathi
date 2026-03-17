import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useLanguage } from './useLanguage';

interface HijriData {
  day: string;
  month: {
    en: string;
    ar: string;
    number: number;
  };
  year: string;
  designation: string;
}

export const hijriMonthKeys: { [key: number]: string } = {
  1: 'muharram',
  2: 'safar',
  3: 'rabiAlAwwal',
  4: 'rabiAlThani',
  5: 'jumadaAlUla',
  6: 'jumadaAlAkhira',
  7: 'rajab',
  8: 'shaban',
  9: 'ramadanMonth',
  10: 'shawwal',
  11: 'dhuAlQidah',
  12: 'dhuAlHijjah',
};

export const bnDigits: { [key: string]: string } = {
  '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
};

export const toBnDigits = (str: string) => str.replace(/\d/g, d => bnDigits[d]);

export const useRealTimeDates = (language: 'en' | 'bn') => {
  const { t } = useLanguage();
  const [gregorianDate, setGregorianDate] = useState('');
  const [banglaDate, setBanglaDate] = useState({ full: '', month: '', day: '', year: '' });
  const [hijriDate, setHijriDate] = useState<{ display: string; data: HijriData | null }>({
    display: '---',
    data: null
  });
  const [loading, setLoading] = useState(true);

  const updateLocalDates = () => {
    const now = new Date();
    
    // Gregorian Date
    const gregOptions: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setGregorianDate(new Intl.DateTimeFormat(language === 'bn' ? 'bn-BD' : 'en-US', gregOptions).format(now));

    // Bangla Date
    const bnLocale = 'bn-BD-u-ca-beng';
    const bnFull = new Intl.DateTimeFormat(bnLocale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(now);
    const bnMonth = new Intl.DateTimeFormat(bnLocale, { month: 'long' }).format(now);
    const bnDay = new Intl.DateTimeFormat(bnLocale, { day: 'numeric' }).format(now);
    const bnYear = new Intl.DateTimeFormat(bnLocale, { year: 'numeric' }).format(now);
    
    setBanglaDate({
      full: bnFull,
      month: bnMonth,
      day: bnDay,
      year: bnYear
    });
  };

  const fetchHijriDate = async () => {
    const now = new Date();
    const dateStr = format(now, 'dd-MM-yyyy');
    
    try {
      const response = await fetch(`https://api.aladhan.com/v1/gToH?date=${dateStr}`);
      const result = await response.json();
      
      if (result.code === 200) {
        const h = result.data.hijri;
        const monthKey = hijriMonthKeys[h.month.number];
        const monthName = t(monthKey as any);
        
        let display = '';
        if (language === 'bn') {
          display = `${toBnDigits(h.day)} ${monthName} ${toBnDigits(h.year)} হিজরি`;
        } else {
          display = `${h.day} ${monthName} ${h.year} ${h.designation.abbreviated}`;
        }

        setHijriDate({
          display,
          data: {
            day: h.day,
            month: { en: h.month.en, ar: h.month.ar, number: h.month.number },
            year: h.year,
            designation: h.designation.abbreviated
          }
        });
      } else {
        throw new Error('API Error');
      }
    } catch (error) {
      console.error('Failed to fetch Hijri date:', error);
      // Fallback using Intl
      const fallbackOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
      const fallback = new Intl.DateTimeFormat(language === 'bn' ? 'bn-BD-u-ca-islamic-uma' : 'en-US-u-ca-islamic-uma', fallbackOptions).format(now);
      setHijriDate({
        display: language === 'bn' ? `${fallback} হিজরি` : `${fallback} AH`,
        data: null
      });
      
      // Retry after 1 minute
      setTimeout(fetchHijriDate, 60000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateLocalDates();
    fetchHijriDate();

    // Update local dates every minute to handle day change
    const interval = setInterval(updateLocalDates, 60000);
    
    return () => clearInterval(interval);
  }, [language, t]); // Added t to dependencies

  return { gregorianDate, banglaDate, hijriDate, loading };
};
