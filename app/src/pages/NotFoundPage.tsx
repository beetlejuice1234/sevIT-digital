import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Ghost, Home } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Entrance animation
    gsap.fromTo(
      '.not-found-content',
      { opacity: 0, scale: 0.9, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center relative overflow-hidden pt-20">
      <div className="not-found-content">
        {/* Graphic */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <span className="text-[120px] sm:text-[180px] font-black text-foreground/[0.03] leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <Ghost className="w-20 h-20 text-accent animate-pulse" style={{ animationDuration: '3s' }} />
          </div>
        </div>
        
        {/* Copy */}
        <h1 className="text-3xl sm:text-5xl font-bold text-foreground mb-6">
          Lost in Space
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto mb-10 leading-relaxed">
          The page you're searching for has drifted into the digital void. Let's redirect you back to something useful.
        </p>
        
        {/* Action */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-foreground text-background rounded-full font-medium shadow-xl hover:shadow-2xl hover:bg-accent hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 group"
        >
          <Home className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          <span>Return to Base</span>
        </button>
      </div>
    </div>
  );
}
