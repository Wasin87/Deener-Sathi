import React, { useState } from 'react';
import { motion, useDragControls } from 'motion/react';
import { X, Play, Pause, SkipBack, SkipForward, Mic, ChevronRight } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../hooks/useLanguage';

interface AudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AudioModal: React.FC<AudioModalProps> = ({ isOpen, onClose }) => {
  const { isPlaying, togglePlayPause, playNext, playPrevious, progress, duration, seek, currentTrack } = useAudio();
  const { t, n } = useLanguage();
  const [isCompact, setIsCompact] = useState(window.innerWidth < 768);
  const controls = useDragControls();

  if (!isOpen) return null;

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;
  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${n(mins)}:${n(secs).toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      layout
      drag
      dragMomentum={false}
      dragElastic={0.1}
      initial={{ opacity: 0, scale: 0.9, x: 20, y: -100 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        width: isCompact ? 80 : 320,
        height: isCompact ? 100 : 'auto',
        borderRadius: isCompact ? '24px' : '32px'
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed z-[100] right-4 top-1/4 bg-white/95 dark:bg-dark-card/95 backdrop-blur-xl shadow-2xl border border-primary/20 overflow-hidden touch-none"
      style={{ cursor: 'grab' }}
      whileDrag={{ cursor: 'grabbing', scale: 1.02, zIndex: 101 }}
    >
      {isCompact ? (
        <div className="flex flex-col items-center justify-center h-full gap-1 p-2">
          <button
            onClick={() => setIsCompact(false)}
            className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-110 transition-transform"
          >
            <Mic size={24} />
          </button>
          <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">
            {t('previous')}
          </span>
          <button 
            onClick={onClose}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-sm"
          >
            <X size={10} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col">
          {/* Header */}
          <div className="p-3 bg-primary/5 flex justify-between items-center border-b border-primary/10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-secondary/60 dark:text-white/60">
                {t('audioPlayer')}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsCompact(true)}
                className="p-1.5 hover:bg-primary/10 rounded-lg transition-colors text-secondary/40 hover:text-primary"
                title={t('compact')}
              >
                <Mic size={14} />
              </button>
              <button 
                onClick={onClose} 
                className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-secondary/40 hover:text-red-500"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 flex flex-col gap-5">
            {currentTrack && (
              <div className="text-center space-y-1">
                <h4 className="text-sm font-bold text-secondary dark:text-white line-clamp-1">
                  {currentTrack.title}
                </h4>
                <p className="text-[11px] text-secondary/50 dark:text-white/40 line-clamp-1">
                  {currentTrack.subtitle}
                </p>
              </div>
            )}

            {/* Progress */}
            <div className="space-y-2">
              <div 
                className="h-2 w-full bg-primary/10 rounded-full overflow-hidden cursor-pointer relative group"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const percent = x / rect.width;
                  seek(percent * duration);
                }}
              >
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.1 }}
                />
                <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity bg-primary/5" />
              </div>
              <div className="flex justify-between text-[10px] font-medium text-secondary/40 dark:text-white/40">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6">
              <button 
                onClick={playPrevious} 
                className="p-2 text-secondary/60 dark:text-white/60 hover:text-primary transition-all hover:scale-110 active:scale-90"
              >
                <SkipBack size={20} fill="currentColor" />
              </button>
              
              <button 
                onClick={togglePlayPause} 
                className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/30"
              >
                {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
              </button>

              <button 
                onClick={playNext} 
                className="p-2 text-secondary/60 dark:text-white/60 hover:text-primary transition-all hover:scale-110 active:scale-90"
              >
                <SkipForward size={20} fill="currentColor" />
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
