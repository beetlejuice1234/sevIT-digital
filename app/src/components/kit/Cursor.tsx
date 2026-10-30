import { useEffect, useRef, useState } from 'react';

/**
 * A small accent dot that trails the pointer and opens into a label over
 * anything marked with data-cursor="View" (or "Play", "Drag" …).
 * Mouse-only: hidden on touch devices and when reduced motion is on.
 */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || calm) return;
    const pos = { x: -100, y: -100, tx: -100, ty: -100 };
    let raf = 0;
    const loop = () => {
      pos.x += (pos.tx - pos.x) * 0.22;
      pos.y += (pos.ty - pos.y) * 0.22;
      if (ref.current) ref.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const move = (e: PointerEvent) => {
      pos.tx = e.clientX;
      pos.ty = e.clientY;
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor]');
      setLabel(t?.dataset.cursor ?? null);
      setOn(true);
    };
    const leave = () => setOn(false);
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[90] hidden [@media(pointer:fine)]:block">
      <div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-a2 text-[13px] font-semibold text-black transition-[width,height,opacity] duration-300 [transition-timing-function:var(--ease-out)]"
        style={{ width: label ? 84 : 10, height: label ? 84 : 10, opacity: on ? 1 : 0 }}
      >
        <span className={label ? 'opacity-100 transition-opacity delay-100' : 'opacity-0'}>{label}</span>
      </div>
    </div>
  );
}
