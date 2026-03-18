import React, { useState } from 'react';
import { motion, useDragControls } from 'motion/react';
import { X, Play, Pause, SkipBack, SkipForward, Mic } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';
import { useLanguage } from '../hooks/useLanguage';

interface AudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AudioModal: React.FC<AudioModalProps> = ({ isOpen, onClose }) => {
  const { isPlaying, togglePlay, playNext, playPrevious, mode, setMode } = useAudio();
  const { t } = useLanguage();
  const [isCompact, setIsCompact] = useState(false);
  const controls = useDragControls();

  if (!isOpen) return null;

  return (
    <motion.div
      drag
      dragControls={controls}
      dragListener={false}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      // Modal styling with responsive behavior
      className={`
        fixed z-50 
        top-20 
        right-4 md:right-6 
        bg-white dark:bg-dark-card 
        shadow-xl rounded-2xl border border-primary/10 overflow-hidden 
        w-full max-w-[200px] 
        md:w-64 
        ${isCompact ? 'md:w-36' : ''} 
        // Mobile-specific adjustments: smaller width and shifted left
        left-2 sm:left-auto sm:right-4
        sm:max-w-[180px] 
      `}
    >
      {/* Header with draggable area */}
      <div 
        className="p-2 cursor-grab active:cursor-grabbing bg-primary/5 flex justify-between items-center"
        onPointerDown={(e) => controls.start(e)}
      >
        <h3 className="font-bold text-secondary dark:text-white flex items-center gap-1.5 text-sm">
          <Mic size={14} /> {t('audioPlayer')}
        </h3>
        <button onClick={onClose} className="text-secondary/50 hover:text-secondary dark:text-white/50 dark:hover:text-white">
          <X size={14} />
        </button>
      </div>

      {/* Controls Section */}
      <div className="p-4 flex flex-col items-center gap-3">
        <div className="flex items-center gap-3">
          <button onClick={playPrevious} className="hidden md:block text-secondary dark:text-white hover:text-primary transition-colors">
            <SkipBack size={20} />
          </button>
          <button onClick={togglePlay} className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button onClick={playNext} className="hidden md:block text-secondary dark:text-white hover:text-primary transition-colors">
            <SkipForward size={20} />
          </button>
        </div>

        {/* Mode and Compact/Expand Buttons */}
        <div className="flex items-center gap-2 w-full justify-center">
          <button 
            onClick={() => setMode(mode === 'surah' ? 'single' : 'surah')}
            className={`text-[10px] font-bold px-2 py-1 rounded-full ${mode === 'surah' ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}
          >
            {mode === 'surah' ? t('fullSurah') : t('singleAyah')}
          </button>
          <button 
            onClick={() => setIsCompact(!isCompact)}
            className="text-[10px] font-bold px-2 py-1 rounded-full bg-secondary/10 dark:bg-white/10 text-secondary dark:text-white"
          >
            {isCompact ? t('expand') : t('compact')}
          </button>
        </div>
      </div>
    </motion.div>
  );
};