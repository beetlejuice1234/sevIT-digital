import {
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
  type ComponentPropsWithoutRef,
} from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── Reveal ─────────────────────────────────────────────────────────────
 * Adds `.is-in` when the element scrolls into view. One shared observer.
 */
let io: IntersectionObserver | null = null;
const getObserver = () => {
  if (io || typeof window === 'undefined') return io;
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io?.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  return io;
};

type RevealProps<T extends ElementType> = {
  as?: T;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className' | 'style'>;

export function Reveal<T extends ElementType = 'div'>({ as, delay = 0, className, style, children, ...rest }: RevealProps<T>) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    const obs = getObserver();
    if (!el || !obs) return;
    obs.observe(el);
    return () => obs.unobserve(el);
  }, []);
  const Tag = (as ?? 'div') as ElementType;
  return (
    <Tag ref={ref} data-reveal="" className={className} style={{ ...style, '--d': `${delay}ms` } as CSSProperties} {...rest}>
      {children}
    </Tag>
  );
}

/* ─── Section header ─────────────────────────────────────────────────
 * Swiss-style: a short label sits in its own left column, the heading and
 * intro take the rest. On mobile the label sits above.
 */
export function SectionHeader({
  eyebrow,
  title,
  intro,
  className,
  action,
  stacked = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
  action?: ReactNode;
  /** label above the title (for headers that sit inside a half-width column) */
  stacked?: boolean;
}) {
  return (
    <div className={cn('mb-12 grid gap-4 md:mb-16', !stacked && 'md:grid-cols-12 md:gap-8', className)}>
      <div className={cn(!stacked && 'md:col-span-3')}>{eyebrow && <p className={cn('eyebrow', !stacked && 'md:pt-3')}>{eyebrow}</p>}</div>
      <div className={cn(!stacked && 'md:col-span-9')}>
        <h2 className="display text-balance text-[clamp(2.4rem,5.2vw,4.6rem)]">{title}</h2>
        {intro && <p className="mt-5 max-w-[58ch] text-pretty text-lg leading-relaxed text-white/60">{intro}</p>}
        {action && <div className="mt-8">{action}</div>}
      </div>
    </div>
  );
}

/* ─── Spotlight card ─────────────────────────────────────────────────── */
export function SpotlightCard<T extends ElementType = 'div'>({
  as,
  className,
  children,
  ...rest
}: { as?: T; className?: string; children?: ReactNode } & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>) {
  const Tag = (as ?? 'div') as ElementType;
  return (
    <Tag
      className={cn('spotlight', className)}
      onPointerMove={(e: React.PointerEvent<HTMLElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ─── Marquee ────────────────────────────────────────────────────────── */
export function Marquee({
  children,
  duration = 40,
  reverse = false,
  vertical = false,
  className,
  pauseOnHover = true,
}: {
  children: ReactNode;
  duration?: number;
  reverse?: boolean;
  vertical?: boolean;
  className?: string;
  pauseOnHover?: boolean;
}) {
  return (
    <div className={cn('overflow-hidden', pauseOnHover && 'marquee-pause', className)}>
      <div
        className={cn('flex w-max', vertical ? 'marquee-y h-max w-full flex-col' : 'marquee-x')}
        style={{ '--dur': `${duration}s`, animationDirection: reverse ? 'reverse' : 'normal' } as CSSProperties}
      >
        <div className={cn('flex shrink-0', vertical && 'flex-col')}>{children}</div>
        <div className={cn('flex shrink-0', vertical && 'flex-col')} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─── Buttons / links ────────────────────────────────────────────────── */
type BtnProps = {
  to: string;
  variant?: 'primary' | 'accent' | 'ghost';
  children: ReactNode;
  className?: string;
  arrow?: boolean;
};
export function ButtonLink({ to, variant = 'primary', children, className, arrow = false }: BtnProps) {
  const external = /^(https?:|mailto:|tel:)/.test(to);
  const cls = cn('btn group', `btn-${variant}`, className);
  const inner = (
    <>
      {children}
      {arrow && (
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      )}
    </>
  );
  if (external)
    return (
      <a href={to} className={cls} target={to.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
        {inner}
      </a>
    );
  return (
    <Link to={to} className={cls}>
      {inner}
    </Link>
  );
}

/* ─── Sparkle (brand mark) ───────────────────────────────────────────── */
/** The sevIT spark, cut straight from the logo artwork. */
export function Sparkle({ className, tone = 'brand' }: { className?: string; tone?: 'brand' | 'white' | 'black' }) {
  return <img src={`/images/spark-${tone}.png`} alt="" aria-hidden className={cn('inline-block object-contain', className)} draggable={false} />;
}

/* ─── Browser frame ──────────────────────────────────────────────────── */
export function BrowserFrame({ url, children, className }: { url: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn('overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0c] shadow-2xl shadow-black/60', className)}>
      <div className="flex items-center gap-3 border-b border-white/[0.06] bg-white/[0.03] px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </div>
        <div className="mx-auto flex max-w-[80%] items-center gap-1.5 rounded-full bg-white/[0.05] px-3 py-1 font-mono text-[9px] text-white/45 sm:max-w-[60%] sm:gap-2 sm:px-4 sm:text-[11px]">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/80" />
          {url}
        </div>
      </div>
      {children}
    </div>
  );
}

/* ─── Phone frame ────────────────────────────────────────────────────── */
export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('relative rounded-[2.4rem] border border-white/15 bg-[#0b0b0b] p-2 shadow-2xl shadow-black/70', className)}>
      <div className="absolute left-1/2 top-3.5 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-black" />
      <div className="overflow-hidden rounded-[1.9rem]">{children}</div>
    </div>
  );
}
