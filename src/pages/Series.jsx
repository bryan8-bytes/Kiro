import { motion } from 'framer-motion'
import bgVideo from '../assets/fondo.mp4'
import { Tv } from 'lucide-react'

const Series = () => {
  return (
    <div className="h-screen w-full relative overflow-hidden text-slate-800 font-sans pt-20 pb-6 flex flex-col">
      <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none fixed w-full h-full left-0 top-0 bg-sky-100 flex items-center justify-center">
        <video src={bgVideo} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover blur-xl opacity-90 scale-110" />
        <video src={bgVideo} autoPlay loop muted playsInline className="relative z-10 w-full h-full object-contain opacity-30" />
        <div className="absolute inset-0 z-20 bg-white/40 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 w-full max-w-[98vw] 2xl:max-w-[1800px] mx-auto px-2 sm:px-6 flex-1 min-h-0 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_8px_32px_rgba(186,230,253,0.3)] mb-4 shrink-0 flex items-center gap-4 group"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-pink-300 to-amber-300 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
            <Tv className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-amber-500 drop-shadow-sm">
            Cinnamoroll La Serie
          </h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full flex-1 min-h-0 bg-white/40 backdrop-blur-md rounded-[1rem] sm:rounded-[2rem] border-[4px] sm:border-[8px] border-white/60 shadow-[0_15px_40px_rgba(186,230,253,0.4)] overflow-hidden"
        >
          <iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/FfGtivDRzP4?autoplay=1" 
            title="Cinnamoroll La Serie" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </motion.div>
      </div>
    </div>
  )
}

export default Series
