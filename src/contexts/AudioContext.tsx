import React, { createContext, useState, useContext, useRef, useEffect } from 'react';

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
  playTrack: (track: Track, list?: Track[]) => Promise<void>;
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
  const playlistRef = useRef<Track[]>([]);
  const currentTrackRef = useRef<Track | null>(null);

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

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.pause();
    };
  }, []);

  const safePlay = async () => {
    try {
      if (audioRef.current.readyState >= 2) { // HAVE_CURRENT_DATA
        await audioRef.current.play();
      } else {
        // Wait for enough data to play
        return new Promise<void>((resolve, reject) => {
          const onCanPlay = async () => {
            audioRef.current.removeEventListener('canplay', onCanPlay);
            try {
              await audioRef.current.play();
              resolve();
            } catch (err) {
              reject(err);
            }
          };
          audioRef.current.addEventListener('canplay', onCanPlay);
          // Also handle error
          const onError = (e: any) => {
            audioRef.current.removeEventListener('canplay', onCanPlay);
            audioRef.current.removeEventListener('error', onError);
            reject(e);
          };
          audioRef.current.addEventListener('error', onError);
        });
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error("Audio play error:", err);
      }
    }
  };

  const playTrack = async (track: Track, list: Track[] = []) => {
    if (!audioRef.current) return;
    
    if (list.length > 0) {
      setPlaylist(list);
    }

    if (currentTrackRef.current?.url === track.url) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        await safePlay();
      }
      return;
    }

    audioRef.current.pause();
    audioRef.current.src = track.url;
    audioRef.current.load(); // Start loading the new source
    
    setCurrentTrack(track);
    await safePlay();
  };

  const togglePlayPause = async () => {
    if (!audioRef.current || !currentTrackRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      await safePlay();
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTrack(null);
    setPlaylist([]);
    setProgress(0);
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const playNext = () => {
    const currentPlaylist = playlistRef.current;
    const track = currentTrackRef.current;
    if (currentPlaylist.length > 0 && track) {
      const currentIndex = currentPlaylist.findIndex(t => t.url === track.url);
      if (currentIndex !== -1 && currentIndex < currentPlaylist.length - 1) {
        playTrack(currentPlaylist[currentIndex + 1], currentPlaylist);
      }
    }
  };

  const playPrevious = () => {
    const currentPlaylist = playlistRef.current;
    const track = currentTrackRef.current;
    if (currentPlaylist.length > 0 && track) {
      const currentIndex = currentPlaylist.findIndex(t => t.url === track.url);
      if (currentIndex !== -1 && currentIndex > 0) {
        playTrack(currentPlaylist[currentIndex - 1], currentPlaylist);
      }
    }
  };

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
