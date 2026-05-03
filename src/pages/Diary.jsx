import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Trash2, Calendar, Book, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const MOODS = ['✨', '🌟', '🥺', '🦋', '🌧️', '🔥', '🌙', '💔', '💖']

const Diary = () => {
  const [entries, setEntries] = useState(() => {
    try {
      const saved = localStorage.getItem('bro_diary')
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      return []
    }
  })

  const [isComposing, setIsComposing] = useState(false)
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: '✨'
  })

  useEffect(() => {
    localStorage.setItem('bro_diary', JSON.stringify(entries))
  }, [entries])

  const handleSaveEntry = () => {
    if (!newEntry.content.trim()) return

    const entry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      title: newEntry.title.trim() || 'Querido Diario...',
      content: newEntry.content,
      mood: newEntry.mood
    }

    setEntries(prev => [entry, ...prev])
    setNewEntry({ title: '', content: '', mood: '✨' })
    setIsComposing(false)
  }

  const handleDeleteEntry = (id) => {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  const groupedEntries = entries.reduce((acc, entry) => {
    const dateObj = new Date(entry.date)
    const dateKey = dateObj.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(entry)
    return acc
  }, {})

  const formatTime = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 pb-24 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto flex flex-col"
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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 relative z-10">
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_32px_rgba(186,230,253,0.3)] flex-1 w-full relative overflow-hidden group hover:bg-white/70 transition-colors duration-500">
          <Link to="/home" className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 hover:bg-white rounded-full text-slate-500 hover:text-sky-500 transition-colors mb-6 text-xs uppercase tracking-widest font-bold shadow-sm border border-white/60 backdrop-blur-md">
            <ArrowLeft size={16} /> Volver a las nubes
          </Link>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-sky-400 via-pink-400 to-sky-300 bg-clip-text text-transparent flex items-center gap-4 drop-shadow-sm">
            <Book className="w-10 h-10 text-sky-400 drop-shadow-[0_0_15px_rgba(125,211,252,0.5)]" />
            Diario en las Nubes
          </h1>
          <p className="text-slate-500 mt-2 text-lg font-bold">Tus pensamientos más tiernos y momentos especiales.</p>
        </div>
        
        {!isComposing && (
          <div className="shrink-0 w-full md:w-auto">
            <button
              onClick={() => setIsComposing(true)}
              className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 md:py-4 rounded-[1.5rem] bg-gradient-to-r from-sky-400 to-pink-400 hover:from-sky-300 hover:to-pink-300 text-white font-black transition-all shadow-[0_5px_15px_rgba(125,211,252,0.4)] hover:scale-105"
            >
              <Plus size={20} /> Escribir Hoy
            </button>
          </div>
        )}
      </div>

      {/* Editor Modal / Inline */}
      <AnimatePresence>
        {isComposing && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="mb-12 overflow-hidden relative z-20"
          >
            <div className="bg-white/60 backdrop-blur-3xl border border-white/60 rounded-3xl p-6 md:p-8 shadow-[0_20px_40px_rgba(186,230,253,0.4)] relative">
              <button 
                onClick={() => setIsComposing(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-sky-500 bg-white/60 p-2 rounded-full transition-colors border border-white/60"
              >
                <X size={20} />
              </button>
              
              <div className="flex flex-col gap-6 max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <div className="flex gap-2 bg-white/50 p-2 rounded-2xl border border-white/60 flex-wrap justify-center flex-none shadow-sm">
                    {MOODS.map(mood => (
                      <button
                        key={mood}
                        onClick={() => setNewEntry(prev => ({ ...prev, mood }))}
                        className={`text-2xl p-2 rounded-xl transition-all ${newEntry.mood === mood ? 'bg-sky-200/50 scale-110 shadow-[0_0_10px_rgba(125,211,252,0.5)]' : 'hover:bg-white/60 opacity-50 hover:opacity-100'}`}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={newEntry.title}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Título (Opcional)"
                    className="flex-1 w-full bg-transparent border-b-2 border-sky-200 focus:border-pink-400 px-4 py-3 text-2xl font-black text-slate-700 placeholder:text-slate-400 outline-none transition-colors"
                  />
                </div>

                <textarea
                  value={newEntry.content}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="¿Qué tienes en mente hoy?..."
                  rows={8}
                  className="w-full bg-white/80 border border-sky-100 rounded-2xl p-6 text-lg text-slate-700 placeholder:text-slate-400 focus:border-pink-400/50 outline-none transition-colors resize-none leading-relaxed shadow-inner font-bold"
                />

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveEntry}
                    disabled={!newEntry.content.trim()}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-pink-400 hover:from-sky-300 hover:to-pink-300 disabled:opacity-50 text-white font-black uppercase tracking-widest transition-all shadow-[0_5px_15px_rgba(125,211,252,0.4)]"
                  >
                    Guardar Pensamiento
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de Entradas Agrupadas por Fecha */}
      <div className="space-y-12 relative z-10">
        <AnimatePresence>
          {entries.length === 0 && !isComposing ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-20 bg-white/60 rounded-3xl border border-white/60 border-dashed shadow-sm"
            >
              <Book className="w-16 h-16 text-sky-300 mx-auto mb-4" />
              <p className="text-xl text-slate-500 font-black">Aún no has escrito nada.</p>
              <p className="text-slate-400 font-bold mt-2">Este es tu espacio seguro en las nubes.</p>
            </motion.div>
          ) : (
            Object.keys(groupedEntries).map((dateKey) => (
              <div key={dateKey} className="space-y-6">
                <h2 className="text-xl font-black text-pink-400 sticky top-20 backdrop-blur-xl py-4 border-b border-sky-100 z-20 capitalize drop-shadow-sm flex items-center gap-2">
                  <Calendar size={20} /> {dateKey}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
                  {groupedEntries[dateKey].map((entry) => (
                    <motion.div
                      key={entry.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-white/80 backdrop-blur-3xl border border-white/60 rounded-3xl p-6 md:p-8 shadow-md hover:bg-white transition-all group relative flex flex-col h-full hover:shadow-lg hover:-translate-y-1 hover:border-sky-100"
                    >
                      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="text-red-400 hover:text-red-500 bg-white p-2 rounded-full transition-all shadow-sm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-4xl filter drop-shadow-sm">{entry.mood}</span>
                        <div className="flex flex-col">
                          <h3 className="text-xl font-black text-slate-700 capitalize pr-8 leading-tight">{entry.title}</h3>
                          <p className="text-xs text-sky-500 flex items-center gap-1 font-bold mt-1">
                            {formatTime(entry.date)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 text-slate-600 font-medium leading-relaxed whitespace-pre-wrap flex-1">
                        {entry.content}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))
          )}
        </AnimatePresence>
      </div>

    </motion.div>
  )
}

export default Diary
