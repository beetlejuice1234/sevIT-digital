import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { Cpu, Zap, Target } from 'lucide-react';

export interface PerspectiveProject {
  id: number;
  title: string;
  tag: string;
  description: string;
  image: string;
  glow: string;
}

interface Props {
  items: PerspectiveProject[];
}

/**
 * Premium 3D Perspective Gallery
 * 
 * Cinematic coverflow with floating data overlays.
 * Designed for elite agency portfolios.
 */
export default function MobilePerspectiveGallery({ items }: Props) {
  const [index, setIndex] = useState(0);
  const x = useMotionValue(0);
  
  // Real-time rotation based on drag
  const rotateY = useTransform(x, [-200, 0, 200], [45, 0, -45]);

  const activeItem = items[index];

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -100 && index < items.length - 1) {
      setIndex(index + 1);
    } else if (info.offset.x > 100 && index > 0) {
      setIndex(index - 1);
    }
  };

  return (
    <div className="relative w-full h-[70vh] flex flex-col items-center justify-center overflow-hidden bg-[#050505] rounded-[3rem] border border-white/5 shadow-2xl mt-10 mb-20">
      
      {/* Background Depth layer */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ background: `radial-gradient(circle at center, ${activeItem.glow} 0%, transparent 80%)` }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 opacity-10"
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay" />
        
        {/* Large background index number */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] select-none pointer-events-none">
          <span className="text-[30vh] font-black leading-none">0{index + 1}</span>
        </div>
      </div>

      {/* Main Showcase */}
      <div className="relative z-10 w-full flex items-center justify-center perspective-[1200px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem.id}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, scale: 0.8, rotateY: -30, z: -200 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0, z: 0 }}
            exit={{ opacity: 0, scale: 1.1, rotateY: 30, z: 200 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="relative w-[85%] max-w-[300px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/20 touch-none active:cursor-grabbing"
            style={{ x, rotateY }}
          >
            <img 
              src={activeItem.image} 
              alt={activeItem.title}
              className="w-full h-full object-cover pointer-events-none"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-white/5" />
            <div className="absolute top-0 left-0 right-0 h-1" style={{ background: activeItem.glow }} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Typography Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-8 z-20 bg-gradient-to-t from-black via-black/40 to-transparent">
        <motion.div
          key={`txt-${activeItem.id}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-violet-500 font-black mb-3 block">
            {activeItem.tag}
          </span>
          <h3 className="text-2xl font-black tracking-tighter text-white uppercase leading-none mb-3">
            {activeItem.title}
          </h3>
          
          <div className="flex items-center justify-center gap-4 mt-6">
             <div className="flex flex-col items-center gap-1">
                <Cpu className="w-3 h-3 text-white/20" />
                <span className="text-[7px] text-white/40 font-mono tracking-widest uppercase">PBR_STCK</span>
             </div>
             <div className="h-6 w-px bg-white/5" />
             <div className="flex flex-col items-center gap-1">
                <Target className="w-3 h-3 text-white/20" />
                <span className="text-[7px] text-white/40 font-mono tracking-widest uppercase">RT_CORE</span>
             </div>
             <div className="h-6 w-px bg-white/5" />
             <div className="flex flex-col items-center gap-1">
                <Zap className="w-3 h-3 text-white/20" />
                <span className="text-[7px] text-white/40 font-mono tracking-widest uppercase">UNRL_5.4</span>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Progress Dots */}
      <div className="absolute bottom-6 flex gap-1.5 items-center">
        {items.map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              width: i === index ? 16 : 4,
              opacity: i === index ? 1 : 0.2
            }}
            className="h-1 rounded-full bg-violet-500"
          />
        ))}
      </div>
    </div>
  );
}
