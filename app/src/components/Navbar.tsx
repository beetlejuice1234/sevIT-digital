import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Menu, X, ArrowLeft, ArrowUpRight } from 'lucide-react';

const navLinks = [
  { label: 'Services', href: '#services', sectionId: 'services' },
  { label: 'Process', href: '#process', sectionId: 'process' },
  { label: 'Testimonials', href: '#testimonials', sectionId: 'testimonials' },
];

const serviceLinks = [
  { label: 'Web Design', href: '#/services/web-design' },
  { label: 'Branding', href: '#/services/branding' },
  { label: '3D Rendering', href: '#/services/3d-rendering' },
  { label: 'Advertising', href: '#/services/advertising' },
  { label: 'Marketing', href: '#/services/marketing' },
  { label: 'AI Solutions', href: '#/services/ai-solutions' },
];

/**
 * GPU-Optimized Navbar
 * 
 * Show/hide uses transform only for 60FPS.
 * Scroll detection is throttled with requestAnimationFrame.
 */
function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  const isHomePage = location.pathname === '/';

  // Entry animation
  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.5 }
    );
  }, []);

  // Throttled scroll handler with RAF
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        rafRef.current = requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Update scrolled state for styling
          setIsScrolled(currentScrollY > 50);
          
          // Smart hide/show on scroll direction
          if (currentScrollY > 150) {
            if (currentScrollY > lastScrollY.current) {
              // Scrolling down - hide navbar immediately
              setIsVisible(false);
              if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
                scrollTimeoutRef.current = null;
              }
            } else {
              // Scrolling up - show navbar after 250ms delay
              if (!scrollTimeoutRef.current) {
                scrollTimeoutRef.current = setTimeout(() => {
                  setIsVisible(true);
                  scrollTimeoutRef.current = null;
                }, 250);
              }
            }
          } else {
            // Near top - always show immediately
            setIsVisible(true);
            if (scrollTimeoutRef.current) {
              clearTimeout(scrollTimeoutRef.current);
              scrollTimeoutRef.current = null;
            }
          }
          
          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string, sectionId?: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    if (isHomePage && sectionId) {
      const target = document.getElementById(sectionId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (href.startsWith('#/')) {
      const path = href.replace('#', '');
      navigate(path);
    } else if (sectionId) {
      navigate('/');
      setTimeout(() => {
        const target = document.getElementById(sectionId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [isHomePage, navigate]);

  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    navigate('/');
  }, [navigate]);

  const handleBackClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/');
  }, [navigate]);

  return (
    <nav
      ref={navRef}
      className={`fixed top-4 left-4 right-4 z-[100] transition-transform duration-500 ease-out ${
        isVisible ? 'translate-y-0' : '-translate-y-[150%]'
      }`}
    >
      <div 
        className={`max-w-7xl mx-auto px-4 sm:px-6 rounded-2xl border transition-all duration-500 ${
          isScrolled || isMobileMenuOpen
            ? 'bg-surface/85 backdrop-blur-xl border-border/50 shadow-lg shadow-black/10'
            : 'bg-transparent border-transparent'
        }`}
        style={{
          willChange: 'background, backdrop-filter, border-color',
        }}
      >
        <div className="flex items-center justify-between min-h-[44px] h-16 relative">
          {/* Desktop Navigation - Left side */}
          <div className="hidden lg:flex items-center gap-2 flex-1">
            {navLinks.slice(0, 2).map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href, link.sectionId)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-full transition-all duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Back Button + Logo - Centered on desktop, left on mobile */}
          <div className="flex items-center gap-2 lg:absolute lg:left-1/2 lg:-translate-x-1/2 z-10 transition-transform duration-300">
            {/* Back Button - Only on sub-pages */}
            {!isHomePage && (
              <button
                onClick={handleBackClick}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-300 rounded-full hover:bg-white/5"
                aria-label="Navigate back to the home page"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            
            {/* Logo */}
            <a 
              href="#" 
              onClick={handleLogoClick}
              className="flex items-center transition-transform duration-300 hover:scale-105 min-h-[44px] px-2"
              style={{ willChange: 'transform' }}
              aria-label="Go to sevIT homepage"
            >
              <span className="text-xl font-bold text-foreground">sev</span>
              <span className="text-xl font-bold text-red-500">IT</span>
            </a>
          </div>

          {/* Desktop Navigation - Right side */}
          <div className="hidden lg:flex items-center gap-4 flex-1 justify-end">
            {navLinks.slice(2).map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href, link.sectionId)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-full transition-all duration-300"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#chat"
              onClick={(e) => handleNavClick(e, '#chat', 'chat')}
              className="px-5 py-2.5 min-h-[44px] inline-flex items-center justify-center text-sm font-medium text-background bg-foreground rounded-full hover:bg-accent transition-all duration-300 hover:scale-105"
              style={{ willChange: 'transform' }}
              aria-label="Book a discovery call"
            >
              Book a Call
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-foreground transition-transform duration-300 active:scale-95 group"
            style={{ willChange: 'transform' }}
            aria-label={isMobileMenuOpen ? "Close mobile navigation menu" : "Open mobile navigation menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-7 h-7 group-hover:scale-110 transition-transform" />
            ) : (
              <Menu className="w-7 h-7 group-hover:scale-110 transition-transform" />
            )}
          </button>
        </div>

        {/* Mobile Menu - GPU accelerated. Placed BELOW the main row so it expands DOWNWARDS */}
        <div
          className="lg:hidden overflow-hidden transition-all duration-500 ease-out"
          style={{
            maxHeight: isMobileMenuOpen ? '700px' : '0',
            opacity: isMobileMenuOpen ? 1 : 0,
            willChange: 'max-height, opacity',
          }}
        >
          <div className="flex flex-col gap-6 pt-6 pb-6 border-t border-border/20">
            {/* Services Grid Pill Style */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/50 mb-4 block px-2">
                Expertise
              </span>
              <div className="flex flex-wrap gap-2">
                {serviceLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-sm px-4 py-2 border border-border/40 rounded-full text-foreground/80 hover:text-foreground hover:bg-white/10 active:bg-white/10 transition-all min-h-[44px] flex items-center justify-center"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="h-px bg-border/20 w-full rounded-full" />

            {/* Menu Links */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/50 mb-4 block px-2">
                Company
              </span>
              <div className="flex flex-col gap-1">
                {navLinks.filter(l => l.label !== 'Services').map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href, link.sectionId)}
                    className="text-lg font-medium py-3 px-2 text-foreground hover:text-accent transition-colors min-h-[44px] flex items-center"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            
            <a
              href="#chat"
              onClick={(e) => handleNavClick(e, '#chat', 'chat')}
              className="mt-4 flex items-center justify-center gap-2 w-full py-4 bg-foreground text-background rounded-xl font-medium active:scale-[0.98] transition-transform min-h-[44px]"
            >
              Start a Project <ArrowUpRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
