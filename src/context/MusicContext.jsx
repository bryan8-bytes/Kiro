import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const MusicContext = createContext();

export const useMusic = () => useContext(MusicContext);

export const MusicProvider = ({ children }) => {
  const [songs, setSongs] = useState(() => {
    try {
      const saved = localStorage.getItem('bro_playlist_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error parsing playlist from localStorage', e);
    }
    return [
      { id: 1, title: '4morant', url: 'https://www.youtube.com/watch?v=qL5e2zP3M8I' },
      { id: 2, title: 'in the h3art', url: 'https://www.youtube.com/watch?v=7CzYsjyrJf8' },
      { id: 3, title: 'join me in death', url: 'https://www.youtube.com/watch?v=1V4AscLidWg' },
      { id: 4, title: 'nope your too late i already died', url: 'https://www.youtube.com/watch?v=I37l6C7UB5w' },
      { id: 5, title: 'i want things to be beutyfull', url: 'https://www.youtube.com/watch?v=kOcnj-0lzeA' }
    ];
  });

  const [currentSong, setCurrentSong] = useState(() => {
    try {
      const savedSong = localStorage.getItem('bro_current_song_v5');
      if (savedSong) {
        return JSON.parse(savedSong);
      }
    } catch (e) {}
    return null;
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [globalPlayerReady, setGlobalPlayerReady] = useState(false);

  // Nuevo estado para el control de tiempo
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seekToRequest, setSeekToRequest] = useState(null);

  // If no current song is set, default to first song on mount
  useEffect(() => {
    if (!currentSong && songs.length > 0) {
      setCurrentSong(songs[0]);
    }
  }, [songs, currentSong]);

  useEffect(() => {
    localStorage.setItem('bro_playlist_v5', JSON.stringify(songs));
  }, [songs]);

  useEffect(() => {
    if (currentSong) {
      localStorage.setItem('bro_current_song_v5', JSON.stringify(currentSong));
    } else {
      localStorage.removeItem('bro_current_song_v5');
    }
  }, [currentSong]);

  const addSong = useCallback((title, url) => {
    const newSong = {
      id: Date.now(),
      title: title.trim(),
      url: url.trim()
    };
    setSongs(prev => [...prev, newSong]);
  }, []);

  const deleteSong = useCallback((id) => {
    setSongs(prev => {
      const newSongs = prev.filter(s => s.id !== id);
      if (currentSong?.id === id) {
        setCurrentSong(newSongs[0] || null);
        setIsPlaying(false);
      }
      return newSongs;
    });
  }, [currentSong]);

  const reorderSongs = useCallback((newOrder) => {
    setSongs(newOrder);
  }, []);

  const selectSong = useCallback((song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  }, []);

  const seekTo = useCallback((seconds) => {
    setSeekToRequest(seconds);
    setCurrentTime(seconds); // Optimistic update
  }, []);

  const playNextSong = useCallback(() => {
    if (!currentSong || songs.length === 0) return;
    const idx = songs.findIndex(s => s.id === currentSong.id);
    if (idx !== -1) {
      const nextIdx = idx < songs.length - 1 ? idx + 1 : 0;
      const nextSong = songs[nextIdx];
      
      if (currentSong.id === nextSong.id) {
        // Es la misma canción (ej: solo hay 1 canción o repetimos la misma)
        seekTo(0);
        setIsPlaying(true);
      } else {
        selectSong(nextSong);
      }
    }
  }, [currentSong, songs, selectSong, seekTo]);

  const togglePlay = useCallback((forcedState = null) => {
    if (forcedState !== null) {
      setIsPlaying(forcedState);
    } else {
      setIsPlaying(prev => !prev);
    }
  }, []);


  return (
    <MusicContext.Provider value={{
      songs,
      currentSong,
      isPlaying,
      globalPlayerReady,
      setGlobalPlayerReady,
      currentTime,
      setCurrentTime,
      duration,
      setDuration,
      seekToRequest,
      setSeekToRequest,
      addSong,
      deleteSong,
      selectSong,
      playNextSong,
      togglePlay,
      seekTo,
      reorderSongs
    }}>
      {children}
    </MusicContext.Provider>
  );
};
