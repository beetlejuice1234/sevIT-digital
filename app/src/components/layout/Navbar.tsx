import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { SERVICES } from '@/lib/site';
import { cn } from '@/lib/utils';

const LINKS = [
  { label: 'Work', to: '/#work' },
  { label: 'Process', to: '/#process' },
  { label: 'Careers', to: '/careers' },
];

export function Logo({ className }: { className?: string }) {
  return (
    <img
      src="/images/logo-sevit.webp"
      alt="sevIT Digital"
      width={84}
      height={28}
      className={cn('h-7 w-auto select-none', className)}
      draggable={false}
    />
  );
}

export default function Navbar() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const lastY = useRef(0);
  const megaTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 400 && y > lastY.current + 4);
      if (y < lastY.current - 4) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close menus when the route changes
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setOpen(false);
    setMega(false);
  }

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && (setOpen(false), setMega(false));
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const openMega = () => {
    window.clearTimeout(megaTimer.current);
    setMega(true);
  };
  const closeMega = () => {
    megaTimer.current = window.setTimeout(() => setMega(false), 120);
  };

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[60] transition-transform duration-500 [transition-timing-function:var(--ease-out)]',
          hidden && !open && !mega ? '-translate-y-full' : 'translate-y-0',
        )}
      >
        <div className="container-x pt-3 sm:pt-4">
          <nav
            aria-label="Main"
            className={cn(
              'relative flex h-14 items-center justify-between rounded-full pl-5 pr-2 transition-all duration-500',
              scrolled || mega
                ? 'border border-white/10 bg-black/60 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl'
                : 'border border-transparent',
            )}
          >
            <Link to="/" aria-label="sevIT home" className="flex items-center">
              <Logo />
            </Link>

            <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
              <li onMouseEnter={openMega} onMouseLeave={closeMega}>
                <button
                  type="button"
                  aria-expanded={mega}
                  aria-controls="mega-menu"
                  onClick={() => setMega((m) => !m)}
                  className={cn(
                    'flex items-center gap-1 rounded-full px-4 py-2 text-sm transition-colors',
                    mega || pathname.startsWith('/services') ? 'text-white' : 'text-white/60 hover:text-white',
                  )}
                >
                  Services
                  <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-300', mega && 'rotate-180')} />
                </button>
              </li>
              {LINKS.map((l) => (
                <li key={l.label}>
                  <NavLink
                    to={l.to}
                    className={({ isActive }) =>
                      cn(
                        'rounded-full px-4 py-2 text-sm transition-colors',
                        isActive && !l.to.includes('#') ? 'text-white' : 'text-white/60 hover:text-white',
                      )
                    }
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <Link to="/#contact" className="btn btn-primary hidden !px-5 !py-2.5 sm:inline-flex">
                Start a project
              </Link>
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] md:hidden"
              >
                <span className={cn('absolute h-px w-4 bg-white transition-transform duration-300', open ? 'rotate-45' : '-translate-y-[3px]')} />
                <span className={cn('absolute h-px w-4 bg-white transition-transform duration-300', open ? '-rotate-45' : 'translate-y-[3px]')} />
              </button>
            </div>

            {/* Mega menu */}
            <div
              id="mega-menu"
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
              className={cn(
                'absolute left-1/2 top-[calc(100%+10px)] hidden w-[min(860px,calc(100vw-48px))] -translate-x-1/2 md:block',
                'origin-top transition-all duration-300 [transition-timing-function:var(--ease-out)]',
                mega ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0',
              )}
            >
              <div className="grid grid-cols-[1fr_240px] gap-2 rounded-3xl border border-white/10 bg-[#0b0b0b]/95 p-2 shadow-2xl shadow-black/80 backdrop-blur-xl">
                <ul className="grid grid-cols-2 gap-1 p-1">
                  {SERVICES.map((s) => (
                    <li key={s.slug}>
                      <Link
                        to={s.path}
                        className="group flex gap-3 rounded-2xl p-3 transition-colors hover:bg-white/[0.05]"
                      >
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70 transition-colors group-hover:border-orange-400/40 group-hover:text-orange-300">
                          <s.icon className="h-4 w-4" />
                        </span>
                        <span>
                          <span className="block text-sm font-medium text-white">{s.name}</span>
                          <span className="mt-0.5 block text-xs leading-snug text-white/45">{s.blurb}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/services/3d-rendering"
                  className="group relative overflow-hidden rounded-2xl"
                  aria-label="See our 3D work"
                >
                  <img
                    src="/images/renders/sm/perf1.webp"
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange-300">Featured</p>
                    <p className="mt-1 flex items-center gap-1 text-sm font-medium">
                      Bergamood — CGI ad <ArrowUpRight className="h-3.5 w-3.5" />
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={cn(
          'fixed inset-0 z-[55] bg-[#050505]/98 backdrop-blur-xl transition-[opacity,visibility] duration-500 md:hidden',
          open ? 'visible opacity-100' : 'invisible opacity-0',
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto px-6 pb-10 pt-28">
          <p className="eyebrow mb-4">Services</p>
          <ul className="space-y-1">
            {SERVICES.map((s, i) => (
              <li
                key={s.slug}
                className={cn('transition-all duration-500', open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0')}
                style={{ transitionDelay: open ? `${80 + i * 40}ms` : '0ms' }}
              >
                <Link to={s.path} className="flex items-center justify-between border-b border-white/[0.06] py-3.5 text-lg font-medium">
                  {s.name}
                  <s.icon className="h-4 w-4 text-white/40" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-white/60">
            {LINKS.map((l) => (
              <Link key={l.label} to={l.to} className="text-base hover:text-white" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
          </div>
          <Link to="/#contact" onClick={() => setOpen(false)} className="btn btn-accent mt-auto w-full !py-4">
            Start a project <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
