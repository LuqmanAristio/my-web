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
const AXIS_LOCK_PX = 12; // finger travel before we commit a gesture to one axis
const FLICK_IDLE_MS = 120; // finger parked longer than this → not a flick, distance decides
const STOP_EPSILON = 24; // overflow smaller than this isn't worth an extra stop
const STOP_STEP_RATIO = 0.9; // how far one intra-section step travels (× viewport)

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(v, max));

// A snap position. Sections shorter than the viewport contribute exactly one
// stop; taller ones (long content on small phones) get extra stops so nothing
// below the fold is unreachable.
type Stop = { y: number; section: number };

export function FullPageWrapper({ children }: FullPageWrapperProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // activeSection state drives the nav UI; the refs are the source of truth
  // read inside event handlers so rapid input never sees a stale value.
  const [activeSection, setActiveSection] = useState(0);
  const activeSectionRef = useRef(0);
  const activeStopRef = useRef(0);
  const maxIndexRef = useRef(0);

  // Real pixel offsets measured from the DOM so the transform always matches
  // the actual layout (handles min-h-dvh sections and mobile toolbar height
  // changes without leaving a sliver of the next panel).
  const stops = useRef<Stop[]>([{ y: 0, section: 0 }]);
  const firstStop = useRef<number[]>([0]);

  // Animation / drag state (refs → no re-render per frame).
  const currentY = useRef(0);
  const animFrom = useRef(0);
  const animTo = useRef(0);
  const animStart = useRef(0);
  const animDuration = useRef(WHEEL_DURATION);
  const isAnimating = useRef(false);

  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragBaseY = useRef(0);

  // Single-touch bookkeeping. Tracking the identifier means a second finger
  // landing mid-swipe can't hijack or strand the gesture.
  const touch = useRef({
    id: -1,
    tracking: false,
    axis: null as null | "x" | "y",
    startX: 0,
    startY: 0,
    startTime: 0,
    lastY: 0,
    lastTime: 0,
    prevY: 0,
    prevTime: 0,
  });

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
  const setActive = useCallback((stopIndex: number) => {
    activeStopRef.current = stopIndex;
    const section = stops.current[stopIndex]?.section ?? 0;
    if (section === activeSectionRef.current) return;

    activeSectionRef.current = section;
    setActiveSection(section);
    // Keep the URL in sync so sections are deep-linkable / shareable
    // (e.g. /#projects) without polluting browser history.
    if (typeof window !== "undefined") {
      const id = sections[section]?.id;
      if (id) {
        const url =
          section === 0
            ? window.location.pathname + window.location.search
            : `#${id}`;
        window.history.replaceState(null, "", url);
      }
    }
  }, []);

  const animateTo = useCallback(
    (stopIndex: number, duration: number) => {
      const target = clamp(stopIndex, 0, maxIndexRef.current);
      const to = stops.current[target]?.y ?? 0;

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
    (index: number) => {
      const stopIndex = firstStop.current[index];
      if (stopIndex === undefined) return;
      animateTo(stopIndex, NAV_DURATION);
    },
    [animateTo]
  );

  /* ================= MEASURE LAYOUT ================= */
  const measure = useCallback(() => {
    const el = containerRef.current;
    const outer = outerRef.current;
    if (!el || !outer) return;

    const kids = Array.from(el.children) as HTMLElement[];
    if (!kids.length) return;

    const vh = outer.clientHeight || window.innerHeight;
    const next: Stop[] = [];
    const firsts: number[] = [];

    kids.forEach((kid, i) => {
      const top = kid.offsetTop;
      const lastReachable = top + kid.offsetHeight - vh;

      firsts.push(next.length);
      next.push({ y: top, section: i });

      // Extra stops for a section that outgrows the viewport, so its lower
      // half is reachable instead of being skipped over to the next section.
      let y = top;
      while (lastReachable - y > STOP_EPSILON) {
        y = Math.min(y + vh * STOP_STEP_RATIO, lastReachable);
        next.push({ y, section: i });
      }
    });

    // Preserve the reader's place across a re-measure (font load, viewport
    // resize, a form message appearing) instead of snapping back to the top.
    const section = activeSectionRef.current;
    const withinSection =
      activeStopRef.current - (firstStop.current[section] ?? 0);

    stops.current = next;
    firstStop.current = firsts;
    maxIndexRef.current = next.length - 1;

    const base = firsts[section] ?? 0;
    const lastOfSection = (firsts[section + 1] ?? next.length) - 1;
    const restored = clamp(base + withinSection, base, lastOfSection);
    activeStopRef.current = restored;

    // Re-align (unless the user is mid-gesture).
    if (!isDragging.current && !isAnimating.current) {
      const y = next[restored]?.y ?? 0;
      currentY.current = y;
      applyTransform(y);
    }
  }, []);

  useEffect(() => {
    reducedMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    measure();

    // Honor an incoming deep link (e.g. /#projects) on first load.
    const hash = window.location.hash.replace("#", "");
    const initialIndex = sections.findIndex((s) => s.id === hash);
    if (initialIndex > 0) {
      const stopIndex = firstStop.current[initialIndex] ?? 0;
      activeStopRef.current = stopIndex;
      activeSectionRef.current = initialIndex;
      setActiveSection(initialIndex);
      currentY.current = stops.current[stopIndex]?.y ?? 0;
      applyTransform(currentY.current);
    }

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
      // Sideways trackpad gestures belong to whatever horizontal scroller is
      // under the cursor, not to the page.
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      e.preventDefault();
      const now = performance.now();
      if (now < wheelLockUntil.current) return;
      if (isDragging.current || isAnimating.current) return;
      if (Math.abs(e.deltaY) < 4) return;

      wheelLockUntil.current = now + WHEEL_DURATION + WHEEL_COOLDOWN;
      animateTo(
        activeStopRef.current + (e.deltaY > 0 ? 1 : -1),
        WHEEL_DURATION
      );
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [animateTo]);

  /* ================= TOUCH (mobile) ================= */
  useEffect(() => {
    // Only hand a vertical gesture to a field that can genuinely consume it —
    // a textarea with lines hidden below the fold. Skipping every form control
    // outright made a swipe starting on the contact textarea do nothing at
    // all, which is indistinguishable from the page being frozen. Taps and
    // focus are unaffected either way: they never reach the axis-lock
    // threshold, so the field still receives them.
    const ownsVerticalTouch = (target: EventTarget | null) => {
      const el = (target as HTMLElement | null)?.closest?.(
        "textarea, [contenteditable='true'], [data-no-drag]"
      ) as HTMLElement | null;
      if (!el) return false;
      if (el.hasAttribute("data-no-drag")) return true;
      return el.scrollHeight > el.clientHeight + 1;
    };

    const stopTracking = () => {
      touch.current.tracking = false;
      touch.current.axis = null;
    };

    // Give the panel back to its current stop when a gesture is interrupted
    // (second finger, system gesture, call notification…). Without this the
    // panel would be stranded wherever the finger left it.
    const releaseDrag = () => {
      if (isDragging.current) {
        isDragging.current = false;
        animateTo(activeStopRef.current, SNAPBACK_DURATION);
      }
      stopTracking();
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        releaseDrag();
        return;
      }
      const t = e.touches[0];
      if (ownsVerticalTouch(t.target)) {
        stopTracking();
        return;
      }

      const now = performance.now();
      touch.current = {
        id: t.identifier,
        tracking: true,
        // Axis is undecided until the finger has actually travelled: a tap
        // (or the start of a horizontal card swipe) must not grab the page.
        axis: null,
        startX: t.clientX,
        startY: t.clientY,
        startTime: now,
        lastY: t.clientY,
        lastTime: now,
        prevY: t.clientY,
        prevTime: now,
      };
    };

    const onTouchMove = (e: TouchEvent) => {
      const st = touch.current;
      if (!st.tracking) return;
      if (e.touches.length > 1) {
        releaseDrag();
        return;
      }

      const t = e.touches[0];
      if (t.identifier !== st.id) return;

      if (!st.axis) {
        const dx = t.clientX - st.startX;
        const dy = t.clientY - st.startY;
        if (Math.abs(dx) < AXIS_LOCK_PX && Math.abs(dy) < AXIS_LOCK_PX) return;

        if (Math.abs(dx) > Math.abs(dy)) {
          // Horizontal intent → hands off, the browser scrolls the carousel
          // this touch started in (touch-action: pan-x on the viewport).
          stopTracking();
          return;
        }

        st.axis = "y";
        isDragging.current = true;
        // Grab wherever the panel currently is (interrupts any running snap →
        // a second swipe never has to wait for the first animation to finish).
        isAnimating.current = false;
        dragBaseY.current = currentY.current;
        // Rebase on the current finger position so the axis-lock deadzone
        // doesn't show up as a jump.
        dragStartY.current = t.clientY;
        ensureRunning();
      }

      e.preventDefault(); // kill native overscroll / pull-to-refresh

      const delta = dragStartY.current - t.clientY;
      let raw = dragBaseY.current + delta;

      const min = stops.current[0]?.y ?? 0;
      const max = stops.current[maxIndexRef.current]?.y ?? 0;
      if (raw < min) raw = min + (raw - min) * EDGE_RESISTANCE;
      else if (raw > max) raw = max + (raw - max) * EDGE_RESISTANCE;

      currentY.current = raw;

      const now = performance.now();
      st.prevY = st.lastY;
      st.prevTime = st.lastTime;
      st.lastY = t.clientY;
      st.lastTime = now;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const st = touch.current;
      if (!st.tracking) return;

      const t = Array.from(e.changedTouches).find((c) => c.identifier === st.id);
      if (!t) return; // some other finger lifted — keep tracking ours

      const wasDragging = st.axis === "y" && isDragging.current;
      stopTracking();
      if (!wasDragging) return;
      isDragging.current = false;

      const now = performance.now();
      const totalDelta = st.startY - t.clientY;
      // Velocity from the last sampled segment, so a slow drag that ends in a
      // flick still advances — and a finger parked before lifting doesn't.
      const idle = now - st.lastTime;
      const sampleDt = Math.max(st.lastTime - st.prevTime, 1);
      const velocity =
        idle > FLICK_IDLE_MS ? 0 : (st.prevY - st.lastY) / sampleDt;

      const vh = outerRef.current?.clientHeight || window.innerHeight;
      const distThreshold = vh * SWIPE_DISTANCE_RATIO;

      let dir = 0;
      if (totalDelta > distThreshold || velocity > SWIPE_VELOCITY) dir = 1;
      else if (totalDelta < -distThreshold || velocity < -SWIPE_VELOCITY)
        dir = -1;

      // One stop per gesture → predictable, no accidental multi-jumps.
      animateTo(
        activeStopRef.current + dir,
        dir === 0 ? SNAPBACK_DURATION : TOUCH_DURATION
      );
    };

    const onTouchCancel = () => releaseDrag();

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchCancel, { passive: true });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchCancel);
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

      let target = activeStopRef.current;
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
      if (idx >= 0 && idx !== activeSectionRef.current) {
        scrollToSection(idx);
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [scrollToSection]);

  /* ================= FOCUS / STRAY SCROLL ================= */
  useEffect(() => {
    const outer = outerRef.current;
    const container = containerRef.current;
    if (!outer || !container) return;

    // Safety net for browsers without `overflow: clip`: an overflow-hidden box
    // is still a scroll container, and any scrolling the browser does to it
    // stacks on top of our transform with no way back. Pin it at zero.
    const pin = () => {
      if (outer.scrollTop !== 0) outer.scrollTop = 0;
      if (outer.scrollLeft !== 0) outer.scrollLeft = 0;
    };

    // Since the browser can no longer scroll a field into view, we move the
    // panel instead — otherwise tapping an off-screen input (or the mobile
    // keyboard revealing one) would focus something nobody can see.
    const onFocusIn = (e: FocusEvent) => {
      pin();
      const el = e.target as HTMLElement | null;
      if (!el || !container.contains(el)) return;

      const vh = outer.clientHeight || window.innerHeight;
      const containerTop = container.getBoundingClientRect().top;
      const top = el.getBoundingClientRect().top - containerTop;
      const bottom = top + el.offsetHeight;

      const overlapAt = (i: number) => {
        const stop = stops.current[i];
        if (!stop) return -1;
        return Math.min(bottom, stop.y + vh) - Math.max(top, stop.y);
      };

      // Stay put if the element is already as visible as it can get.
      let best = activeStopRef.current;
      let bestVisible = overlapAt(best);
      stops.current.forEach((_, i) => {
        const visible = overlapAt(i);
        if (visible > bestVisible + 1) {
          bestVisible = visible;
          best = i;
        }
      });

      if (best !== activeStopRef.current) animateTo(best, NAV_DURATION);
    };

    outer.addEventListener("scroll", pin, { passive: true });
    outer.addEventListener("focusin", onFocusIn);
    pin();

    return () => {
      outer.removeEventListener("scroll", pin);
      outer.removeEventListener("focusin", onFocusIn);
    };
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
      {/* .fullpage-viewport carries the clipping and touch-action rules — see
          the comment on it in globals.css, both are load-bearing. */}
      <div ref={outerRef} className="fixed inset-0 fullpage-viewport">
        <div ref={containerRef} className="will-change-transform">
          {children}
        </div>
      </div>
    </FullPageContext.Provider>
  );
}
