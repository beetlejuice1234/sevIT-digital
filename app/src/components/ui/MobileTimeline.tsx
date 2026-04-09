import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface TimelineStep {
  number: string;
  title: string;
  description: string;
  accentColor: string;   // e.g. 'rgb(239,68,68)'
  accentClass: string;   // e.g. 'text-red-500'
  bgClass: string;       // e.g. 'bg-red-500/20'
  borderClass: string;   // e.g. 'border-red-500/40'
}

interface Props {
  steps: TimelineStep[];
}

/**
 * MobileTimeline
 * Vertical timeline with animated SVG connecting line and scroll-triggered step reveals.
 * Mobile-only: wrap with md:hidden in the parent.
 */
export default function MobileTimeline({ steps }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the vertical SVG line on scroll
      if (lineRef.current) {
        const total = lineRef.current.getTotalLength?.() ?? 300;
        gsap.set(lineRef.current, {
          strokeDasharray: total,
          strokeDashoffset: total,
        });
        gsap.to(lineRef.current, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'bottom 60%',
            scrub: 1,
          },
        });
      }

      // Stagger each step sliding in from left
      stepRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              once: true,
            },
            delay: i * 0.05,
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // line height: roughly 100% of the container minus some padding
  // We'll use an SVG overlay with a vertical path

  return (
    <div ref={containerRef} className="md:hidden relative pl-10 pr-2 py-2">
      {/* Vertical connecting SVG line */}
      <svg
        className="absolute left-[18px] top-5 w-1"
        style={{ height: `calc(100% - 40px)` }}
        overflow="visible"
      >
        <line
          ref={lineRef}
          x1="0.5"
          y1="0"
          x2="0.5"
          y2="100%"
          stroke={`url(#timelineGrad-${steps[0]?.accentColor?.replace(/[^a-z0-9]/gi, '')})`}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id={`timelineGrad-${steps[0]?.accentColor?.replace(/[^a-z0-9]/gi, '')}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={steps[0]?.accentColor ?? '#fff'} stopOpacity="0.9" />
            <stop offset="100%" stopColor={steps[0]?.accentColor ?? '#fff'} stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>

      {/* Steps */}
      <div className="space-y-6">
        {steps.map((step, i) => (
          <div
            key={i}
            ref={(el) => { stepRefs.current[i] = el; }}
            className="relative flex gap-4 items-start"
          >
            {/* Node on the line */}
            <div
              className={`absolute -left-10 w-7 h-7 rounded-full ${step.bgClass} border-2 ${step.borderClass} flex items-center justify-center shrink-0 z-10`}
            >
              <span className={`text-[10px] font-black ${step.accentClass}`}>{step.number}</span>
            </div>

            {/* Content card */}
            <div
              className={`flex-1 bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors duration-300`}
              style={{ boxShadow: i === 0 ? `0 0 20px ${step.accentColor}10` : undefined }}
            >
              <h3 className="font-bold text-white text-base mb-2 leading-tight">{step.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
