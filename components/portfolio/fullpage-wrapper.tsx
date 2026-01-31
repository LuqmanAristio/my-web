"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface FullPageWrapperProps {
  children: ReactNode;
}

const sections = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Work" },
  { id: "experience", label: "Journey" },
  { id: "contact", label: "Contact" },
];

const LERP_EASE = 0.08;

export function FullPageWrapper({ children }: FullPageWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeSection, setActiveSection] = useState(0);

  const currentY = useRef(0);
  const targetY = useRef(0);

  const isTicking = useRef(false);
  const touchStartY = useRef(0);

  const clampSection = (index: number) =>
    Math.max(0, Math.min(index, sections.length - 1));

  const scrollToSection = useCallback((index: number) => {
    const clamped = clampSection(index);
    setActiveSection(clamped);
    targetY.current = clamped * window.innerHeight;
  }, []);

  /* ================= RAF LOOP ================= */
  useEffect(() => {
    let rafId: number;

    const lerp = (a: number, b: number, n: number) =>
      a + (b - a) * n;

    const animate = () => {
      currentY.current = lerp(
        currentY.current,
        targetY.current,
        LERP_EASE
      );

      if (containerRef.current) {
        containerRef.current.style.transform = `translateY(-${currentY.current}px)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(rafId);
  }, []);

  /* ================= INPUT ================= */
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isTicking.current) return;

      isTicking.current = true;
      scrollToSection(activeSection + (e.deltaY > 0 ? 1 : -1));

      setTimeout(() => (isTicking.current = false), 400);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [activeSection, scrollToSection]);

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const diff = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(diff) < 50) return;
      scrollToSection(activeSection + (diff > 0 ? 1 : -1));
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [activeSection, scrollToSection]);

  /* ================= RENDER ================= */
  return (
    <>
      {/* ================= UI OVERLAY ================= */}

      {/* Logo MLA */}
      <header className="fixed top-6 left-6 z-50">
        <button
          onClick={() => scrollToSection(0)}
          className="text-lg font-bold tracking-tight"
        >
          MLA<span className="text-accent">.</span>
        </button>
      </header>

      {/* Side navigation dots / lines */}
      <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3">
        {sections.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            className="group relative h-8 w-8 flex items-center justify-end"
          >
            <span
              className={`absolute right-0 h-0.5 transition-all duration-500 ${
                activeSection === index
                  ? "w-8 bg-accent"
                  : "w-3 bg-muted-foreground/40 group-hover:w-5"
              }`}
            />
          </button>
        ))}
      </nav>

      {/* ================= SCROLL CONTENT ================= */}
      <div className="fixed inset-0 overflow-hidden">
        <div
          ref={containerRef}
          className="will-change-transform"
          style={{ height: `${sections.length * 100}vh` }}
        >
          {children}
        </div>
      </div>
    </>
  );
}
