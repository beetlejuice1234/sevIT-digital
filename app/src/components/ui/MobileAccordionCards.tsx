import React, { useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ChevronDown } from 'lucide-react';

export interface AccordionCardItem {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  subtitle?: string;
  description: string;
  bullets?: string[];
  tags?: string[];
  accentColor: string; // e.g. 'rgb(239,68,68)'
  accentClass: string; // e.g. 'text-red-500'
  bgClass: string;     // e.g. 'bg-red-500/20'
  borderClass: string; // e.g. 'border-red-500/40'
}

interface Props {
  items: AccordionCardItem[];
  defaultOpenIndex?: number;
}

function AccordionCard({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: AccordionCardItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const Icon = item.icon;

  const handleToggle = useCallback(() => {
    onToggle();
    if (!bodyRef.current) return;
    if (!isOpen) {
      // Opening: animate from 0 to auto
      gsap.set(bodyRef.current, { height: 0, opacity: 0, overflow: 'hidden' });
      gsap.to(bodyRef.current, {
        height: 'auto',
        opacity: 1,
        duration: 0.45,
        ease: 'power3.out',
      });
    } else {
      // Closing
      gsap.to(bodyRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.35,
        ease: 'power3.in',
        onComplete: () => {
          if (bodyRef.current) gsap.set(bodyRef.current, { clearProps: 'all' });
        },
      });
    }
  }, [isOpen, onToggle]);

  return (
    <div
      className={`rounded-2xl border transition-colors duration-300 overflow-hidden ${
        isOpen ? item.borderClass + ' bg-white/[0.04]' : 'border-white/10 bg-white/[0.02]'
      }`}
      style={{ boxShadow: isOpen ? `0 0 30px ${item.accentColor}15` : undefined }}
    >
      {/* Header — always visible */}
      <button
        onClick={handleToggle}
        className="w-full flex items-center gap-4 p-5 text-left"
      >
        {/* Step number */}
        <span
          className={`text-xs font-black tracking-widest ${item.accentClass} opacity-60 shrink-0 w-5`}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Icon bubble */}
        <div className={`w-10 h-10 rounded-xl ${item.bgClass} flex items-center justify-center shrink-0`}>
          <Icon className={`w-5 h-5 ${item.accentClass}`} />
        </div>

        {/* Title + subtitle */}
        <div className="flex-1 min-w-0">
          {item.subtitle && (
            <p className={`text-[10px] uppercase tracking-[0.2em] ${item.accentClass} mb-0.5`}>
              {item.subtitle}
            </p>
          )}
          <h3 className="font-bold text-base text-white leading-tight">{item.title}</h3>
        </div>

        {/* Chevron */}
        <ChevronDown
          className={`w-4 h-4 text-white/40 shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Body — animated */}
      <div
        ref={bodyRef}
        style={{ height: isOpen ? 'auto' : 0, overflow: 'hidden', opacity: isOpen ? 1 : 0 }}
      >
        <div className="px-5 pb-6 pt-1">
          <p className="text-white/55 text-sm leading-relaxed mb-4">{item.description}</p>

          {item.bullets && item.bullets.length > 0 && (
            <ul className="space-y-2.5">
              {item.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-white/70">
                  <div className={`w-1.5 h-1.5 rounded-full ${item.bgClass.replace('/20', '')} shrink-0 mt-1.5`} />
                  {b}
                </li>
              ))}
            </ul>
          )}

          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {item.tags.map((tag, i) => (
                <span key={i} className="px-2.5 py-1 bg-white/5 rounded-full text-xs text-white/60">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * MobileAccordionCards
 * Tap-to-expand accordion cards for mobile service sections.
 * Only shown on mobile (md:hidden wrapper applied by caller or inside here).
 */
export default function MobileAccordionCards({ items, defaultOpenIndex = 0 }: Props) {
  const [openIndex, setOpenIndex] = useState(defaultOpenIndex);

  const handleToggle = useCallback((i: number) => {
    setOpenIndex((prev) => (prev === i ? -1 : i));
  }, []);

  return (
    <div className="md:hidden space-y-3">
      {items.map((item, i) => (
        <AccordionCard
          key={i}
          item={item}
          index={i}
          isOpen={openIndex === i}
          onToggle={() => handleToggle(i)}
        />
      ))}
    </div>
  );
}
