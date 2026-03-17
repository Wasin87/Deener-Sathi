import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, ChevronLeft, Book } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export const DuaPage: React.FC = () => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: t('all') },
    { id: 'morning', label: t('morningDuas') },
    { id: 'night', label: t('nightDuas') },
    { id: 'daily', label: t('dailyDuas') },
    { id: 'travel', label: t('travelDuas') },
    { id: 'eating', label: t('eatingDuas') },
    { id: 'sleeping', label: t('sleepingDuas') },
  ];

  // Mock Dua Data
  const duas = [
    { id: '1', category: 'morning', title: t('morningDuas'), arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا', bangla: 'হে আল্লাহ! আপনার রহমতে আমরা সকালে উপনীত হয়েছি...' },
    { id: '2', category: 'night', title: t('nightDuas'), arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', bangla: 'হে আল্লাহ! আপনার নামেই আমি মৃত্যুবরণ করি এবং জীবিত হই।' },
    { id: '3', category: 'eating', title: t('eatingDuas'), arabic: 'بِسْمِ اللَّهِ', bangla: 'আল্লাহর নামে শুরু করছি।' },
    { id: '4', category: 'travel', title: t('travelDuas'), arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا', bangla: 'পবিত্র সেই সত্তা যিনি এগুলোকে আমাদের বশীভূত করে দিয়েছেন...' },
  ];

  const filteredDuas = activeCategory === 'all' ? duas : duas.filter(d => d.category === activeCategory);

  const togglePlay = (id: string) => {
    setPlayingId(prev => prev === id ? null : id);
  };

  return (
    <section className="py-20 bg-islamic-bg dark:bg-dark-bg min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-secondary dark:text-white mb-4">{t('dua')}</h2>
          <p className="text-secondary/60 dark:text-white/60">{t('findPeace')}</p>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto gap-3 pb-8 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                  : 'bg-white dark:bg-dark-card text-secondary dark:text-white/70 border border-primary/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredDuas.map((dua) => (
              <motion.div
                key={dua.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass p-8 rounded-[32px] relative overflow-hidden group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                    <Book size={24} />
                  </div>
                  <button 
                    onClick={() => togglePlay(dua.id)}
                    className={`p-4 rounded-2xl transition-all ${
                      playingId === dua.id ? 'bg-secondary text-white' : 'bg-primary text-white shadow-lg shadow-primary/20'
                    }`}
                  >
                    {playingId === dua.id ? <Pause size={20} /> : <Volume2 size={20} />}
                  </button>
                </div>

                <div className="space-y-6">
                  <p className="text-3xl text-right font-arabic leading-loose text-secondary dark:text-white">
                    {dua.arabic}
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-bold text-primary">{dua.title}</h4>
                    <p className="text-secondary/70 dark:text-white/70 leading-relaxed">
                      {dua.bangla}
                    </p>
                  </div>
                </div>

                {playingId === dua.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 flex items-end gap-1 px-8">
                    {[...Array(15)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [4, Math.random() * 16 + 8, 4] }}
                        transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
                        className="flex-1 bg-primary rounded-t-full"
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
