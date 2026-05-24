import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ArrowRight, 
  Briefcase, 
  Sparkles, 
  Rocket, 
  Upload, 
  CheckCircle2, 
  FileText, 
  Zap, 
  Globe, 
  Heart,
  Loader2,
  X
} from 'lucide-react';
import { useTextReveal } from '@/hooks/useTextReveal';

gsap.registerPlugin(ScrollTrigger);

// ─── Data ──────────────────────────────────────────────────────────────────
const roles = [
  {
    id: 'ui-ux-designer',
    title: 'Senior UI/UX Designer',
    type: 'Full-time / Remote',
    category: 'Design',
    description: 'Lead the visual direction of high-end digital experiences for global brands.',
    requirements: ['5+ years experience', 'Mastery of Figma & GSAP', 'Strong portfolio of motion design'],
  },
  {
    id: 'frontend-engineer',
    title: 'Frontend Engineer (React)',
    type: 'Full-time / Remote',
    category: 'Engineering',
    description: 'Build blazing-fast, animation-rich web applications using the latest tech stack.',
    requirements: ['React/Next.js expert', 'Tailwind CSS & TypeScript', 'Experience with 3D/Three.js is a plus'],
  },
  {
    id: 'ai-automation-engineer',
    title: 'AI Automation Specialist',
    type: 'Project-based / Remote',
    category: 'AI',
    description: 'Architect and deploy custom AI workflows and intelligent agents for enterprise clients.',
    requirements: ['LLM integration experience', 'Python & Node.js', 'Obsession with workflow efficiency'],
  },
  {
    id: '3d-render-artist',
    title: '3D Render Artist',
    type: 'Project-based / Remote',
    category: 'Creative',
    description: 'Create photorealistic product renders and cinematic lifestyle animations.',
    requirements: ['Blender/C4D mastery', 'Advanced material & lighting skills', 'Experience with Octane/Redshift'],
  },
];

const benefits = [
  { icon: Globe, title: 'Remote-First', desc: 'Work from anywhere in the world. We value output over office hours.' },
  { icon: Zap, title: 'Latest Tech', desc: 'We play with the newest toys. From AI agents to high-end 3D engines.' },
  { icon: Heart, title: 'Passion Driven', desc: 'No boring corporate red tape. Just high-impact work that matters.' },
  { icon: Rocket, title: 'Rapid Growth', desc: 'Join an elite squad where you can scale your skills at warp speed.' },
];

// ─── Components ─────────────────────────────────────────────────────────────

function RoleCard({ role, onApply }: { role: typeof roles[0], onApply: (role: string) => void }) {
  return (
    <div className="group relative bg-white/[0.02] border border-white/10 rounded-2xl p-6 lg:p-8 hover:border-accent/50 transition-all duration-500 hover:bg-white/[0.04]">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-accent font-bold block mb-2">{role.category}</span>
          <h3 className="text-xl lg:text-2xl font-black tracking-tight group-hover:text-white transition-colors">{role.title}</h3>
        </div>
        <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-white/40 uppercase tracking-widest font-medium">
          {role.type}
        </div>
      </div>
      
      <p className="text-white/50 text-sm leading-relaxed mb-6">{role.description}</p>
      
      <div className="space-y-2 mb-8">
        {role.requirements.map((req, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-white/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-accent/50" />
            <span>{req}</span>
          </div>
        ))}
      </div>
      
      <button 
        onClick={() => onApply(role.title)}
        className="inline-flex items-center gap-2 text-sm font-bold text-white group/btn"
      >
        <span>Apply Now</span>
        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
      </button>
      
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
    </div>
  );
}

function CareersPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);
  const formRef = useRef<HTMLDivElement>(null);

  const [selectedRole, setSelectedRole] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSubmittingSuccess] = useState(false);

  const titleRef = useTextReveal<HTMLHeadingElement>();

  // ─── Animations ───────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const stars: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];
    for (let i = 0; i < 80; i++) {
      stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: Math.random() * 1.5 + 0.5, speed: Math.random() * 0.3 + 0.1, opacity: Math.random() * 0.5 + 0.2 });
    }

    const animate = () => {
      if (!isVisibleRef.current) { animationRef.current = requestAnimationFrame(animate); return; }
      ctx.fillStyle = 'rgba(5, 5, 5, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
        star.y += star.speed;
        if (star.y > canvas.height) { star.y = 0; star.x = Math.random() * canvas.width; }
      });
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { isVisibleRef.current = entry.isIntersecting; }); },
      { threshold: 0 }
    );
    observer.observe(canvas);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-subtitle', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.8 });
      gsap.fromTo('.role-card', { opacity: 0, y: 50 }, { 
        opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.roles-section', start: 'top 80%', once: true }
      });
      gsap.fromTo('.benefit-item', { opacity: 0, scale: 0.9 }, { 
        opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.7)',
        scrollTrigger: { trigger: '.benefits-section', start: 'top 85%', once: true }
      });
    });
    return () => ctx.revert();
  }, []);

  // ─── Form Handling ────────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else if (selectedFile) {
      alert('Please upload a PDF file.');
    }
  };

  const scrollToForm = (roleTitle: string) => {
    setSelectedRole(roleTitle);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmittingSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <Helmet>
        <title>Careers & Elite Opportunities | sevIT Digital</title>
        <meta name="description" content="Join the next generation of digital pioneers. We are looking for elite specialists in UI/UX, Frontend Engineering, AI Automation, and 3D Rendering. Build the future with us." />
        <meta property="og:title" content="Careers & Elite Opportunities | sevIT Digital" />
        <meta property="og:description" content="We're building a team of extraordinary builders. Explore our open roles and launch your career into the digital cosmos." />
        <meta property="og:image" content="https://sevitdigital.com/images/3dlogo.webp" />
        <link rel="canonical" href="https://sevitdigital.com/#/careers" />
      </Helmet>
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-6 lg:px-12 pt-32 pb-20 z-10">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(139, 92, 246, 0.12) 0%, transparent 60%)' }} />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full mb-8">
            <Briefcase className="w-4 h-4 text-accent" />
            <span className="text-xs uppercase tracking-[0.3em] text-accent">Join the cosmos</span>
          </div>

          <h1 ref={titleRef} className="text-6xl sm:text-7xl lg:text-9xl font-black leading-[0.9] tracking-tighter mb-8 uppercase">
            BUILD THE<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-purple-500 to-accent">FUTURE.</span>
          </h1>

          <p className="hero-subtitle text-base sm:text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed opacity-0">
            We are looking for elite specialists who live at the intersection of art and engineering. Join a remote-first team building the next generation of digital tools, 3D experiences, and AI agents.
          </p>

          <div className="hero-subtitle opacity-0 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#roles" className="px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-wider hover:bg-accent hover:text-white transition-all">
              View Open Roles
            </a>
            <a href="#benefits" className="px-8 py-4 border border-white/20 rounded-full font-bold uppercase tracking-wider hover:bg-white/5 transition-all">
              Our Culture
            </a>
          </div>
        </div>
      </section>

      {/* ── BENEFITS ─────────────────────────────────────────────────────────── */}
      <section id="benefits" className="benefits-section relative py-24 px-6 lg:px-12 z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, i) => (
              <div key={i} className="benefit-item flex flex-col items-center text-center opacity-0">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                  <benefit.icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OPEN ROLES ───────────────────────────────────────────────────────── */}
      <section id="roles" className="roles-section relative py-24 md:py-32 px-6 lg:px-12 z-10 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full mb-6">
              <Sparkles className="w-3 h-3 text-accent" />
              <span className="text-xs uppercase tracking-[0.2em] text-white/40">Openings</span>
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight">MISSION CONTROL</h2>
            <p className="text-white/50 mt-4 max-w-xl mx-auto">
              If you don't see a role that fits but you're extraordinary, apply under "General Application".
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roles.map((role) => (
              <div key={role.id} className="role-card opacity-0">
                <RoleCard role={role} onApply={scrollToForm} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPLICATION FORM ─────────────────────────────────────────────────── */}
      <section ref={formRef} id="apply" className="relative py-24 md:py-32 px-6 lg:px-12 z-10 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/20 blur-[100px] pointer-events-none" />
            
            {isSuccess ? (
              <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 className="w-10 h-10 text-accent" />
                </div>
                <h3 className="text-3xl font-black mb-4 uppercase">Transmission Received</h3>
                <p className="text-white/50 text-lg max-w-md mx-auto mb-10">
                  Our team has received your application. If there's a match, we'll reach out across the digital void soon.
                </p>
                <button 
                  onClick={() => setIsSubmittingSuccess(false)}
                  className="px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-wider hover:bg-accent hover:text-white transition-all"
                >
                  Send another
                </button>
              </div>
            ) : (
              <>
                <div className="mb-12">
                  <h2 className="text-3xl sm:text-4xl font-black mb-4 uppercase">Apply for Impact</h2>
                  <p className="text-white/40">Ready to join sevIT? Fill out the form below and upload your CV.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-white/40 font-bold ml-1">Full Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="John Doe"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-accent/50 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-white/40 font-bold ml-1">Email Address</label>
                      <input 
                        required
                        type="email" 
                        placeholder="john@example.com"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-accent/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/40 font-bold ml-1">Applying for Position</label>
                    <select 
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-accent/50 transition-colors appearance-none"
                    >
                      <option value="" className="bg-[#0a0a0a]">Select a role</option>
                      {roles.map(r => <option key={r.id} value={r.title} className="bg-[#0a0a0a]">{r.title}</option>)}
                      <option value="General Application" className="bg-[#0a0a0a]">General Application</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/40 font-bold ml-1">CV / Resume (PDF Only)</label>
                    <div className="relative group/upload">
                      <input 
                        type="file" 
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className={`w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-all ${file ? 'border-accent/50 bg-accent/5' : 'border-white/10 hover:border-white/20'}`}>
                        {file ? (
                          <>
                            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl">
                              <FileText className="w-5 h-5 text-accent" />
                              <span className="text-sm font-medium">{file.name}</span>
                              <button 
                                onClick={(e) => { e.preventDefault(); setFile(null); }}
                                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <span className="text-[10px] text-white/30 uppercase tracking-widest">Click or drag to replace</span>
                          </>
                        ) : (
                          <>
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover/upload:scale-110 transition-transform">
                              <Upload className="w-6 h-6 text-white/40" />
                            </div>
                            <span className="text-sm text-white/40 font-medium">Click or drag your PDF here</span>
                            <span className="text-[10px] text-white/20 uppercase tracking-widest">Max size 5MB</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/40 font-bold ml-1">Tell us why you're extraordinary</label>
                    <textarea 
                      placeholder="I once built a..."
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-accent/50 transition-colors resize-none"
                    />
                  </div>

                  <button 
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full py-5 bg-accent text-white rounded-full font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Sending Signal...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Application</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── SPACE FOOTER ─────────────────────────────────────────────────────── */}
      <section className="relative py-20 px-6 lg:px-12 z-10 text-center">
        <div className="max-w-2xl mx-auto opacity-20">
          <p className="text-[10px] uppercase tracking-[0.5em]">sevIT Digital Agency — Recruitment Division</p>
        </div>
      </section>
    </div>
  );
}

export default CareersPage;
