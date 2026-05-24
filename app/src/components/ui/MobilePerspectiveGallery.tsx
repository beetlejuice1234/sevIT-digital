import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { Cpu, Zap, Target, MousePointer2 } from 'lucide-react';

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

/**
 * Advanced Interactive 3D Exhibit
 * 
 * Cinematic 82vh showcase with:
 * - Auto-cycle projects (Autonomous Sweep)
 * - Tap-to-cycle project images (Angle Switch)
 * - Technical HUD with rolling status hints
 */
export default function MobilePerspectiveGallery({ items }: Props) {
  const [index, setIndex] = useState(0);
  const [imgIndex, setImgIndex] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  
  const x = useMotionValue(0);
  const rotateY = useTransform(x, [-200, 0, 200], [45, 0, -45]);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeItem = items[index];
  
  const statusHints = [
    "SYSTEM_STATUS: NOMINAL",
    "G_INPUT: SWIPE_TO_NAVIGATE",
    "G_INPUT: TAP_RENDER_FOR_ANGLES",
    "HUD_READY: EXHIBIT_ACTIVE",
    "PBR_ENGINE: RESOLVED_4K"
  ];

  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      if (!isUserInteracting) {
        setIndex((prev) => (prev + 1) % items.length);
        setImgIndex(0);
      }
    }, 6000);
  }, [items.length, isUserInteracting]);

  useEffect(() => {
    startAutoPlay();
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
  }, [startAutoPlay]);

  useEffect(() => {
    const timer = setInterval(() => {
      setStatusIdx((prev) => (prev + 1) % statusHints.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const pauseAutoPlay = () => {
    setIsUserInteracting(true);
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    setTimeout(() => setIsUserInteracting(false), 10000);
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    pauseAutoPlay();
    if (info.offset.x < -100 && index < items.length - 1) {
      setIndex(index + 1);
      setImgIndex(0);
    } else if (info.offset.x > 100 && index > 0) {
      setIndex(index - 1);
      setImgIndex(0);
    }
    x.set(0);
  };

  const cycleImage = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    pauseAutoPlay();
    setImgIndex((prev) => (prev + 1) % activeItem.images.length);
  };

  return (
    <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[82vh] flex flex-col items-center justify-center overflow-hidden bg-[#050505] mt-2 mb-12 select-none">
      
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ background: `radial-gradient(circle at 50% 40%, ${activeItem.glow} 0%, transparent 85%)` }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 opacity-15"
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay" />
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] select-none">
          <span className="text-[35vh] font-black leading-none">0{index + 1}</span>
        </div>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center justify-center perspective-[1500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeItem.id}-${imgIndex}`}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            onClick={cycleImage}
            initial={{ opacity: 0, scale: 0.85, rotateY: -25, z: -300 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0, z: 0 }}
            exit={{ opacity: 0, scale: 1.1, rotateY: 25, z: 300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className="relative w-[82%] max-w-[340px] aspect-[3/4.2] rounded-[2rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-white/15 touch-none active:cursor-grabbing group"
            style={{ x, rotateY }}
          >
            <img 
              src={activeItem.images[imgIndex]} 
              alt={activeItem.title}
              className="w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-white/5 pointer-events-none" />
            
            {activeItem.images.length > 1 && (
              <div className="absolute top-6 right-6 flex gap-1">
                {activeItem.images.map((_, i) => (
                  <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === imgIndex ? 'w-4 bg-white' : 'w-1 bg-white/20'}`} />
                ))}
              </div>
            )}
            <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: activeItem.glow }} />
          </motion.div>
        </AnimatePresence>
        
        {!isUserInteracting && (
           <motion.div 
             animate={{ opacity: [0, 1, 0], y: [10, 0, 10] }}
             transition={{ duration: 3, repeat: Infinity }}
             className="mt-6 flex items-center gap-2 text-white/20"
           >
             <MousePointer2 className="w-3 h-3" />
             <span className="text-[8px] uppercase tracking-[0.3em]">Interact to Explore</span>
           </motion.div>
        )}
      </div>

      <div className="absolute bottom-10 left-0 right-0 px-8 z-20 pointer-events-none text-center">
        <div className="mb-4 overflow-hidden h-4 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={statusHints[statusIdx]}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="text-[7px] font-mono tracking-[0.5em] text-violet-500/60 uppercase"
            >
              {statusHints[statusIdx]}
            </motion.span>
          </AnimatePresence>
        </div>

        <span className="text-[10px] uppercase tracking-[0.4em] text-violet-400 font-black mb-3 block">
          {activeItem.tag}
        </span>
        <h3 className="text-3xl font-black tracking-tighter text-white uppercase leading-[0.9] mb-4">
          {activeItem.title}
        </h3>
        
        <div className="flex items-center justify-center gap-4 mt-8">
           <div className="flex flex-col items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-white/10" />
              <span className="text-[7px] text-white/30 font-mono tracking-widest uppercase">PHYSICAL_SHDR</span>
           </div>
           <div className="h-8 w-px bg-white/5" />
           <div className="flex flex-col items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-white/10" />
              <span className="text-[7px] text-white/30 font-mono tracking-widest uppercase">PBR_CAMERA</span>
           </div>
           <div className="h-8 w-px bg-white/5" />
           <div className="flex flex-col items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-white/10" />
              <span className="text-[7px] text-white/30 font-mono tracking-widest uppercase">UNRL_LUMEN</span>
           </div>
        </div>
      </div>

      <div className="absolute bottom-6 flex gap-1 items-center">
        {items.map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              width: i === index ? 24 : 4,
              opacity: i === index ? 1 : 0.15,
              backgroundColor: i === index ? activeItem.glow : 'rgba(255,255,255,1)'
            }}
            className="h-1 rounded-full"
          />
        ))}
      </div>
    </div>
  );
}
