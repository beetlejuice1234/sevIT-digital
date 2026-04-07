import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Twitter, 
  Linkedin, 
  Instagram, 
  Github,
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
  Star,
  Rocket
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const footerLinks = {
  services: [
    { label: 'Web Design', href: '#services' },
    { label: '3D Rendering', href: '#services' },
    { label: 'Branding', href: '#services' },
    { label: 'Advertising', href: '#services' },
    { label: 'Growth Marketing', href: '#services' },
  ],
  company: [
    { label: 'About Us', href: '#' },
    { label: 'Our Process', href: '#process' },
    { label: 'Case Studies', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#chat' },
  ],
  resources: [
    { label: 'Blog', href: '#' },
    { label: 'Documentation', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Github, href: '#', label: 'GitHub' },
];

function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable parallax on mobile for performance
    const isMobile = window.innerWidth < 768;
    
    const ctx = gsap.context(() => {
      // Watermark parallax - desktop only
      if (!isMobile) {
        gsap.fromTo(
          watermarkRef.current,
          { y: 50 },
          {
            y: -50,
            ease: 'none',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: 1,
            },
          }
        );
      }

      // Content fade in
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 85%',
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative pt-12 sm:pt-16 md:pt-24 pb-6 sm:pb-8 px-4 sm:px-6 lg:px-8 z-50 overflow-hidden"
    >
      {/* Space decorations - hidden on mobile */}
      <div className="hidden sm:block absolute top-20 right-20 text-accent/20">
        <Star className="w-5 h-5 animate-pulse" />
      </div>
      <div className="hidden sm:block absolute bottom-40 left-10 text-accent/10">
        <Rocket className="w-6 h-6 animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Giant Watermark - smaller on mobile */}
      <div
        ref={watermarkRef}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none select-none"
      >
        <span className="text-[80px] sm:text-[150px] md:text-[250px] lg:text-[350px] font-bold text-foreground/[0.03] whitespace-nowrap">
          sevIT
        </span>
      </div>

      {/* Content */}
      <div ref={contentRef} className="relative z-10 max-w-7xl mx-auto">
        {/* Main Footer Grid - Single column on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-8 mb-10 sm:mb-12 md:mb-16">
          {/* Brand Column - Full width on mobile */}
          <div className="col-span-2 lg:col-span-2">
            <div className="mb-3 sm:mb-4">
              <span className="text-xl sm:text-2xl font-bold text-foreground">sev</span>
              <span className="text-xl sm:text-2xl font-bold text-red-500">IT</span>
            </div>
            <p className="text-muted-foreground mb-4 sm:mb-6 max-w-sm leading-relaxed text-sm sm:text-base">
              Launching brands into the digital cosmos. We craft stunning websites, 
              powerful campaigns, and immersive experiences.
            </p>
            
            {/* Contact Info - Compact on mobile */}
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent flex-shrink-0" />
                <span>hello@sevit.agency</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent flex-shrink-0" />
                <span>San Francisco, CA</span>
              </div>
            </div>

            {/* Social Links - Smaller on mobile */}
            <div className="flex gap-2 sm:gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-surface border border-border/50 flex items-center justify-center text-muted-foreground transition-all duration-300 hover:text-foreground hover:border-foreground/20 hover:scale-110"
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-2 sm:mb-4 text-sm sm:text-base">Services</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-2 sm:mb-4 text-sm sm:text-base">Company</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-2 sm:mb-4 text-sm sm:text-base">Resources</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Stacked on mobile */}
        <div className="pt-6 sm:pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} sevIT Digital Agency. All rights reserved.
          </p>
          <div className="flex gap-4 sm:gap-6">
            <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
