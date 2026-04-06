# Technical Specification: Nexus AI Agency Website

## Component Inventory

### shadcn/ui Components (Built-in)
| Component | Purpose | Customization |
|-----------|---------|---------------|
| Button | CTAs, form submission | Custom colors, rounded-full variant |
| Card | Service cards, chat window | Dark theme, custom border radius |
| Input | Chat input, newsletter | Dark background, custom focus ring |
| Badge | Service tags | Custom color variants |
| Separator | Section dividers | Custom opacity |

### Third-Party Registry Components
| Component | Registry | Purpose |
|-----------|----------|---------|
| None required | - | Custom implementations preferred for performance |

### Custom Components
| Component | Purpose | Location |
|-----------|---------|----------|
| NeuralBackground | WebGL particle system | `components/NeuralBackground.tsx` |
| StackingCards | Service deck animation | `components/StackingCards.tsx` |
| ChatInterface | AI chat simulation | `components/ChatInterface.tsx` |
| ProcessPipeline | SVG line animation | `components/ProcessPipeline.tsx` |
| TextScramble | Character scramble effect | `components/TextScramble.tsx` |
| CustomCursor | Cursor effects | `components/CustomCursor.tsx` |

---

## Animation Implementation Table

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| Neural Background | Three.js/React Three Fiber | ShaderMaterial with particle system, mouse interaction via uniforms | High |
| Hero Text Reveal | GSAP | Clip-path animation with staggered timeline | Medium |
| Text Scramble | GSAP + Custom | Character replacement animation on scroll trigger | Medium |
| Stacking Cards | GSAP ScrollTrigger | Pin section, scrub card transforms (translateY, scale) | High |
| SVG Line Draw | GSAP DrawSVG | stroke-dasharray animation on scroll | Low |
| Chat Messages | GSAP Timeline | Staggered slide-in animations with delays | Medium |
| Custom Cursor | React + CSS | Mouse position tracking, scale on hover states | Low |
| Button Hover | CSS/Tailwind | Background inversion, transition effects | Low |
| Loading Screen | GSAP | Progress bar fill, curtain lift exit | Medium |

---

## Animation Library Choices

### Primary: GSAP (GreenSock)
**Rationale**: 
- Industry-standard for complex scroll-driven animations
- ScrollTrigger plugin for pinning and scrubbing
- Excellent performance with hardware acceleration
- Precise timeline control for sequential animations

**Plugins Required**:
- `ScrollTrigger` - For pinning and scroll-linked animations
- `Flip` (optional) - For layout transitions

### Secondary: React Three Fiber
**Rationale**:
- React-friendly wrapper for Three.js
- Declarative component structure for WebGL
- Excellent for the neural network background

**Dependencies**:
- `@react-three/fiber`
- `@react-three/drei` (for helpers)
- `three`

### Smooth Scrolling: Lenis
**Rationale**:
- Smooth momentum scrolling
- Better sync with WebGL render loop
- Lightweight alternative to Locomotive Scroll

---

## Project File Structure

```
app/
├── sections/
│   ├── Hero.tsx              # Hero with neural background
│   ├── Manifesto.tsx         # Mission statement with text scramble
│   ├── Services.tsx          # Stacking cards section
│   ├── Process.tsx           # Pipeline with SVG animation
│   └── ChatSection.tsx       # AI chat interface
├── components/
│   ├── NeuralBackground.tsx  # WebGL particle system
│   ├── StackingCards.tsx     # Card stacking animation
│   ├── ChatInterface.tsx     # Chat UI component
│   ├── ProcessPipeline.tsx   # SVG line animation
│   ├── TextScramble.tsx      # Text scramble effect
│   ├── CustomCursor.tsx      # Custom cursor component
│   ├── LoadingScreen.tsx     # Initial loading animation
│   └── ui/                   # shadcn components
├── hooks/
│   ├── useMousePosition.ts   # Mouse tracking hook
│   ├── useScrollProgress.ts  # Scroll progress hook
│   └── useInView.ts          # Intersection observer hook
├── lib/
│   ├── utils.ts              # Utility functions
│   └── animations.ts         # Animation presets
├── types/
│   └── index.ts              # TypeScript types
├── page.tsx                  # Main page
├── layout.tsx                # Root layout
└── globals.css               # Global styles
```

---

## Dependencies

### Core
```json
{
  "react": "^18.2.0",
  "next": "14.x",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.4.0"
}
```

### Animation
```json
{
  "gsap": "^3.12.0",
  "@gsap/react": "^2.1.0",
  "lenis": "^1.1.0",
  "@react-three/fiber": "^8.16.0",
  "@react-three/drei": "^9.105.0",
  "three": "^0.164.0"
}
```

### UI
```json
{
  "lucide-react": "latest",
  "class-variance-authority": "latest",
  "clsx": "latest",
  "tailwind-merge": "latest"
}
```

---

## Performance Optimizations

### WebGL
- Limit particle count to 150-200
- Use instanced mesh for particles
- Disable shadows
- Run at half-pixel ratio on high-DPI screens
- Pause animation when tab is inactive

### Scroll Animations
- Use `will-change: transform` on animated elements
- Throttle scroll events
- Use CSS transforms only (no layout properties)
- Implement `content-visibility: auto` for off-screen sections

### General
- Lazy load below-fold sections
- Preload critical fonts
- Use `requestAnimationFrame` for custom animations
- Implement reduced-motion media query support

---

## Responsive Breakpoints

| Breakpoint | Width | Adjustments |
|------------|-------|-------------|
| Mobile | < 640px | Single column, reduced particles, no custom cursor |
| Tablet | 640-1024px | Two columns where applicable |
| Desktop | > 1024px | Full experience |

---

## Color Tokens (Tailwind Config)

```javascript
colors: {
  background: '#050505',
  surface: '#111111',
  foreground: '#FFFFFF',
  muted: '#A0A0A0',
  accent: '#3B82F6',
  border: '#222222',
}
```

---

## Typography Scale

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 (Hero) | 12vw / 15vw mobile | 700 | 0.9 |
| H2 | 4vw | 600 | 1.1 |
| H3 | 1.5rem | 600 | 1.3 |
| Body | 1.125rem | 400 | 1.6 |
| Label | 0.875rem | 500 | 1.4 |

---

## Implementation Order

1. **Setup**: Initialize project, install dependencies
2. **Layout**: Create base layout with dark theme
3. **Neural Background**: Implement WebGL particle system
4. **Hero Section**: Text reveal animations
5. **Loading Screen**: Initial loading animation
6. **Manifesto**: Text scramble effect
7. **Services**: Stacking cards with ScrollTrigger
8. **Process**: SVG line animation
9. **Chat Section**: Chat interface with message animations
10. **Custom Cursor**: Cursor effects
11. **Polish**: Micro-interactions, hover states
12. **Responsive**: Mobile adaptations
13. **Performance**: Optimizations and testing
