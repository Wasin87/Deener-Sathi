import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, X, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../hooks/useLanguage';

export const GlobalAudioPlayer: React.FC = () => {
  const { isPlaying, currentTrack, progress, duration, togglePlayPause, stopAudio, seek, playNext, playPrevious, mode, setMode } = useAudio();
  const { t } = useLanguage();

  if (!currentTrack || currentTrack.type === 'quran') return null;

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 z-[100] w-[300px] glass rounded-2xl border border-primary/20 shadow-xl overflow-hidden p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-bold truncate text-sm">{currentTrack.title}</h4>
            <p className="text-primary/70 text-[10px] truncate font-medium">{currentTrack.subtitle}</p>
          </div>
          <button 
            onClick={stopAudio}
            className="w-6 h-6 rounded-full bg-white/5 text-white/50 hover:text-red-400 hover:bg-red-400/10 flex items-center justify-center transition-all"
          >
            <X size={12} />
          </button>
        </div>

        <div className="flex items-center gap-2 justify-center mb-3">
          <button 
            onClick={playPrevious}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-primary hover:bg-primary/10 transition-all"
          >
            <SkipBack size={16} />
          </button>
          <button 
            onClick={async () => {
              try {
                await togglePlayPause();
              } catch (error) {
                console.error("Failed to toggle play/pause:", error);
              }
            }}
            className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-primary/20"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-1" fill="currentColor" />}
          </button>
          <button 
            onClick={playNext}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-primary hover:bg-primary/10 transition-all"
          >
            <SkipForward size={16} />
          </button>
        </div>
        
        <div className="space-y-1">
          <div 
            className="h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer relative group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const percentage = x / rect.width;
              seek(percentage * duration);
            }}
          >
            <div 
              className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-100"
              style={{ width: `${(progress / duration) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-white/40 font-mono tracking-tighter">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
