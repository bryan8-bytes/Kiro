import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Music, User, Heart, ArrowRight, Book, Clock } from 'lucide-react'

// Video de fondo
import bgVideo from '../assets/fondo.mp4'

// GIFs de Cinnamoroll
const diarioImg = 'https://media1.tenor.com/m/1z09XoEOnccAAAAC/cinnamoroll-sanrio.gif'
const myProfileImg = 'https://media1.tenor.com/m/P5EJALTMklMAAAAC/cinnamoroll.gif'
const musicImg = 'https://media1.tenor.com/m/KGhFXJaFRNEAAAAC/sanrio-sanrio-characters.gif'
const recuerdosImg = 'https://media1.tenor.com/m/KOcnNt3Q4HIAAAAC/cinnamoroll-icinnamoroll.gif'

// Custom hook para el reloj en tiempo real
const useTime = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return time
}

const TiltCard = ({ children, className, to, bgContent }) => {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"])

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const Content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={`relative w-full h-full rounded-3xl border border-white/60 bg-white/60 shadow-[0_8px_32px_rgba(186,230,253,0.3)] backdrop-blur-xl group transition-colors duration-500 hover:bg-white/80 overflow-hidden ${className}`}
    >
      {bgContent && (
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          {bgContent}
        </div>
      )}

      <div style={{ transform: "translateZ(30px)" }} className="w-full h-full relative z-10 pointer-events-none">
        <div className="w-full h-full pointer-events-auto">
          {children}
        </div>
      </div>
      
      {/* Resplandor interno de hover */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-br from-white/5 to-transparent z-20" />
    </motion.div>
  )

  if (to) {
    return (
      <Link to={to} className="block w-full h-full perspective-1000">
        {Content}
      </Link>
    )
  }

  return (
    <div className="w-full h-full perspective-1000">
      {Content}
    </div>
  )
}

const Home = () => {
  const time = useTime()
  const [greeting, setGreeting] = useState('¡Hola')
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('bro_profile_v3')
      if (saved) return JSON.parse(saved)
      const oldSaved = localStorage.getItem('bro_profile_v2')
      if (oldSaved) return JSON.parse(oldSaved)
      const veryOldSaved = localStorage.getItem('bro_profile')
      return veryOldSaved ? JSON.parse(veryOldSaved) : null
    } catch (e) {
      return null
    }
  })

  // Formato de hora, día, mes y año
  const timeString = time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const dateString = time.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  useEffect(() => {
    const hour = time.getHours()
    if (hour < 12) setGreeting('¡Buenos días')
    else if (hour < 19) setGreeting('¡Buenas tardes')
    else setGreeting('¡Buenas noches')
  }, [time])

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('bro_profile_v3')
        if (saved) setProfile(JSON.parse(saved))
      } catch (e) {}
    }
    window.addEventListener('profileUpdated', handleUpdate)
    return () => window.removeEventListener('profileUpdated', handleUpdate)
  }, [])

  // Header staggered animation
  const headerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden text-slate-800 font-sans selection:bg-sky-200/50 pt-16">
      
      {/* Fondo de Video */}
      <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none fixed w-full h-full left-0 top-0 bg-sky-100 flex items-center justify-center">
        
        {/* Video en tamaño PC (relleno de fondo) */}
        <video 
          src={bgVideo}
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover blur-xl opacity-90 scale-110"
        />

        {/* Video en tamaño celular (frente) */}
        <video 
          src={bgVideo}
          autoPlay 
          loop 
          muted 
          playsInline 
          className="relative z-10 w-full h-full object-contain"
        />

        {/* Capa de cristal suave para legibilidad general */}
        <div className="absolute inset-0 z-20 bg-white/30 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex flex-col justify-center gap-y-12">
        
        {/* Encabezado Dinámico en Cuadro */}
        <motion.div 
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="w-full bg-white/60 backdrop-blur-xl border border-white/60 rounded-[3rem] p-8 sm:p-10 md:p-12 shadow-[0_8px_32px_rgba(186,230,253,0.3)] mb-6 flex flex-col items-center md:items-start text-center md:text-left gap-6 relative overflow-hidden group hover:bg-white/70 transition-colors duration-500"
        >
          {/* Brillo interno de hover */}
          <div className="absolute inset-0 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-br from-white/20 to-transparent z-0" />
          
          <motion.div variants={itemVariants} className="flex flex-col lg:flex-row items-center lg:items-center justify-between w-full gap-8 relative z-10">
            <div className="flex-1 min-w-0 w-full text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight break-words">
                <span className="text-sky-400 font-bold">{greeting},</span><br />
                <span className="bg-gradient-to-r from-sky-400 via-pink-400 to-sky-300 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(244,114,182,0.4)] block">
                  {profile?.name || 'kirocinnamorollfanboy'}! (≧◡≦)
                </span>
              </h1>
            </div>
            
            <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-[2.5rem] border-[6px] border-white/80 bg-white/60 backdrop-blur-md shadow-[0_15px_40px_rgba(186,230,253,0.5)] overflow-hidden shrink-0 p-1 relative flex items-center justify-center">
              {profile?.avatar ? (
                <img src={profile.avatar} alt="Perfil" className="w-full h-full object-cover rounded-[2rem] transition-transform duration-700 hover:scale-105" />
              ) : (
                <User size={64} className="text-slate-300 hover:scale-110 transition-transform duration-500" />
              )}
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-sky-300/20 to-pink-200/20 pointer-events-none mix-blend-overlay" />
            </div>
          </motion.div>

          <motion.p variants={itemVariants} className="text-base sm:text-lg text-slate-500 max-w-2xl font-bold mt-2 relative z-10 leading-relaxed">
            Explora tus nubes escondidas, escucha tus canciones favoritas y redescubre tu esencia más suave.
          </motion.p>
        </motion.div>

        {/* Sección Exclusiva del Reloj (Su propio cuadro grande) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full mt-4 mb-6"
        >
          <TiltCard className="p-8 md:p-12 flex flex-col justify-center items-center overflow-hidden relative text-center min-h-[40vh]">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-sky-300/20 via-transparent to-pink-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center justify-center w-full">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-white/80 to-white/60 border border-white/60 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(125,211,252,0.3)] backdrop-blur-md">
                <Clock className="w-8 h-8 md:w-10 md:h-10 text-sky-500 opacity-80" />
              </div>
              
              {/* Reloj Digital Segmentado */}
              <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-8 font-black tracking-tighter tabular-nums drop-shadow-2xl leading-none">
                
                {/* Horas */}
                <div className="flex flex-col items-center bg-white/80 border border-sky-200 rounded-3xl p-4 sm:p-6 md:p-8 backdrop-blur-md shadow-[0_0_30px_rgba(125,211,252,0.3)]">
                  <span className="text-6xl sm:text-7xl md:text-[8rem] lg:text-[10rem] text-transparent bg-clip-text bg-gradient-to-b from-sky-400 to-sky-600 drop-shadow-[0_0_15px_rgba(125,211,252,0.4)]">
                    {time.getHours().toString().padStart(2, '0')}
                  </span>
                  <span className="text-xs sm:text-sm md:text-base text-sky-500 uppercase tracking-widest mt-2 md:mt-4 font-bold">Horas</span>
                </div>

                <span className="text-5xl sm:text-6xl md:text-[6rem] text-sky-400/50 animate-pulse pb-8 sm:pb-12 md:pb-16">:</span>

                {/* Minutos */}
                <div className="flex flex-col items-center bg-white/80 border border-sky-200 rounded-3xl p-4 sm:p-6 md:p-8 backdrop-blur-md shadow-[0_0_30px_rgba(125,211,252,0.3)]">
                  <span className="text-6xl sm:text-7xl md:text-[8rem] lg:text-[10rem] text-transparent bg-clip-text bg-gradient-to-b from-sky-300 to-pink-400 drop-shadow-[0_0_15px_rgba(244,114,182,0.4)]">
                    {time.getMinutes().toString().padStart(2, '0')}
                  </span>
                  <span className="text-xs sm:text-sm md:text-base text-pink-400 uppercase tracking-widest mt-2 md:mt-4 font-bold">Minutos</span>
                </div>

                <span className="text-5xl sm:text-6xl md:text-[6rem] text-pink-400/50 animate-pulse pb-8 sm:pb-12 md:pb-16">:</span>

                {/* Segundos */}
                <div className="flex flex-col items-center bg-white/80 border border-sky-200 rounded-3xl p-4 sm:p-6 md:p-8 backdrop-blur-md shadow-[0_0_30px_rgba(125,211,252,0.3)]">
                  <span className="text-6xl sm:text-7xl md:text-[8rem] lg:text-[10rem] text-transparent bg-clip-text bg-gradient-to-b from-pink-300 to-rose-400 drop-shadow-[0_0_20px_rgba(251,113,133,0.4)]">
                    {time.getSeconds().toString().padStart(2, '0')}
                  </span>
                  <span className="text-xs sm:text-sm md:text-base text-rose-400 uppercase tracking-widest mt-2 md:mt-4 font-bold">Segundos</span>
                </div>

              </div>
              
              <div className="mt-10 flex flex-col items-center gap-2">
                <p className="text-xl md:text-3xl text-slate-600 font-bold capitalize tracking-wide drop-shadow-md">
                  {dateString}
                </p>
              </div>
            </div>
          </TiltCard>
        </motion.div>

        {/* Bento Grid Ordenado (2x2) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr w-full"
        >
          {/* Tarjeta Recuerdos */}
          <div className="h-72 sm:h-80 w-full">
            <TiltCard 
              to="/memories" 
              className=""
              bgContent={
                <>
                  <img 
                    src={recuerdosImg} 
                    alt="Recuerdos Cinnamoroll"
                    className="block w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/20 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-pink-200/20 group-hover:bg-pink-300/20 transition-colors duration-500 mix-blend-overlay pointer-events-none" />
                </>
              }
            >
              <div className="relative z-10 p-8 sm:p-10 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-300 to-pink-400 flex items-center justify-center shadow-[0_0_20px_rgba(244,114,182,0.4)] group-hover:scale-110 transition-transform duration-500">
                    <Heart className="w-8 h-8 text-white fill-white/50" />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/60 border border-white/80 flex items-center justify-center backdrop-blur-xl group-hover:bg-white transition-colors">
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:-rotate-45 transition-all" />
                  </div>
                </div>
                
                <div className="mt-8 drop-shadow-sm">
                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-700 mb-2 drop-shadow-sm">Galería de Recuerdos</h2>
                  <p className="text-slate-500 font-medium text-lg">Revive los momentos que quedan grabados en el tiempo.</p>
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Tarjeta Diario Secreto */}
          <div className="h-72 sm:h-80 w-full">
            <TiltCard 
              to="/diary"
              className=""
              bgContent={
                <>
                  <img 
                    src={diarioImg} 
                    alt="Diario Cinnamoroll"
                    className="block w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/20 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-amber-200/20 group-hover:bg-amber-300/20 transition-colors duration-500 mix-blend-overlay pointer-events-none" />
                </>
              }
            >
              <div className="relative z-10 p-8 sm:p-10 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.4)] group-hover:scale-110 transition-transform duration-500">
                    <Book className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/60 border border-white/80 flex items-center justify-center backdrop-blur-xl group-hover:bg-white transition-colors">
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:-rotate-45 transition-all" />
                  </div>
                </div>

                <div className="relative z-10 mt-8 drop-shadow-sm">
                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-700 mb-2 drop-shadow-sm">Diario Secreto</h2>
                  <p className="text-slate-500 font-medium text-lg">Tus pensamientos, ideas y metas por cumplir.</p>
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Tarjeta Música */}
          <div className="h-72 sm:h-80 w-full">
            <TiltCard 
              to="/music" 
              className=""
              bgContent={
                <>
                  <img 
                    src={musicImg} 
                    alt="Música Cinnamoroll"
                    className="block w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/20 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-purple-200/20 group-hover:bg-purple-300/20 transition-colors duration-500 mix-blend-overlay pointer-events-none" />
                </>
              }
            >
              <div className="relative z-10 p-8 sm:p-10 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-300 to-purple-400 flex items-center justify-center shadow-[0_0_20px_rgba(192,132,252,0.4)] group-hover:scale-110 transition-transform duration-500 backdrop-blur-md border border-white/60">
                    <Music className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/60 border border-white/80 flex items-center justify-center backdrop-blur-xl group-hover:bg-white transition-colors">
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:-rotate-45 transition-all" />
                  </div>
                </div>

                <div className="mt-8 drop-shadow-sm">
                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-700 mb-2 drop-shadow-sm">Tu Música</h2>
                  <p className="text-slate-500 font-medium text-lg">Las canciones que hacen latir tu corazón.</p>
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Tarjeta Perfil */}
          <div className="h-72 sm:h-80 w-full">
            <TiltCard 
              to="/profile" 
              className=""
              bgContent={
                <>
                  <img 
                    src={myProfileImg} 
                    alt="Perfil Cinnamoroll"
                    className="block w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/20 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-sky-200/20 group-hover:bg-sky-300/20 transition-colors duration-500 mix-blend-overlay pointer-events-none" />
                </>
              }
            >
              <div className="relative z-10 p-8 sm:p-10 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-300 to-cyan-300 flex items-center justify-center shadow-[0_0_20px_rgba(125,211,252,0.4)] group-hover:scale-110 transition-transform duration-500 overflow-hidden border border-white/60">
                    {profile?.avatar ? (
                      <img src={profile.avatar} alt="Perfil" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/60 border border-white/80 flex items-center justify-center backdrop-blur-md group-hover:bg-white transition-colors">
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:-rotate-45 transition-all" />
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-700 mb-2 truncate drop-shadow-sm">
                    {profile?.name ? `Perfil de ${profile.name}` : 'Tu Perfil'}
                  </h2>
                  <p className="text-slate-500 font-medium text-lg line-clamp-1 drop-shadow-sm">
                    {profile?.quote || 'Descubre más sobre la esencia de Kiro.'}
                  </p>
                </div>
              </div>
            </TiltCard>
          </div>

        </motion.div>

        {/* Cita Inferior en Cuadro */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="w-full text-center mt-6 pb-10"
        >
          <div className="inline-block bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl py-5 px-8 sm:px-12 shadow-[0_8px_32px_rgba(186,230,253,0.3)] hover:bg-white/70 transition-colors duration-500 group">
            <p className="text-sky-500 font-bold tracking-widest uppercase text-xs sm:text-sm drop-shadow-sm transition-transform duration-500 group-hover:scale-105">
              “Las nubes son suaves, <span className="text-pink-400 font-black">pero tú eres más tierno (≧◡≦)</span>”
            </p>
          </div>
        </motion.div>
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  )
}

export default Home