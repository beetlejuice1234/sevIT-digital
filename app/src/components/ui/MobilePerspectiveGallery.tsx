import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export interface PerspectiveProject {
  id: number;
  title: string;
  tag: string;
  description: string;
  images: string[];
  glow: string;
}

interface Props {
  items: PerspectiveProject[];
}

function AutoCycleImage({ images, alt, glow }: { images: string[]; alt: string; glow: string }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => setIdx(prev => (prev + 1) % images.length), 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Blurred background fill — replaces black bars with color-bleed */}
      {images.map((src, i) => (
        <img
          key={`blur-${src}`}
          src={src}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: i === idx ? 0.55 : 0,
            transform: 'scale(1.3)',
            filter: 'blur(50px) saturate(1.4)',
            transition: 'opacity 0.7s ease-out',
            pointerEvents: 'none',
          }}
          loading="lazy"
        />
      ))}
      {/* Actual contained images */}
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={alt}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ${
            i === idx ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ zIndex: 1 }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" style={{ zIndex: 2 }} />
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: glow, zIndex: 2 }} />
      {images.length > 1 && (
        <div className="absolute top-4 right-4 flex gap-1.5">
          {images.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === idx ? 'bg-white scale-125' : 'bg-white/25'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MobilePerspectiveGallery({ items }: Props) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => {
        const isFullWidth = i === 0 || i === 3 || i === 4 || i === 7;
        const isPairStart = i === 1 || i === 5;
        const isPairEnd = i === 2 || i === 6;

        if (isPairEnd) return null;

        if (isPairStart && items[i + 1]) {
          const item2 = items[i + 1];
          return (
            <div key={item.id} className="grid grid-cols-2 gap-3">
              {[item, item2].map((proj) => (
                <motion.div
                  key={proj.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="group relative rounded-2xl overflow-hidden border border-white/10 bg-black"
                >
                  <div className="relative w-full" style={{ aspectRatio: '2/3' }}>
                    <AutoCycleImage images={proj.images} alt={proj.title} glow={proj.glow} />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                    <span className="text-[8px] uppercase tracking-[0.3em] text-violet-400 font-medium block mb-1">{proj.tag}</span>
                    <h3 className="text-xs font-black tracking-tight uppercase leading-tight">{proj.title}</h3>
                    <p className="text-white/25 text-[7px] uppercase tracking-widest mt-1 italic">Concept by <span className="normal-case">sev</span>IT</p>
                  </div>
                </motion.div>
              ))}
            </div>
          );
        }

        if (isFullWidth) {
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="group relative rounded-2xl overflow-hidden border border-white/10 bg-black"
            >
              <div 
                className="relative w-full" 
                style={{ aspectRatio: i === 7 ? '4/3' : (i === 0 || i === 3 || i === 4 ? '3/4' : '4/3') }}
              >
                <AutoCycleImage images={item.images} alt={item.title} glow={item.glow} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-5 rounded-full" style={{ background: item.glow }} />
                  <span className="text-[9px] uppercase tracking-[0.3em] text-violet-400 font-medium">{item.tag}</span>
                </div>
                <h3 className="text-lg font-black tracking-tight uppercase">{item.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed mt-1.5 line-clamp-2">{item.description}</p>
                <p className="text-white/25 text-[8px] uppercase tracking-widest mt-2 italic">Concept visualization by <span className="normal-case">sev</span>IT</p>
              </div>
            </motion.div>
          );
        }

        return null;
      })}
    </div>
  );
}
