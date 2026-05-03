import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image as ImageIcon, Video, Plus, X, Trash2, Calendar, Maximize2, ArrowLeft, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'

// --- IndexedDB Service ---
const DB_NAME = 'BroDB'
const STORE_NAME = 'memories'

const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = (e) => {
      const db = e.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
  })
}

const getAllMemoriesDB = async () => {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.getAll()
    request.onsuccess = () => {
      const data = request.result || []
      resolve(data.sort((a, b) => new Date(b.date) - new Date(a.date)))
    }
    request.onerror = () => reject(request.error)
  })
}

const saveMemoryDB = async (memory) => {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put(memory)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

const deleteMemoryDB = async (id) => {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.delete(id)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}
// ------------------------

const Memories = () => {
  const [memories, setMemories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [addType, setAddType] = useState('image') // 'image', 'video_link', 'video_local'
  const [newTitle, setNewTitle] = useState('')
  const [newVideoUrl, setNewVideoUrl] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef(null)

  // Cargar recuerdos desde IndexedDB al iniciar
  useEffect(() => {
    const loadMemories = async () => {
      try {
        const data = await getAllMemoriesDB()
        
        // Generar URLs temporales para archivos locales (Blob/File)
        const memoriesWithUrls = data.map(m => {
          if (m.type === 'video_local' && m.fileBlob) {
            return { ...m, objectUrl: URL.createObjectURL(m.fileBlob) }
          }
          return m
        })
        
        setMemories(memoriesWithUrls)
      } catch (e) {
        console.error("Error loading memories:", e)
      } finally {
        setIsLoading(false)
      }
    }
    loadMemories()

    // Cleanup object URLs on unmount
    return () => {
      memories.forEach(m => {
        if (m.objectUrl) URL.revokeObjectURL(m.objectUrl)
      })
    }
  }, [])

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const MAX_SIZE = 1200
          let width = img.width
          let height = img.height

          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width
            width = MAX_SIZE
          } else if (height > MAX_SIZE) {
            width *= MAX_SIZE / height
            height = MAX_SIZE
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL('image/jpeg', 0.8))
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    })
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    
    try {
      if (addType === 'image' && file.type.startsWith('image/')) {
        const base64Image = await compressImage(file)
        const newMemory = {
          id: Date.now().toString(),
          type: 'image',
          url: base64Image,
          title: newTitle.trim() || 'Nuevo Recuerdo',
          date: new Date().toISOString()
        }
        await saveMemoryDB(newMemory)
        setMemories(prev => [newMemory, ...prev])
      } 
      else if (addType === 'video_local' && file.type.startsWith('video/')) {
        const newMemory = {
          id: Date.now().toString(),
          type: 'video_local',
          fileBlob: file, // Guardamos el File object directo en IndexedDB
          title: newTitle.trim() || 'Mi Video',
          date: new Date().toISOString()
        }
        await saveMemoryDB(newMemory)
        // Generar URL temporal solo para mostrar en UI
        newMemory.objectUrl = URL.createObjectURL(file)
        setMemories(prev => [newMemory, ...prev])
      }
    } catch (error) {
      console.error("Error saving file:", error)
      alert("Hubo un error al guardar el archivo. Puede que sea demasiado grande.")
    } finally {
      setIsProcessing(false)
      resetAddState()
    }
  }

  const handleVideoLinkAdd = async () => {
    if (!newVideoUrl.trim()) return

    setIsProcessing(true)
    let embedUrl = newVideoUrl
    const ytMatch = newVideoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)
    if (ytMatch && ytMatch[1]) {
      embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`
    }

    const newMemory = {
      id: Date.now().toString(),
      type: 'video_link',
      url: embedUrl,
      title: newTitle.trim() || 'Video Web',
      date: new Date().toISOString()
    }

    try {
      await saveMemoryDB(newMemory)
      setMemories(prev => [newMemory, ...prev])
    } catch (e) {
      console.error(e)
    } finally {
      setIsProcessing(false)
      resetAddState()
    }
  }

  const resetAddState = () => {
    setIsAdding(false)
    setNewTitle('')
    setNewVideoUrl('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDelete = async (id) => {
    try {
      await deleteMemoryDB(id)
      setMemories(prev => prev.filter(m => m.id !== id))
    } catch (e) {
      console.error("Error deleting:", e)
    }
  }

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('es-ES', { 
      day: 'numeric', month: 'long', year: 'numeric' 
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col relative z-10"
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
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-sky-400 via-pink-400 to-sky-300 bg-clip-text text-transparent drop-shadow-sm">
            Galería de Recuerdos
          </h1>
          <p className="text-slate-500 mt-2 text-lg font-bold">Guarda tus fotos y videos como tesoros (sin límite).</p>
        </div>
        
        {!isAdding && (
          <div className="shrink-0 w-full md:w-auto">
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 md:py-4 rounded-[1.5rem] bg-gradient-to-r from-sky-400 to-pink-400 hover:from-sky-300 hover:to-pink-300 text-white font-black transition-all shadow-[0_5px_15px_rgba(125,211,252,0.4)] hover:scale-105"
            >
              <Plus size={20} /> Añadir Recuerdo
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="mb-12 overflow-hidden relative z-10"
          >
            <div className="bg-white/60 backdrop-blur-3xl border border-white/60 rounded-3xl p-6 md:p-8 shadow-sm relative">
              <button 
                onClick={resetAddState}
                className="absolute top-6 right-6 text-slate-400 hover:text-sky-500 bg-white/60 p-2 rounded-full transition-colors border border-white/60"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-2xl font-black text-slate-700 mb-6">Añadir Nuevo Recuerdo</h2>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <button 
                  onClick={() => setAddType('image')}
                  className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${addType === 'image' ? 'bg-pink-400 text-white' : 'bg-white/80 text-slate-500 hover:bg-white'}`}
                >
                  <ImageIcon size={20} /> Foto
                </button>
                <button 
                  onClick={() => setAddType('video_local')}
                  className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${addType === 'video_local' ? 'bg-sky-400 text-white' : 'bg-white/80 text-slate-500 hover:bg-white'}`}
                >
                  <Video size={20} /> Subir Video
                </button>
                <button 
                  onClick={() => setAddType('video_link')}
                  className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${addType === 'video_link' ? 'bg-purple-400 text-white' : 'bg-white/80 text-slate-500 hover:bg-white'}`}
                >
                  <Video size={20} /> Enlace (YouTube)
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Título de este recuerdo (Ej: Nuestro viaje)..."
                  className="w-full bg-white/80 border border-sky-100 focus:border-pink-400 px-4 py-3 rounded-xl text-slate-700 placeholder:text-slate-400 outline-none transition-colors shadow-inner font-bold"
                />

                {(addType === 'image' || addType === 'video_local') ? (
                  <div>
                    <input
                      type="file"
                      accept={addType === 'image' ? "image/*" : "video/*"}
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                      id="media-upload"
                      disabled={isProcessing}
                    />
                    <label 
                      htmlFor="media-upload"
                      className={`w-full border-2 border-dashed border-sky-200 bg-white/50 rounded-xl p-10 flex flex-col items-center justify-center transition-colors group ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:border-pink-400 cursor-pointer hover:bg-white/80'}`}
                    >
                      {isProcessing ? (
                        <Loader2 size={40} className="text-sky-400 animate-spin mb-4" />
                      ) : (
                        addType === 'image' 
                          ? <ImageIcon size={40} className="text-sky-300 group-hover:text-pink-400 mb-4 transition-colors" />
                          : <Video size={40} className="text-sky-300 group-hover:text-sky-500 mb-4 transition-colors" />
                      )}
                      <p className="text-slate-500 font-bold">
                        {isProcessing 
                          ? "Guardando nube..." 
                          : `Haz clic para subir un ${addType === 'image' ? 'foto' : 'video'} desde tu dispositivo`}
                      </p>
                    </label>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="text"
                      value={newVideoUrl}
                      onChange={(e) => setNewVideoUrl(e.target.value)}
                      placeholder="Pega el enlace de YouTube aquí..."
                      className="flex-1 bg-white/80 border border-sky-100 focus:border-sky-400 px-4 py-3 rounded-xl text-slate-700 placeholder:text-slate-400 outline-none transition-colors shadow-inner font-bold"
                    />
                    <button
                      onClick={handleVideoLinkAdd}
                      disabled={!newVideoUrl.trim() || isProcessing}
                      className="px-8 py-3 rounded-xl bg-sky-400 hover:bg-sky-500 disabled:opacity-50 text-white font-black transition-colors flex justify-center items-center shadow-sm"
                    >
                      {isProcessing ? <Loader2 size={20} className="animate-spin" /> : "Guardar"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid de Recuerdos */}
      {isLoading ? (
        <div className="flex justify-center py-20 relative z-10">
          <Loader2 size={40} className="text-pink-400 animate-spin" />
        </div>
      ) : memories.length === 0 && !isAdding ? (
        <div className="text-center py-20 bg-white/60 rounded-3xl border border-white/60 border-dashed shadow-sm relative z-10">
          <ImageIcon className="w-16 h-16 text-sky-300 mx-auto mb-4" />
          <p className="text-xl text-slate-500 font-bold">Aún no hay recuerdos en las nubes.</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence>
            {memories.map((memory) => (
              <motion.div
                key={memory.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-white border border-white/60 shadow-[0_5px_15px_rgba(125,211,252,0.3)] hover:shadow-[0_10px_25px_rgba(244,114,182,0.3)] transition-all duration-300"
              >
                {/* Media Content */}
                {memory.type === 'image' ? (
                  <div className="relative cursor-pointer" onClick={() => setSelectedImage(memory.url)}>
                    <img src={memory.url} alt={memory.title} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/40 transition-colors flex items-center justify-center backdrop-blur-[1px]">
                      <Maximize2 className="text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-sm" size={32} />
                    </div>
                  </div>
                ) : memory.type === 'video_local' ? (
                  <div className="relative w-full">
                    <video 
                      src={memory.objectUrl} 
                      controls 
                      className="w-full h-auto max-h-[400px] bg-black"
                    />
                  </div>
                ) : (
                  <div className="relative w-full pt-[56.25%]">
                    <iframe 
                      src={memory.url}
                      className="absolute top-0 left-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}

                {/* Info & Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/95 via-white/70 to-transparent p-4 pt-12 pointer-events-none">
                  <h3 className="text-slate-800 font-black text-lg leading-tight drop-shadow-sm">{memory.title}</h3>
                  <p className="text-slate-500 text-xs mt-1 flex items-center gap-1 font-bold">
                    <Calendar size={12} /> {formatDate(memory.date)}
                  </p>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(memory.id)}
                  className="absolute top-3 right-3 text-red-400 hover:text-red-500 bg-white/80 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm z-10"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Lightbox Modal para Imágenes */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          >
            <button 
              className="absolute top-6 right-6 text-slate-500 hover:text-slate-800 bg-white/60 hover:bg-white border border-slate-200 p-2 rounded-full transition-colors shadow-sm"
            >
              <X size={32} />
            </button>
            <motion.img 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={selectedImage} 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
              onClick={(e) => e.stopPropagation()} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Memories