import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, AlertTriangle, Key, CloudRain, Star, Heart, Cloud } from 'lucide-react'

import bgVideo from '../assets/cinnamorolls.mp4'
import error1Gif from '../assets/error1.gif'
import error2Gif from '../assets/error2.gif'
import error3Gif from '../assets/error3.gif'
import successGif from '../assets/success.gif'
import logoImg from '../assets/logo kiro.png'

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [attemptsLeft, setAttemptsLeft] = useState(3)
  const [videoOverlay, setVideoOverlay] = useState(null) // 'error1', 'error2', 'error3', 'success', null
  const [reactionMsg, setReactionMsg] = useState('')

  const CORRECT_USER = 'Kiro'
  const CORRECT_PASS = 'left4dead2'

  const handleSubmit = (e) => {
    e.preventDefault()

    if (username === CORRECT_USER && password === CORRECT_PASS) {
      setReactionMsg('¡Yay! Llave correcta. Entrando a las nubes, Kiro... (≧◡≦)')
      setVideoOverlay('success')
      // En lugar de onEnded (ya que es un GIF), usamos setTimeout
      setTimeout(() => {
        onLoginSuccess()
      }, 3000)
    } else {
      const newAttempts = attemptsLeft - 1
      setAttemptsLeft(newAttempts)

      if (newAttempts === 2) {
        setReactionMsg('Oops, esa no es la llave... Te quedan 2 intentos (｀_´)')
        setVideoOverlay('error1')
      } else if (newAttempts === 1) {
        setReactionMsg('¡Cuidado! Es tu último intento. ¡No me asustes! (╥_╥)')
        setVideoOverlay('error2')
      } else if (newAttempts <= 0) {
        setReactionMsg('¡Oh no! Puerta bloqueada. Cinnamoroll está llorando (╥﹏╥)')
        setVideoOverlay('error3')
      }

      // Cerrar el video de error forzosamente después de 10 segundos
      if (newAttempts > 0) {
        setTimeout(() => {
          setVideoOverlay(null)
          setReactionMsg('')
        }, 10000)
      }
    }
  }

  const videos = {
    error1: 'https://media1.tenor.com/m/orFLTNidP6YAAAAC/cinnamoroll.gif', // Intento 1 - GIF de Tenor
    error2: 'https://media1.tenor.com/m/LQH2wyi5Wi8AAAAC/cinnamoroll-sanrio.gif', // Intento 2 - GIF de Tenor
    error3: 'https://media1.tenor.com/m/NwdC14NHxRIAAAAC/cinnamoroll.gif', // Intento 3 - GIF de Tenor
    success: successGif
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans text-slate-800 px-4">
      {/* Fondo de Video Animado */}
      <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none fixed w-full h-full left-0 top-0">
        <video 
          src={bgVideo}
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute w-full h-full object-cover"
        />
        {/* Capa casi invisible solo para dar un pelín de legibilidad, pero dejando el video 100% nítido */}
        <div className="absolute inset-0 bg-white/10" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-[3rem] p-10 sm:p-14 shadow-[0_8px_32px_rgba(0,0,0,0.1)] relative overflow-hidden group hover:border-white/50 hover:bg-white/20 transition-all duration-500">
          
          {/* Brillo superior de la tarjeta animado */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-sky-400/50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-sky-300/40 rounded-full blur-[50px] pointer-events-none group-hover:bg-sky-300/60 transition-colors duration-700" />

          <div className="flex flex-col items-center mb-8 relative z-10">
            <motion.div 
              animate={{ 
                y: [-5, 5, -5],
                filter: attemptsLeft <= 0 ? 'drop-shadow(0 0 20px rgba(239,68,68,0.6))' : videoOverlay === 'success' ? 'drop-shadow(0 0 20px rgba(34,197,94,0.6))' : 'drop-shadow(0 0 15px rgba(125,211,252,0.6))' 
              }}
              transition={{ y: { repeat: Infinity, duration: 4, ease: "easeInOut" } }}
              className="mb-4 relative"
            >
              <img src={logoImg} alt="Kiro Logo" className="h-28 sm:h-32 w-auto object-contain drop-shadow-md" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-black tracking-[0.3em] uppercase text-transparent bg-clip-text bg-gradient-to-br from-sky-600 via-sky-400 to-pink-400 drop-shadow-[0_0_15px_rgba(125,211,252,0.4)] ml-2"
            >
              LOGIN
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sky-500 mt-2 text-[10px] font-bold tracking-[0.4em] uppercase drop-shadow-sm"
            >
              Portal Personal
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10" autoComplete="off">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Identificación</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-sky-500 text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={attemptsLeft <= 0 || videoOverlay === 'success'}
                  autoComplete="off"
                  data-lpignore="true"
                  className="w-full bg-white/50 border border-sky-100 focus:border-sky-400/50 focus:bg-white/80 focus:shadow-[0_0_15px_rgba(125,211,252,0.4)] rounded-2xl py-4 pl-12 pr-4 text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-300"
                  placeholder="Usuario"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Código de Acceso</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-sky-500 text-slate-400">
                  <Key className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={attemptsLeft <= 0 || videoOverlay === 'success'}
                  autoComplete="new-password"
                  data-lpignore="true"
                  className="w-full bg-white/50 border border-sky-100 focus:border-sky-400/50 focus:bg-white/80 focus:shadow-[0_0_15px_rgba(125,211,252,0.4)] rounded-2xl py-4 pl-12 pr-4 text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-300 tracking-[0.3em]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={attemptsLeft <= 0 || !username || !password || videoOverlay !== null}
              className="w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-sm transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed border-none shadow-[0_10px_30px_rgba(255,99,128,0.5)] hover:shadow-[0_15px_40px_rgba(96,200,255,0.7)] hover:-translate-y-1 mt-6"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-sky-500 to-pink-500 bg-[length:200%_auto] group-hover:bg-[position:right_center] transition-all duration-700" />
              <span className="relative z-10 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                {attemptsLeft <= 0 ? 'Bloqueado' : videoOverlay === 'success' ? 'Verificando...' : 'Entrar al Mundo'}
              </span>
            </button>
          </form>
        </div>
      </motion.div>

      {/* Reproductor de Video Fullscreen Overlay (MOVIDO FUERA DEL CONTENEDOR PARA EVITAR RECORTE) */}
      <AnimatePresence>
        {videoOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-sky-900/50 backdrop-blur-md px-4 gap-6"
          >
            {/* Mensaje de reacción estructurado (Caja más equilibrada) */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="w-11/12 max-w-2xl px-6 md:px-8 py-4 md:py-5 bg-white/95 backdrop-blur-xl border-4 border-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4"
            >
              {videoOverlay === 'success' ? (
                <Heart className="text-pink-400 w-8 h-8 md:w-10 md:h-10 shrink-0 fill-pink-400" />
              ) : (
                <CloudRain className="text-sky-400 w-8 h-8 md:w-10 md:h-10 shrink-0 animate-bounce" />
              )}
              <p className={`text-xl md:text-2xl font-black tracking-wide text-center md:text-left w-full md:w-auto break-words leading-snug ${videoOverlay === 'success' ? 'text-green-500' : 'text-red-400'}`}>
                {reactionMsg}
              </p>
            </motion.div>

            {/* El Video Grande (GIF a tamaño real con bordes redondos) */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 20 }}
              className="relative rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-[0_0_60px_rgba(255,255,255,0.4)] border-[6px] md:border-8 border-white/60 bg-sky-100/50 inline-flex items-center justify-center max-w-[95vw]"
            >
              <img
                src={videos[videoOverlay]}
                alt="Reacción Cinnamoroll"
                className="w-auto h-auto max-w-full max-h-[60vh] object-contain block"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Login
