"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { FullPageContext } from "./fullpage-context";
import { ThemeToggle } from "./theme-toggle";


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

/* ================= TUNING ================= */
const WHEEL_DURATION = 700; // ms, snap after a wheel step
const NAV_DURATION = 800; // ms, jump from nav dots / logo
const TOUCH_DURATION = 520; // ms, snap after a swipe
const SNAPBACK_DURATION = 340; // ms, spring back when a swipe is too small
const WHEEL_COOLDOWN = 120; // ms buffer to swallow trackpad inertia after a step
const SWIPE_DISTANCE_RATIO = 0.14; // fraction of viewport that counts as a deliberate swipe
const SWIPE_VELOCITY = 0.3; // px/ms flick threshold (fast short flicks still advance)
const EDGE_RESISTANCE = 0.35; // rubber-band damping past the first / last section

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(v, max));

export function FullPageWrapper({ children }: FullPageWrapperProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // activeSection state drives the nav UI; activeIndexRef is the source of
  // truth read inside event handlers so rapid input never reads a stale value.
  const [activeSection, setActiveSection] = useState(0);
  const activeIndexRef = useRef(0);
  const maxIndexRef = useRef(sections.length - 1);

  // Real pixel offset of each section's top, measured from the DOM so the
  // transform always matches the actual layout (handles min-h-dvh sections and
  // mobile toolbar height changes without leaving a sliver of the next panel).
  const offsets = useRef<number[]>([]);

  // Animation / drag state (refs → no re-render per frame).
  const currentY = useRef(0);
  const animFrom = useRef(0);
  const animTo = useRef(0);
  const animStart = useRef(0);
  const animDuration = useRef(WHEEL_DURATION);
  const isAnimating = useRef(false);

  const isDragging = useRef(false);
  const skipDrag = useRef(false);
  const dragStartY = useRef(0);
  const dragStartTime = useRef(0);
  const dragBaseY = useRef(0);

  const wheelLockUntil = useRef(0);
  const reducedMotion = useRef(false);

  const rafId = useRef<number | null>(null);
  const loopRunning = useRef(false);

  /* ================= TRANSFORM + RAF LOOP ================= */
  const applyTransform = (y: number) => {
    if (containerRef.current) {
      // translate3d keeps the whole panel on its own GPU layer → smoother on mobile.
      containerRef.current.style.transform = `translate3d(0, ${-y}px, 0)`;
    }
  };

  const frame = useCallback(() => {
    if (isDragging.current) {
      // While the finger is down we follow it directly (currentY set in touchmove).
      applyTransform(currentY.current);
      rafId.current = requestAnimationFrame(frame);
      return;
    }

    if (isAnimating.current) {
      const t = clamp(
        (performance.now() - animStart.current) / animDuration.current,
        0,
        1
      );
      currentY.current =
        animFrom.current + (animTo.current - animFrom.current) * easeOutCubic(t);
      applyTransform(currentY.current);
      if (t >= 1) isAnimating.current = false;
      rafId.current = requestAnimationFrame(frame);
      return;
    }

    // Idle → stop the loop to save battery (important on mobile).
    loopRunning.current = false;
    rafId.current = null;
  }, []);

  const ensureRunning = useCallback(() => {
    if (!loopRunning.current) {
      loopRunning.current = true;
      rafId.current = requestAnimationFrame(frame);
    }
  }, [frame]);

  /* ================= NAVIGATION ================= */
  const setActive = useCallback((index: number) => {
    activeIndexRef.current = index;
    setActiveSection(index);
    // Keep the URL in sync so sections are deep-linkable / shareable
    // (e.g. /#projects) without polluting browser history.
    if (typeof window !== "undefined") {
      const id = sections[index]?.id;
      if (id) {
        const url =
          index === 0
            ? window.location.pathname + window.location.search
            : `#${id}`;
        window.history.replaceState(null, "", url);
      }
    }
  }, []);

  const animateTo = useCallback(
    (index: number, duration: number) => {
      const target = clamp(index, 0, maxIndexRef.current);
      const to = offsets.current[target] ?? 0;

      if (reducedMotion.current) {
        currentY.current = to;
        applyTransform(to);
        setActive(target);
        return;
      }

      animFrom.current = currentY.current;
      animTo.current = to;
      animStart.current = performance.now();
      animDuration.current = duration;
      isAnimating.current = true;
      setActive(target);
      ensureRunning();
    },
    [ensureRunning, setActive]
  );

  const scrollToSection = useCallback(
    (index: number) => animateTo(index, NAV_DURATION),
    [animateTo]
  );

  /* ================= MEASURE LAYOUT ================= */
  const measure = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const kids = Array.from(el.children) as HTMLElement[];
    if (!kids.length) return;

    offsets.current = kids.map((k) => k.offsetTop);
    maxIndexRef.current = kids.length - 1;

    // Re-align to the current section (unless the user is mid-gesture).
    if (!isDragging.current && !isAnimating.current) {
      const y = offsets.current[
        Math.min(activeIndexRef.current, maxIndexRef.current)
      ] ?? 0;
      currentY.current = y;
      applyTransform(y);
    }
  }, []);

  useEffect(() => {
    reducedMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // Honor an incoming deep link (e.g. /#projects) on first load.
    const hash = window.location.hash.replace("#", "");
    const initialIndex = sections.findIndex((s) => s.id === hash);
    if (initialIndex > 0) {
      activeIndexRef.current = initialIndex;
      setActiveSection(initialIndex);
    }

    measure();
    // Measure again after fonts/images settle layout.
    const raf = requestAnimationFrame(measure);
    const onLoad = () => measure();
    window.addEventListener("load", onLoad);

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => measure())
        : null;
    if (ro && containerRef.current) ro.observe(containerRef.current);

    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      ro?.disconnect();
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [measure]);

  /* ================= WHEEL (desktop / trackpad) ================= */
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = performance.now();
      if (now < wheelLockUntil.current) return;
      if (isDragging.current || isAnimating.current) return;
      if (Math.abs(e.deltaY) < 4) return;

      wheelLockUntil.current = now + WHEEL_DURATION + WHEEL_COOLDOWN;
      animateTo(
        activeIndexRef.current + (e.deltaY > 0 ? 1 : -1),
        WHEEL_DURATION
      );
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [animateTo]);

  /* ================= TOUCH (mobile) ================= */
  useEffect(() => {
    const isFormTarget = (target: EventTarget | null) =>
      !!(target as HTMLElement | null)?.closest?.(
        "input, textarea, [data-no-drag]"
      );

    const onTouchStart = (e: TouchEvent) => {
      // Let form fields, links and buttons behave natively.
      if (isFormTarget(e.target)) {
        skipDrag.current = true;
        return;
      }
      skipDrag.current = false;
      isDragging.current = true;
      // Grab wherever the panel currently is (interrupts any running snap →
      // a second swipe never has to wait for the first animation to finish).
      isAnimating.current = false;
      dragBaseY.current = currentY.current;
      dragStartY.current = e.touches[0].clientY;
      dragStartTime.current = performance.now();
      ensureRunning();
    };

    const onTouchMove = (e: TouchEvent) => {
      if (skipDrag.current || !isDragging.current) return;
      e.preventDefault(); // kill native overscroll / pull-to-refresh
      const delta = dragStartY.current - e.touches[0].clientY;
      let raw = dragBaseY.current + delta;

      const min = offsets.current[0] ?? 0;
      const max = offsets.current[maxIndexRef.current] ?? 0;
      if (raw < min) raw = min + (raw - min) * EDGE_RESISTANCE;
      else if (raw > max) raw = max + (raw - max) * EDGE_RESISTANCE;

      currentY.current = raw;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (skipDrag.current) {
        skipDrag.current = false;
        return;
      }
      if (!isDragging.current) return;
      isDragging.current = false;

      const totalDelta = dragStartY.current - e.changedTouches[0].clientY;
      const elapsed = Math.max(performance.now() - dragStartTime.current, 1);
      const velocity = totalDelta / elapsed; // px/ms
      const vh = outerRef.current?.clientHeight || window.innerHeight;
      const distThreshold = vh * SWIPE_DISTANCE_RATIO;

      let dir = 0;
      if (totalDelta > distThreshold || velocity > SWIPE_VELOCITY) dir = 1;
      else if (totalDelta < -distThreshold || velocity < -SWIPE_VELOCITY)
        dir = -1;

      // One section per gesture → predictable, no accidental multi-jumps.
      animateTo(
        activeIndexRef.current + dir,
        dir === 0 ? SNAPBACK_DURATION : TOUCH_DURATION
      );
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [animateTo, ensureRunning]);

  /* ================= KEYBOARD (accessibility) ================= */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement as HTMLElement | null;
      if (
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.isContentEditable)
      ) {
        return; // don't steal keys while typing in the contact form
      }

      let target = activeIndexRef.current;
      switch (e.key) {
        case "ArrowDown":
        case "PageDown":
        case " ":
          target += 1;
          break;
        case "ArrowUp":
        case "PageUp":
          target -= 1;
          break;
        case "Home":
          target = 0;
          break;
        case "End":
          target = maxIndexRef.current;
          break;
        default:
          return;
      }

      e.preventDefault();
      if (isAnimating.current) return;
      animateTo(target, NAV_DURATION);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [animateTo]);

  /* ================= DEEP LINK (hash) ================= */
  useEffect(() => {
    const onHashChange = () => {
      const id = window.location.hash.replace("#", "");
      const idx = sections.findIndex((s) => s.id === id);
      if (idx >= 0 && idx !== activeIndexRef.current) {
        animateTo(idx, NAV_DURATION);
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [animateTo]);

  /* ================= RENDER ================= */
  return (
    <FullPageContext.Provider value={{ scrollToSection }}>
      {/* ================= UI OVERLAY ================= */}

      {/* Light / dark theme toggle */}
      <ThemeToggle />

      {/* Logo MLA */}
      <header className="fixed md:block hidden top-6 left-6 z-50">
        <button
          onClick={() => scrollToSection(0)}
          className="text-lg font-bold tracking-tight"
        >
          MLA<span className="text-accent">.</span>
        </button>
      </header>

      {/* Side navigation dots / lines */}
      <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(index)}
            aria-label={`Go to ${section.label}`}
            aria-current={activeSection === index ? "true" : undefined}
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
      <div
        ref={outerRef}
        className="fixed inset-0 overflow-hidden touch-none"
      >
        <div ref={containerRef} className="will-change-transform">
          {children}
        </div>
      </div>
    </FullPageContext.Provider>
  );
}
