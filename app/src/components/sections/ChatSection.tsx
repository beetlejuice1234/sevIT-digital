import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, Bot, Sparkles, Star, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

gsap.registerPlugin(ScrollTrigger);

interface Message {
  id: number;
  type: 'ai' | 'user';
  text: string;
  delay?: number;
}

const initialMessages: Message[] = [
  {
    id: 1,
    type: 'ai',
    text: "🚀 Welcome to sevIT! I'm your AI guide to digital excellence. What brings you here today?",
    delay: 0,
  },
  {
    id: 2,
    type: 'user',
    text: 'I need help with my website and online presence.',
    delay: 1200,
  },
  {
    id: 3,
    type: 'ai',
    text: 'Great choice! A strong digital presence is essential. Are you looking to build a new website from scratch, or revamp an existing one?',
    delay: 2500,
  },
  {
    id: 4,
    type: 'user',
    text: 'I want a completely new, modern website.',
    delay: 4000,
  },
  {
    id: 5,
    type: 'ai',
    text: 'Perfect! We specialize in creating stunning, high-converting websites with React & Next.js. What type of business are you in?',
    delay: 5500,
  },
  {
    id: 6,
    type: 'user',
    text: 'I run an e-commerce store selling fashion accessories.',
    delay: 7500,
  },
  {
    id: 7,
    type: 'ai',
    text: 'Excellent! Fashion e-commerce is our forte. We can create a visually stunning site with 3D product showcases, smooth checkout flows, and integrated payment systems. Want to see how we can boost your sales?',
    delay: 9000,
  },
];

// AI response templates for different user inputs
const getAIResponse = (userMessage: string): string => {
  const lowerMsg = userMessage.toLowerCase();
  
  if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('how much')) {
    return "Our pricing varies based on project scope. Websites start at $3,500, full branding packages at $2,000, and 3D rendering projects at $1,500. Let's schedule a call to discuss your specific needs and get you a custom quote!";
  }
  
  if (lowerMsg.includes('time') || lowerMsg.includes('long') || lowerMsg.includes('duration')) {
    return "Typical timelines: Website projects take 4-8 weeks, branding 2-4 weeks, and 3D rendering 1-3 weeks depending on complexity. Rush options available!";
  }
  
  if (lowerMsg.includes('3d') || lowerMsg.includes('render') || lowerMsg.includes('visualization')) {
    return "Our 3D team creates photorealistic product visualizations, architectural renders, and animations that make your products impossible to ignore. Perfect for e-commerce and marketing!";
  }
  
  if (lowerMsg.includes('brand') || lowerMsg.includes('logo') || lowerMsg.includes('identity')) {
    return "We craft complete brand identities - from logo design to color palettes, typography, and brand guidelines. Your brand will stand out in the crowded digital space.";
  }
  
  if (lowerMsg.includes('ad') || lowerMsg.includes('marketing') || lowerMsg.includes('traffic') || lowerMsg.includes('lead')) {
    return "Our growth marketing team runs data-driven campaigns across Google Ads, Meta, and more. We focus on ROI - every dollar spent should bring measurable results.";
  }
  
  if (lowerMsg.includes('seo') || lowerMsg.includes('search') || lowerMsg.includes('rank')) {
    return "SEO is built into everything we do. From technical optimization to content strategy, we'll help you climb the search rankings and get found by your ideal customers.";
  }
  
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
    return "Hey there! 👋 Ready to take your digital presence to the next level? Tell me about your project!";
  }
  
  if (lowerMsg.includes('thank')) {
    return "You're welcome! 🌟 I'm here to help. What else would you like to know about our services?";
  }
  
  return "That's fascinating! I'd love to learn more about your specific needs. Would you like to schedule a free discovery call with our team? We can dive deeper into how sevIT can help elevate your brand.";
};

function ChatSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Content animation
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );

      // Chat window animation
      gsap.fromTo(
        chatWindowRef.current,
        { opacity: 0, x: 50, y: 30 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
          },
          onComplete: () => {
            if (!hasStarted) {
              setHasStarted(true);
              playMessageAnimation();
            }
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [hasStarted]);

  const playMessageAnimation = () => {
    initialMessages.forEach((msg) => {
      setTimeout(() => {
        if (msg.type === 'ai') {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            setMessages((prev) => [...prev, msg]);
            scrollToBottom();
          }, 600);
        } else {
          setMessages((prev) => [...prev, msg]);
          scrollToBottom();
        }
      }, msg.delay || 0);
    });
  };

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      type: 'user',
      text: inputValue,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    scrollToBottom();

    // Simulate AI response with contextual reply
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const aiResponse: Message = {
          id: Date.now() + 1,
          type: 'ai',
          text: getAIResponse(newMessage.text),
        };
        setMessages((prev) => [...prev, aiResponse]);
        scrollToBottom();
      }, 1000);
    }, 400);
  };

  return (
    <section
      ref={sectionRef}
      id="chat"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 z-50"
    >
      {/* Space decorations */}
      <div className="absolute top-20 right-20 text-accent/20">
        <Star className="w-6 h-6 animate-pulse" />
      </div>
      <div className="absolute bottom-40 left-10 text-accent/10">
        <Rocket className="w-8 h-8 animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div ref={contentRef}>
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

            {/* CTA */}
            <div className="mt-10">
              <a
                href="#booking"
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-background bg-foreground rounded-full transition-all duration-300 hover:scale-105 hover:bg-accent"
              >
                Book a Discovery Call
              </a>
            </div>
          </div>

          {/* Chat Window */}
          <div
            ref={chatWindowRef}
            className="relative bg-surface rounded-3xl border border-border/50 overflow-hidden card-shadow"
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-surface/80 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">
                    sev<span className="text-red-500">IT</span> AI
                  </h4>
                  <p className="text-xs text-muted-foreground">Online</p>
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
              ref={messagesRef}
              className="h-[400px] overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin"
            >
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Bot className="w-12 h-12 mb-3 opacity-50" />
                  <p className="text-sm">Start a conversation...</p>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-foreground text-background rounded-br-md'
                        : 'bg-muted text-foreground rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-3 px-6 py-4 border-t border-border/50 bg-surface/80 backdrop-blur-sm"
            >
              <Input
                type="text"
                placeholder="Ask about pricing, services, timelines..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-background border-border/50 text-foreground placeholder:text-muted-foreground rounded-full px-4 py-2 text-sm focus-visible:ring-accent"
              />
              <Button
                type="submit"
                size="icon"
                className="w-10 h-10 rounded-full bg-accent hover:bg-accent/90 flex-shrink-0"
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
