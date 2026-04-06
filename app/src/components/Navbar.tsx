import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#chat' },
];

function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Entry animation
    gsap.fromTo(
      navRef.current,
      { opacity: 0, y: -20, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out', delay: 0.5 }
    );

    // Scroll handler
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-4 left-4 right-4 z-[100] transition-all duration-500 opacity-0 ${
        isScrolled
          ? 'bg-surface/80 backdrop-blur-xl border-border/50'
          : 'bg-transparent border-transparent'
      } border rounded-2xl`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Centered on desktop */}
          <div className="lg:absolute lg:left-1/2 lg:-translate-x-1/2">
            <a href="#" className="flex items-center">
              <span className="text-xl font-bold text-foreground">sev</span>
              <span className="text-xl font-bold text-red-500">IT</span>
            </a>
          </div>

          {/* Desktop Navigation - Left side */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.slice(0, 2).map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Navigation - Right side */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.slice(2).map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#booking"
              onClick={(e) => handleNavClick(e, '#booking')}
              className="px-5 py-2.5 text-sm font-medium text-background bg-foreground rounded-full hover:bg-accent transition-colors duration-300"
            >
              Book a Call
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-foreground"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-80 pb-4' : 'max-h-0'
          }`}
        >
          <div className="flex flex-col gap-4 pt-4 border-t border-border/50">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 py-2"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#booking"
              onClick={(e) => handleNavClick(e, '#booking')}
              className="px-5 py-3 text-sm font-medium text-center text-background bg-foreground rounded-full hover:bg-accent transition-colors duration-300 mt-2"
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
