"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // The resolved theme is only known on the client, so everything derived from
  // it has to wait for mount. That includes the label, not just the icon:
  // rendering it from `resolvedTheme` alone produced a hydration mismatch,
  // because the server always saw undefined and guessed "Switch to dark mode"
  // while the client already knew better. React does not patch up mismatched
  // attributes, so the label stayed wrong for screen readers too.
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={
        mounted
          ? isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
          : "Toggle color theme"
      }
      className="fixed top-5 right-5 md:top-6 md:right-6 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/60 backdrop-blur-sm text-muted-foreground transition-all duration-300 hover:text-accent hover:border-accent/40"
    >
      {mounted ? (
        isDark ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )
      ) : (
        <span className="h-4 w-4" />
      )}
    </button>
  );
}
