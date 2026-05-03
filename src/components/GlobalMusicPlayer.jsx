import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import { Disc, Play, Pause, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const GlobalMusicPlayer = () => {
  const { 
    currentSong, 
    isPlaying, 
    togglePlay, 
    setGlobalPlayerReady,
    setCurrentTime,
    setDuration,
    seekToRequest,
    setSeekToRequest,
    songs,
    selectSong,
    playNextSong
  } = useMusic();
  
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const playNextSongRef = useRef(playNextSong);
  const location = useLocation();
  const [showWidget, setShowWidget] = useState(true);

  // Mantener la referencia actualizada para evitar closures viejos en onStateChange
  useEffect(() => {
    playNextSongRef.current = playNextSong;
  }, [playNextSong]);

  const isMusicPage = location.pathname === '/music';

  const getVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = currentSong ? getVideoId(currentSong.url) : null;

  // 1. Iniciar API de YouTube nativa
  useEffect(() => {
    if (!videoId) return;

    const initPlayer = () => {
      if (playerRef.current) return; // Ya existe

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: videoId,
        playerVars: {
          autoplay: isPlaying ? 1 : 0,
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          playsinline: 1,
          origin: window.location.origin,
          rel: 0,
          fs: 0
        },
        events: {
          onReady: (event) => {
            setGlobalPlayerReady(true);
            setDuration(event.target.getDuration());
            if (isPlaying) {
              event.target.playVideo();
            }
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) togglePlay(true);
            if (event.data === window.YT.PlayerState.PAUSED) togglePlay(false);
            if (event.data === window.YT.PlayerState.ENDED) {
              playNextSongRef.current(); // Mover a la siguiente canción automáticamente
            }
          }
        }
      });
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }
    
    // Cleanup: Solo destruimos el player al desmontar el componente Global
    return () => {
    };
  }, []); // Solo ejecutar una vez para inyectar script

  // 2. Cambiar de video dinámicamente si la canción cambia
  useEffect(() => {
    if (playerRef.current && playerRef.current.loadVideoById && videoId) {
      const currentVideoUrl = playerRef.current.getVideoUrl ? playerRef.current.getVideoUrl() : '';
      if (!currentVideoUrl || !currentVideoUrl.includes(videoId)) {
        // loadVideoById reproduce automáticamente, cueVideoById solo prepara.
        // Llamar a playVideo justo después de loadVideoById rompe el iframe de YouTube.
        if (isPlaying) {
          playerRef.current.loadVideoById(videoId);
        } else {
          playerRef.current.cueVideoById(videoId);
        }
      } else {
        // Si es el mismo video, nos aseguramos de que empiece desde 0
        if (playerRef.current.getPlayerState() === window.YT.PlayerState.ENDED || isPlaying) {
          playerRef.current.seekTo(0, true);
          playerRef.current.playVideo();
        }
      }
    }
  }, [videoId, isPlaying]);

  // 3. Manejar Play/Pausa
  useEffect(() => {
    if (playerRef.current && playerRef.current.playVideo) {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isPlaying]);

  // 4. Manejar Seek (Adelantar/Rebobinar)
  useEffect(() => {
    if (playerRef.current && playerRef.current.seekTo && seekToRequest !== null) {
      playerRef.current.seekTo(seekToRequest, true);
      setSeekToRequest(null);
    }
  }, [seekToRequest, setSeekToRequest]);

  // 5. Seguimiento del Tiempo Exacto
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        if (playerRef.current && playerRef.current.getCurrentTime) {
          setCurrentTime(playerRef.current.getCurrentTime());
          const dur = playerRef.current.getDuration();
          if (dur > 0) setDuration(dur);
        }
      }, 100); // Actualización más rápida para sincronización perfecta
    }
    return () => clearInterval(interval);
  }, [isPlaying, setCurrentTime, setDuration]);

  if (!currentSong) return null;

  return (
    <>
      {/* Contenedor del Reproductor de YouTube Nativo (Siempre oculto para reproducir solo audio) */}
      <div className="fixed bottom-0 left-0 w-0 h-0 overflow-hidden opacity-0 pointer-events-none z-[-1]">
        <div ref={containerRef} style={{ width: '1px', height: '1px' }} />
      </div>

      {/* Widget Flotante del Disco */}
      <AnimatePresence>
        {!isMusicPage && showWidget && currentSong && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-4 bg-black/60 backdrop-blur-xl border border-white/10 p-3 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
          >
            <div 
              className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full cursor-pointer flex-shrink-0 group"
              onClick={() => togglePlay()}
            >
              {isPlaying && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-purple-500/30 rounded-full blur-md"
                />
              )}
              
              <motion.div
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="w-full h-full rounded-full bg-gradient-to-br from-gray-900 to-black border-2 border-white/10 shadow-[inset_0_0_10px_rgba(255,255,255,0.2)] flex items-center justify-center relative overflow-hidden"
              >
                <div className="absolute inset-1 rounded-full border border-white/5" />
                <div className="absolute inset-3 rounded-full border border-white/5" />
                
                <div className="w-1/3 h-1/3 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 shadow-inner flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-black/80" />
                </div>
              </motion.div>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-full">
                {isPlaying ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white ml-1" />}
              </div>
            </div>

            <div className="hidden sm:flex flex-col pr-4 max-w-[150px]">
              <p className="text-xs font-bold text-white truncate drop-shadow-sm">{currentSong.title}</p>
              <p className="text-[10px] text-fuchsia-300 uppercase tracking-wider truncate">
                {isPlaying ? 'Reproduciendo...' : 'Pausado'}
              </p>
            </div>
            
            <button 
              onClick={() => setShowWidget(false)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center border border-white/20 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors shadow-lg"
            >
              <X size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GlobalMusicPlayer;
