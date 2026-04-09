import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Menu, X, ArrowLeft } from 'lucide-react';

const navLinks = [
  { label: 'Services', href: '#services', sectionId: 'services' },
  { label: 'Process', href: '#process', sectionId: 'process' },
  { label: 'Testimonials', href: '#testimonials', sectionId: 'testimonials' },
  { label: 'Contact', href: '#chat', sectionId: 'chat' },
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
      className="fixed top-4 left-4 right-4 z-[100] opacity-0"
      style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(-150%)',
        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform',
      }}
    >
      <div 
        className={`max-w-7xl mx-auto px-4 sm:px-6 rounded-2xl border transition-all duration-500 ${
          isScrolled
            ? 'bg-surface/85 backdrop-blur-xl border-border/50 shadow-lg shadow-black/10'
            : 'bg-transparent border-transparent'
        }`}
        style={{
          willChange: 'background, backdrop-filter, border-color',
        }}
      >
        <div className="flex items-center justify-between h-16 relative">
          {/* Desktop Navigation - Left side */}
          <div className="hidden lg:flex items-center gap-8 flex-1">
            {navLinks.slice(0, 2).map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href, link.sectionId)}
                className="relative text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 group"
              >
                {link.label}
                <span 
                  className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full"
                  style={{ willChange: 'width' }}
                />
              </a>
            ))}
          </div>

          {/* Back Button + Logo - Centered on desktop, left on mobile */}
          <div className="flex items-center gap-2 lg:absolute lg:left-1/2 lg:-translate-x-1/2 z-10 transition-transform duration-300">
            {/* Back Button - Only on sub-pages */}
            {!isHomePage && (
              <button
                onClick={handleBackClick}
                className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-300 rounded-full hover:bg-white/5"
                aria-label="Back to Home"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            
            {/* Logo */}
            <a 
              href="#" 
              onClick={handleLogoClick}
              className="flex items-center transition-transform duration-300 hover:scale-105"
              style={{ willChange: 'transform' }}
            >
              <span className="text-xl font-bold text-foreground">sev</span>
              <span className="text-xl font-bold text-red-500">IT</span>
            </a>
          </div>

          {/* Desktop Navigation - Right side */}
          <div className="hidden lg:flex items-center gap-8 flex-1 justify-end">
            {navLinks.slice(2).map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href, link.sectionId)}
                className="relative text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 group"
              >
                {link.label}
                <span 
                  className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full"
                  style={{ willChange: 'width' }}
                />
              </a>
            ))}
            <a
              href="#chat"
              onClick={(e) => handleNavClick(e, '#chat', 'chat')}
              className="px-5 py-2.5 text-sm font-medium text-background bg-foreground rounded-full hover:bg-accent transition-all duration-300 hover:scale-105"
              style={{ willChange: 'transform' }}
            >
              Book a Call
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-foreground transition-transform duration-300 active:scale-95"
            style={{ willChange: 'transform' }}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu - GPU accelerated */}
        <div
          className="lg:hidden overflow-hidden transition-all duration-500 ease-out"
          style={{
            maxHeight: isMobileMenuOpen ? '500px' : '0',
            opacity: isMobileMenuOpen ? 1 : 0,
            willChange: 'max-height, opacity',
          }}
        >
          <div className="flex flex-col gap-4 pt-4 border-t border-border/50">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href, link.sectionId)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 py-2"
              >
                {link.label}
              </a>
            ))}
            
            <div className="pt-4 border-t border-border/30">
              <span className="text-xs uppercase tracking-wider text-muted-foreground/60 mb-3 block">Services</span>
              <div className="grid grid-cols-2 gap-2">
                {serviceLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 py-1"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            
            <a
              href="#chat"
              onClick={(e) => handleNavClick(e, '#chat', 'chat')}
              className="px-5 py-3 text-sm font-medium text-center text-background bg-foreground rounded-full hover:bg-accent transition-all duration-300 mt-2 hover:scale-105"
              style={{ willChange: 'transform' }}
            >
              Book a Call
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
