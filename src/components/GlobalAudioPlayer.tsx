import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, X, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../hooks/useLanguage';

export const GlobalAudioPlayer: React.FC = () => {
  const { isPlaying, currentTrack, progress, duration, togglePlayPause, stopAudio, seek, playNext, playPrevious } = useAudio();
  const { t } = useLanguage();

  if (!currentTrack) return null;

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
        className="fixed bottom-8 left-8 z-[100] w-[350px] max-w-[calc(100vw-64px)] glass rounded-[32px] border border-primary/20 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        <div className="p-6 flex flex-col gap-4">
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 relative overflow-hidden border border-primary/20">
              {isPlaying && (
                <div className="absolute inset-0 bg-primary/20 animate-pulse" />
              )}
              <Volume2 size={24} className={isPlaying ? "animate-pulse" : ""} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-bold truncate text-lg">{currentTrack.title}</h4>
              <p className="text-primary/70 text-sm truncate font-medium">{currentTrack.subtitle}</p>
            </div>
            <button 
              onClick={stopAudio}
              className="w-8 h-8 rounded-full bg-white/5 text-white/50 hover:text-red-400 hover:bg-red-400/10 flex items-center justify-center transition-all"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-4 justify-center">
              <button 
                onClick={playPrevious}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white/50 hover:text-primary hover:bg-primary/10 transition-all"
              >
                <SkipBack size={20} />
              </button>
              <button 
                onClick={togglePlayPause}
                className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-primary/20"
              >
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} className="ml-1" fill="currentColor" />}
              </button>
              <button 
                onClick={playNext}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white/50 hover:text-primary hover:bg-primary/10 transition-all"
              >
                <SkipForward size={20} />
              </button>
            </div>
            
            <div className="space-y-1">
              <div 
                className="h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer relative group"
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
                <div className="absolute top-0 right-0 bottom-0 left-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex justify-between text-[10px] text-white/40 font-mono tracking-tighter">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};
