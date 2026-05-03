import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import { getLyricsForVideo } from '../data/lyrics';
import { Mic2 } from 'lucide-react';

const LiveLyrics = () => {
  const { currentSong, currentTime } = useMusic();
  const [lyrics, setLyrics] = useState(null);
  const [activeLine, setActiveLine] = useState(-1);

  const getVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  useEffect(() => {
    if (currentSong) {
      const vid = getVideoId(currentSong.url);
      setLyrics(getLyricsForVideo(vid));
      setActiveLine(-1);
    }
  }, [currentSong]);

  useEffect(() => {
    if (lyrics && currentTime >= 0) {
      let currentIdx = -1;
      for (let i = 0; i < lyrics.length; i++) {
        if (currentTime >= lyrics[i].time) {
          currentIdx = i;
        } else {
          break;
        }
      }
      if (currentIdx !== activeLine) {
        setActiveLine(currentIdx);
      }
    }
  }, [currentTime, lyrics, activeLine]);

  if (!lyrics) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-white/40 space-y-4">
        <Mic2 size={48} className="opacity-20" />
        <p className="text-sm font-medium tracking-wider uppercase">Letras no disponibles</p>
        <div className="flex gap-1 items-end h-8 mt-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              animate={{ height: ["20%", "100%", "20%"] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
              className="w-1.5 bg-white/20 rounded-t-full"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-full relative overflow-hidden flex flex-col justify-center items-center" 
      style={{ 
        maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)' 
      }}
    >
      <motion.div
        className="absolute w-full flex flex-col"
        animate={{ y: -(activeLine * 60) }}
        transition={{ type: "spring", stiffness: 90, damping: 20 }}
        style={{ top: 'calc(50% - 30px)' }}
      >
        {lyrics.map((line, idx) => {
          const isActive = idx === activeLine;
          const isPast = idx < activeLine;
          
          let words = [];
          if (line.text) {
            words = line.text.split(' ');
          }

          let duration = 3;
          const totalChars = line.text.replace(/\s/g, '').length || 1;
          
          if (isActive) {
             const currentLineTime = line.time;
             const nextLineTime = activeLine + 1 < lyrics.length ? lyrics[activeLine + 1].time : currentLineTime + 4;
             
             // Estimar duración de voz (aprox 10 caracteres por segundo)
             const estimatedVoiceDuration = totalChars / 10;
             // Nunca tomar más del tiempo que hay hasta la siguiente línea
             duration = Math.min(nextLineTime - currentLineTime, Math.max(estimatedVoiceDuration, 1.5));
          }

          let accumulatedChars = 0;

          return (
            <motion.div
              key={idx}
              className="text-center w-full h-[60px] flex items-center justify-center px-4"
              animate={{ 
                opacity: isActive ? 1 : isPast ? 0 : 0.4,
                scale: isActive ? 1.1 : 0.95
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-wrap justify-center gap-x-2">
                {words.map((word, wordIdx) => {
                  const wordChars = word.length;
                  let isWordActive = false;
                  
                  if (isActive) {
                    const startDelay = (accumulatedChars / totalChars) * duration;
                    const wordStartTime = line.time + startDelay;
                    isWordActive = currentTime >= wordStartTime;
                  } else if (isPast) {
                    isWordActive = true;
                  }
                  
                  accumulatedChars += wordChars;

                  return (
                    <span 
                      key={wordIdx} 
                      className={`font-black text-2xl md:text-3xl lg:text-4xl transition-all duration-150 tracking-tight ${
                        isActive 
                          ? isWordActive 
                            ? 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]' 
                            : 'text-white/30'
                          : 'text-white/40 text-xl md:text-2xl'
                      }`}
                      style={{
                        textShadow: isActive && isWordActive ? '0 0 20px rgba(236,72,153,0.8)' : 'none',
                        display: 'inline-block'
                      }}
                    >
                      {word}
                    </span>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default LiveLyrics;
