import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, User } from 'lucide-react'
import ProfileCard from '../components/ProfileCard'

const Profile = () => {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('bro_profile_v3')
    if (saved) {
      return JSON.parse(saved)
    }
    
    // Migración del perfil viejo si existe
    const oldSaved = localStorage.getItem('bro_profile_v2')
    const oldProfile = oldSaved ? JSON.parse(oldSaved) : {}

    return {
      name: oldProfile.name || 'kirocinnamorollfanboy',
      mood: oldProfile.mood || 'Soñadora 🌙',
      bio: oldProfile.bio || 'Una chica que convierte los momentos en estrellas. Apasionada por la música, los atardeceres y las risas sinceras.',
      avatar: oldProfile.avatar || '',
      quote: oldProfile.quote || 'Las estrellas no sueñan, tú les das sentido.',
      zodiacSign: oldProfile.zodiacSign || '✨ Universo',
      sections: [
        {
          id: 'sec-1',
          title: 'Top Canciones',
          type: 'list', // 'list', 'text', 'tags'
          items: oldProfile.topSongs || ['Canción 1', 'Canción 2', 'Canción 3'],
          icon: 'Music'
        },
        {
          id: 'sec-2',
          title: 'Mis Etiquetas',
          type: 'tags',
          items: oldProfile.tags || ['Soñadora', 'Única'],
          icon: 'Sparkles'
        }
      ]
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('bro_profile_v3', JSON.stringify(profile))
      window.dispatchEvent(new Event('profileUpdated'))
    } catch (e) {
      console.error('Error saving profile, might be too large.', e)
    }
  }, [profile])

  const handleUpdateProfile = (newProfileData) => {
    setProfile(newProfileData)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-24 pb-24 px-4 w-full flex justify-center relative z-10"
    >
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
      <div className="w-full max-w-5xl flex flex-col gap-6">
        {/* Encabezado en Cuadro */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_32px_rgba(186,230,253,0.3)] w-full relative overflow-hidden group hover:bg-white/70 transition-colors duration-500">
          <Link to="/home" className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 hover:bg-white rounded-full text-slate-500 hover:text-sky-500 transition-colors mb-6 text-xs uppercase tracking-widest font-bold shadow-sm border border-white/60 backdrop-blur-md">
            <ArrowLeft size={16} /> Volver a las nubes
          </Link>
          <div className="flex items-center gap-4">
            <User className="w-10 h-10 text-sky-400 drop-shadow-[0_0_15px_rgba(125,211,252,0.5)]" />
            <div>
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-sky-400 via-pink-400 to-sky-300 bg-clip-text text-transparent drop-shadow-sm">
                Tu Perfil
              </h1>
              <p className="text-slate-500 mt-2 text-lg font-bold">Refleja quién eres y todo lo que te hace especial.</p>
            </div>
          </div>
        </div>

        <ProfileCard 
          profile={profile}
          onUpdateProfile={handleUpdateProfile}
        />
      </div>
    </motion.div>
  )
}

export default Profile