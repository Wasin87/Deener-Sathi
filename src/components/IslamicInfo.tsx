import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Heart, Info, Star, Moon, Sun, Calendar, ShieldCheck, Users, HelpCircle, ArrowRight, X } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export const IslamicInfo: React.FC = () => {
  const { t } = useLanguage();
  const [selectedInfo, setSelectedInfo] = useState<any>(null);

  const infoCards = [
    {
      id: 'howToPray',
      icon: <BookOpen className="text-primary" size={32} />,
      title: t('howToPray'),
      desc: t('howToPrayDesc'),
      color: "bg-primary/10",
      content: [
        { title: t('step1Pray'), text: t('step1PrayDesc') },
        { title: t('step2Pray'), text: t('step2PrayDesc') },
        { title: t('step3Pray'), text: t('step3PrayDesc') },
        { title: t('step4Pray'), text: t('step4PrayDesc') },
        { title: t('step5Pray'), text: t('step5PrayDesc') },
        { title: t('step6Pray'), text: t('step6PrayDesc') },
        { title: t('step7Pray'), text: t('step7PrayDesc') }
      ]
    },
    {
      id: 'namazRakat',
      icon: <Calendar className="text-primary" size={32} />,
      title: t('namazRakat'),
      desc: t('namazRakatDesc'),
      color: "bg-primary/10",
      content: [
        { title: t('fajr'), text: t('fajrRakat') },
        { title: t('dhuhr'), text: t('dhuhrRakat') },
        { title: t('asr'), text: t('asrRakat') },
        { title: t('maghrib'), text: t('maghribRakat') },
        { title: t('isha'), text: t('ishaRakat') }
      ]
    },
    {
      id: 'wuduRules',
      icon: <ShieldCheck className="text-primary" size={32} />,
      title: t('wuduRules'),
      desc: t('wuduRulesDesc'),
      color: "bg-primary/10",
      content: [
        { title: t('step1Wudu'), text: t('step1WuduDesc') },
        { title: t('step2Wudu'), text: t('step2WuduDesc') },
        { title: t('step3Wudu'), text: t('step3WuduDesc') },
        { title: t('step4Wudu'), text: t('step4WuduDesc') },
        { title: t('step5Wudu'), text: t('step5WuduDesc') },
        { title: t('step6Wudu'), text: t('step6WuduDesc') },
        { title: t('step7Wudu'), text: t('step7WuduDesc') },
        { title: t('step8Wudu'), text: t('step8WuduDesc') },
        { title: t('step9Wudu'), text: t('step9WuduDesc') }
      ]
    },
    {
      id: 'importanceOfNamaz',
      icon: <Heart className="text-primary" size={32} />,
      title: t('importanceOfNamaz'),
      desc: t('importanceOfNamazDesc'),
      color: "bg-primary/10",
      content: [
        { title: t('pillarOfIslam'), text: t('pillarOfIslamDesc') },
        { title: t('connectionWithAllah'), text: t('connectionWithAllahDesc') },
        { title: t('preventsEvil'), text: t('preventsEvilDesc') },
        { title: t('firstQuestion'), text: t('firstQuestionDesc') }
      ]
    },
    {
      id: 'ramadanGuide',
      icon: <Moon className="text-primary" size={32} />,
      title: t('ramadanInfo'),
      desc: t('ramadanInfoDesc'),
      color: "bg-primary/10",
      content: [
        { title: t('fastingSawm'), text: t('fastingSawmDesc') },
        { title: t('suhoor'), text: t('suhoorDesc') },
        { title: t('iftar'), text: t('iftarDesc') },
        { title: t('taraweeh'), text: t('taraweehDesc') },
        { title: t('laylatulQadr'), text: t('laylatulQadrDesc') }
      ]
    },
    {
      id: 'islamicCalendar',
      icon: <Star className="text-primary" size={32} />,
      title: t('islamicCalendar'),
      desc: t('islamicCalendarDesc'),
      color: "bg-primary/10",
      content: [
        { title: t('muharram'), text: t('muharramDesc') },
        { title: t('safar'), text: t('safarDesc') },
        { title: t('rabiAlAwwal'), text: t('rabiAlAwwalDesc') },
        { title: t('ramadanMonth'), text: t('ramadanMonthDesc') },
        { title: t('shawwal'), text: t('shawwalDesc') },
        { title: t('dhuAlHijjah'), text: t('dhuAlHijjahDesc') }
      ]
    }
  ];

  return (
    <section id="info" className="py-24 bg-islamic-bg dark:bg-dark-bg transition-colors duration-300 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none dark:opacity-[0.05]">
        <div className="absolute top-20 left-10 w-64 h-64 border-2 border-primary rounded-full rotate-45" />
        <div className="absolute bottom-20 right-10 w-96 h-96 border-2 border-primary rounded-full -rotate-12" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-widest mb-6 border border-primary/20"
          >
            <Info size={16} />
            {t('knowledgeBase')}
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-secondary dark:text-primary mb-6"
          >
            {t('islamicInfo')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-secondary/60 dark:text-primary/60 max-w-2xl mx-auto text-lg"
          >
            {t('islamicInfoDesc')}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {infoCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              onClick={() => setSelectedInfo(card)}
              className="glass p-10 rounded-[40px] border border-primary/10 hover:border-primary/40 transition-all group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[80px] -z-10 group-hover:bg-primary/10 transition-colors" />
              
              <div className={`w-20 h-20 ${card.color} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-primary/5`}>
                {card.icon}
              </div>
              
              <h3 className="text-2xl font-bold text-secondary dark:text-white mb-4 group-hover:text-primary transition-colors">{card.title}</h3>
              <p className="text-secondary/60 dark:text-white/60 text-base leading-relaxed mb-8">
                {card.desc}
              </p>
              
              <div className="flex items-center text-primary font-bold text-sm group-hover:gap-3 transition-all">
                {t('learnMore')} <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Daily Wisdom Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mt-24 glass p-12 md:p-16 rounded-[50px] border border-primary/20 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-12 opacity-[0.07] group-hover:opacity-10 transition-opacity">
            <Moon size={200} className="text-primary rotate-12" />
          </div>
          
          <div className="relative z-10 max-w-4xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-1 bg-primary rounded-full" />
              <span className="text-primary font-bold uppercase tracking-[0.2em] text-sm">
                {t('dailyWisdom')}
              </span>
            </div>
            
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary dark:text-white mb-10 leading-tight italic font-serif">
              "{t('wisdomQuote')}"
            </h3>
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Star size={24} />
              </div>
              <div>
                <p className="text-secondary dark:text-white font-bold text-lg">— {t('wisdomSource')}</p>
                <p className="text-primary/60 text-sm font-medium uppercase tracking-wider">Islamic Teaching</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Info Modal */}
      <AnimatePresence>
        {selectedInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedInfo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dark-card border border-primary/20 rounded-[32px] p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedInfo(null)}
                className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className={`w-16 h-16 ${selectedInfo.color} rounded-2xl flex items-center justify-center`}>
                  {selectedInfo.icon}
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">{selectedInfo.title}</h3>
                  <p className="text-white/60 mt-1">{selectedInfo.desc}</p>
                </div>
              </div>

              <div className="space-y-6">
                {selectedInfo.content.map((item: any, index: number) => (
                  <div key={index} className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-primary/20 transition-colors">
                    <h4 className="text-xl font-bold text-primary mb-2">{item.title}</h4>
                    <p className="text-white/80 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
