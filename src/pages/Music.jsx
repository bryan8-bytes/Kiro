import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useMusic } from '../context/MusicContext'
import MusicPlayer from '../components/MusicPlayer'
import Playlist from '../components/Playlist'
import { Disc, Music as MusicIcon, Sparkles, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import bgVideo from '../assets/fondo.mp4'

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
        // Valores pseudo-aleatorios deterministas para que siempre se vea igual de bien
        const duration = 0.35 + ((i * 7) % 6) * 0.08; 
        const delay = ((i * 11) % 15) * 0.05;
        // La altura base varía creando picos en el centro y valles
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

const Music = () => {
  const { 
    songs, 
    currentSong, 
    isPlaying, 
    addSong, 
    deleteSong, 
    selectSong, 
    togglePlay,
    reorderSongs
  } = useMusic();

  return (
    <div className="min-h-screen w-full relative overflow-hidden text-slate-800 font-sans pt-24 pb-12">
      
      {/* Fondo Atmosférico Estilo Cinnamoroll (Más fuerte y animado) */}
      <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none bg-gradient-to-b from-sky-200 via-pink-100 to-sky-200 fixed w-full h-full left-0 top-0">
        {/* Nube Flotante Celeste Fuerte */}
        <motion.div
          animate={{ x: ["-5%", "15%", "-5%"], y: ["-5%", "20%", "-5%"], scale: [1, 1.2, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{ willChange: "transform" }}
          className="absolute -top-1/4 -left-1/4 w-[70vw] h-[70vw] rounded-full bg-sky-400/40 blur-[100px] mix-blend-multiply"
        />
        
        {/* Nube Flotante Rosa Fuerte */}
        <motion.div
          animate={{ x: ["10%", "-15%", "10%"], y: ["5%", "-20%", "5%"], scale: [1, 1.3, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{ willChange: "transform" }}
          className="absolute top-1/4 right-0 w-[60vw] h-[60vw] rounded-full bg-pink-400/40 blur-[120px] mix-blend-multiply"
        />

        {/* Nube Flotante Púrpura (Efecto extra) */}
        <motion.div
          animate={{ x: ["0%", "20%", "0%"], y: ["0%", "20%", "0%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          style={{ willChange: "transform" }}
          className="absolute -bottom-1/4 left-1/4 w-[80vw] h-[80vw] rounded-full bg-purple-300/40 blur-[100px] mix-blend-multiply"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col"
      >
        {/* Título de la Página - Versión Ultra Premium */}
        <div className="flex flex-col mb-10 mt-6 relative z-20 w-full">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            className="relative group w-full"
          >
            {/* Brillo de fondo expansivo */}
            <div className="absolute inset-[-10px] bg-gradient-to-r from-sky-300 via-pink-300 to-purple-300 rounded-[3rem] blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500 animate-pulse" />
            
            <div className="relative flex flex-col items-center md:items-start bg-white/60 backdrop-blur-xl px-8 sm:px-12 py-10 rounded-[3rem] border border-white/60 shadow-[0_8px_32px_rgba(186,230,253,0.3)] overflow-hidden w-full group-hover:bg-white/70 transition-colors duration-500">
              
              <div className="w-full flex justify-start mb-6">
                <Link to="/home" className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 hover:bg-white rounded-full text-slate-500 hover:text-sky-500 transition-colors text-xs uppercase tracking-widest font-bold shadow-sm border border-white/60 backdrop-blur-md">
                  <ArrowLeft size={16} /> Volver a las nubes
                </Link>
              </div>

              {/* Reflejo de cristal interno */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-100" />
              <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-sky-100/30 to-transparent pointer-events-none" />

              <div className="flex items-center gap-4 sm:gap-6 mb-2 relative z-10">
                {/* Contenedor del Disco con efecto vinilo */}
                <div className="relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-gradient-to-br from-pink-400 to-sky-400 rounded-full shadow-[0_0_20px_rgba(244,114,182,0.6)]">
                  <div className="absolute inset-1 bg-white/30 rounded-full backdrop-blur-sm" />
                  <Disc className="w-8 h-8 md:w-10 md:h-10 text-white animate-[spin_3s_linear_infinite] drop-shadow-md relative z-10" />
                </div>

                <div className="flex flex-col text-center md:text-left">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-pink-500 to-purple-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                    Melodías en las Nubes
                  </h1>
                </div>
                
                {/* Notas musicales flotantes */}
                <motion.div 
                  animate={{ y: [-5, 5, -5], rotate: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="hidden md:block text-pink-400"
                >
                  <MusicIcon size={32} className="drop-shadow-[0_0_10px_rgba(244,114,182,0.6)]" />
                </motion.div>
              </div>

              <div className="flex items-center gap-2 mt-4 relative z-10">
                <Sparkles size={20} className="text-sky-500 animate-pulse hidden sm:block" />
                <p className="text-sky-800 font-extrabold text-lg md:text-xl tracking-wide text-center md:text-left">
                  Música suave para volar con Cinnamoroll
                </p>
                <Sparkles size={20} className="text-sky-500 animate-pulse hidden sm:block" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 xl:gap-12 flex-1 min-h-[700px]">
          {/* Panel Izquierdo: Reproductor y Playlist Apilados */}
          <div className="flex flex-col h-full gap-8">
            {/* Reproductor */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/60 backdrop-blur-3xl border border-white/60 rounded-3xl p-8 shadow-[0_20px_40px_rgba(186,230,253,0.4)] flex-none relative overflow-hidden group hover:bg-white/80 transition-colors duration-500"
            >
              {/* Brillo interno superior */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-sky-300/50 to-transparent opacity-50" />
              
              <div className="flex items-center gap-3 mb-8">
                <div className="w-3 h-3 rounded-full bg-pink-400 shadow-[0_0_10px_rgba(244,114,182,0.8)] animate-pulse" />
                <h2 className="text-xl font-black text-sky-500 tracking-wide uppercase text-sm">
                  Ahora suena
                </h2>
              </div>
              
              <MusicPlayer 
                currentSong={currentSong}
                isPlaying={isPlaying}
                onPlayPause={() => togglePlay()}
              />
            </motion.div>

            {/* Playlist */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex-1 min-h-[400px] lg:h-auto"
            >
              <Playlist 
                songs={songs}
                currentSong={currentSong}
                onSelect={selectSong}
                onDelete={deleteSong}
                onAdd={addSong}
                onReorder={reorderSongs}
              />
            </motion.div>
          </div>

          {/* Panel Derecho: Video Automático sin audio completo */}
          <div className="hidden lg:block h-full w-full">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
              className="relative w-full h-full rounded-[3rem] overflow-hidden border-8 border-white/60 shadow-[0_20px_50px_rgba(244,114,182,0.4)] bg-sky-100/50"
            >
              {/* Video principal cubriendo todo el panel */}
              <video 
                src={bgVideo}
                autoPlay 
                loop 
                muted 
                playsInline 
                className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              
              {/* Overlay sutil de cristal para integrar el video */}
              <div className="absolute inset-0 bg-gradient-to-t from-pink-300/10 to-transparent pointer-events-none" />
              <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(255,255,255,0.6)] rounded-[2.5rem] pointer-events-none border border-white/40" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Music