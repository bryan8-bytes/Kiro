import { motion } from 'framer-motion'
import { Play, Pause, Music, SkipBack, SkipForward, Rewind, FastForward } from 'lucide-react'
import { useMusic } from '../context/MusicContext'

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// Visualizador de audio fluido y sin lag (Aceleración por GPU con transform: scaleY)
const AudioVisualizer = ({ isPlaying }) => {
  return (
    <div className="w-full h-full flex items-center justify-center gap-1 sm:gap-1.5 px-4 overflow-hidden">
      <style>{`
        @keyframes soundWave {
          0% { transform: scaleY(0.15); opacity: 0.4; filter: brightness(0.8); }
          100% { transform: scaleY(1); opacity: 1; filter: brightness(1.2); }
        }
      `}</style>
      {Array.from({ length: 36 }).map((_, i) => {
        const duration = 0.35 + ((i * 7) % 6) * 0.08; 
        const delay = ((i * 11) % 15) * 0.05;
        const distanceToCenter = Math.abs(18 - i);
        const baseHeight = 90 - (distanceToCenter * 2) - ((i * 13) % 20); 
        
        return (
          <div
            key={i}
            className="w-1.5 sm:w-2 rounded-full bg-gradient-to-t from-sky-400 via-pink-300 to-sky-300 origin-center"
            style={{
              height: `${Math.max(20, baseHeight)}%`,
              animation: isPlaying ? `soundWave ${duration}s ease-in-out ${delay}s infinite alternate` : 'none',
              transform: isPlaying ? 'scaleY(0.15)' : 'scaleY(0.05)',
              transition: 'transform 0.5s ease-out',
              boxShadow: isPlaying ? '0 0 15px rgba(125,211,252,0.5)' : 'none',
            }}
          />
        );
      })}
    </div>
  );
};

const MusicPlayer = ({ currentSong, isPlaying, onPlayPause }) => {
  const { songs, currentTime, duration, seekTo, selectSong } = useMusic();

  if (!currentSong) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <Music size={48} className="opacity-40 mb-4 text-sky-400" />
        <p className="text-lg font-bold text-slate-500">Las nubes están silenciosas...</p>
        <p className="text-sm mt-1">Sube una canción para volar</p>
      </div>
    )
  }

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    seekTo(newTime);
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-8 flex flex-col items-center w-full">
      {/* Botón de Play Circular Gigante */}
      <div className="flex items-center justify-center gap-6 mt-4 relative z-10 w-full max-w-sm">
        {/* Previous Song */}
        <button 
          onClick={() => {
            const idx = songs.findIndex(s => s.id === currentSong.id);
            if (idx > 0) selectSong(songs[idx - 1]);
            else selectSong(songs[songs.length - 1]);
          }}
          className="p-3 rounded-full hover:bg-white/60 text-slate-400 hover:text-sky-500 transition-colors"
        >
          <SkipBack size={24} />
        </button>

        {/* Rewind 10s */}
        <button 
          onClick={() => seekTo(Math.max(0, currentTime - 10))}
          className="p-3 rounded-full hover:bg-white/60 text-slate-400 hover:text-sky-500 transition-colors"
        >
          <Rewind size={24} />
        </button>

        {/* Play/Pause Gigante - Efectos Premium Fluidos */}
        <div className="relative flex justify-center items-center mx-2 w-32 h-32">
          {/* Brillos expansivos (Breathing) suaves, sin reseteo brusco para evitar parpadeo */}
          {isPlaying && (
            <>
              <motion.div
                animate={{ 
                  scale: [1, 1.25, 1], 
                  opacity: [0.3, 0.7, 0.3] 
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-300 to-pink-300 blur-2xl"
                style={{ willChange: 'transform, opacity' }}
              />
              <motion.div
                animate={{ 
                  scale: [1, 1.4, 1], 
                  opacity: [0.2, 0.5, 0.2] 
                }}
                transition={{ 
                  duration: 4, 
                  delay: 0.5, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-200 to-sky-200 blur-3xl"
                style={{ willChange: 'transform, opacity' }}
              />
            </>
          )}
          
          {/* Botón Principal Glassmorphism */}
          <motion.div
            animate={{
              scale: isPlaying ? [1, 1.05, 1] : 1,
            }}
            transition={{
              duration: 3,
              repeat: isPlaying ? Infinity : 0,
              ease: "easeInOut"
            }}
            className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center cursor-pointer overflow-hidden border border-white/60 group shadow-[0_0_30px_rgba(125,211,252,0.3)] hover:shadow-[0_0_50px_rgba(125,211,252,0.5)] transition-all duration-500 bg-white/60 backdrop-blur-xl"
            onClick={onPlayPause}
            style={{ willChange: 'transform' }}
          >
            {/* Fondo giratorio orgánico tierno */}
            <motion.div 
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-50%] opacity-80 group-hover:opacity-100 transition-opacity duration-700"
              style={{
                background: 'conic-gradient(from 0deg, #bae6fd, #fbcfe8, #7dd3fc, #bae6fd)',
                filter: 'blur(10px)'
              }}
            />
            
            {/* Cristal Interior para profundidad */}
            <div className="absolute inset-1 rounded-full bg-white/40 backdrop-blur-md border border-white/60" />

            {/* Resplandor superior tipo cristal */}
            <div className="absolute inset-0 rounded-full shadow-[inset_0_4px_15px_rgba(255,255,255,0.8)] mix-blend-overlay" />

            <div className="relative z-10 drop-shadow-[0_2px_5px_rgba(125,211,252,0.5)]">
              {isPlaying ? (
                <Pause size={38} className="text-sky-600" />
              ) : (
                <Play size={38} className="text-sky-600 ml-2" />
              )}
            </div>
          </motion.div>
        </div>

        {/* Fast Forward 10s */}
        <button 
          onClick={() => seekTo(Math.min(duration || 0, currentTime + 10))}
          className="p-3 rounded-full hover:bg-white/60 text-slate-400 hover:text-sky-500 transition-colors"
        >
          <FastForward size={24} />
        </button>

        {/* Next Song */}
        <button 
          onClick={() => {
            const idx = songs.findIndex(s => s.id === currentSong.id);
            if (idx < songs.length - 1) selectSong(songs[idx + 1]);
            else selectSong(songs[0]);
          }}
          className="p-3 rounded-full hover:bg-white/60 text-slate-400 hover:text-sky-500 transition-colors"
        >
          <SkipForward size={24} />
        </button>
      </div>

      <div className="text-center space-y-2 max-w-sm w-full px-4">
        <h3 className="text-2xl sm:text-3xl font-black text-slate-700 drop-shadow-sm truncate">
          {currentSong.title}
        </h3>
        <p className="text-pink-400 text-sm sm:text-base font-bold uppercase tracking-widest drop-shadow-sm">
          Kiro • Canción de las Nubes
        </p>
      </div>

      {/* Barra de Progreso Interactiva */}
      <div className="w-full max-w-md px-4 mt-2 space-y-3">
        <div className="relative group cursor-pointer flex items-center h-4">
          <input 
            type="range" 
            min={0} 
            max={duration || 100} 
            value={currentTime || 0} 
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          {/* Background track */}
          <div className="w-full h-1.5 bg-white/40 rounded-full overflow-hidden relative shadow-inner">
            {/* Filled track */}
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-sky-400 to-pink-300 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          {/* Thumb */}
          <div 
            className="absolute h-4 w-4 bg-white rounded-full shadow-[0_0_10px_rgba(125,211,252,0.8)] border-2 border-sky-300 pointer-events-none transition-transform group-hover:scale-125"
            style={{ left: `calc(${progressPercentage}% - 8px)` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-slate-400 font-bold font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Ecualizador Visual fluido integrado en el reproductor */}
      <div className="w-full rounded-2xl overflow-hidden border border-white/60 shadow-[0_10px_30px_rgba(186,230,253,0.3)] bg-white/50 h-32 sm:h-40 relative mt-4">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-200/20 to-pink-200/20 opacity-50" />
        <div className="absolute inset-0 z-10">
          <AudioVisualizer isPlaying={isPlaying} />
        </div>
        {!isPlaying && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-slate-400 bg-white/60 backdrop-blur-sm transition-all duration-500">
            <Music size={40} className="mb-2 text-sky-400 opacity-60" />
            <p className="font-bold tracking-widest uppercase text-sm">Nubes Dormidas</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MusicPlayer