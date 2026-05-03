import { useState } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { Plus, Trash2, Music as MusicIcon, PlayCircle, Settings2, Search, X, Loader2, GripVertical } from 'lucide-react'
import { searchYouTube } from '../services/youtube'

const Playlist = ({ songs, currentSong, onSelect, onDelete, onAdd, onReorder }) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [localSearchQuery, setLocalSearchQuery] = useState('')
  const [ytSearchQuery, setYtSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [error, setError] = useState('')

  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(localSearchQuery.toLowerCase())
  )

  const isSearchingLocally = localSearchQuery.trim().length > 0;

  const handleSearchYouTube = async (e) => {
    e.preventDefault()
    if (!ytSearchQuery.trim()) return

    setIsSearching(true)
    setError('')
    try {
      const results = await searchYouTube(ytSearchQuery)
      setSearchResults(results)
    } catch (err) {
      setError(err.message || 'Error al buscar en YouTube')
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleAddSearchResult = (result) => {
    onAdd(result.title, result.url)
    setShowAddForm(false)
    setYtSearchQuery('')
    setSearchResults([])
    setError('')
  }

  return (
    <div className="w-full h-full flex flex-col bg-white/60 backdrop-blur-3xl border border-white/60 rounded-3xl p-6 sm:p-8 shadow-[0_20px_40px_rgba(186,230,253,0.4)]">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-300 to-pink-300 flex items-center justify-center border border-white/60 shadow-sm">
              <Settings2 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-700 drop-shadow-sm tracking-tight">
              Mi Playlist
            </h2>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar en mi playlist..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/60 border border-white/60 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all text-sm shadow-inner"
            />
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-sky-400 to-pink-400 text-white font-bold text-sm shadow-[0_5px_15px_rgba(125,211,252,0.4)] hover:shadow-[0_8px_20px_rgba(244,114,182,0.5)] transition-all hover:-translate-y-0.5 active:scale-[0.98] flex-shrink-0"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Buscar en YouTube</span>
            <span className="sm:hidden">YouTube</span>
          </button>
        </div>
      </div>

      {/* Modal Didáctico para Agregar Canción */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white/90 backdrop-blur-3xl border border-white/60 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[0_20px_60px_rgba(125,211,252,0.4)] relative overflow-hidden"
            >
              {/* Brillos de fondo en el modal */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-pink-300/40 blur-[50px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-sky-300/40 blur-[50px] rounded-full pointer-events-none" />

              <button 
                onClick={() => setShowAddForm(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-2 bg-slate-100 hover:bg-slate-200 rounded-full"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center mb-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-pink-400 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(125,211,252,0.4)]">
                  <PlayCircle size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-black text-slate-700 mb-1">Buscar en YouTube</h3>
                <p className="text-slate-500 text-xs font-bold">
                  Busca cualquier canción y añádela directamente a tu nube.
                </p>
              </div>

              <div className="space-y-4 relative z-10">
                <form onSubmit={handleSearchYouTube} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="¿Qué quieres escuchar?"
                    value={ytSearchQuery}
                    onChange={(e) => setYtSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/80 border border-slate-200 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all text-sm shadow-inner"
                  />
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-pink-400 text-white font-black shadow-[0_5px_15px_rgba(125,211,252,0.4)] hover:shadow-[0_8px_20px_rgba(244,114,182,0.5)] transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSearching ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                  </button>
                </form>

                {error && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-pink-400 text-sm font-medium text-center bg-pink-500/10 py-2 rounded-lg border border-pink-500/20"
                  >
                    {error}
                  </motion.p>
                )}

                <div className="mt-4 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2 space-y-2">
                  {searchResults.map((result, idx) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex gap-3 p-2 rounded-xl hover:bg-sky-50 border border-transparent hover:border-sky-200 transition-all cursor-pointer group"
                      onClick={() => handleAddSearchResult(result)}
                    >
                      <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 relative shadow-sm border border-slate-100">
                        <img src={result.thumbnail} alt={result.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-white/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                          <Plus size={24} className="text-sky-600 drop-shadow-sm" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <p className="text-slate-700 text-sm font-bold line-clamp-2 leading-tight group-hover:text-pink-500 transition-colors">
                          {result.title}
                        </p>
                        <p className="text-slate-400 text-xs mt-1 font-bold truncate">
                          {result.author}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar max-h-[500px]">
        {filteredSongs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-12 text-slate-400">
            <div className="w-20 h-20 rounded-full bg-white/50 flex items-center justify-center mb-4 border border-white/60 shadow-inner">
              <MusicIcon size={32} className="text-sky-400 opacity-60" />
            </div>
            <p className="text-lg font-black text-slate-500">
              {localSearchQuery ? 'No se encontraron nubecitas' : 'Lista vacía'}
            </p>
            <p className="text-sm mt-1 font-bold">
              {localSearchQuery ? 'Prueba con otro nombre' : 'Añade tu primera canción especial'}
            </p>
          </div>
        ) : (
          <Reorder.Group 
            axis="y" 
            values={isSearchingLocally ? filteredSongs : songs} 
            onReorder={isSearchingLocally ? () => {} : onReorder}
            className="space-y-2 h-full"
          >
            {filteredSongs.map((song, idx) => {
              const isPlaying = currentSong?.id === song.id
              return (
                <Reorder.Item
                  key={song.id}
                  value={song}
                  dragListener={!isSearchingLocally}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: isSearchingLocally ? idx * 0.05 : 0 }}
                  className={`group flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-colors duration-300 relative bg-white/80 shadow-sm ${
                    isPlaying
                      ? 'bg-gradient-to-r from-sky-100 to-pink-50 border border-sky-200 shadow-[0_5px_15px_rgba(125,211,252,0.3)]'
                      : 'border border-white/60 hover:bg-white hover:border-sky-100 hover:shadow-md'
                  }`}
                  onClick={() => onSelect(song)}
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 overflow-hidden">
                    {!isSearchingLocally && (
                      <div className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-sky-400 transition-colors opacity-30 group-hover:opacity-100 flex-shrink-0">
                        <GripVertical size={20} />
                      </div>
                    )}
                    <div className={`relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-inner border border-white ${isPlaying ? 'bg-sky-200/50 text-sky-500' : 'bg-slate-50 text-slate-400 group-hover:text-pink-400 group-hover:bg-pink-50'}`}>
                    {isPlaying ? (
                      <div className="flex items-end justify-center gap-[2px] h-4">
                        <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-sky-400 rounded-full" />
                        <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1 bg-pink-400 rounded-full" />
                        <motion.div animate={{ height: [6, 10, 6] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1 bg-sky-400 rounded-full" />
                      </div>
                    ) : (
                      <PlayCircle size={24} className="ml-0.5" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`font-black truncate transition-colors ${isPlaying ? 'text-sky-600' : 'text-slate-600 group-hover:text-pink-500'}`}>
                      {song.title}
                    </p>
                    <p className="text-slate-400 text-xs uppercase tracking-wider mt-0.5 font-bold">
                      Audio Track
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(song.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2.5 rounded-xl hover:bg-red-50 text-red-400 hover:text-red-500 transition-all flex-shrink-0"
                >
                  <Trash2 size={20} />
                </button>
              </Reorder.Item>
            )
          })}
          </Reorder.Group>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(125, 211, 252, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(125, 211, 252, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(244, 114, 182, 0.4);
        }
      `}</style>
    </div>
  )
}

export default Playlist