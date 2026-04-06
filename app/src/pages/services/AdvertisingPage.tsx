import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight, TrendingUp, Search, Share2, Target, Zap, ChevronRight, GripHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

// ROI Calculator Component with obvious sliders
function ROICalculator() {
  const [monthlySpend, setMonthlySpend] = useState(5000);
  const [currentROAS, setCurrentROAS] = useState(2.5);
  const [targetROAS] = useState(5.0);
  
  const currentRevenue = monthlySpend * currentROAS;
  const targetRevenue = monthlySpend * targetROAS;
  const additionalRevenue = targetRevenue - currentRevenue;
  const annualGain = additionalRevenue * 12;

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 lg:p-12 backdrop-blur-sm">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Inputs */}
        <div className="space-y-10">
          {/* Monthly Spend Slider */}
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm text-white/50 uppercase tracking-wider">
                Monthly Ad Spend
              </label>
              <span className="text-3xl font-black text-red-500">
                ${monthlySpend.toLocaleString()}
              </span>
            </div>
            
            {/* Slider Track with markers */}
            <div className="relative h-14 bg-white/5 rounded-2xl border border-white/10 flex items-center px-4">
              <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-2 bg-white/10 rounded-full">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all"
                  style={{ width: `${((monthlySpend - 1000) / (100000 - 1000)) * 100}%` }}
                />
              </div>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={monthlySpend}
                onChange={(e) => setMonthlySpend(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {/* Visible thumb */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30 pointer-events-none transition-all"
                style={{ left: `calc(${((monthlySpend - 1000) / (100000 - 1000)) * 100}% - 20px + 16px)` }}
              >
                <GripHorizontal className="w-5 h-5 text-white" />
              </div>
            </div>
            
            {/* Markers */}
            <div className="flex justify-between mt-2 px-4">
              <span className="text-xs text-white/30">$1K</span>
              <span className="text-xs text-white/30">$50K</span>
              <span className="text-xs text-white/30">$100K</span>
            </div>
          </div>

          {/* ROAS Slider */}
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm text-white/50 uppercase tracking-wider">
                Current ROAS
              </label>
              <span className="text-3xl font-black text-white">
                {currentROAS.toFixed(1)}x
              </span>
            </div>
            
            {/* Slider Track */}
            <div className="relative h-14 bg-white/5 rounded-2xl border border-white/10 flex items-center px-4">
              <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-2 bg-white/10 rounded-full">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all"
                  style={{ width: `${((currentROAS - 1) / (10 - 1)) * 100}%` }}
                />
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.1"
                value={currentROAS}
                onChange={(e) => setCurrentROAS(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {/* Visible thumb */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg pointer-events-none transition-all"
                style={{ left: `calc(${((currentROAS - 1) / (10 - 1)) * 100}% - 20px + 16px)` }}
              >
                <GripHorizontal className="w-5 h-5 text-black" />
              </div>
            </div>
            
            {/* Markers */}
            <div className="flex justify-between mt-2 px-4">
              <span className="text-xs text-white/30">1x</span>
              <span className="text-xs text-white/30">5x</span>
              <span className="text-xs text-white/30">10x</span>
            </div>
          </div>

          {/* Target indicator */}
          <div className="flex items-center gap-4 p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
            <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-sm text-white/50 block">sevIT Target ROAS</span>
              <span className="text-2xl font-black text-red-500">{targetROAS}x</span>
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
            <span className="text-sm text-red-400 uppercase tracking-wider block mb-2">With sevIT</span>
            <span className="text-5xl font-black text-white">${targetRevenue.toLocaleString()}</span>
            <span className="text-sm text-red-400 block mt-1">/month</span>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6">
            <span className="text-sm text-white/80 uppercase tracking-wider block mb-2">Additional Annual Revenue</span>
            <span className="text-6xl font-black text-white">+${annualGain.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Platform Card Component
function PlatformCard({ icon: Icon, title, description, features }: { 
  icon: React.ComponentType<{ className?: string }>; 
  title: string; 
  description: string;
  features: string[];
}) {
  return (
    <div className="group relative bg-white/[0.02] border border-white/10 rounded-3xl p-8 hover:border-red-500/50 transition-all duration-500 overflow-hidden">
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-red-500/20 blur-3xl opacity-0 group-hover:opacity-30 transition-opacity" />
      
      <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center mb-6">
        <Icon className="w-7 h-7 text-red-500" />
      </div>

      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-white/50 text-sm mb-6">{description}</p>

      <ul className="space-y-3">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-white/70">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Retargeting Funnel Visual
function RetargetingFunnel() {
  const steps = [
    { label: 'Website Visit', percent: '100%', color: '#EF4444' },
    { label: 'Add to Cart', percent: '15%', color: '#F97316' },
    { label: 'Initiate Checkout', percent: '8%', color: '#EAB308' },
    { label: 'Purchase', percent: '3%', color: '#22C55E' },
  ];

  return (
    <div className="relative py-12">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-4 lg:gap-8">
            <div 
              className="relative px-8 py-6 rounded-2xl border backdrop-blur-sm"
              style={{ 
                borderColor: step.color,
                backgroundColor: `${step.color}10`,
                minWidth: '160px'
              }}
            >
              <span className="text-xs uppercase tracking-wider text-white/50 block mb-1">{step.label}</span>
              <span className="text-3xl font-black" style={{ color: step.color }}>{step.percent}</span>
            </div>
            {index < steps.length - 1 && (
              <ChevronRight className="w-6 h-6 text-white/20 hidden lg:block" />
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-center">
        <div className="flex items-center gap-4 text-sm text-white/40">
          <Zap className="w-4 h-4 text-red-500" />
          <span>Retargeting recaptures the 97% who don't convert</span>
        </div>
      </div>
    </div>
  );
}

function AdvertisingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    let animationId: number;
    const animate = () => {
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

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-line', 
        { opacity: 0, y: 80 }, 
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.3 }
      );
      
      gsap.fromTo('.platform-card', 
        { opacity: 0, y: 60 }, 
        { 
          opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: '.platforms-section', start: 'top 80%' }
        }
      );

      gsap.fromTo('.calculator-section', 
        { opacity: 0, y: 60 }, 
        { 
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.calculator-section', start: 'top 80%' }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />

      {/* Back Navigation */}
      <div className="fixed top-24 left-6 z-50">
        <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </Link>
      </div>

      {/* HERO */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-6 lg:px-12 pt-32 z-10">
        <div className="absolute inset-0 pointer-events-none" 
          style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(239, 68, 68, 0.15) 0%, transparent 60%)' }} 
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full mb-8">
            <TrendingUp className="w-4 h-4 text-red-500" />
            <span className="text-xs uppercase tracking-[0.3em] text-red-400">Performance Marketing</span>
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-8">
            <span className="hero-line block opacity-0">ADS THAT</span>
            <span className="hero-line block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 opacity-0">
              PRINT MONEY.
            </span>
          </h1>

          <p className="hero-line text-xl text-white/50 max-w-2xl mx-auto mb-10 opacity-0">
            We turn ad spend into predictable revenue. No vanity metrics. Just profit.
          </p>

          <div className="hero-line opacity-0">
            <Link 
              to="/#chat" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-red-500 text-white rounded-full font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all group"
            >
              <span>Get Your Free Audit</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ROI CALCULATOR */}
      <section className="calculator-section relative py-24 px-6 lg:px-12 z-10 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm text-red-400 uppercase tracking-wider">ROI Calculator</span>
            <h2 className="text-4xl lg:text-5xl font-black mt-2">See What You're Leaving on the Table</h2>
            <p className="text-white/40 mt-4">Drag the sliders to adjust your numbers</p>
          </div>
          <ROICalculator />
        </div>
      </section>

      {/* PLATFORMS */}
      <section className="platforms-section relative py-24 px-6 lg:px-12 z-10 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm text-red-400 uppercase tracking-wider">Our Platforms</span>
            <h2 className="text-4xl lg:text-5xl font-black mt-2">Three Channels. One Goal.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="platform-card opacity-0">
              <PlatformCard
                icon={Search}
                title="Google Ads"
                description="Capture high-intent searches. Dominate position one."
                features={['Search & Shopping', 'YouTube Ads', 'Display Network', 'Keyword Optimization']}
              />
            </div>
            <div className="platform-card opacity-0">
              <PlatformCard
                icon={Share2}
                title="Social Media"
                description="Exploit algorithms. Scale winning creative fast."
                features={['Meta & TikTok', 'Lookalike Audiences', 'Rapid Creative Testing', 'Influencer Integration']}
              />
            </div>
            <div className="platform-card opacity-0">
              <PlatformCard
                icon={Target}
                title="Retargeting"
                description="Follow the 97%. Convert the almost-customers."
                features={['Dynamic Product Ads', 'Sequential Messaging', 'Cross-Platform', 'Cart Recovery']}
              />
            </div>
          </div>
        </div>
      </section>

      {/* RETARGETING FUNNEL */}
      <section className="relative py-24 px-6 lg:px-12 z-10 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm text-red-400 uppercase tracking-wider">The Funnel</span>
            <h2 className="text-4xl lg:text-5xl font-black mt-2">We Don't Let Them Escape</h2>
          </div>
          <RetargetingFunnel />
        </div>
      </section>

      {/* PROCESS */}
      <section className="relative py-16 px-6 lg:px-12 z-10 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm text-red-400 uppercase tracking-wider">Our Process</span>
            <h2 className="text-4xl lg:text-5xl font-black mt-2">How We Work</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-black text-red-500">01</span>
              </div>
              <h3 className="font-bold mb-2">Audit</h3>
              <p className="text-sm text-white/50">Deep dive into your current ad accounts. Find the waste.</p>
            </div>
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-black text-red-500">02</span>
              </div>
              <h3 className="font-bold mb-2">Rebuild</h3>
              <p className="text-sm text-white/50">New structure, new creative, new targeting. Built to scale.</p>
            </div>
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-black text-red-500">03</span>
              </div>
              <h3 className="font-bold mb-2">Scale</h3>
              <p className="text-sm text-white/50">Pour fuel on winners. Kill losers fast. Maximize ROAS.</p>
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
          <h2 className="text-5xl lg:text-6xl font-black mb-6">Ready to Scale?</h2>
          <p className="text-xl text-white/50 mb-10">
            Free audit. No pitch. Just raw analysis of where your money's going.
          </p>
          <Link 
            to="/#chat" 
            className="inline-flex items-center gap-3 px-10 py-5 bg-red-500 text-white rounded-full font-bold text-lg uppercase tracking-wider hover:bg-white hover:text-black transition-all group"
          >
            <span>Book Your Audit</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative py-8 px-6 lg:px-12 z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-1 text-lg font-bold">
            <span>sev</span>
            <span className="text-red-500">IT</span>
          </div>
          <p className="text-sm text-white/40">© {new Date().getFullYear()} sevIT Digital Agency</p>
          <Link to="/" className="text-sm text-white/40 hover:text-white transition-colors">Back to Home</Link>
        </div>
      </footer>
    </div>
  );
}

export default AdvertisingPage;
