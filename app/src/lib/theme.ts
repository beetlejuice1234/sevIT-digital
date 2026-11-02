/**
 * Per-page accent colours. Each page keeps the black base but gets its own
 * accent (as the original site did). Values are "r g b" triplets so they can be
 * used as rgb(var(--a2) / <alpha>) in CSS and Tailwind (a1 / a2 / a3 classes).
 *   a1 = deep, a2 = main, a3 = light
 */
export type Theme = { a1: string; a2: string; a3: string };

export const THEMES: Record<string, Theme> = {
  home: { a1: '239 68 68', a2: '249 115 22', a3: '253 186 116' }, // sevIT red → orange
  'web-design': { a1: '220 38 38', a2: '239 68 68', a3: '252 165 165' }, // red
  'software-pos': { a1: '37 99 235', a2: '59 130 246', a3: '147 197 253' }, // blue
  'ai-solutions': { a1: '8 145 178', a2: '6 182 212', a3: '103 232 249' }, // cyan
  '3d-rendering': { a1: '124 58 237', a2: '139 92 246', a3: '196 181 253' }, // violet
  branding: { a1: '219 39 119', a2: '236 72 153', a3: '249 168 212' }, // pink
  advertising: { a1: '217 119 6', a2: '245 158 11', a3: '252 211 77' }, // amber
  marketing: { a1: '5 150 105', a2: '16 185 129', a3: '110 231 183' }, // emerald
  careers: { a1: '109 40 217', a2: '139 92 246', a3: '196 181 253' }, // violet
};

export const themeFor = (pathname: string): Theme => {
  const m = pathname.match(/^\/services\/([^/]+)/);
  if (m && THEMES[m[1]]) return THEMES[m[1]];
  if (pathname.startsWith('/careers')) return THEMES.careers;
  return THEMES.home;
};

/** Inline style that scopes a theme to one element (e.g. a service card). */
export const themeStyle = (t: Theme) =>
  ({ '--a1': t.a1, '--a2': t.a2, '--a3': t.a3 }) as React.CSSProperties;

export const applyTheme = (t: Theme) => {
  const s = document.documentElement.style;
  s.setProperty('--a1', t.a1);
  s.setProperty('--a2', t.a2);
  s.setProperty('--a3', t.a3);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#050505');
};
