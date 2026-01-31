"use client";

import { useEffect, useState, useCallback } from "react";
import { useSectionInView } from "@/hooks/use-section-in-view";
import { useFullPage } from "./fullpage-context";

// Text scramble effect hook
function useTextScramble(text: string, isActive: boolean) {
  const [displayText, setDisplayText] = useState("");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  useEffect(() => {
    if (!isActive) {
      setDisplayText("");
      return;
    }

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }
      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [text, isActive]);

  return displayText;
}

// Orbital animation component - elegant continuous motion
function OrbitalRings() {
  return (
    <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-125 h-125 md:w-150 md:h-150 pointer-events-none">
      {/* Outer ring */}
      <div 
        className="absolute inset-0 rounded-full border border-accent/20"
        style={{
          animation: "spin 60s linear infinite",
        }}
      >
        {/* Dots on outer ring */}
        {[0, 90, 180, 270].map((deg) => (
          <div
            key={deg}
            className="absolute w-2 h-2 bg-accent/50 rounded-full"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${deg}deg) translateX(50%) translateX(calc(250px - 50%)) translateY(-50%)`,
            }}
          />
        ))}
      </div>
      
      {/* Middle ring - counter rotate */}
      <div 
        className="absolute inset-[15%] rounded-full border border-foreground/10"
        style={{
          animation: "spin 45s linear infinite reverse",
        }}
      >
        {[45, 135, 225, 315].map((deg) => (
          <div
            key={deg}
            className="absolute w-1.5 h-1.5 bg-foreground/30 rounded-full"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${deg}deg) translateX(50%) translateX(calc(175px - 50%)) translateY(-50%)`,
            }}
          />
        ))}
      </div>
      
      {/* Inner ring */}
      <div 
        className="absolute inset-[30%] rounded-full border border-accent/15"
        style={{
          animation: "spin 30s linear infinite",
        }}
      >
        {[0, 120, 240].map((deg) => (
          <div
            key={deg}
            className="absolute w-2.5 h-2.5 rounded-full"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${deg}deg) translateX(50%) translateX(calc(105px - 50%)) translateY(-50%)`,
              background: "radial-gradient(circle, rgba(56, 189, 178, 0.6) 0%, transparent 70%)",
            }}
          />
        ))}
      </div>

      {/* Center glow */}
      <div 
        className="absolute inset-[45%] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(56, 189, 178, 0.25) 0%, transparent 70%)",
          animation: "pulse 4s ease-in-out infinite",
        }}
      />
    </div>
  );
}

// Moving gradient line
function AnimatedGradientLine() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden">
      <div 
        className="h-full w-[200%]"
        style={{
          background: "linear-gradient(90deg, transparent, transparent 25%, rgba(56, 189, 178, 0.5) 50%, transparent 75%, transparent)",
          animation: "slideRight 8s linear infinite",
        }}
      />
    </div>
  );
}

// Floating particles component
function FloatingParticles() {
  const [particles, setParticles] = useState<
    {
      left: string
      top: string
      duration: number
      delay: number
    }[]
  >([])

  useEffect(() => {
    const generated = Array.from({ length: 12 }).map(() => ({
      left: `${10 + Math.random() * 80}%`,
      top: `${10 + Math.random() * 80}%`,
      duration: 15 + Math.random() * 10,
      delay: Math.random() * 5,
    }))

    setParticles(generated)
  }, [])

  if (!particles.length) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-accent/50 rounded-full"
          style={{
            left: p.left,
            top: p.top,
            animation: `float ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

// Glowing orb that follows cursor subtly
function GlowingOrb({
  mousePosition,
}: {
  mousePosition: { x: number; y: number };
}) {
  return (
    <div
      className="absolute w-150 h-150 rounded-full pointer-events-none"
      style={{
        background:
          "radial-gradient(circle, rgba(56, 189, 178, 0.12) 0%, transparent 70%)",
        left: "50%",
        top: "50%",
        transform: `translate(calc(-50% + ${mousePosition.x * 2}px), calc(-50% + ${mousePosition.y * 2}px))`,
        transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    />
  );
}

export function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { ref, isInView } = useSectionInView(0.5);
  const [showScramble, setShowScramble] = useState(false);
  const { scrollToSection } = useFullPage();

  const scrambledText = useTextScramble("FULL STACK DEVELOPER", showScramble);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setShowScramble(true), 800);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({
      x: (e.clientX / window.innerWidth - 0.5) * 40,
      y: (e.clientY / window.innerHeight - 0.5) * 40,
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <section
      ref={ref}
      id="hero"
      className="fullpage-section relative h-dvh overflow-hidden"
    >
      <FloatingParticles />
      <GlowingOrb mousePosition={mousePosition} />
      <OrbitalRings />
      <AnimatedGradientLine />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), 
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "100px 100px",
        }}
      />

      {/* Main container with asymmetric layout */}
      <div className="relative z-10 h-full w-full">
        
        {/* Large background number */}
        <div 
          className="absolute right-0 top-1/2 -translate-y-1/2 text-[20rem] lg:text-[28rem] font-bold text-foreground/6 leading-none pointer-events-none select-none"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(-50%) translateX(10%)" : "translateY(-50%) translateX(30%)",
            transition: "all 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
          }}
        >
          01
        </div>

        {/* Left vertical line with year */}
        <div 
          className="absolute left-8 md:left-16 top-0 h-full flex flex-col items-center"
          style={{
            opacity: isInView ? 1 : 0,
            transition: "opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
          }}
        >
          <div 
            className="w-px bg-linear-to-b from-transparent via-accent/50 to-transparent flex-1"
            style={{
              transform: isInView ? "scaleY(1)" : "scaleY(0)",
              transition: "transform 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
            }}
          />
          <span className="text-xs text-muted-foreground/50 tracking-widest py-4 [writing-mode:vertical-lr]">2026</span>
          <div 
            className="w-px bg-linear-to-b from-transparent via-accent/50 to-transparent flex-1"
            style={{
              transform: isInView ? "scaleY(1)" : "scaleY(0)",
              transition: "transform 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
            }}
          />
        </div>

        {/* Right side - vertical text */}
        <div 
          className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-4"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(-50%) translateX(0)" : "translateY(-50%) translateX(20px)",
            transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.7s",
          }}
        >
          <span className="text-xs text-muted-foreground/60 tracking-[0.3em] [writing-mode:vertical-lr] rotate-180">
            SCROLL TO EXPLORE
          </span>
          <div className="w-px h-16 bg-gradient-to-b from-accent/50 to-transparent" />
        </div>

        {/* Main content - Left aligned with offset */}
        <div className="absolute left-[15%] md:left-[20%] top-1/2 -translate-y-1/2 max-w-4xl">
          
          {/* Status badge - aligned left */}
          <div 
            className="flex items-center gap-3 mb-8"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? "translateX(0)" : "translateX(-30px)",
              transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
            }}
          >
            <div className="flex items-center gap-2 px-3 py-1.5 border border-accent/30 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="text-xs text-accent uppercase tracking-wider">Available</span>
            </div>
            <div className="h-px w-12 bg-border" />
            <span className="text-xs text-muted-foreground/60 tracking-wider">Based in Indonesia</span>
          </div>

          {/* Name - Large typography with creative split */}
          <div className="mb-6">
            <div 
              className="overflow-hidden"
              style={{
                opacity: isInView ? 1 : 0,
                transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
              }}
            >
              <h1 
                className="text-[clamp(2.5rem,8vw,6rem)] font-bold leading-[0.9] tracking-tight text-foreground/90"
                style={{
                  transform: isInView ? "translateY(0)" : "translateY(100%)",
                  transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
                }}
              >
                MUHAMMAD
              </h1>
            </div>
            <div 
              className="overflow-hidden"
              style={{
                opacity: isInView ? 1 : 0,
                transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
              }}
            >
              <h1 
                className="text-[clamp(2.5rem,8vw,6rem)] font-bold leading-[0.9] tracking-tight flex items-baseline gap-4"
                style={{
                  transform: isInView ? "translateY(0)" : "translateY(100%)",
                  transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
                }}
              >
                <span className="text-foreground/90">LUQMAN</span>
                <span className="text-accent">.</span>
              </h1>
            </div>
            <div 
              className="overflow-hidden mt-2"
              style={{
                opacity: isInView ? 1 : 0,
                transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
              }}
            >
              <h1 
                className="text-[clamp(2.5rem,8vw,6rem)] font-bold leading-[0.9] tracking-tight"
                style={{
                  transform: isInView ? "translateY(0)" : "translateY(100%)",
                  transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
                }}
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/50">ARISTIO</span>
              </h1>
            </div>
          </div>

          {/* Role with scramble effect - horizontal line design */}
          <div 
            className="flex items-center gap-6 mb-8"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? "translateX(0)" : "translateX(-20px)",
              transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.6s",
            }}
          >
            <div 
              className="h-px bg-accent/50"
              style={{
                width: isInView ? "60px" : "0px",
                transition: "width 1s cubic-bezier(0.16, 1, 0.3, 1) 0.8s",
              }}
            />
            <p className="text-sm md:text-base text-muted-foreground font-mono tracking-[0.2em]">
              {scrambledText || "\u00A0"}
            </p>
          </div>

          {/* Description */}
          <p 
            className="max-w-md text-sm md:text-base text-muted-foreground/70 leading-relaxed mb-10"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.7s",
            }}
          >
            Computer Science graduate from Udayana University with a passion for building scalable web applications. Currently crafting digital solutions at PT SUM Digital Konsultan.
          </p>

          {/* CTA Buttons - minimal design */}
          <div 
            className="flex items-center gap-6"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.8s",
            }}
          >
            <button
              onClick={() => scrollToSection(2)}
              className="group relative flex items-center gap-3 text-foreground font-medium"
            >
              <span className="relative">
                View Work
                <span className="absolute -bottom-1 left-0 w-full h-px bg-foreground scale-x-100 group-hover:scale-x-0 transition-transform duration-500 origin-right" />
                <span className="absolute -bottom-1 left-0 w-full h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </span>
              <svg
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
            
            <span className="text-muted-foreground/30">|</span>
            
            <button
              onClick={() => scrollToSection(4)} // Contact
              className="group relative text-muted-foreground hover:text-foreground"
            >
              Get in Touch
            </button>
          </div>
        </div>

        {/* Bottom info bar */}
        <div 
          className="absolute bottom-8 left-[15%] md:left-[20%] right-[15%] md:right-[20%] flex items-end justify-between"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(30px)",
            transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 1s",
          }}
        >
          {/* Social links - minimal */}
          <div className="flex items-center gap-6">
            {[
              { name: "GitHub", url: "https://github.com/LuqmanAristio" },
              { name: "LinkedIn", url: "https://www.linkedin.com/in/luqmanaristio" },
              { name: "Instagram", url: "https://www.instagram.com/luqman_aristio/" }
            ].map((social, i) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground/50 hover:text-accent transition-colors duration-300 tracking-wider"
                style={{
                  opacity: isInView ? 1 : 0,
                  transform: isInView ? "translateY(0)" : "translateY(10px)",
                  transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${1.1 + i * 0.1}s`,
                }}
              >
                {social.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
