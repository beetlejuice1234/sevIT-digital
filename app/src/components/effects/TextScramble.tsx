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

  const scramble = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const textLength = text.length;
    const scrambleDuration = 1500; // Snappier for better UX
    const charRevealDelay = 30; 
    
    const startTime = Date.now();
    const revealedChars = new Set<number>();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / scrambleDuration, 1);
      
      const shouldBeRevealed = Math.floor((elapsed / charRevealDelay));
      
      let newText = '';
      for (let i = 0; i < textLength; i++) {
        const char = text[i];
        
        if (char === ' ') {
          newText += ' ';
          continue;
        }
        
        if (i < shouldBeRevealed || Math.random() < progress) {
          revealedChars.add(i);
        }
        
        if (revealedChars.has(i)) {
          newText += char;
        } else {
          newText += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      
      setDisplayText(newText);
      
      if (progress < 1 || revealedChars.size < textLength) {
        requestAnimationFrame(animate);
      } else {
        setDisplayText(text);
      }
    };

    requestAnimationFrame(animate);
  }, [text]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

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
      className={`inline-grid grid-cols-1 grid-rows-1 ${className}`}
      style={{
        verticalAlign: 'bottom',
        transform: 'translateZ(0)',
      }}
    >
      {/* Ghost text - defines the stable size */}
      <span 
        className="invisible select-none pointer-events-none"
        style={{ 
          gridArea: '1 / 1 / 2 / 2',
          whiteSpace: 'pre-wrap'
        }}
        aria-hidden="true"
      >
        {text}
      </span>

      {/* Scrambled text - overlays the ghost */}
      <span 
        style={{ 
          gridArea: '1 / 1 / 2 / 2',
          whiteSpace: 'pre-wrap'
        }}
        aria-hidden="true"
      >
        {displayText}
      </span>
      
      <span className="sr-only">{text}</span>
    </span>
  );
}

export default TextScramble;
