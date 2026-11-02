import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { themeFor } from '@/lib/theme';

const rgb = (t: string) => t.split(' ').map((n) => Number(n) / 255) as [number, number, number];

/**
 * Lightweight WebGL "molten light" backdrop in the brand red→orange.
 * ~3 KB, no three.js. Renders at reduced resolution, pauses off-screen,
 * follows the pointer, and draws a single still frame for reduced motion.
 */
const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uIntensity;
uniform vec3 uA1;
uniform vec3 uA2;
uniform vec3 uA3;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 r = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++){ v += a * noise(p); p = r * p * 2.02; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes.xy) / uRes.y;
  float t = uTime * 0.06;

  vec2 m = (uMouse - 0.5) * vec2(uRes.x / uRes.y, 1.0);
  vec2 q = vec2(fbm(p * 1.4 + vec2(0.0, t)), fbm(p * 1.4 + vec2(5.2, -t)));
  vec2 r = vec2(fbm(p * 1.8 + 3.0 * q + vec2(1.7, 9.2) + t * 1.5), fbm(p * 1.8 + 3.0 * q + vec2(8.3, 2.8) - t));
  float f = fbm(p * 1.6 + 2.5 * r);

  // bias the light towards the upper right and the pointer
  float glow = smoothstep(1.25, 0.0, length(p - vec2(0.7, 0.3)));
  float mglow = smoothstep(0.75, 0.0, length(p - m));
  float k = f * f * (0.55 + 0.9 * glow + 0.6 * mglow);

  vec3 black = vec3(0.02);
  vec3 red = uA1;
  vec3 orange = uA2;
  vec3 cream = uA3;

  vec3 col = mix(black, red, smoothstep(0.08, 0.55, k));
  col = mix(col, orange, smoothstep(0.32, 0.8, k * (0.8 + length(q))));
  col = mix(col, cream, smoothstep(0.75, 1.15, k * 1.25) * 0.6);

  // contour lines for a "designed" feel
  float lines = smoothstep(0.02, 0.0, abs(fract(f * 9.0) - 0.5) - 0.47) * 0.08 * glow;
  col += lines * orange;

  // vignette + fade to background at the bottom
  col *= smoothstep(1.3, 0.25, length(uv - vec2(0.6, 0.6)));
  col *= smoothstep(0.0, 0.35, uv.y);
  // keep the left (text) side darker
  col *= mix(0.35, 1.0, smoothstep(0.05, 0.75, uv.x));
  col *= uIntensity * 0.72;

  gl_FragColor = vec4(col, 1.0);
}`;

const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;

export default function ShaderBackdrop({ className, intensity = 1 }: { className?: string; intensity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) {
      canvas.style.display = 'none';
      return;
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      canvas.style.display = 'none';
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uMouse = gl.getUniformLocation(prog, 'uMouse');
    const uInt = gl.getUniformLocation(prog, 'uIntensity');
    gl.uniform1f(uInt, intensity);
    const theme = themeFor(window.location.pathname);
    gl.uniform3f(gl.getUniformLocation(prog, 'uA1'), ...rgb(theme.a1));
    gl.uniform3f(gl.getUniformLocation(prog, 'uA2'), ...rgb(theme.a2));
    gl.uniform3f(gl.getUniformLocation(prog, 'uA3'), ...rgb(theme.a3));

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scale = Math.min(window.devicePixelRatio, 1.5) * (window.innerWidth < 768 ? 0.45 : 0.6);

    const resize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * scale));
      const h = Math.max(1, Math.floor(canvas.clientHeight * scale));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const mouse = { x: 0.75, y: 0.6, tx: 0.75, ty: 0.6 };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) / r.width;
      mouse.ty = 1 - (e.clientY - r.top) / r.height;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    let visible = true;
    const vis = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    vis.observe(canvas);

    let raf = 0;
    const start = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      gl.uniform1f(uTime, (now - start) / 1000 + 20);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    if (reduce) {
      gl.uniform1f(uTime, 24);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    } else {
      raf = requestAnimationFrame(frame);
    }
    canvas.style.opacity = '1';

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      vis.disconnect();
      window.removeEventListener('pointermove', onMove);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [intensity]);

  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
      {/* CSS fallback / first paint */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_75%_25%,rgb(var(--a1)/0.3),rgb(var(--a2)/0.08)_45%,transparent_70%)]" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-1000" />
    </div>
  );
}
