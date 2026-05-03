import { motion, AnimatePresence } from 'framer-motion'
import { Edit2, Sparkles, Star, Camera, Plus, X, Music, Quote, Trash2 } from 'lucide-react'
import { useState, useRef } from 'react'

const ProfileCard = ({ profile, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false)
  const fileInputRef = useRef(null)
  
  // Temporary state for the editor
  const [tempProfile, setTempProfile] = useState(profile)

  const handleSave = () => {
    onUpdateProfile(tempProfile)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempProfile(profile)
    setIsEditing(false)
  }

  const handleChange = (field, value) => {
    setTempProfile(prev => ({ ...prev, [field]: value }))
  }

  // Comprimir imagen usando Canvas para evitar errores de QuotaExceeded
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const img = new Image()
        img.src = reader.result
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const MAX_WIDTH = 400
          const MAX_HEIGHT = 400
          let width = img.width
          let height = img.height
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height
              height = MAX_HEIGHT
            }
          }
          
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)
          
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7) // Compresión al 70%
          setTempProfile(prev => ({ ...prev, avatar: dataUrl }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // --- Dynamic Sections Logic ---
  const handleAddSection = () => {
    const newSection = {
      id: `sec-${Date.now()}`,
      title: 'Nueva Sección',
      type: 'list',
      items: ['Nuevo elemento'],
      content: '',
      icon: 'Star'
    }
    setTempProfile(prev => ({ ...prev, sections: [...(prev.sections || []), newSection] }))
  }

  const handleRemoveSection = (id) => {
    setTempProfile(prev => ({ ...prev, sections: prev.sections.filter(s => s.id !== id) }))
  }

  const handleSectionChange = (id, field, value) => {
    setTempProfile(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === id ? { ...s, [field]: value } : s)
    }))
  }

  const handleSectionItemChange = (secId, index, value) => {
    setTempProfile(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id === secId) {
          const newItems = [...s.items]
          newItems[index] = value
          return { ...s, items: newItems }
        }
        return s
      })
    }))
  }

  const handleAddSectionItem = (secId) => {
    setTempProfile(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id === secId) {
          return { ...s, items: [...(s.items || []), ''] }
        }
        return s
      })
    }))
  }

  const handleRemoveSectionItem = (secId, index) => {
     setTempProfile(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id === secId) {
          return { ...s, items: s.items.filter((_, i) => i !== index) }
        }
        return s
      })
    }))
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Botonera Superior */}
      <div className="flex justify-end w-full mb-2">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-sky-400 to-pink-400 hover:from-sky-500 hover:to-pink-500 text-white font-black transition-all shadow-[0_8px_20px_rgba(125,211,252,0.5)] hover:scale-105"
          >
            <Edit2 size={18} /> Modo Editor
          </button>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 rounded-full bg-white/60 hover:bg-white border border-slate-200 text-slate-500 font-bold transition-all shadow-sm"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-sky-400 to-pink-400 hover:from-sky-300 hover:to-pink-300 text-white font-black transition-all shadow-[0_5px_15px_rgba(125,211,252,0.4)]"
            >
              Guardar Cambios
            </button>
          </div>
        )}
      </div>

      <motion.div
        layout
        className="bg-white/90 backdrop-blur-3xl border-4 border-white/80 rounded-[3rem] overflow-hidden shadow-[0_25px_60px_rgba(186,230,253,0.6)] relative"
      >
        {/* Efectos decorativos de fondo en lugar de portada */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-sky-300/40 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-300/50 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-300/50 rounded-full blur-[100px] pointer-events-none" />

        <div className="px-6 md:px-10 py-10 relative z-10">
          
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            className="hidden" 
          />

          {/* Sección Superior: Avatar y Título Centrado */}
            <div className="flex flex-col items-center text-center mb-10 w-full pt-4 relative z-10">
              <div className="relative group mb-6">
                <div 
                  className={`w-36 h-36 md:w-44 md:h-44 rounded-full bg-gradient-to-br from-sky-300 to-pink-300 flex items-center justify-center shadow-[0_0_40px_rgba(125,211,252,0.4)] border-4 border-white overflow-hidden ${isEditing ? 'cursor-pointer hover:border-pink-300 transition-colors' : ''}`}
                  onClick={() => isEditing && fileInputRef.current?.click()}
                >
                  {tempProfile.avatar ? (
                    <img src={tempProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-7xl md:text-8xl">☁️</span>
                  )}
                </div>
                
                {isEditing && (
                  <div 
                    className="absolute inset-0 rounded-full bg-white/60 flex flex-col items-center justify-center border-4 border-transparent backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera size={32} className="text-sky-500 mb-2" />
                    <span className="text-xs text-sky-600 font-bold uppercase tracking-widest">Subir Foto</span>
                  </div>
                )}
              </div>

              <div className="w-full max-w-2xl">
                {!isEditing ? (
                  <>
                    <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-sky-400 via-pink-400 to-sky-300 bg-clip-text text-transparent drop-shadow-sm">
                      {tempProfile.name}
                    </h1>
                    <p className="text-xl text-pink-400 mt-2 font-black">{tempProfile.mood}</p>
                    
                    <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-4 text-slate-500">
                      {tempProfile.zodiacSign && (
                        <div className="flex items-center gap-2 bg-cream-100/80 px-4 py-2 rounded-full border border-sky-300 shadow-sm">
                          <Sparkles size={16} className="text-sky-500" />
                          <span className="font-bold">{tempProfile.zodiacSign}</span>
                        </div>
                      )}
                    </div>
                    
                    {tempProfile.quote && (
                      <div className="mt-6 italic text-slate-500 text-lg flex items-center justify-center gap-2 font-bold">
                        <Quote size={16} className="text-sky-300" />
                        "{tempProfile.quote}"
                        <Quote size={16} className="text-sky-300" />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-4 w-full">
                    <div className="flex flex-col md:flex-row gap-4">
                      <input
                        type="text"
                        value={tempProfile.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Tu Nombre"
                        className="w-full px-4 py-3 bg-cream-50 border border-sky-300 rounded-xl text-2xl font-black text-center text-slate-700 focus:border-sky-500 focus:outline-none transition-colors shadow-inner"
                      />
                      <input
                        type="text"
                        value={tempProfile.mood}
                        onChange={(e) => handleChange('mood', e.target.value)}
                        placeholder="Estado de ánimo (Ej. Soñadora)"
                        className="w-full px-4 py-3 bg-cream-50 border border-pink-300 rounded-xl text-pink-500 font-bold text-center focus:border-pink-500 focus:outline-none transition-colors shadow-inner"
                      />
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4">
                      <input
                        type="text"
                        value={tempProfile.zodiacSign}
                        onChange={(e) => handleChange('zodiacSign', e.target.value)}
                        placeholder="Signo, Aura o Fecha Especial (Ej. ☁️ Nubes)"
                        className="w-full md:w-1/3 px-4 py-2 bg-white/80 border border-sky-100 rounded-xl text-slate-600 font-bold focus:border-sky-400 focus:outline-none transition-colors shadow-inner"
                      />
                      <input
                        type="text"
                        value={tempProfile.quote}
                        onChange={(e) => handleChange('quote', e.target.value)}
                        placeholder="Tu frase favorita..."
                        className="w-full md:w-2/3 px-4 py-2 bg-white/80 border border-sky-100 rounded-xl text-slate-600 font-bold focus:border-pink-400 focus:outline-none transition-colors shadow-inner"
                      />
                    </div>
                  </div>
              )}
            </div>
          </div>

          {/* Grid de Contenido (Dinámico) */}
          <div className="grid md:grid-cols-[1.5fr_1fr] gap-8 border-t border-sky-100 pt-10">
            
            {/* Columna Izquierda */}
            <div className="space-y-8">
              {/* Biografía Siempre Fija */}
              <div className="bg-white rounded-[2rem] p-8 border-2 border-sky-100 shadow-[0_10px_30px_rgba(186,230,253,0.3)] relative group hover:border-sky-200 transition-colors">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-sky-100 to-transparent rounded-bl-full rounded-tr-[2rem] opacity-50" />
                <h3 className="text-xl font-black text-slate-700 mb-4 flex items-center gap-2 relative z-10">
                  <Star size={22} className="text-sky-400" /> Sobre Mí
                </h3>
                {!isEditing ? (
                  <p className="text-slate-600 font-bold leading-relaxed text-lg">
                    {tempProfile.bio}
                  </p>
                ) : (
                  <textarea
                    value={tempProfile.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    rows={4}
                    placeholder="Escribe algo sobre ti..."
                    className="w-full px-4 py-3 bg-white border border-sky-100 rounded-xl text-slate-700 font-bold focus:border-pink-400 focus:outline-none resize-none shadow-inner"
                  />
                )}
              </div>

              {/* Secciones Dinámicas de Columna Izquierda (Índices pares) */}
              {(tempProfile.sections || []).filter((_, i) => i % 2 === 0).map((section) => (
                <div key={section.id} className="bg-white rounded-[2rem] p-8 border-2 border-pink-100 shadow-[0_10px_30px_rgba(244,114,182,0.2)] relative group hover:border-pink-200 transition-colors">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-100 to-transparent rounded-bl-full rounded-tr-[2rem] opacity-50" />

                  {isEditing && (
                    <button onClick={() => handleRemoveSection(section.id)} className="absolute top-4 right-4 p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-100 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  )}
                  
                  {!isEditing ? (
                    <h3 className="text-xl font-black text-slate-700 mb-5 flex items-center gap-2 relative z-10">
                      <Star size={22} className="text-pink-400" /> {section.title}
                    </h3>
                  ) : (
                    <div className="flex items-center gap-3 mb-4 mr-10">
                      <select 
                        value={section.type} 
                        onChange={(e) => handleSectionChange(section.id, 'type', e.target.value)}
                        className="bg-white border border-sky-100 rounded-lg px-2 py-1 text-slate-600 font-bold text-sm shadow-inner"
                      >
                        <option value="list">Lista Vertical</option>
                        <option value="tags">Etiquetas</option>
                        <option value="text">Texto Libre</option>
                      </select>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => handleSectionChange(section.id, 'title', e.target.value)}
                        className="flex-1 bg-transparent text-lg font-black text-slate-700 focus:outline-none border-b border-sky-200 pb-1"
                      />
                    </div>
                  )}

                  {/* Render based on type */}
                  {section.type === 'text' && (
                    !isEditing ? (
                      <p className="text-slate-600 font-bold leading-relaxed">{section.content}</p>
                    ) : (
                      <textarea
                        value={section.content}
                        onChange={(e) => handleSectionChange(section.id, 'content', e.target.value)}
                        rows={3}
                        className="w-full bg-white border border-sky-100 rounded-xl p-3 text-slate-700 font-bold focus:outline-none shadow-inner"
                        placeholder="Contenido de esta sección..."
                      />
                    )
                  )}

                  {section.type === 'list' && (
                    <div className="space-y-3">
                      {(section.items || []).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 bg-cream-100/50 p-3 rounded-xl border border-sky-200 hover:bg-sky-100 transition-colors shadow-sm">
                          {!isEditing ? (
                            <>
                              <div className="w-2 h-2 rounded-full bg-pink-400" />
                              <p className="text-slate-700 font-bold truncate">{item}</p>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleRemoveSectionItem(section.id, idx)} className="text-slate-400 hover:text-red-400"><X size={16}/></button>
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleSectionItemChange(section.id, idx, e.target.value)}
                                className="flex-1 bg-transparent text-slate-700 font-bold focus:outline-none"
                                placeholder={`Elemento ${idx + 1}`}
                              />
                            </>
                          )}
                        </div>
                      ))}
                      {isEditing && (
                        <button onClick={() => handleAddSectionItem(section.id)} className="w-full flex items-center justify-center gap-2 p-2 border border-dashed border-sky-200 rounded-xl text-slate-500 hover:text-sky-500 hover:border-sky-300 font-bold transition-colors bg-white/50">
                          <Plus size={16} /> Añadir Elemento
                        </button>
                      )}
                    </div>
                  )}

                  {section.type === 'tags' && (
                    <div className="flex flex-wrap gap-2">
                      <AnimatePresence>
                        {(section.items || []).map((item, idx) => (
                          <motion.div key={idx} className="bg-sky-100 text-sky-600 px-4 py-2 rounded-full border border-sky-200 text-sm font-black flex items-center gap-2 shadow-sm">
                            {!isEditing ? item : (
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleSectionItemChange(section.id, idx, e.target.value)}
                                className="bg-transparent text-sky-600 focus:outline-none w-20"
                              />
                            )}
                            {isEditing && (
                              <button onClick={() => handleRemoveSectionItem(section.id, idx)} className="hover:bg-sky-200 rounded-full p-0.5 transition-colors">
                                <X size={14} />
                              </button>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {isEditing && (
                        <button onClick={() => handleAddSectionItem(section.id)} className="bg-white border border-dashed border-sky-200 px-3 py-1 rounded-full text-slate-400 hover:text-sky-500 hover:border-sky-300 font-bold transition-colors flex items-center">
                          <Plus size={16} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Columna Derecha (Índices impares) */}
            <div className="space-y-6">
              {(tempProfile.sections || []).filter((_, i) => i % 2 !== 0).map((section) => (
                <div key={section.id} className="bg-white rounded-[2rem] p-8 border-2 border-sky-100 shadow-[0_10px_30px_rgba(186,230,253,0.3)] relative group hover:border-sky-200 transition-colors">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-sky-100 to-transparent rounded-bl-full rounded-tr-[2rem] opacity-50" />
                  {isEditing && (
                    <button onClick={() => handleRemoveSection(section.id)} className="absolute top-4 right-4 p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-100 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  )}
                  
                  {!isEditing ? (
                    <h3 className="text-xl font-black text-slate-700 mb-5 flex items-center gap-2 relative z-10">
                      <Sparkles size={22} className="text-sky-400" /> {section.title}
                    </h3>
                  ) : (
                    <div className="flex items-center gap-3 mb-4 mr-10">
                      <select 
                        value={section.type} 
                        onChange={(e) => handleSectionChange(section.id, 'type', e.target.value)}
                        className="bg-white border border-sky-100 rounded-lg px-2 py-1 text-slate-600 font-bold text-sm w-12 flex-none shadow-inner"
                      >
                        <option value="list">📝</option>
                        <option value="tags">🏷️</option>
                        <option value="text">A</option>
                      </select>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => handleSectionChange(section.id, 'title', e.target.value)}
                        className="flex-1 bg-transparent text-lg font-black text-slate-700 focus:outline-none border-b border-sky-200 pb-1"
                      />
                    </div>
                  )}

                  {/* Render based on type */}
                  {section.type === 'text' && (
                    !isEditing ? (
                      <p className="text-slate-600 font-bold leading-relaxed">{section.content}</p>
                    ) : (
                      <textarea
                        value={section.content}
                        onChange={(e) => handleSectionChange(section.id, 'content', e.target.value)}
                        rows={3}
                        className="w-full bg-white border border-sky-100 rounded-xl p-3 text-slate-700 font-bold focus:outline-none shadow-inner"
                        placeholder="Contenido..."
                      />
                    )
                  )}

                  {section.type === 'list' && (
                    <div className="space-y-3">
                      {(section.items || []).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-cream-100/50 p-2 rounded-xl border border-pink-200 hover:bg-pink-100 transition-colors shadow-sm">
                          {!isEditing ? (
                            <>
                              <div className="w-1.5 h-1.5 rounded-full bg-sky-400 flex-none" />
                              <p className="text-slate-700 font-bold truncate text-sm">{item}</p>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleRemoveSectionItem(section.id, idx)} className="text-slate-400 hover:text-red-400"><X size={14}/></button>
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleSectionItemChange(section.id, idx, e.target.value)}
                                className="flex-1 bg-transparent text-slate-700 font-bold focus:outline-none text-sm w-full"
                                placeholder={`Item ${idx + 1}`}
                              />
                            </>
                          )}
                        </div>
                      ))}
                      {isEditing && (
                        <button onClick={() => handleAddSectionItem(section.id)} className="w-full flex items-center justify-center gap-2 p-2 border border-dashed border-sky-200 rounded-xl text-slate-500 font-bold hover:text-sky-500 hover:border-sky-300 transition-colors text-sm bg-white/50">
                          <Plus size={16} /> Añadir
                        </button>
                      )}
                    </div>
                  )}

                  {section.type === 'tags' && (
                    <div className="flex flex-wrap gap-2">
                      <AnimatePresence>
                        {(section.items || []).map((item, idx) => (
                          <motion.div key={idx} className="bg-pink-100 text-pink-600 px-3 py-1.5 rounded-full border border-pink-200 text-sm font-black flex items-center gap-1 shadow-sm">
                            {!isEditing ? item : (
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleSectionItemChange(section.id, idx, e.target.value)}
                                className="bg-transparent text-pink-600 focus:outline-none w-16 text-sm"
                              />
                            )}
                            {isEditing && (
                              <button onClick={() => handleRemoveSectionItem(section.id, idx)} className="hover:bg-pink-200 rounded-full p-0.5 transition-colors">
                                <X size={12} />
                              </button>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {isEditing && (
                        <button onClick={() => handleAddSectionItem(section.id)} className="bg-white border border-dashed border-sky-200 px-2 py-1 rounded-full text-slate-400 hover:text-sky-500 hover:border-sky-300 font-bold transition-colors flex items-center">
                          <Plus size={14} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Botón para Añadir Nueva Sección */}
              {isEditing && (
                <button
                  onClick={handleAddSection}
                  className="w-full flex items-center justify-center gap-2 p-4 bg-white/60 hover:bg-white border-2 border-dashed border-sky-200 rounded-2xl text-slate-500 hover:text-sky-500 font-black transition-all shadow-sm"
                >
                  <Plus size={20} /> Añadir Nueva Sección
                </button>
              )}
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ProfileCard