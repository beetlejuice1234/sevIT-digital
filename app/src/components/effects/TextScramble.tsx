import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TextScrambleProps {
  text: string;
  className?: string;
  triggerPoint?: string;
}

const chars = '!<>-_\\/[]{}—=+*^?#________';

/**
 * GPU-Optimized Text Scramble Effect
 * 
 * Uses canvas-based rendering to avoid React state updates and layout thrashing.
 * All animations are computed on the GPU via canvas 2D context.
 */
function TextScramble({ text, className = '', triggerPoint = 'top 80%' }: TextScrambleProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const hasAnimated = useRef(false);
  const frameRef = useRef<number | null>(null);

  // Memoized scramble render function - no React state, pure canvas
  const renderScramble = useCallback((progress: number) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const length = text.length;
    const revealedCount = Math.floor(progress * length);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set text styling to match parent
    const computedStyle = window.getComputedStyle(container);
    const fontSize = computedStyle.fontSize || '48px';
    const fontFamily = computedStyle.fontFamily || 'system-ui';
    const fontWeight = computedStyle.fontWeight || '500';
    const color = computedStyle.color || '#ffffff';
    
    ctx.font = `${fontWeight} ${fontSize} ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';
    
    // Measure and center text
    const metrics = ctx.measureText(text);
    const x = (canvas.width - metrics.width) / 2;
    const y = canvas.height / 2;
    
    // Build scrambled text
    let displayText = '';
    for (let i = 0; i < length; i++) {
      const char = text[i];
      if (char === ' ') {
        displayText += ' ';
      } else if (i < revealedCount) {
        displayText += char;
      } else {
        // Random scramble character
        displayText += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    
    ctx.fillText(displayText, x, y);
  }, [text]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Set canvas size to match container
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      // Use higher resolution for crisp text
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Initial render - show scrambled text
    renderScramble(0);

    // Create ScrollTrigger for animation
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: triggerPoint,
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;

        // Use GSAP to animate progress from 0 to 1
        const progressObj = { value: 0 };
        
        animationRef.current = gsap.to(progressObj, {
          value: 1,
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: () => {
            // Render on RAF for smooth 60FPS
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
            frameRef.current = requestAnimationFrame(() => {
              renderScramble(progressObj.value);
            });
          },
          onComplete: () => {
            // Final render with complete text
            renderScramble(1);
          },
        });
      },
    });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      trigger.kill();
      if (animationRef.current) animationRef.current.kill();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [triggerPoint, renderScramble]);

  return (
    <span 
      ref={containerRef} 
      className={`relative inline-block ${className}`}
      style={{ 
        minHeight: '1.2em',
        display: 'inline-block',
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{
          display: 'block',
          willChange: 'contents',
        }}
      />
      {/* Hidden text for SEO and accessibility */}
      <span className="sr-only">{text}</span>
    </span>
  );
}

export default TextScramble;
