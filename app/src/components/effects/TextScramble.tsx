import { useEffect, useRef, useState, useCallback } from 'react';
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
 * Text Scramble Effect - Stable Version
 * 
 * Uses pre-sized container to prevent layout shift.
 * Characters reveal with a cyberpunk scramble effect.
 */
function TextScramble({ text, className = '', triggerPoint = 'top 80%' }: TextScrambleProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const [displayText, setDisplayText] = useState(() => {
    let scrambled = '';
    for (let i = 0; i < text.length; i++) {
      scrambled += text[i] === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)];
    }
    return scrambled;
  });
  const [isScrambling, setIsScrambling] = useState(false);

  // Stable container size - prevents layout shift
  const containerStyle: React.CSSProperties = {
    display: 'inline-block',
    minWidth: '100%',
    // Use opacity to hide/show without affecting layout
    opacity: isScrambling ? 1 : 0.99,
  };

  const scramble = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    setIsScrambling(true);

    const textLength = text.length;
    const scrambleDuration = 5000; // 5 seconds total - MUCH SLOWER
    const charRevealDelay = 80; // ms between each character - SLOWER
    
    const startTime = Date.now();
    const revealedChars = new Set<number>();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / scrambleDuration, 1);
      
      // Determine how many characters should be revealed
      const shouldBeRevealed = Math.floor((elapsed / charRevealDelay));
      
      let newText = '';
      for (let i = 0; i < textLength; i++) {
        const char = text[i];
        
        // Space always stays space
        if (char === ' ') {
          newText += ' ';
          continue;
        }
        
        // Reveal character if its time has come
        if (i < shouldBeRevealed || Math.random() < progress) {
          revealedChars.add(i);
        }
        
        if (revealedChars.has(i)) {
          newText += char;
        } else {
          // Random scramble character
          newText += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      
      setDisplayText(newText);
      
      if (progress < 1 || revealedChars.size < textLength) {
        requestAnimationFrame(animate);
      } else {
        // Ensure final text is correct
        setDisplayText(text);
        setIsScrambling(false);
      }
    };

    requestAnimationFrame(animate);
  }, [text]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create ScrollTrigger
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: triggerPoint,
      onEnter: scramble,
    });

    return () => {
      trigger.kill();
    };
  }, [scramble, triggerPoint]);

  return (
    <span 
      ref={containerRef} 
      className={`relative inline-block ${className}`}
      style={containerStyle}
    >
      {/* The scrambled text */}
      <span 
        className="font-mono tracking-tight"
        style={{ 
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          whiteSpace: 'pre-wrap',
        }}
        aria-hidden="true"
      >
        {displayText}
      </span>
      
      {/* Hidden real text for SEO/accessibility */}
      <span className="sr-only">{text}</span>
    </span>
  );
}

export default TextScramble;
