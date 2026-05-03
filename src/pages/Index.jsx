import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { PlayCircle, Star, Cloud } from 'lucide-react'
// Cinnamoroll GIF logo
const logoImg = 'https://media.tenor.com/J1y1DpxGzK0AAAAi/cinnamoroll.gif'

const Index = () => {
  const navigate = useNavigate()
  const containerRef = useRef(null)

  // Background spotlight position
  const mouseXPixel = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0)
  const mouseYPixel = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0)
  
  const smoothXPixel = useSpring(mouseXPixel, { damping: 40, stiffness: 200 })
  const smoothYPixel = useSpring(mouseYPixel, { damping: 40, stiffness: 200 })

  const handleMouseMovePixels = (e) => {
    mouseXPixel.set(e.clientX)
    mouseYPixel.set(e.clientY)
  }

  // Stagger and continuous floating text animation (no blur to prevent lag)
  const titleText = "Kiro"
  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const letterVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: "spring", 
        damping: 12, 
        stiffness: 100 
      } 
    }
  }

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMovePixels}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="w-full h-screen flex flex-col items-center justify-center relative overflow-hidden selection:bg-sky-200/50 font-sans"
    >
      {/* Fondo Animado de Colores: Estilo Cinnamoroll Vibrante */}
      <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none bg-gradient-to-br from-sky-300 via-cream-300 to-pink-300">
        {/* Nube Flotante Celeste/Blanca */}
        <motion.div
          animate={{
            x: ["0%", "15%", "-5%", "0%"],
            y: ["0%", "10%", "-10%", "0%"],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-white/70 blur-[120px] mix-blend-overlay"
        />
        {/* Nube Flotante Rosa Vibrante */}
        <motion.div
          animate={{
            x: ["0%", "-15%", "5%", "0%"],
            y: ["0%", "-10%", "15%", "0%"],
            scale: [1, 1.2, 0.8, 1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-pink-400/50 blur-[120px] mix-blend-overlay"
        />
        
        {/* Nube Flotante Blanca Suave */}
        <motion.div
          animate={{
            x: ["0%", "20%", "0%"],
            y: ["0%", "20%", "0%"],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ willChange: "transform" }}
          className="absolute -bottom-1/4 left-1/4 w-[80vw] h-[80vw] rounded-full bg-white/70 blur-[100px] mix-blend-overlay"
        />
      </div>

      {/* Luz que sigue el ratón (Optimizada sin CSS filters complejos) */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: useTransform(
            [smoothXPixel, smoothYPixel],
            ([x, y]) => `radial-gradient(circle 600px at ${x}px ${y}px, rgba(255,255,255,0.8), transparent 60%)`
          )
        }}
      />

      {/* Contenedor centralizado */}
      <div className="relative z-10 w-full px-6 flex flex-col items-center justify-center gap-y-10 sm:gap-y-12 h-full">
        
        {/* Logo */}
        <motion.img 
          src={logoImg} 
          alt="Kiro"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            y: [0, -15, 0], 
            scale: [1, 1.05, 1],
            opacity: 1 
          }}
          transition={{ 
            y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 1.2 },
          }}
          className="w-32 h-32 sm:w-48 sm:h-48 object-contain drop-shadow-[0_0_30px_rgba(186,230,253,0.8)] cursor-pointer mt-12"
          onError={(e) => {
            e.target.onerror = null
            e.target.style.display = 'none'
            const el = document.createElement('div')
            el.className = 'w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-br from-sky-300 to-pink-200 rounded-3xl transform rotate-45'
            e.target.parentElement.appendChild(el)
          }}
        />

        {/* Textos Principales */}
        <div className="text-center flex flex-col items-center gap-y-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-sky-500 font-extrabold tracking-[0.2em] sm:tracking-[0.3em] uppercase text-lg sm:text-xl md:text-2xl drop-shadow-[0_2px_10px_rgba(125,211,252,0.4)] flex items-center justify-center gap-3 sm:gap-4"
          >
            <motion.div
              animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.3, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
            </motion.div>
            
            <span>Bienvenido a tu espacio, nubesita</span>
            
            <motion.div
              animate={{ rotate: [0, -20, 20, 0], scale: [1, 1.3, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
            </motion.div>
          </motion.div>

          <motion.h1 
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            className="text-7xl sm:text-[9rem] md:text-[11rem] lg:text-[13rem] font-black tracking-tighter leading-tight flex justify-center py-4"
          >
            {titleText.split('').map((char, index) => (
              <motion.span 
                key={index} 
                variants={letterVariants}
                className="inline-block relative px-2 pb-4"
              >
                {/* Animación continua flotante suave (sin afectar el rendimiento) */}
                <motion.span
                  animate={{ y: [0, -8, 0] }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: index * 0.2 
                  }}
                  style={{ willChange: "transform" }}
                  className="inline-block bg-gradient-to-br from-sky-600 via-sky-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(125,211,252,0.4)] pb-4 pr-4"
                >
                  {char}
                </motion.span>
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-lg md:text-2xl text-slate-600 font-bold max-w-2xl px-4"
          >
            Donde los <span className="text-sky-400 font-black drop-shadow-[0_0_10px_rgba(125,211,252,0.4)]">sueños</span> flotan como <span className="text-pink-400 font-black drop-shadow-[0_0_10px_rgba(244,114,182,0.4)]">nubes</span> suaves.
          </motion.p>
        </div>

        {/* Botón Flotante Único */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="flex justify-center mt-4 w-full"
        >
          <motion.button
            whileHover={{ scale: 1.08, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/home')}
            className="group relative flex items-center justify-center gap-3 w-72 sm:w-auto px-16 py-6 bg-gradient-to-r from-sky-400 via-pink-400 to-sky-400 rounded-full text-white font-extrabold text-2xl overflow-hidden shadow-[0_10px_40px_rgba(56,189,248,0.7)] hover:shadow-[0_15px_50px_rgba(244,114,182,0.8)] transition-all duration-500 bg-[length:200%_auto] hover:bg-[position:right_center]"
          >
            <Cloud className="w-8 h-8 relative z-10 fill-white/40 drop-shadow-md" />
            <span className="relative z-10 tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">Flotar Adentro</span>
          </motion.button>
        </motion.div>

      </div>
    </motion.div>
  )
}

export default Index