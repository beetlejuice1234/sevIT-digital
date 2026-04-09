import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';

export interface FlipCardItem {
  icon: React.ComponentType<{ className?: string }>;
  problem: string;
  solution: string;
  accentClass: string;   // e.g. 'text-red-500'
  bgClass: string;       // e.g. 'bg-red-500/20'
  iconBgClass: string;   // e.g. 'bg-white/5'
}

interface Props {
  items: FlipCardItem[];
  accentColor?: string;  // for glow
}

function FlipCard({ item, index }: { item: FlipCardItem; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const innerRef = useRef<HTMLDivElement>(null);
  const Icon = item.icon;

  const handleFlip = () => {
    if (!innerRef.current) {
      setFlipped((f) => !f);
      return;
    }
    const targetRot = flipped ? 0 : 180;
    gsap.to(innerRef.current, {
      rotateY: targetRot,
      duration: 0.55,
      ease: 'power3.inOut',
    });
    setFlipped((f) => !f);
  };

  return (
    <div
      className="relative cursor-pointer select-none"
      style={{ perspective: '800px', height: '140px' }}
      onClick={handleFlip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleFlip()}
      aria-label={`Card ${index + 1}: ${item.problem}`}
    >
      <div
        ref={innerRef}
        style={{ transformStyle: 'preserve-3d', height: '100%', width: '100%' }}
      >
        {/* Front — Problem */}
        <div
          className="absolute inset-0 rounded-2xl bg-white/[0.03] border border-white/10 p-4 flex flex-col justify-between"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className={`w-8 h-8 rounded-lg ${item.iconBgClass} flex items-center justify-center`}>
            <Icon className="w-4 h-4 text-white/40" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Problem</p>
            <p className="text-white/50 text-sm line-through decoration-red-500/60 leading-tight">
              {item.problem}
            </p>
          </div>
          <div className="flex items-center gap-1 text-white/25 text-[10px]">
            <span>Tap to flip</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Back — Solution */}
        <div
          className={`absolute inset-0 rounded-2xl ${item.bgClass} border ${item.accentClass.replace('text-', 'border-')}/30 p-4 flex flex-col justify-between`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Solution</p>
            <p className={`${item.accentClass} font-bold text-sm leading-tight`}>
              {item.solution}
            </p>
          </div>
          <div className="flex items-center gap-1 text-white/25 text-[10px]">
            <span>Tap to flip back</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * MobileFlipCards
 * A compact grid of tap-to-flip cards, showing problem on front and solution on back.
 * Wrap with md:hidden in the parent component.
 */
export default function MobileFlipCards({ items }: Props) {
  return (
    <div className="md:hidden">
      {/* Hint */}
      <p className="text-center text-white/30 text-xs uppercase tracking-widest mb-5">
        Tap any card to reveal the fix
      </p>

      <div className="grid grid-cols-2 gap-3">
        {items.map((item, i) => (
          <FlipCard key={i} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}
