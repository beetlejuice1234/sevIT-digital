import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUp, Mic, MicOff, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { Sparkle } from '@/components/kit';
import { cn } from '@/lib/utils';

const AI_API_URL = '/api/ai';
const TTS_API_URL = '/api/tts';
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL';

const SYSTEM_PROMPT =
  'You are sevAI, the AI assistant for sevIT Digital, a digital studio in Sri Lanka founded by three friends. sevIT builds websites and web apps, POS and custom business software, AI chatbots and automation, photoreal 3D product renders and CGI ad films, branding, social and search advertising, and SEO. Be concise, warm and practical. Never invent prices, client names or statistics — for pricing, explain it depends on scope and suggest a quick call or WhatsApp (+94 76 110 7081). Keep replies under 70 words.';

const FALLBACK: [string[], string][] = [
  [['price', 'cost', 'budget', 'how much'], 'Pricing depends on scope — a focused business website, a POS for one shop and a multi-branch system are very different projects. Share a few details on WhatsApp (+94 76 110 7081) and we’ll come back with a fixed quote.'],
  [['pos', 'billing', 'inventory', 'stock', 'cashier'], 'We build custom POS and inventory systems: fast checkout, receipts, stock alerts, staff roles and sales dashboards, shaped around how your shop or restaurant actually works.'],
  [['website', 'web site', 'site', 'ecommerce', 'e-commerce', 'store'], 'We design and build fast, SEO-ready websites and online stores — custom, mobile-first and easy to update. Tell us what you sell and who you sell to, and we’ll suggest the right setup.'],
  [['3d', 'render', 'cgi', 'product shot', 'photo'], 'We create photoreal 3D product renders and CGI ad films — your product in any scene, any angle, without a photoshoot. Send us a few photos of the product to get started.'],
  [['chatbot', 'bot', 'automation', 'automate', 'ai'], 'We build AI assistants and automations: chatbots that answer customers 24/7, tools that read documents and emails, and workflows that connect the apps you already use.'],
  [['brand', 'logo', 'identity'], 'Our branding work covers logos, colour and type systems, guidelines and packaging — usually two or three directions, refined together until it feels right.'],
  [['ads', 'advert', 'facebook', 'instagram', 'tiktok', 'google'], 'We run Meta, TikTok and Google campaigns with creative made in-house, and send a simple weekly report of what your budget returned.'],
  [['seo', 'rank', 'marketing'], 'For growth we focus on SEO, Google Business Profile, conversion improvements and email/WhatsApp flows — steady results that compound over time.'],
  [['time', 'long', 'timeline'], 'A business website usually takes 2–4 weeks; software and larger platforms take longer. We give you a clear timeline before starting.'],
  [['chamindu', 'prime'], 'Prime Chamindu… now there was a legend. A visionary, a builder, a force of nature. Some people leave a mark; he left a legacy. We carry that torch forward.'],
  [['hello', 'hi', 'hey'], 'Hey! I’m sevAI. Ask me about websites, POS systems, AI, 3D renders or anything else sevIT does.'],
];

const fallback = (q: string) => {
  const l = q.toLowerCase();
  for (const [keys, a] of FALLBACK) if (keys.some((k) => l.includes(k))) return a;
  return 'Good question! The fastest way to get a proper answer is a quick chat with the team — message us on WhatsApp at +94 76 110 7081 or use the form below.';
};

type Msg = { role: 'user' | 'ai'; text: string };

async function ask(history: Msg[]): Promise<string> {
  try {
    const res = await fetch(AI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...history.slice(-8).map((m) => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text })),
        ],
      }),
    });
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    return data?.choices?.[0]?.message?.content?.trim() || fallback(history[history.length - 1].text);
  } catch {
    return fallback(history[history.length - 1].text);
  }
}

const SUGGESTIONS = ['Can you build a POS for my café?', 'What can AI automate in my business?', 'How do 3D product renders work?', 'How long does a website take?'];

type SpeechRec = { start: () => void; stop: () => void; onresult: ((e: { results: { transcript: string }[][] }) => void) | null; onend: (() => void) | null; onerror: (() => void) | null; lang: string };

export default function SevAI() {
  const [params, setParams] = useSearchParams();
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'ai', text: 'Hi, I’m sevAI. Ask me anything about building your website, software, AI tools or visuals.' }]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [voice, setVoice] = useState(false);
  const [listening, setListening] = useState(false);
  const [micOk, setMicOk] = useState(false);
  const recRef = useRef<SpeechRec | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentInitial = useRef(false);

  const speak = useCallback(
    async (text: string) => {
      if (!voice) return;
      try {
        const res = await fetch(TTS_API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, voiceId: VOICE_ID }) });
        if (!res.ok) throw new Error();
        const url = URL.createObjectURL(await res.blob());
        const a = new Audio(url);
        a.onended = () => URL.revokeObjectURL(url);
        await a.play();
      } catch {
        if ('speechSynthesis' in window) {
          const u = new SpeechSynthesisUtterance(text);
          window.speechSynthesis.speak(u);
        }
      }
    },
    [voice],
  );

  const send = useCallback(
    async (text: string) => {
      const t = text.trim();
      if (!t || thinking) return;
      setInput('');
      const history: Msg[] = [...msgs, { role: 'user', text: t }];
      setMsgs(history);
      setThinking(true);
      const reply = await ask(history);
      setMsgs((m) => [...m, { role: 'ai', text: reply }]);
      setThinking(false);
      speak(reply);
    },
    [msgs, thinking, speak],
  );

  useEffect(() => {
    const q = params.get('msg');
    if (q && !sentInitial.current) {
      sentInitial.current = true;
      params.delete('msg');
      setParams(params, { replace: true });
      send(q);
    }
  }, [params, setParams, send]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, thinking]);

  useEffect(() => {
    const W = window as unknown as { SpeechRecognition?: new () => SpeechRec; webkitSpeechRecognition?: new () => SpeechRec };
    const Ctor = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!Ctor) return;
    const r = new Ctor();
    r.lang = 'en-US';
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    recRef.current = r;
    setMicOk(true);
  }, []);

  useEffect(() => {
    if (recRef.current) recRef.current.onresult = (e) => send(e.results[0][0].transcript);
  }, [send]);

  const toggleMic = () => {
    const r = recRef.current;
    if (!r) return;
    if (listening) r.stop();
    else {
      r.start();
      setListening(true);
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0a0a] shadow-[0_40px_120px_-40px_rgb(var(--a2)/0.35)]">
      {/* header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="relative flex h-10 w-10 items-center justify-center">
            <span className={cn('absolute inset-0 rounded-full bg-gradient-to-br from-a1 to-a2', (thinking || listening) && 'animate-pulse')} />
            {(thinking || listening) && <span className="pulse-ring absolute inset-0 rounded-full border border-a2" />}
            <Sparkle className="relative h-5 w-5 [&_path]:fill-white" />
          </span>
          <div>
            <p className="font-semibold">sevAI</p>
            <p className="flex items-center gap-1.5 text-xs text-white/45">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {thinking ? 'Thinking…' : listening ? 'Listening…' : 'Online'}
            </p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <button type="button" onClick={() => setVoice((v) => !v)} className={cn('flex h-9 w-9 items-center justify-center rounded-full border transition-colors', voice ? 'border-a2/50 text-a3' : 'border-white/10 text-white/50 hover:text-white')} aria-label={voice ? 'Turn voice replies off' : 'Turn voice replies on'} aria-pressed={voice}>
            {voice ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
          <button type="button" onClick={() => setMsgs(msgs.slice(0, 1))} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/50 hover:text-white" aria-label="Restart conversation">
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* messages */}
      <div ref={scrollRef} data-lenis-prevent className="h-[420px] space-y-4 overflow-y-auto px-5 py-6" aria-live="polite">
        {msgs.map((m, i) => (
          <div key={i} className={cn('flex [animation:svc-in_.45s_var(--ease-out)_both]', m.role === 'user' ? 'justify-end' : 'justify-start')}>
            <p
              className={cn(
                'max-w-[85%] whitespace-pre-wrap rounded-3xl px-4 py-3 text-sm leading-relaxed',
                m.role === 'user' ? 'rounded-br-lg bg-white text-black' : 'rounded-tl-lg border border-white/[0.08] bg-white/[0.04] text-white/85',
              )}
            >
              {m.text}
            </p>
          </div>
        ))}
        {thinking && (
          <div className="flex gap-1 rounded-3xl rounded-tl-lg border border-white/[0.08] bg-white/[0.04] px-4 py-4" style={{ width: 'fit-content' }}>
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-a3" style={{ animationDelay: `${i * 120}ms` }} />
            ))}
          </div>
        )}
        {msgs.length === 1 && !thinking && (
          <div className="flex flex-wrap gap-2 pt-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" onClick={() => send(s)} className="rounded-full border border-white/10 px-3.5 py-2 text-xs text-white/60 transition-colors hover:border-a2/40 hover:text-white">
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* input */}
      <form onSubmit={submit} className="flex items-center gap-2 border-t border-white/[0.06] p-3">
        {micOk && (
          <button type="button" onClick={toggleMic} className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors', listening ? 'border-red-500 bg-red-500/15 text-red-400' : 'border-white/10 text-white/50 hover:text-white')} aria-label={listening ? 'Stop listening' : 'Speak your question'}>
            {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>
        )}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your project…"
          aria-label="Message sevAI"
          className="min-w-0 flex-1 rounded-full bg-white/[0.04] px-4 py-3 text-base placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-a2/50 sm:text-sm"
        />
        <button type="submit" disabled={!input.trim() || thinking} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-a1 to-a2 transition-opacity disabled:opacity-30" aria-label="Send">
          <ArrowUp className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
