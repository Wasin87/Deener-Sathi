import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Play, Pause, Book, ChevronRight, Volume2, Mic, ChevronLeft } from 'lucide-react';
import { fetchSurahs, fetchSurahDetail, fetchSurahTranslation, fetchParaDetail, fetchParaTranslation } from '../services/quranService';
import { Surah, Ayah } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { useAudio } from '../contexts/AudioContext';
import { AudioModal } from './AudioModal';
import { surahTranslations } from '../utils/surahTranslations';

export const QuranSection: React.FC = () => {
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const { t, language } = useLanguage();
  const { playTrack, currentTrack, isPlaying, togglePlayPause } = useAudio();
  const [view, setView] = useState<'grid' | 'surah' | 'para'>('grid');
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [selectedPara, setSelectedPara] = useState<number | null>(null);
  const [surahData, setSurahData] = useState<{ details: Ayah[]; translation: Ayah[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const loadSurahs = async () => {
      const res = await fetchSurahs();
      if (res) setSurahs(res.data);
    };
    loadSurahs();
  }, []);

  const handleSurahClick = async (number: number) => {
    setLoading(true);
    setSelectedSurah(number);
    setView('surah');
    const [details, translation] = await Promise.all([
      fetchSurahDetail(number),
      fetchSurahTranslation(number)
    ]);
    
    if (details && translation) {
      setSurahData({
        details: details.data.ayahs,
        translation: translation.data.ayahs
      });
    }
    setLoading(false);
  };

  const handleParaClick = async (number: number) => {
    setLoading(true);
    setSelectedPara(number);
    setView('para');
    const [details, translation] = await Promise.all([
      fetchParaDetail(number),
      fetchParaTranslation(number)
    ]);
    
    if (details && translation) {
      setSurahData({
        details: details.data.ayahs,
        translation: translation.data.ayahs
      });
    }
    setLoading(false);
  };

  const playRecitation = async (surahNumber: number) => {
    const surah = surahs.find(s => s.number === surahNumber);
    if (!surah || !surahData) return;
    
    const playlist = surahData.details.map((ayah, index) => ({
      title: `${surah.englishName} - Ayah ${ayah.numberInSurah}`,
      subtitle: t('quranRecitation'),
      url: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`,
      type: 'quran' as const,
      id: `ayah-${ayah.number}`,
      index
    }));

    if (playlist.length > 0) {
      try {
        await playTrack(playlist[0], playlist, 'surah');
      } catch (error) {
        console.error("Failed to play Quran recitation:", error);
      }
    }
  };

  const playAyatAudio = async (globalAyahNumber: number, index: number) => {
    if (!surahData) return;
    
    const surah = surahs.find(s => s.number === selectedSurah);
    const playlist = surahData.details.map((ayah, i) => ({
      title: `${surah?.englishName || t('para') + ' ' + selectedPara} - Ayah ${ayah.numberInSurah}`,
      subtitle: t('quranRecitation'),
      url: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`,
      type: 'quran' as const,
      id: `ayah-${ayah.number}`,
      index: i
    }));

    try {
      await playTrack(playlist[index], playlist, 'single');
    } catch (error) {
      console.error("Failed to play Ayah audio:", error);
    }
  };

  const playParaRecitation = async () => {
    if (!surahData || !selectedPara) return;
    
    const playlist = surahData.details.map((ayah, index) => ({
      title: `${t('para')} ${selectedPara} - Ayah ${ayah.numberInSurah}`,
      subtitle: t('quranRecitation'),
      url: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`,
      type: 'quran' as const,
      id: `ayah-${ayah.number}`,
      index
    }));

    if (playlist.length > 0) {
      try {
        await playTrack(playlist[0], playlist, 'surah');
      } catch (error) {
        console.error("Failed to play Para recitation:", error);
      }
    }
  };

  const handleSearch = async () => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return;

    // Check for Para/Juz
    if (query.includes('para') || query.includes('juz') || query.includes('পারা')) {
      const match = query.match(/\d+/);
      if (match) {
        const paraNum = parseInt(match[0]);
        if (paraNum >= 1 && paraNum <= 30) {
          handleParaClick(paraNum);
          return;
        }
      }
    }

    // Check for Surah:Ayah format (e.g., 2:255)
    if (query.includes(':') || query.includes('ঃ')) {
      const separator = query.includes(':') ? ':' : 'ঃ';
      const [surahPart, ayahPart] = query.split(separator).map(n => n.trim());
      const surahNum = parseInt(surahPart);
      const ayahNum = parseInt(ayahPart);

      if (!isNaN(surahNum) && !isNaN(ayahNum)) {
        await handleSurahClick(surahNum);
        setTimeout(() => {
          const element = document.getElementById(`ayah-${ayahNum}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('ring-4', 'ring-primary/50', 'ring-offset-4', 'ring-offset-dark-bg');
            setTimeout(() => element.classList.remove('ring-4', 'ring-primary/50', 'ring-offset-4', 'ring-offset-dark-bg'), 5000);
          }
        }, 1000);
        return;
      }
    }

    // Check for Surah name or number
    const found = surahs.find(s => 
      s.englishName.toLowerCase().includes(query) || 
      s.name.includes(query) ||
      s.number.toString() === query
    );
    
    if (found) {
      handleSurahClick(found.number);
    }
  };

  const filteredSurahs = (surahs || []).filter(s => 
    s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.name.includes(searchQuery) ||
    s.number.toString().includes(searchQuery)
  );

  return (
    <section id="quran" className="py-20 bg-islamic-bg dark:bg-dark-bg min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-4">
        {view === 'grid' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-secondary dark:text-primary mb-4">{t('holyQuran')}</h2>
              <p className="text-secondary/60 dark:text-primary/60">{t('quranDesc')}</p>
            </div>

            <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-12">
              <div className="relative w-full md:w-[500px] flex items-center gap-3">
                <div className="relative flex-1 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40 group-focus-within:text-primary transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder={t('searchSurah')}
                    className="w-full pl-12 pr-14 py-4 rounded-2xl border border-primary/20 focus:outline-none focus:border-primary bg-white dark:bg-dark-card dark:text-white shadow-sm transition-all text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button 
                    onClick={handleSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-primary/20"
                    title={t('search')}
                  >
                    <Search size={18} />
                  </button>
                </div>
                <button 
                  onClick={() => {
                    if (!('webkitSpeechRecognition' in window)) {
                      alert(t('voiceNotSupported') || "Speech recognition is not supported in this browser.");
                      return;
                    }
                    const recognition = new (window as any).webkitSpeechRecognition();
                    recognition.continuous = false;
                    recognition.interimResults = false;
                    recognition.lang = 'en-US'; 
                    recognition.onstart = () => setIsListening(true);
                    recognition.onend = () => setIsListening(false);
                    recognition.onerror = () => setIsListening(false);
                    recognition.onresult = (event: any) => {
                      const transcript = event.results[0][0].transcript.toLowerCase();
                      setSearchQuery(transcript);
                      
                      // Handle commands like "Read Surah Yaseen" or "Read Para 5"
                      if (transcript.includes('read surah') || transcript.includes('surah')) {
                        const surahName = transcript.replace('read surah', '').replace('surah', '').trim();
                        const found = surahs.find(s => s.englishName.toLowerCase().includes(surahName) || s.name.includes(surahName));
                        if (found) {
                          handleSurahClick(found.number);
                        }
                      } else if (transcript.includes('read para') || transcript.includes('para') || transcript.includes('juz')) {
                        const match = transcript.match(/\d+/);
                        if (match) {
                          const paraNum = parseInt(match[0]);
                          if (paraNum >= 1 && paraNum <= 30) {
                            handleParaClick(paraNum);
                          }
                        }
                      }
                    };
                    recognition.start();
                  }}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border ${
                    isListening ? 'bg-red-500 text-white border-red-500 animate-pulse' : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary hover:text-white'
                  }`}
                  title="Voice Search"
                >
                  <Mic size={24} />
                </button>
              </div>
            </div>

            {/* 30 Para Grid */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-secondary dark:text-primary mb-8 flex items-center gap-3">
                <Book className="text-primary" /> {t('para')} (Juz)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {[...Array(30)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleParaClick(i + 1)}
                    className="islamic-card p-6 group text-center"
                  >
                    <div className="w-12 h-12 bg-primary/10 group-hover:bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <span className="font-bold text-primary group-hover:text-white">{i + 1}</span>
                    </div>
                    <h4 className="font-bold">{t('para')} {i + 1}</h4>
                  </button>
                ))}
              </div>
            </div>

            {/* Surah List */}
            <div>
              <h3 className="text-2xl font-bold text-secondary dark:text-primary mb-8 flex items-center gap-3">
                <Volume2 className="text-primary" /> {t('selectSurah')}
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSurahs.map((surah) => (
                  <button
                    key={surah.number}
                    onClick={() => handleSurahClick(surah.number)}
                    className="islamic-card p-6 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-bold text-lg">
                        {surah.number}
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-secondary dark:text-white">
                          {surahTranslations[surah.englishName]?.[language] || surah.englishName}
                        </h4>
                        <p className="text-xs text-secondary/50 dark:text-primary/50">{surah.numberOfAyahs} {t('ayat')}</p>
                      </div>
                    </div>
                    <span className="text-2xl font-arabic text-primary">{surah.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {(view === 'surah' || view === 'para') && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button 
              onClick={() => setView('grid')}
              className="flex items-center gap-2 text-primary font-bold mb-8 hover:translate-x-1 transition-transform bg-primary/10 px-6 py-3 rounded-xl"
            >
              <ChevronLeft size={20} /> {t('backToList')}
            </button>

            <div className="glass rounded-[40px] p-8 md:p-12 relative overflow-hidden border border-primary/10">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 border-b border-primary/10 pb-8">
                <div className="text-center md:text-left">
                  <h3 className="text-4xl font-bold text-secondary dark:text-white mb-2">
                    {view === 'surah' ? (surahTranslations[surahs.find(s => s.number === selectedSurah)?.englishName || '']?.[language] || surahs.find(s => s.number === selectedSurah)?.englishName) : `${t('para')} ${selectedPara}`}
                  </h3>
                  <p className="text-primary font-medium text-2xl font-arabic">
                    {view === 'surah' ? surahs.find(s => s.number === selectedSurah)?.name : 'الجزء ' + selectedPara}
                  </p>
                </div>
                <div className="flex gap-4 items-center">
                  {isPlaying && (
                    <div className="flex gap-1 h-6 items-end">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ height: [4, 24, 4] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                          className="w-1.5 bg-primary rounded-full"
                        />
                      ))}
                    </div>
                  )}
                  <button 
                    onClick={() => view === 'surah' ? (selectedSurah && playRecitation(selectedSurah)) : playParaRecitation()}
                    className={`px-8 py-4 rounded-2xl flex items-center gap-3 transition-all font-bold text-lg ${
                      isPlaying ? 'bg-secondary text-white' : 'bg-primary text-white shadow-xl shadow-primary/30 hover:scale-105'
                    }`}
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    {isPlaying ? t('playing') : t('listenFullSurah')}
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="py-32 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-primary font-bold animate-pulse">{t('bismillah')}</p>
                </div>
              ) : (
                <div className="space-y-16">
                  {surahData?.details.map((ayah, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={ayah.number} 
                      id={`ayah-${ayah.numberInSurah}`}
                      className="islamic-card p-8 group relative transition-all duration-300"
                    >
                      <div className="flex flex-col gap-8">
                        <div className="flex justify-between items-start gap-6">
                          <div className="flex flex-col gap-3">
                            <span className="w-14 h-14 rounded-2xl bg-primary/10 text-primary text-xl flex items-center justify-center shrink-0 font-bold border border-primary/20 shadow-inner">
                              {ayah.numberInSurah}
                            </span>
                            <button 
                              onClick={() => playAyatAudio(ayah.number, idx)}
                              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border shadow-sm ${
                                currentTrack?.id === `ayah-${ayah.number}` && isPlaying
                                  ? 'bg-primary text-white border-primary'
                                  : 'bg-white/5 text-primary border-primary/10 hover:bg-primary hover:text-white'
                              }`}
                              title={t('listen')}
                            >
                              {currentTrack?.id === `ayah-${ayah.number}` && isPlaying ? <Pause size={24} /> : <Volume2 size={24} />}
                            </button>
                          </div>
                          <p className="text-3xl md:text-5xl text-right font-arabic leading-[2] text-white flex-1 drop-shadow-sm">
                            {ayah.text}
                          </p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6 mt-4">
                          <div className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-primary/20 transition-colors">
                            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                              <span className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(200,169,81,0.6)]" />
                              {t('translation')}
                            </p>
                            <p className="text-white/90 leading-relaxed text-lg font-bangla">
                              {surahData.translation[idx].text}
                            </p>
                          </div>
                          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 hover:border-primary/30 transition-colors">
                            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                              <span className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(200,169,81,0.6)]" />
                              {t('shaanENuzul')}
                            </p>
                            <p className="text-white/70 text-sm italic leading-relaxed">
                              {t('ayahRevealed')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
        <AudioModal isOpen={isAudioModalOpen} onClose={() => setIsAudioModalOpen(false)} />
      </div>
    </section>
  );
};

