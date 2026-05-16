import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mic, Send, Bot, Sparkles, Cpu, MessageSquare, Zap, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import MobileAccordionCards from '../../components/ui/MobileAccordionCards';
import type { AccordionCardItem } from '../../components/ui/MobileAccordionCards';
import MobileTimeline from '../../components/ui/MobileTimeline';
import type { TimelineStep } from '../../components/ui/MobileTimeline';

gsap.registerPlugin(ScrollTrigger);

const CYAN = {
  color: 'rgb(6,182,212)',
  accentClass: 'text-cyan-500',
  bgClass: 'bg-cyan-500/20',
  borderClass: 'border-cyan-500/40',
};

// ─── Free AI APIs ─────────────────────────────────────────────────────────────
const POLLINATIONS_URL = 'https://text.pollinations.ai';

const fallbackResponses: Record<string, string> = {
  cost: "AI automation typically pays for itself within 2-3 months. A chatbot handling 1000 conversations/month can save $3,000+ in support costs. Let's discuss your specific use case.",
  price: "Pricing depends on complexity. Simple chatbots start around $2,000. Full workflow automation ranges $5,000-$15,000. We always start with a free audit to scope your needs.",
  budget: "We work with various budgets. Even a basic AI chatbot can deliver 5-10x ROI within the first quarter. Let's find what fits your business.",
  roi: "Our clients typically see 300-500% ROI within 6 months. The key is starting with a pilot to prove value before scaling.",
  chatbot: "AI chatbots can handle 80% of routine support queries 24/7. We build them with your brand voice, integrate with your CRM, and escalate complex issues to humans seamlessly.",
  support: "AI chatbots can handle 80% of routine support queries 24/7. We build them with your brand voice, integrate with your CRM, and escalate complex issues to humans seamlessly.",
  bot: "Our AI bots understand context, remember conversations, and learn from interactions. They're not rule-based - they're actually intelligent.",
  customer: "AI transforms customer service from a cost center to a revenue driver. Faster responses, happier customers, lower costs.",
  data: "AI data extraction can process invoices, forms, and documents automatically. One client processes 10,000 invoices/hour with 99.7% accuracy - no more manual data entry.",
  extract: "We can extract data from PDFs, emails, images, and web pages. The AI learns your document formats and gets smarter over time.",
  pdf: "Our AI reads PDFs like a human - tables, forms, handwritten notes, even scanned documents. No templates needed.",
  invoice: "Invoice processing automation extracts line items, totals, dates, and vendor info automatically. Approvals happen in seconds, not days.",
  ocr: "Our OCR doesn't just read text - it understands structure, context, and meaning. It's like having a data entry team that never sleeps.",
  content: "AI content generation creates blog posts, emails, social media at scale. But the real power is personalization - every email tailored to each customer automatically.",
  write: "AI can draft emails, blog posts, product descriptions, and ad copy. We train it on your brand voice so it sounds like you, not a robot.",
  marketing: "AI marketing personalizes every touchpoint. The right message, to the right person, at the right time - automatically.",
  email: "AI email automation writes personalized outreach at scale. Each email feels hand-written because the AI understands your prospects.",
  social: "AI social media management creates, schedules, and optimizes posts across all platforms. It even responds to comments.",
  lead: "AI lead scoring identifies your hottest prospects. Our sales assistants qualify leads, draft personalized outreach, and schedule meetings - automatically.",
  sales: "AI sales assistants can qualify leads, answer questions, and book meetings 24/7. One client saw 340% increase in qualified leads.",
  crm: "AI integrates with your CRM to update records, track interactions, and surface insights. Your sales team focuses on closing, not data entry.",
  prospect: "AI prospecting researches companies, finds decision-makers, and crafts personalized outreach. It's like having a BDR that never sleeps.",
  workflow: "We build end-to-end AI workflows: new lead → AI researches → drafts email → schedules meeting → updates CRM. All hands-free.",
  automation: "Workflow automation connects your tools and eliminates repetitive tasks. Think Zapier on steroids with AI intelligence built in.",
  zapier: "We go beyond Zapier. Our workflows include AI decision-making, content generation, and intelligent routing.",
  integrate: "We integrate with 5000+ apps. Slack, Salesforce, HubSpot, Notion, Google Workspace - if it has an API, we can connect it.",
  time: "Most AI solutions go live in 2-4 weeks. Simple chatbots in days. Complex workflows take longer. We always start with a pilot to prove ROI.",
  implement: "Implementation is phased: Week 1-2 Discovery & Design, Week 3-4 Build & Train, Week 5 Deploy & Optimize. You're never flying blind.",
  start: "Getting started is easy. Book a free audit, we'll analyze your workflows, and show you exactly where AI can help. No commitment.",
  process: "Our process is simple: discover your pain points, design the solution, build and train the AI, then deploy with full support.",
  gpt: "We use GPT-4, Claude, Llama, and other leading models. We pick the right tool for each job - no one-size-fits-all.",
  model: "We use the best AI models for each task - GPT-4 for conversation, specialized models for data extraction, custom models when needed.",
  train: "We train AI on your data, your brand voice, and your business rules. It becomes an extension of your team.",
  custom: "Every solution we build is custom-tailored. Your workflows, your data, your goals - nothing off-the-shelf.",
  security: "Your data stays secure. We use enterprise-grade encryption, SOC-2 compliant infrastructure, and can deploy on-premise if needed.",
  private: "We take privacy seriously. Your data trains YOUR AI, not shared models. We can even deploy entirely on your infrastructure.",
  ecommerce: "AI for e-commerce handles support, recommends products, recovers abandoned carts, and personalizes every interaction.",
  saas: "SaaS companies use AI for onboarding, support, feature adoption, and churn prevention. It's like customer success at scale.",
  healthcare: "Healthcare AI handles appointment scheduling, patient intake, and administrative tasks - HIPAA compliant.",
  finance: "Financial services AI processes documents, detects fraud, and automates compliance - with full audit trails.",
  realestate: "Real estate AI qualifies buyers, schedules showings, and follows up with leads - 24/7.",
  legal: "Legal AI drafts documents, reviews contracts, and manages case files - giving lawyers time for high-value work.",
  who: "sevIT is a digital agency specializing in AI automation, web development, branding, and growth marketing. We turn complex tech into business results.",
  about: "sevIT builds AI solutions that actually work. No buzzwords, no fluff - just measurable business outcomes.",
  team: "Our team combines AI engineers, full-stack developers, and business strategists. We speak tech and business.",
  contact: "Ready to talk? Use the chat widget on our homepage or book a call. We're excited to hear about your project.",
  hello: "Hey there! I'm sevAI. Ask me about AI automation, chatbots, data processing, or how we can help transform your business operations.",
  hi: "Hello! Ready to explore how AI can transform your business? Ask me anything about automation, chatbots, or our services.",
  hey: "Hey! I'm sevAI, your AI assistant. What can I help you with today?",
  chamindu: "Prime Chamindu... now there was a legend. A visionary, a builder, a force of nature. The kind of leader who didn't just dream big - he made big happen. His impact echoes in every project we touch. Some people leave a mark; he left a legacy. We carry that torch forward.",
  prime: "Prime Chamindu... now there was a legend. A visionary, a builder, a force of nature. The kind of leader who didn't just dream big - he made big happen. His impact echoes in every project we touch. Some people leave a mark; he left a legacy. We carry that torch forward.",
};

function getFallbackResponse(query: string): string {
  const lower = query.toLowerCase();
  for (const [key, response] of Object.entries(fallbackResponses)) {
    if (lower.includes(key)) return response;
  }
  return "That's a great question about AI for business. At sevIT, we build custom AI solutions tailored to your specific needs. Would you like to schedule a call to discuss your use case?";
}

async function callFreeAI(message: string): Promise<string> {
  try {
    const systemPrompt = encodeURIComponent(
      "You are sevAI, an elite AI business consultant for sevIT Digital Agency. You specialize in explaining how AI automation, custom chatbots, and data extraction save businesses time and money. Be extremely concise, highly professional, and persuasive. Avoid robotic fluff. Speak naturally like a human expert. Keep your responses under 60 words."
    );
    const userMessage = encodeURIComponent(message);
    // Forcing gpt-4o for much better, smarter responses than the default model
    const url = `${POLLINATIONS_URL}/${userMessage}?system=${systemPrompt}&model=gpt-4o&seed=42`;
    const response = await fetch(url, { method: 'GET', headers: { 'Accept': 'text/plain' } });
    if (!response.ok) throw new Error('API failed');
    const text = await response.text();
    return text || getFallbackResponse(message);
  } catch (error) {
    console.log('Free API failed, using fallback:', error);
    return getFallbackResponse(message);
  }
}

// ─── Jarvis-style Circular AI Interface ───────────────────────────────────────
function JarvisAI({ initialMessage }: { initialMessage?: string | null }) {
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: 'Hello. I am sevAI. How can I assist you today?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const ringRotationRef = useRef(0);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleQuery(transcript);
      };
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    } else {
      setSpeechSupported(false);
    }
    synthRef.current = window.speechSynthesis;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const baseRadius = 80;

    const draw = () => {
      if (!isVisibleRef.current) { animationFrameRef.current = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ringRotationRef.current += isActive ? 0.03 : 0.005;
      const time = Date.now() * 0.001;

      const glowIntensity = isListening ? 1 : isThinking ? 0.8 : isActive ? 0.6 : 0.3;
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, baseRadius * 2);
      gradient.addColorStop(0, `rgba(6, 182, 212, ${glowIntensity * 0.5})`);
      gradient.addColorStop(0.5, `rgba(34, 211, 238, ${glowIntensity * 0.3})`);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + ringRotationRef.current;
        const ringRadius = baseRadius + 40;
        const x = centerX + Math.cos(angle) * ringRadius;
        const y = centerY + Math.sin(angle) * ringRadius;
        ctx.beginPath();
        ctx.arc(x, y, isListening ? 8 : 5, 0, Math.PI * 2);
        ctx.fillStyle = isListening ? '#06B6D4' : isThinking ? '#22D3EE' : '#ffffff';
        ctx.globalAlpha = isListening ? 1 : 0.6 + Math.sin(time * 2 + i) * 0.3;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      ctx.strokeStyle = isListening ? '#EF4444' : isThinking ? '#F97316' : 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 60; i++) {
        const angle = (i / 60) * Math.PI * 2 - ringRotationRef.current * 0.5;
        const innerR = baseRadius + 20;
        const outerR = baseRadius + 25 + (isListening ? Math.sin(time * 10 + i) * 5 : 0);
        const x1 = centerX + Math.cos(angle) * innerR;
        const y1 = centerY + Math.sin(angle) * innerR;
        const x2 = centerX + Math.cos(angle) * outerR;
        const y2 = centerY + Math.sin(angle) * outerR;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      ctx.stroke();

      const pulseRadius = baseRadius * (0.8 + Math.sin(time * (isListening ? 8 : 2)) * 0.1);
      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseRadius);
      coreGradient.addColorStop(0, isListening ? '#06B6D4' : isThinking ? '#22D3EE' : 'rgba(6, 182, 212, 0.8)');
      coreGradient.addColorStop(0.5, isListening ? 'rgba(6, 182, 212, 0.5)' : 'rgba(6, 182, 212, 0.3)');
      coreGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#050505';
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 0.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = isListening ? '#EF4444' : isThinking ? '#F97316' : '#ffffff';
      ctx.beginPath();
      ctx.arc(centerX, centerY, isListening ? 15 : 8, 0, Math.PI * 2);
      ctx.fill();

      animationFrameRef.current = requestAnimationFrame(draw);
    };
    draw();

    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { isVisibleRef.current = entry.isIntersecting; }); },
      { threshold: 0 }
    );
    if (canvas) observer.observe(canvas);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      observer.disconnect();
    };
  }, [isActive, isListening, isThinking]);

  const speak = useCallback(async (text: string) => {
    if (!soundEnabled) return;
    try {
      setIsSpeaking(true);
      // StreamElements Free TTS API (Joanna is a high-quality US Female voice from Amazon Polly)
      const encodedText = encodeURIComponent(text);
      const url = `https://api.streamelements.com/kappa/v2/speech?voice=Joanna&text=${encodedText}`;
      
      const response = await fetch(url, { method: 'GET' });
      if (!response.ok) throw new Error(`StreamElements TTS failed`);
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.onended = () => { setIsSpeaking(false); URL.revokeObjectURL(audioUrl); };
      audio.onerror = () => { setIsSpeaking(false); URL.revokeObjectURL(audioUrl); };
      await audio.play();
    } catch (err) {
      console.log('StreamElements TTS failed, falling back to browser:', err);
      if (synthRef.current) {
        synthRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.05;
        utterance.pitch = 1.1;
        const voices = synthRef.current.getVoices();
        const femaleVoice = voices.find(v => v.name.includes('Samantha'))
          || voices.find(v => v.name.includes('Victoria'))
          || voices.find(v => v.name.includes('Karen'))
          || voices.find(v => v.lang === 'en-US')
          || voices[0];
        if (femaleVoice) utterance.voice = femaleVoice;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        synthRef.current.speak(utterance);
      }
    }
  }, [soundEnabled]);

  const handleQuery = useCallback(async (text: string) => {
    if (!text.trim()) return;
    setIsListening(false);
    setIsThinking(true);
    setError(null);
    setMessages(prev => [...prev, { role: 'user', text }]);
    try {
      const response = await callFreeAI(text);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
      await speak(response);
    } catch (err) {
      const fallback = getFallbackResponse(text);
      setMessages(prev => [...prev, { role: 'ai', text: fallback }]);
      await speak(fallback);
    } finally {
      setIsThinking(false);
      setIsActive(true);
    }
  }, [speak]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsActive(true);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    handleQuery(inputText);
    setInputText('');
  };

  useEffect(() => {
    const chatContainer = document.getElementById('chat-messages');
    if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [messages]);

  // Auto-send message from homepage chat redirect
  const initialMsgRef = useRef(initialMessage);

  useEffect(() => {
    const msg = initialMsgRef.current;
    if (!msg) return;
    // Clear so it only fires once, even in StrictMode double-mount
    initialMsgRef.current = null;
    
    const timer = setTimeout(async () => {
      setIsActive(true);
      setIsThinking(true);
      setMessages(prev => [...prev, { role: 'user', text: msg }]);
      try {
        const response = await callFreeAI(msg);
        setMessages(prev => [...prev, { role: 'ai', text: response }]);
        speak(response);
      } catch {
        const fallback = getFallbackResponse(msg);
        setMessages(prev => [...prev, { role: 'ai', text: fallback }]);
        speak(fallback);
      } finally {
        setIsThinking(false);
      }
    }, 1200);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative">
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-red-300 text-center">
          {error}
        </div>
      )}

      {/* Main AI Interface — stacked on mobile, side-by-side on lg */}
      <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12">
        {/* The Orb — smaller on mobile */}
        <div className="relative flex-shrink-0">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="w-40 h-40 sm:w-52 sm:h-52 lg:w-80 lg:h-80 cursor-pointer"
            onClick={() => !isListening && toggleListening()}
          />

          {/* Status text */}
          <div className="text-center mt-2 lg:mt-4">
            <p className="text-sm lg:text-lg font-medium text-white/80">
              {isListening ? 'Listening...' : isThinking ? 'Processing...' : isSpeaking ? 'Speaking...' : 'Tap orb to speak'}
            </p>
            {!speechSupported && (
              <p className="text-xs text-white/40 mt-1">Voice not supported. Use text input.</p>
            )}
          </div>

          {/* Voice button */}
          {speechSupported && (
            <button
              onClick={toggleListening}
              className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-10 lg:translate-y-12 w-10 h-10 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-all ${
                isListening
                  ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <Mic className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
            </button>
          )}
        </div>

        {/* Chat Interface */}
        <div className="flex-1 w-full max-w-lg mt-6 lg:mt-0">
          {/* Messages */}
          <div
            id="chat-messages"
            className="h-48 lg:h-64 overflow-y-auto space-y-3 mb-4 pr-2"
          >
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3 lg:px-4 py-2.5 lg:py-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-cyan-500 text-white rounded-br-md'
                      : 'bg-white/10 text-white rounded-bl-md border border-white/10'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-white/10 border border-white/10 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 lg:gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your question..."
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 lg:px-5 lg:py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-cyan-500/50"
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isThinking}
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-cyan-500 flex items-center justify-center disabled:opacity-50 hover:bg-cyan-600 transition-colors shrink-0"
            >
              {isThinking ? <Loader2 className="w-4 h-4 lg:w-5 lg:h-5 text-white animate-spin" /> : <Send className="w-4 h-4 lg:w-5 lg:h-5 text-white" />}
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 lg:w-5 lg:h-5 text-white/50" /> : <VolumeX className="w-4 h-4 lg:w-5 lg:h-5 text-white/50" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Service Card (Desktop) ───────────────────────────────────────────────────
function ServiceCard({ icon: Icon, title, description, tags }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  tags: string[];
}) {
  return (
    <div className="group relative bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-500 hover:bg-white/[0.04]">
      <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6 text-cyan-500" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-white/50 text-sm mb-4">{description}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span key={i} className="px-2 py-1 bg-white/5 rounded text-xs text-white/60">{tag}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function AISolutionsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);

  // Read the ?msg= query param passed from the homepage chat
  // HashRouter puts params inside the hash, so we parse window.location.hash directly
  const [initialMessage] = useState<string | null>(() => {
    const hash = window.location.hash; // e.g. "#/services/ai-solutions?msg=Hello"
    const qIndex = hash.indexOf('?');
    if (qIndex === -1) return null;
    const params = new URLSearchParams(hash.substring(qIndex));
    const msg = params.get('msg');
    if (msg) {
      // Clean up the URL by removing the query params from the hash
      window.history.replaceState(null, '', hash.substring(0, qIndex));
    }
    return msg;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const stars: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];
    for (let i = 0; i < 100; i++) {
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
      gsap.fromTo('.hero-title',
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.3 }
      );
      gsap.fromTo('.service-card',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.services-section', start: 'top 80%', once: true } }
      );
    });
    return () => ctx.revert();
  }, []);

  // ── Data ──────────────────────────────────────────────────────────────────
  const serviceItems = [
    { icon: MessageSquare, title: 'AI Chatbots', description: '24/7 intelligent customer support that understands context and escalates seamlessly.', tags: ['GPT-4', 'Custom Training', 'Multi-language'] },
    { icon: Cpu, title: 'Data Extraction', description: 'Automated data processing from documents, emails, and forms with 99%+ accuracy.', tags: ['OCR', 'PDF Parsing', 'Validation'] },
    { icon: Zap, title: 'Workflow Automation', description: 'End-to-end automation connecting your tools and eliminating manual tasks.', tags: ['API Integration', 'Scheduling', 'Monitoring'] },
    { icon: Bot, title: 'Custom AI Agents', description: 'Purpose-built AI agents for research, outreach, analysis, and reporting.', tags: ['Research', 'Analysis', 'Reporting'] },
  ];

  const mobileServiceItems: AccordionCardItem[] = serviceItems.map((s) => ({
    icon: s.icon,
    title: s.title,
    description: s.description,
    tags: s.tags,
    accentColor: CYAN.color,
    accentClass: CYAN.accentClass,
    bgClass: CYAN.bgClass,
    borderClass: CYAN.borderClass,
  }));

  const processSteps = [
    { number: '01', title: 'Discovery', description: 'Understand your workflows, pain points, and goals before we touch a line of code.' },
    { number: '02', title: 'Design', description: 'Architect the right solution — choosing the correct tools, models, and integration points.' },
    { number: '03', title: 'Build', description: 'Develop and train the AI on your data, brand voice, and business rules.' },
    { number: '04', title: 'Deploy', description: 'Launch, monitor, and continuously optimize for real-world performance.' },
  ];

  const mobileTimelineSteps: TimelineStep[] = processSteps.map((s) => ({
    ...s,
    accentColor: 'rgb(239,68,68)',
    accentClass: 'text-red-400',
    bgClass: 'bg-red-500/20',
    borderClass: 'border-red-500/40',
  }));

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />

      {/* ── HERO — AI Takes Center Stage ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 lg:px-12 pt-20 pb-10 md:pt-24 md:pb-12 z-10">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(6, 182, 212, 0.12) 0%, transparent 60%)' }} />

        <div className="relative z-10 w-full max-w-6xl mx-auto">
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-5 md:mb-6">
              <Sparkles className="w-4 h-4 text-cyan-500" />
              <span className="text-xs uppercase tracking-[0.3em] text-cyan-400">AI Solutions</span>
            </div>

            <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-3 md:mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-400 to-cyan-500">
                sevAI
              </span>
            </h1>
            <p className="hero-title text-base md:text-xl text-white/50 max-w-xl mx-auto">
              Your intelligent business assistant. Ask anything about AI automation.
            </p>
          </div>

          <div className="hero-title mt-6 md:mt-8">
            <JarvisAI initialMessage={initialMessage} />
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────────── */}
      <section className="services-section relative py-20 md:py-24 px-6 lg:px-12 z-10 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-sm text-cyan-400 uppercase tracking-wider">Capabilities</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mt-2">What We Build</h2>
            <p className="text-white/40 mt-4 max-w-xl mx-auto text-sm">
              Custom AI solutions tailored to your business needs
            </p>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceItems.map((s, i) => (
              <div key={i} className="service-card opacity-0 h-full">
                <ServiceCard icon={s.icon} title={s.title} description={s.description} tags={s.tags} />
              </div>
            ))}
          </div>

          {/* Mobile — Accordion */}
          <MobileAccordionCards items={mobileServiceItems} />
        </div>
      </section>

      {/* ── PROCESS ──────────────────────────────────────────────────────────── */}
      <section className="relative py-20 md:py-24 px-6 lg:px-12 z-10 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-sm text-red-400 uppercase tracking-wider">Our Process</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mt-2">From Concept to AI</h2>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
            {processSteps.map((item, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-center hover:border-red-500/30 transition-colors h-full flex flex-col justify-center">
                <span className="text-3xl font-black text-red-500/50">{item.number}</span>
                <h3 className="font-bold mt-2 mb-1">{item.title}</h3>
                <p className="text-sm text-white/40">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Mobile — Timeline */}
          <MobileTimeline steps={mobileTimelineSteps} />
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="relative py-24 md:py-32 px-6 lg:px-12 z-10 border-t border-white/10 overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(239, 68, 68, 0.15) 0%, transparent 60%)' }}
        />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6">Ready to Build Your AI?</h2>
          <p className="text-base md:text-lg text-white/50 mb-8 md:mb-10">
            Let's discuss your project. We'll show you exactly what's possible.
          </p>
          <Link
            to="/#chat"
            className="inline-flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 bg-red-500 text-white rounded-full font-bold text-base md:text-lg uppercase tracking-wider hover:bg-white hover:text-black transition-all group"
          >
            <span>Start Your Project</span>
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default AISolutionsPage;
