"use client";

import { useEffect, useState, useRef } from "react";

// Sample the ratio often enough that the checks below can't fall between two
// notifications on a fast swipe.
const THRESHOLDS = [0, 0.05, 0.1, 0.15, 0.25, 0.4, 0.6, 0.8, 1];

export function useSectionInView(threshold = 0.3) {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const rootHeight =
          entry.rootBounds?.height || window.innerHeight || 1;
        const elementHeight = entry.boundingClientRect.height || 1;

        // A section taller than the viewport can never reach a high ratio —
        // on a small phone that used to leave its content stuck at opacity 0.
        // Ask for a share of what *can* be shown instead of a fixed fraction.
        const needed = Math.min(threshold, (rootHeight / elementHeight) * 0.5);

        if (entry.intersectionRatio >= needed) {
          setIsInView(true);
          observer.disconnect(); // entrance animation only plays once
        }
      },
      { threshold: THRESHOLDS }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}
