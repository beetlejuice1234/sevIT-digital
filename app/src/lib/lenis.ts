import type Lenis from 'lenis';

/** The app-wide smooth-scroll instance (null when reduced motion is on). */
let instance: Lenis | null = null;
export const setLenis = (l: Lenis | null) => {
  instance = l;
};
export const getLenis = () => instance;
