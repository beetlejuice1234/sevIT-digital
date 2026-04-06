import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Search, Mail, BarChart3, Rocket, GripHorizontal, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import BackToHome from '../../components/BackToHome';

gsap.registerPlugin(ScrollTrigger);

// Growth Calculator
function GrowthCalculator() {
  const [monthlyTraffic, setMonthlyTraffic] = useState(5000);
  const [conversionRate, setConversionRate] = useState(2);
  const [avgOrderValue, setAvgOrderValue] = useState(100);
  
  const currentRevenue = monthlyTraffic * (conversionRate / 100) * avgOrderValue;
  const projectedTraffic = monthlyTraffic * 3; // 3x traffic goal
  const projectedRevenue = projectedTraffic * (conversionRate / 100) * avgOrderValue * 1.5; // 1.5x from CRO
  const annualIncrease = (projectedRevenue - currentRevenue) * 12;

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 lg:p-12 backdrop-blur-sm">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Inputs */}
        <div className="space-y-8">
          {/* Traffic Slider */}
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm text-white/50 uppercase tracking-wider">Monthly Website Traffic</label>
              <span className="text-3xl font-black text-red-500">{monthlyTraffic.toLocaleString()}</span>
            </div>
            <div className="relative h-14 bg-white/5 rounded-2xl border border-white/10 flex items-center px-4">
              <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-2 bg-white/10 rounded-full">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all" style={{ width: `${(monthlyTraffic / 50000) * 100}%` }} />
              </div>
              <input type="range" min="1000" max="50000" step="500" value={monthlyTraffic} onChange={(e) => setMonthlyTraffic(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <div className="absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30 pointer-events-none transition-all" style={{ left: `calc(${(monthlyTraffic / 50000) * 100}% - 20px + 16px)` }}>
                <GripHorizontal className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex justify-between mt-2 px-4">
              <span className="text-xs text-white/30">1K</span>
              <span className="text-xs text-white/30">25K</span>
              <span className="text-xs text-white/30">50K</span>
            </div>
          </div>

          {/* Conversion Rate Slider */}
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm text-white/50 uppercase tracking-wider">Current Conversion Rate</label>
              <span className="text-3xl font-black text-white">{conversionRate.toFixed(1)}%</span>
            </div>
            <div className="relative h-14 bg-white/5 rounded-2xl border border-white/10 flex items-center px-4">
              <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-2 bg-white/10 rounded-full">
                <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all" style={{ width: `${(conversionRate / 10) * 100}%` }} />
              </div>
              <input type="range" min="0.5" max="10" step="0.1" value={conversionRate} onChange={(e) => setConversionRate(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <div className="absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg pointer-events-none transition-all" style={{ left: `calc(${(conversionRate / 10) * 100}% - 20px + 16px)` }}>
                <GripHorizontal className="w-5 h-5 text-black" />
              </div>
            </div>
            <div className="flex justify-between mt-2 px-4">
              <span className="text-xs text-white/30">0.5%</span>
              <span className="text-xs text-white/30">5%</span>
              <span className="text-xs text-white/30">10%</span>
            </div>
          </div>

          {/* AOV Slider */}
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm text-white/50 uppercase tracking-wider">Average Order Value</label>
              <span className="text-3xl font-black text-white">${avgOrderValue}</span>
            </div>
            <div className="relative h-14 bg-white/5 rounded-2xl border border-white/10 flex items-center px-4">
              <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-2 bg-white/10 rounded-full">
                <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all" style={{ width: `${((avgOrderValue - 50) / 450) * 100}%` }} />
              </div>
              <input type="range" min="50" max="500" step="10" value={avgOrderValue} onChange={(e) => setAvgOrderValue(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <div className="absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 pointer-events-none transition-all" style={{ left: `calc(${((avgOrderValue - 50) / 450) * 100}% - 20px + 16px)` }}>
                <GripHorizontal className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex justify-between mt-2 px-4">
              <span className="text-xs text-white/30">$50</span>
              <span className="text-xs text-white/30">$275</span>
              <span className="text-xs text-white/30">$500</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="bg-white/[0.05] rounded-2xl p-6 border border-white/10">
            <span className="text-sm text-white/40 uppercase tracking-wider block mb-2">Current Monthly Revenue</span>
            <span className="text-4xl font-bold text-white/50">${currentRevenue.toLocaleString()}</span>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <span className="text-sm text-red-400 uppercase tracking-wider block mb-2">Projected with sevIT</span>
            <span className="text-5xl font-black text-white">${projectedRevenue.toLocaleString()}</span>
            <span className="text-sm text-red-400 block mt-1">/month (3x traffic + CRO)</span>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6">
            <span className="text-sm text-white/80 uppercase tracking-wider block mb-2">Additional Annual Revenue</span>
            <span className="text-6xl font-black text-white">+${annualIncrease.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Service Card
function ServiceCard({ icon: Icon, title, description, features }: { 
  icon: React.ComponentType<{ className?: string }>; 
  title: string; 
  description: string;
  features: string[];
}) {
  return (
    <div className="group relative bg-white/[0.02] border border-white/10 rounded-3xl p-8 hover:border-emerald-500/50 transition-all duration-500">
      <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6">
        <Icon className="w-7 h-7 text-emerald-500" />
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-white/50 text-sm mb-6">{description}</p>
      <ul className="space-y-3">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-white/70">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MarketingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);

  // Starfield background with IntersectionObserver
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const stars: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];
    for (let i = 0; i < 80; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const animate = () => {
      if (!isVisibleRef.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      ctx.fillStyle = 'rgba(5, 5, 5, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    // IntersectionObserver to pause when not visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-line', 
        { opacity: 0, y: 80 }, 
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.3 }
      );
      
      gsap.fromTo('.service-card', 
        { opacity: 0, y: 60 }, 
        { 
          opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: '.services-section', start: 'top 80%', once: true }
        }
      );

      gsap.fromTo('.calculator-section', 
        { opacity: 0, y: 60 }, 
        { 
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.calculator-section', start: 'top 80%', once: true }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />

      {/* Back Navigation - New Design */}
      <BackToHome accentColor="#10B981" variant="floating" />

      {/* HERO */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-6 lg:px-12 pt-32 z-10">
        <div className="absolute inset-0 pointer-events-none" 
          style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(16, 185, 129, 0.15) 0%, transparent 60%)' }} 
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-8">
            <Rocket className="w-4 h-4 text-emerald-500" />
            <span className="text-xs uppercase tracking-[0.3em] text-emerald-400">Growth Marketing</span>
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-8">
            <span className="hero-line block opacity-0">TRAFFIC THAT</span>
            <span className="hero-line block text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-500 opacity-0">
              CONVERTS.
            </span>
          </h1>

          <p className="hero-line text-xl text-white/50 max-w-2xl mx-auto mb-10 opacity-0">
            SEO, content, and CRO engineered to turn visitors into revenue. No fluff. Just growth.
          </p>

          <div className="hero-line opacity-0">
            <Link 
              to="/#chat" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-red-500 text-white rounded-full font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all group"
            >
              <span>Get Your Growth Plan</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* GROWTH CALCULATOR */}
      <section className="calculator-section relative py-24 px-6 lg:px-12 z-10 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm text-emerald-400 uppercase tracking-wider">Growth Calculator</span>
            <h2 className="text-4xl lg:text-5xl font-black mt-2">See Your Growth Potential</h2>
            <p className="text-white/40 mt-4">Drag the sliders to see what's possible</p>
          </div>
          <GrowthCalculator />
        </div>
      </section>

      {/* SERVICES */}
      <section className="services-section relative py-24 px-6 lg:px-12 z-10 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm text-red-400 uppercase tracking-wider">What We Do</span>
            <h2 className="text-4xl lg:text-5xl font-black mt-2">Three Engines. One Goal.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="service-card opacity-0">
              <ServiceCard
                icon={Search}
                title="SEO"
                description="Rank higher. Get found. Capture organic demand."
                features={['Technical SEO', 'Content Strategy', 'Link Building', 'Local SEO']}
              />
            </div>
            <div className="service-card opacity-0">
              <ServiceCard
                icon={Target}
                title="CRO"
                description="Convert more visitors. Maximize revenue per click."
                features={['A/B Testing', 'Landing Pages', 'User Research', 'Funnel Optimization']}
              />
            </div>
            <div className="service-card opacity-0">
              <ServiceCard
                icon={Mail}
                title="Email Marketing"
                description="Nurture leads. Increase lifetime value."
                features={['Automated Flows', 'Segmentation', 'Newsletters', 'Retention Campaigns']}
              />
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="relative py-16 px-6 lg:px-12 z-10 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm text-red-400 uppercase tracking-wider">How We Work</span>
            <h2 className="text-4xl lg:text-5xl font-black mt-2">The Growth Flywheel</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-bold mb-2">Attract</h3>
              <p className="text-sm text-white/50">SEO & content that brings qualified traffic</p>
            </div>
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-bold mb-2">Convert</h3>
              <p className="text-sm text-white/50">CRO that turns visitors into customers</p>
            </div>
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-bold mb-2">Nurture</h3>
              <p className="text-sm text-white/50">Email that keeps them coming back</p>
            </div>
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-bold mb-2">Scale</h3>
              <p className="text-sm text-white/50">Data-driven optimization loop</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 px-6 lg:px-12 z-10 border-t border-white/10 overflow-hidden">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(239, 68, 68, 0.2) 0%, transparent 60%)' }} 
        />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-5xl lg:text-6xl font-black mb-6">Ready to Grow?</h2>
          <p className="text-xl text-white/50 mb-10">
            Free growth audit. We'll show you exactly where the opportunities are.
          </p>
          <Link 
            to="/#chat" 
            className="inline-flex items-center gap-3 px-10 py-5 bg-red-500 text-white rounded-full font-bold text-lg uppercase tracking-wider hover:bg-white hover:text-black transition-all group"
          >
            <span>Get Your Free Audit</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default MarketingPage;
