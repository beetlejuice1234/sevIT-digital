import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Zap, Info, X } from 'lucide-react';

export interface DeepProjectItem {
  id: number;
  title: string;
  tag: string;
  description: string;
  image: string;
  glow: string;
  details?: string[];
}

interface Props {
  items: DeepProjectItem[];
}

/**
 * Mobile-First Deep Explorer Gallery
 * 
 * Replaces linear scrolling with a depth-based interaction model.
 * Users "dive into" projects with immersive transitions.
 */
export default function MobileDeepExplorer({ items }: Props) {
  const [index, setIndex] = useState(0);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const next = () => setIndex((i) => (i + 1) % items.length);
  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);

  const activeItem = items[index];

  return (
    <div ref={containerRef} className="relative w-full h-[65vh] flex flex-col items-center justify-center overflow-hidden rounded-[2.5rem] bg-black/40 border border-white/10 mt-8 mb-16 shadow-2xl">
      
      {/* Background Depth Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-20 transition-colors duration-1000"
          style={{ background: `radial-gradient(circle at center, ${activeItem.glow} 0%, transparent 70%)` }}
        />
      </div>

      {/* Main Product Stage */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem.id}
            initial={{ opacity: 0, scale: 0.8, rotateY: -20, z: -100 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0, z: 0 }}
            exit={{ opacity: 0, scale: 1.1, rotateY: 20, z: 100 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="relative w-full max-w-[260px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/20"
          >
            <img 
              src={activeItem.image} 
              alt={activeItem.title}
              className="w-full h-full object-cover"
            />
            
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
            
            {/* Top Glow Bar */}
            <div 
              className="absolute top-0 left-0 right-0 h-1 transition-colors duration-700"
              style={{ background: activeItem.glow }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Persistent Info Overlay (Glassmorphism) */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
        <motion.div 
          layout
          className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-violet-400 font-black">
              {activeItem.tag}
            </span>
            <span className="text-[10px] text-white/20 font-mono">
              0{index + 1} / 0{items.length}
            </span>
          </div>
          
          <h3 className="text-lg font-black tracking-tight text-white mb-2 uppercase">
            {activeItem.title}
          </h3>
          
          <p className="text-white/50 text-[11px] leading-relaxed line-clamp-2">
            {activeItem.description}
          </p>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3 mt-5">
            <button 
              onClick={prev}
              className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white active:bg-violet-500/20 active:scale-95 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button 
              onClick={() => setIsDetailOpen(true)}
              className="flex-1 h-12 rounded-xl bg-white text-black font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Info className="w-3.5 h-3.5" />
              Analyze Render
            </button>

            <button 
              onClick={next}
              className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white active:bg-violet-500/20 active:scale-95 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Detail Overlay (Technical Breakdown) */}
      <AnimatePresence>
        {isDetailOpen && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            className="absolute inset-0 z-50 bg-[#050505] p-8 flex flex-col"
          >
            <button 
              onClick={() => setIsDetailOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mt-10">
              <span className="text-[10px] uppercase tracking-[0.4em] text-violet-500 font-black mb-2 block">Technical Analysis</span>
              <h2 className="text-3xl font-black tracking-tighter text-white mb-6 uppercase leading-none">
                {activeItem.title}
              </h2>
              
              <div className="space-y-6">
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-5 h-5 text-violet-400" />
                    <span className="font-bold text-sm">Design Intent</span>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {activeItem.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                    <span className="text-[8px] uppercase tracking-widest text-white/30 block mb-1">Lighting</span>
                    <span className="text-xs font-bold">PBR Path Traced</span>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                    <span className="text-[8px] uppercase tracking-widest text-white/30 block mb-1">Materials</span>
                    <span className="text-xs font-bold">High-Entropy</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsDetailOpen(false)}
                  className="w-full py-5 bg-violet-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs mt-4 shadow-xl shadow-violet-500/20"
                >
                  Back to Exhibit
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
