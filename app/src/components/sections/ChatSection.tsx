import { useEffect, useRef, useState, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, Bot, Sparkles, Star, Rocket, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

gsap.registerPlugin(ScrollTrigger);

interface Message {
  id: number;
  type: 'ai' | 'user';
  text: string;
  timestamp?: string;
}

// Chat conversation - FASTER timing so it actually shows
const chatScenario: { type: 'ai' | 'user'; text: string; delayAfter?: number }[] = [
  {
    type: 'ai',
    text: "Hey there! Welcome to sevIT. I'm your AI assistant. What brings you here today?",
    delayAfter: 600, // User reads and thinks
  },
  {
    type: 'user',
    text: 'Hi! I need help with my website',
    delayAfter: 800, // AI "reads" and starts typing
  },
  {
    type: 'ai',
    text: "Got it! Are you looking to build something brand new, or revamp an existing site?",
    delayAfter: 600,
  },
  {
    type: 'user',
    text: 'I want a completely new modern website',
    delayAfter: 800,
  },
  {
    type: 'ai',
    text: "Perfect! We specialize in high-converting sites with React & Next.js. What's your business?",
    delayAfter: 600,
  },
  {
    type: 'user',
    text: 'I run an e-commerce store selling fashion accessories',
    delayAfter: 1000,
  },
  {
    type: 'ai',
    text: "Fashion e-commerce is our forte! We can create stunning 3D product showcases, smooth checkout flows, and integrated payments. Want to see how we can boost your sales?",
    delayAfter: 0,
  },
];

// Reasonable typing speed - 60 WPM for AI, 50 WPM for user
const getTypingDuration = (text: string, isAI: boolean): number => {
  const chars = text.length;
  const cpm = isAI ? 300 : 250; // characters per minute
  const baseDuration = (chars / cpm) * 60 * 1000; // in ms
  const variance = baseDuration * 0.2;
  return Math.max(600, baseDuration + (Math.random() * variance * 2 - variance));
};


// Chat Message Component
const ChatMessage = memo(({ message }: { message: Message }) => {
  const isAI = message.type === 'ai';
  
  return (
    <div
      className={`chat-message flex ${isAI ? 'justify-start' : 'justify-end'} group`}
      style={{
        willChange: 'transform, opacity',
        transform: 'translateZ(0)',
      }}
    >
      <div className={`flex ${isAI ? 'flex-row' : 'flex-row-reverse'} items-end gap-2 max-w-[85%]`}>
        {/* Avatar */}
        <div 
          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
            isAI ? 'bg-accent/20' : 'bg-foreground/20'
          }`}
        >
          {isAI ? (
            <Bot className="w-4 h-4 text-accent" />
          ) : (
            <span className="text-xs font-medium text-foreground">You</span>
          )}
        </div>
        
        {/* Message Bubble */}
        <div
          className={`px-4 py-3 rounded-2xl ${
            isAI
              ? 'bg-muted text-foreground rounded-bl-md'
              : 'bg-foreground text-background rounded-br-md'
          }`}
        >
          <p className="text-sm leading-relaxed">{message.text}</p>
          
          {/* Timestamp */}
          <div className={`flex items-center gap-1 mt-1 ${isAI ? '' : 'justify-end'}`}>
            <span className={`text-[10px] ${isAI ? 'text-muted-foreground/60' : 'text-background/60'}`}>
              {message.timestamp}
            </span>
            {!isAI && (
              <svg className="w-3 h-3 text-accent" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 13a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"/>
                <path d="M10.97 6.97a.75.75 0 0 0-1.06-1.06L7 8.81 5.59 7.4a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l3.38-3.49z"/>
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';

// Typing Indicator
const TypingIndicator = memo(({ isAI }: { isAI: boolean }) => (
  <div 
    className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}
    style={{
      willChange: 'transform, opacity',
      transform: 'translateZ(0)',
    }}
  >
    <div className={`flex ${isAI ? 'flex-row' : 'flex-row-reverse'} items-end gap-2`}>
      <div 
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
          isAI ? 'bg-accent/20' : 'bg-foreground/20'
        }`}
      >
        {isAI ? (
          <Bot className="w-4 h-4 text-accent" />
        ) : (
          <span className="text-xs font-medium text-foreground">You</span>
        )}
      </div>
      
      <div className={`bg-muted px-4 py-3 rounded-2xl ${isAI ? 'rounded-bl-md' : 'rounded-br-md'}`}>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <span 
              className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" 
              style={{ animationDelay: '0ms', animationDuration: '0.6s' }} 
            />
            <span 
              className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" 
              style={{ animationDelay: '100ms', animationDuration: '0.6s' }} 
            />
            <span 
              className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" 
              style={{ animationDelay: '200ms', animationDuration: '0.6s' }} 
            />
          </div>
          <span className="text-[10px] text-muted-foreground/60">
            {isAI ? 'sevIT AI is typing...' : 'You are typing...'}
          </span>
        </div>
      </div>
    </div>
  </div>
));

TypingIndicator.displayName = 'TypingIndicator';

function ChatSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState<'ai' | 'user' | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const hasStartedRef = useRef(false);
  const navigate = useNavigate();
  const scrollTweenRef = useRef<gsap.core.Tween | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const getTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const scrollToBottom = useCallback(() => {
    if (!messagesContainerRef.current) return;
    
    const container = messagesContainerRef.current;
    const targetScroll = container.scrollHeight - container.clientHeight;
    
    if (scrollTweenRef.current) {
      scrollTweenRef.current.kill();
    }
    
    scrollTweenRef.current = gsap.to(container, {
      scrollTop: targetScroll,
      duration: 0.3,
      ease: 'power2.out',
    });
  }, []);

  const playConversation = useCallback(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    setHasStarted(true);

    const tl = gsap.timeline();
    timelineRef.current = tl;

    chatScenario.forEach((msg, index) => {
      const isAI = msg.type === 'ai';
      const typingDuration = getTypingDuration(msg.text, isAI) / 1000;
      
      // Show typing indicator
      tl.call(() => {
        setIsTyping(isAI ? 'ai' : 'user');
        scrollToBottom();
      });
      
      // Type for realistic duration
      const displayTypingDuration = Math.min(Math.max(typingDuration, 0.5), 2);
      tl.to({}, { duration: displayTypingDuration });
      
      // Hide typing and show message
      tl.call(() => {
        setIsTyping(null);
        const newMessage: Message = {
          id: Date.now() + index,
          type: msg.type,
          text: msg.text,
          timestamp: getTimestamp(),
        };
        setMessages(prev => [...prev, newMessage]);
      });
      
      // Animate message entrance
      tl.add(() => {
        const messageElements = document.querySelectorAll('.chat-message');
        const lastMessage = messageElements[messageElements.length - 1];
        if (lastMessage) {
          gsap.fromTo(
            lastMessage,
            { opacity: 0, y: 10, scale: 0.98 },
            { 
              opacity: 1, 
              y: 0, 
              scale: 1, 
              duration: 0.25, 
              ease: 'power2.out',
            }
          );
        }
        scrollToBottom();
      });
      
      // Reading delay before next message
      if (msg.delayAfter && msg.delayAfter > 0) {
        tl.to({}, { duration: msg.delayAfter / 1000 });
      }
    });
  }, [scrollToBottom]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        chatWindowRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
            onEnter: () => {
              setTimeout(playConversation, 400);
            },
          },
        }
      );
    }, sectionRef);

    return () => {
      ctx.revert();
      if (scrollTweenRef.current) scrollTweenRef.current.kill();
      if (timelineRef.current) timelineRef.current.kill();
      // Reset ref when component unmounts so chat plays again on return
      hasStartedRef.current = false;
    };
  }, [playConversation]);

  const handleSendMessage = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Instead of playing a dummy AI response, redirect to the real AI page
    // with the user's message pre-loaded as a query parameter
    const encodedMessage = encodeURIComponent(inputValue.trim());
    setInputValue('');
    navigate(`/services/ai-solutions?msg=${encodedMessage}`);
  }, [inputValue, navigate]);

  const handleTalkToAI = () => {
    navigate('/services/ai-solutions');
  };

  return (
    <section
      ref={sectionRef}
      id="chat"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 z-50"
    >
      <div className="absolute top-20 right-20 text-accent/20">
        <Star className="w-6 h-6 animate-pulse" />
      </div>
      <div className="absolute bottom-40 left-10 text-accent/10">
        <Rocket className="w-8 h-8 animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div 
            ref={contentRef}
            style={{
              willChange: 'transform, opacity',
              transform: 'translateZ(0)',
            }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">AI-Powered Consultation</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Let's Talk
            </h2>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
              Not sure what you need? Chat with our AI consultant to discover 
              the perfect solution for your business challenges.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Instant Analysis</h4>
                  <p className="text-sm text-muted-foreground">Get immediate insights on your business needs</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Personalized Recommendations</h4>
                  <p className="text-sm text-muted-foreground">Tailored solutions based on your specific goals</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Rocket className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Launch Ready</h4>
                  <p className="text-sm text-muted-foreground">Get a roadmap to elevate your digital presence</p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="https://wa.me/94761107081?text=Hi!%20I'd%20like%20to%20schedule%20a%20discovery%20call."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-background bg-foreground rounded-full transition-all duration-300 hover:scale-105 hover:bg-accent"
                style={{ willChange: 'transform', transform: 'translateZ(0)' }}
              >
                Book a Discovery Call
              </a>
              <button
                onClick={handleTalkToAI}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-medium text-foreground border border-border rounded-full transition-all duration-300 hover:bg-surface hover:border-foreground/20 group"
                style={{ willChange: 'transform', transform: 'translateZ(0)' }}
              >
                <MessageSquare className="w-4 h-4 text-accent" />
                <span>Talk to Real AI</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Chat Window with contain: layout to prevent jitter */}
          <div
            ref={chatWindowRef}
            className="relative bg-surface rounded-3xl border border-border/50 overflow-hidden card-shadow"
            style={{
              minHeight: '520px',
              contain: 'layout', // Prevents layout jitter
              willChange: 'transform, opacity',
              transform: 'translateZ(0)',
            }}
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-surface/80 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-accent" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-surface" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">
                    sev<span className="text-red-500">IT</span> AI
                  </h4>
                  <p className="text-xs text-green-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <div className="w-2 h-2 rounded-full bg-red-500" />
              </div>
            </div>

            {/* Messages */}
            <div
              ref={messagesContainerRef}
              className="h-[360px] overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin"
              style={{ willChange: 'scroll-position' }}
            >
              {messages.length === 0 && !hasStarted && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Bot className="w-12 h-12 mb-3 opacity-50" />
                  <p className="text-sm">Starting conversation...</p>
                </div>
              )}
              
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}

              {isTyping && <TypingIndicator isAI={isTyping === 'ai'} />}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-3 px-6 py-4 border-t border-border/50 bg-surface/80 backdrop-blur-sm"
            >
              <Input
                type="text"
                placeholder="Ask about pricing, services, timelines..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={!hasStarted || isTyping !== null}
                className="flex-1 bg-background border-border/50 text-foreground placeholder:text-muted-foreground rounded-full px-4 py-2 text-sm focus-visible:ring-accent disabled:opacity-50"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!inputValue.trim() || !hasStarted || isTyping !== null}
                className="w-10 h-10 rounded-full bg-accent hover:bg-accent/90 flex-shrink-0 transition-transform duration-200 active:scale-95 disabled:opacity-50"
                style={{ willChange: 'transform' }}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ChatSection;
