import React, { createContext, useState, useContext, useRef, useEffect, useCallback } from 'react';

interface Track {
  title: string;
  subtitle: string;
  url: string;
  type: 'quran' | 'dua';
  id?: string | number;
  index?: number;
}

interface AudioContextType {
  isPlaying: boolean;
  currentTrack: Track | null;
  playlist: Track[];
  progress: number;
  duration: number;
  playTrack: (track: Track, list?: Track[]) => Promise<boolean>;
  togglePlayPause: () => Promise<void>;
  stopAudio: () => void;
  seek: (time: number) => void;
  playNext: () => void;
  playPrevious: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.setAttribute('referrerPolicy', 'no-referrer');
    }
  }, []);

  const playlistRef = useRef<Track[]>([]);
  const currentTrackRef = useRef<Track | null>(null);

  // Unlock audio on first interaction
  useEffect(() => {
    const unlock = () => {
      const audio = audioRef.current;
      // Play a silent/empty sound to unlock the audio context
      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
      }).catch(() => {
        // Ignore errors during unlock
      });
      document.removeEventListener('click', unlock);
      document.removeEventListener('touchstart', unlock);
    };
    document.addEventListener('click', unlock);
    document.addEventListener('touchstart', unlock);
    return () => {
      document.removeEventListener('click', unlock);
      document.removeEventListener('touchstart', unlock);
    };
  }, []);

  const safePlay = useCallback(async (): Promise<boolean> => {
    try {
      // Browsers require a user gesture to play audio.
      // Calling play() directly is more likely to succeed than waiting for a promise.
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        await playPromise;
      }
      return true;
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        console.error("Audio playback blocked by browser. Please interact with the page first.");
        setIsPlaying(false);
      } else if (err.name !== 'AbortError') {
        if (currentTrackRef.current?.type === 'dua') {
          console.error("Audio failed:", err);
        } else {
          console.error("Audio play error:", err);
        }
        setIsPlaying(false);
      }
      return false;
    }
  }, []);

  const playTrack = useCallback(async (track: Track, list: Track[] = []): Promise<boolean> => {
    if (!audioRef.current) return false;
    
    if (list.length > 0) {
      setPlaylist(list);
    }

    if (currentTrackRef.current?.url === track.url) {
      if (!audioRef.current.paused) {
        audioRef.current.pause();
        return true;
      } else {
        return await safePlay();
      }
    }

    // Stop any currently playing TTS
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // Stop current playback
    audioRef.current.pause();
    
    // Set new source directly
    audioRef.current.src = track.url;
    audioRef.current.load();
    
    setCurrentTrack(track);
    
    // Attempt to play immediately to preserve user gesture context
    return await safePlay();
  }, [safePlay]);

  const togglePlayPause = useCallback(async () => {
    if (!audioRef.current || !currentTrackRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      await safePlay();
    }
  }, [isPlaying, safePlay]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setCurrentTrack(null);
    setPlaylist([]);
    setProgress(0);
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  }, []);

  const playNext = useCallback(() => {
    const currentPlaylist = playlistRef.current;
    const track = currentTrackRef.current;
    if (currentPlaylist.length > 0 && track) {
      const currentIndex = currentPlaylist.findIndex(t => t.url === track.url);
      if (currentIndex !== -1 && currentIndex < currentPlaylist.length - 1) {
        playTrack(currentPlaylist[currentIndex + 1], currentPlaylist);
      }
    }
  }, [playTrack]);

  const playPrevious = useCallback(() => {
    const currentPlaylist = playlistRef.current;
    const track = currentTrackRef.current;
    if (currentPlaylist.length > 0 && track) {
      const currentIndex = currentPlaylist.findIndex(t => t.url === track.url);
      if (currentIndex !== -1 && currentIndex > 0) {
        playTrack(currentPlaylist[currentIndex - 1], currentPlaylist);
      }
    }
  }, [playTrack]);

  // Sync refs with state
  useEffect(() => {
    playlistRef.current = playlist;
  }, [playlist]);

  useEffect(() => {
    currentTrackRef.current = currentTrack;
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    
    const updateProgress = () => {
      setProgress(audio.currentTime);
    };
    
    const updateDuration = () => {
      setDuration(audio.duration);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      // Auto play next if in playlist
      const currentPlaylist = playlistRef.current;
      const track = currentTrackRef.current;
      
      if (currentPlaylist.length > 0 && track) {
        const currentIndex = currentPlaylist.findIndex(t => t.url === track.url);
        if (currentIndex !== -1 && currentIndex < currentPlaylist.length - 1) {
          playTrack(currentPlaylist[currentIndex + 1], currentPlaylist);
        }
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = (e: any) => {
      const audio = audioRef.current;
      const track = currentTrackRef.current;
      
      // Detailed error logging
      let errorMessage = "Unknown audio error";
      if (audio.error) {
        switch (audio.error.code) {
          case 1: errorMessage = "MEDIA_ELEMENT_ERROR: Fetching process aborted by user"; break;
          case 2: errorMessage = "MEDIA_ELEMENT_ERROR: Network error"; break;
          case 3: errorMessage = "MEDIA_ELEMENT_ERROR: Format error (Decoding failed)"; break;
          case 4: errorMessage = "MEDIA_ELEMENT_ERROR: Source not supported"; break;
        }
      }
      
      if (track?.type === 'dua') {
        console.error("Audio failed:", errorMessage);
        setIsPlaying(false);
        // Dispatch a custom event for track errors so DuaSection can fallback
        window.dispatchEvent(new CustomEvent('audio-track-error', { detail: { track } }));
        return;
      }
      
      console.error("Audio element error:", errorMessage, "URL:", audio.currentSrc || audio.src);
      
      // Retry logic for Quran audio if the primary source fails
      if (track && track.type === 'quran' && !audio.src.includes('everyayah.com')) {
        const match = audio.src.match(/\/(\d+)\.mp3$/);
        if (match) {
          const ayahNumber = match[1];
          console.log(`Retrying Quran audio with fallback source for ayah ${ayahNumber}...`);
          const fallbackUrl = audio.src.replace('/128/', '/64/');
          if (fallbackUrl !== audio.src) {
            audio.src = fallbackUrl;
            audio.load();
            safePlay();
            return;
          }
        }
      }

      setIsPlaying(false);
      
      // Dispatch a custom event for track errors
      if (track) {
        window.dispatchEvent(new CustomEvent('audio-track-error', { detail: { track } }));
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
    };
  }, [playTrack, safePlay]);


  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <AudioContext.Provider value={{ 
      isPlaying, 
      currentTrack, 
      playlist,
      progress, 
      duration, 
      playTrack, 
      togglePlayPause, 
      stopAudio, 
      seek,
      playNext,
      playPrevious
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
