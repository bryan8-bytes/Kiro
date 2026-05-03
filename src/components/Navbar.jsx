import { NavLink, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Music, User, Heart, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'

// Logo personalizado de Kiro
import logoImg from '../assets/logo kiro.png'

const loadProfile = () => {
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
}

const Navbar = () => {
  const [profile, setProfile] = useState(loadProfile)

  useEffect(() => {
    const handleUpdate = () => setProfile(loadProfile())
    window.addEventListener('profileUpdated', handleUpdate)
    return () => window.removeEventListener('profileUpdated', handleUpdate)
  }, [])
  const links = [
    { to: '/home', icon: Home, label: 'Inicio' },
    { to: '/music', icon: Music, label: 'Música' },
    { to: '/profile', icon: User, label: 'Perfil' },
    { to: '/memories', icon: Heart, label: 'Recuerdos' },
  ]

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/40 backdrop-blur-xl border-b border-white/60 shadow-[0_10px_30px_rgba(125,211,252,0.15)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4 group cursor-pointer">
            <img src={logoImg} alt="Logo" className="h-12 w-auto object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
            <span className="font-extrabold text-4xl tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-pink-400 to-sky-500 group-hover:scale-105 transition-transform duration-300">
              Kiro
            </span>
          </div>
          
          <div className="flex gap-1 sm:gap-2">
            {links.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-2xl text-sm font-extrabold transition-all duration-300 hover:-translate-y-1 hover:scale-105 ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-sky-400 to-pink-400 shadow-[0_5px_15px_rgba(244,114,182,0.4)]'
                      : 'text-slate-500 hover:text-sky-500 hover:bg-white/60'
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  <Icon size={18} />
                  <span className="hidden sm:inline">{label}</span>
                </div>
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link to="/profile" className="flex items-center gap-3 bg-white/50 hover:bg-white/80 p-1.5 pr-4 rounded-full transition-all duration-300 border border-white/60 hover:border-sky-300 hover:shadow-[0_0_15px_rgba(125,211,252,0.4)] group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-300 to-pink-300 flex items-center justify-center overflow-hidden shadow-inner group-hover:shadow-[0_0_10px_rgba(244,114,182,0.6)] transition-all">
                {profile?.avatar ? (
                  <img src={profile.avatar} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  <User size={16} className="text-white" />
                )}
              </div>
              <span className="hidden md:block text-sm font-medium text-slate-600 group-hover:text-sky-600 truncate max-w-[150px]">
                {profile?.name || 'kirocinnamorollfanboy'}
              </span>
            </Link>
            
            <button
              onClick={() => {
                localStorage.removeItem('bro_authenticated')
                window.location.href = '/'
              }}
              className="p-2 rounded-full text-slate-400 hover:text-rose-500 hover:bg-white/80 transition-all duration-300 border border-transparent hover:border-rose-200 hover:shadow-[0_0_15px_rgba(251,113,133,0.3)] ml-2"
              title="Cerrar Sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar