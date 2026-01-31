"use client";

import {
  useEffect,
  useState,
  useRef,
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

export function FullPageWrapper({ children }: FullPageWrapperProps) {
  const [activeSection, setActiveSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);

  const scrollToSection = useCallback(
    (index: number) => {
      if (index < 0 || index >= sections.length || isScrolling) return;

      const container = containerRef.current;
      if (!container) return;

      setIsScrolling(true);
      setActiveSection(index);
      setIsMenuOpen(false);

      const targetSection = document.getElementById(sections[index].id);
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    },
    [isScrolling]
  );

  // Handle anchor link clicks globally
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      
      if (anchor) {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        if (href) {
          const sectionId = href.replace('#', '');
          const sectionIndex = sections.findIndex(s => s.id === sectionId);
          if (sectionIndex !== -1) {
            scrollToSection(sectionIndex);
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, [scrollToSection]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (isScrolling || isMenuOpen) return;

      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        if (e.deltaY > 20) {
          scrollToSection(activeSection + 1);
        } else if (e.deltaY < -20) {
          scrollToSection(activeSection - 1);
        }
      }, 50);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling || isMenuOpen) return;

      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY.current - touchEndY;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          scrollToSection(activeSection + 1);
        } else {
          scrollToSection(activeSection - 1);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling || isMenuOpen) return;

      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        scrollToSection(activeSection + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        scrollToSection(activeSection - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        scrollToSection(0);
      } else if (e.key === "End") {
        e.preventDefault();
        scrollToSection(sections.length - 1);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(scrollTimeout);
    };
  }, [activeSection, isScrolling, isMenuOpen, scrollToSection]);

  return (
    <>
      {/* Floating header - minimal */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollToSection(0)}
            className="relative group"
            type="button"
          >
            <span className="text-lg font-bold tracking-tight">
              MLA
              <span className="text-accent">.</span>
            </span>
          </button>

          {/* Current section indicator - desktop */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <span className="text-accent">
                {String(activeSection + 1).padStart(2, "0")}
              </span>
              <span className="w-8 h-px bg-border" />
              <span>{String(sections.length).padStart(2, "0")}</span>
            </div>
          </div>

          {/* Menu trigger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative flex items-center gap-3 group cursor-pointer"
            type="button"
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-4 flex flex-col justify-between">
              <span
                className={`w-full h-0.5 bg-foreground transition-all duration-300 origin-center ${
                  isMenuOpen ? "rotate-45 translate-y-[7px]" : ""
                }`}
              />
              <span
                className={`w-full h-0.5 bg-foreground transition-all duration-300 ${
                  isMenuOpen ? "opacity-0 scale-0" : ""
                }`}
              />
              <span
                className={`w-full h-0.5 bg-foreground transition-all duration-300 origin-center ${
                  isMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Fullscreen menu overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-700 ease-out ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-background/95 backdrop-blur-xl transition-all duration-700 ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Menu content */}
        <nav className="relative h-full flex items-center">
          <div className="w-full max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
            {/* Navigation links */}
            <div className="flex flex-col justify-center">
              <ul className="space-y-2">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollToSection(index)}
                      className="group flex items-center gap-6 py-3 w-full text-left"
                      type="button"
                      style={{
                        opacity: isMenuOpen ? 1 : 0,
                        transform: isMenuOpen
                          ? "translateX(0)"
                          : "translateX(-40px)",
                        transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s`,
                      }}
                    >
                      {/* Number */}
                      <span className="text-xs font-mono text-muted-foreground w-6">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      {/* Label */}
                      <span
                        className={`text-4xl md:text-6xl font-bold tracking-tight transition-colors duration-300 ${
                          activeSection === index
                            ? "text-accent"
                            : "text-foreground group-hover:text-accent"
                        }`}
                      >
                        {section.label}
                      </span>

                      {/* Arrow indicator */}
                      <span
                        className={`ml-auto text-2xl transition-all duration-300 ${
                          activeSection === index
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-4 group-hover:opacity-50 group-hover:translate-x-0"
                        }`}
                      >
                        <svg
                          className="w-8 h-8"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right side info */}
            <div
              className="hidden md:flex flex-col justify-center items-start pl-12 border-l border-border/30"
              style={{
                opacity: isMenuOpen ? 1 : 0,
                transform: isMenuOpen ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
              }}
            >
              <p className="text-sm text-muted-foreground mb-8 max-w-xs">
                Full Stack Developer based in Bali, Indonesia. Building scalable
                web applications with Ruby on Rails and Next.js.
              </p>

              <div className="space-y-4">
                <p className="text-xs text-muted-foreground uppercase tracking-widest">
                  Get in touch
                </p>
                <a
                  href="mailto:hello@itsluqman.com"
                  className="block text-lg hover:text-accent transition-colors"
                >
                  hello@itsluqman.com
                </a>
              </div>

              <div className="flex gap-6 mt-12">
                {[
                  { name: "GitHub", url: "https://github.com/LuqmanAristio" },
                  { name: "LinkedIn", url: "https://www.linkedin.com/in/luqmanaristio" },
                  { name: "Instagram", url: "https://www.instagram.com/luqman_aristio/" },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Main scrollable container */}
      <div
        ref={containerRef}
        className="fullpage-container h-screen overflow-hidden"
      >
        {children}
      </div>

      {/* Side navigation dots - desktop only */}
      <nav
        className={`fixed right-6 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-3 transition-all duration-500 ${
          isMenuOpen
            ? "opacity-0 translate-x-4 pointer-events-none"
            : "opacity-100 translate-x-0"
        }`}
      >
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(index)}
            className="group relative flex items-center justify-end h-8"
            aria-label={`Go to ${section.label} section`}
          >
            {/* Expanding line */}
            <span
              className={`absolute right-0 h-0.5 transition-all duration-500 ease-out ${
                activeSection === index
                  ? "w-8 bg-accent"
                  : "w-3 bg-muted-foreground/30 group-hover:w-5 group-hover:bg-muted-foreground/50"
              }`}
            />
          </button>
        ))}
      </nav>

      {/* Bottom progress bar - mobile */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-30 md:hidden transition-all duration-500 ${
          isMenuOpen ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="h-1 bg-border/30">
          <div
            className="h-full bg-accent transition-all duration-700 ease-out"
            style={{
              width: `${((activeSection + 1) / sections.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Scroll indicator for first section */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 transition-all duration-700 ${
          activeSection === 0 && !isMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="w-5 h-8 rounded-full border border-muted-foreground/30 flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-accent rounded-full animate-bounce" />
        </div>
      </div>
    </>
  );
}
