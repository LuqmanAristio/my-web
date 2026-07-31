# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Personal portfolio site for Muhammad Luqman Aristio, built with Next.js App Router (v16), React 19, TypeScript, and Tailwind CSS v4. It is a single-page, full-page-scroll experience (Hero, About, Projects, Experience, Contact) originally scaffolded with v0.app and shadcn/ui.

## Commands

- `npm run dev` — start the dev server
- `npm run build` — production build (note: `next.config.mjs` sets `typescript.ignoreBuildErrors: true`, so a successful build does NOT guarantee the project type-checks)
- `npm run start` — run the production build
- `npm run lint` — run ESLint (`eslint .`); there is no local ESLint config file, so it relies on Next's built-in defaults
- There is no test setup/framework in this repo (no test runner, no test files)
- Use `npx tsc --noEmit` to type-check manually, since build errors are ignored by Next

## Architecture

**Single scroll-hijacked page.** `app/page.tsx` renders one `<FullPageWrapper>` containing all five sections (`Hero`, `About`, `Projects`, `Experience`, `Contact`) as full-viewport-height siblings, not separate routes. There is only one real route in `app/`.

**Custom snap-scroll engine, not a library.** `components/portfolio/fullpage-wrapper.tsx` implements the section-snapping/scroll-hijacking behavior itself: it tracks `activeSection` state, translates a container via `transform: translateY()` driven by a `requestAnimationFrame` lerp loop, and listens to `wheel`/`touchstart`/`touchend`/resize events directly instead of native scroll. `FullPageContext` (`fullpage-context.tsx`) exposes `scrollToSection()` down to children (e.g. nav dots, logo, section CTAs) via `useFullPage()`. When editing scroll/section behavior, this file is the source of truth — there's no other scroll library involved.

**Section components are self-contained and use hardcoded content.** Each file under `components/portfolio/` (`hero.tsx`, `about.tsx`, `projects.tsx`, `experience.tsx`, `contact.tsx`) owns its own data array inline (e.g. the `projects` array in `projects.tsx`, experience entries in `experience.tsx`) — there is no CMS or shared data file. To update portfolio content (projects, work history, social links), edit the relevant array directly in that component.

**Visibility-driven entrance animations.** `hooks/use-section-in-view.ts` wraps `IntersectionObserver` and returns `{ ref, isInView }`. Section components attach `ref` to their root `<section>` and use `isInView` to drive inline-style opacity/transform transitions (no animation library like Framer Motion is used — animations are hand-rolled CSS transitions toggled by this hook).

**Contact form → server action → SMTP.** `components/portfolio/contact.tsx` is a client component that calls `sendMail()` (a `"use server"` action in `lib/send-mail.ts`) directly — no API route. `sendMail` uses `nodemailer` with `SMTP_HOST`/`SMTP_PORT`/`SMTP_USER`/`SMTP_PASS`/`MAIL_FROM`/`MAIL_TO` env vars (not committed; see `.gitignore`'s `.env*` exclusion).

**UI primitives via shadcn/ui.** `components/ui/` contains generated shadcn/ui primitives (style: "new-york", base color: neutral) configured in `components.json`. Path aliases (`@/components`, `@/lib`, `@/ui`, `@/hooks`) are defined both in `components.json` and `tsconfig.json`'s `paths`. Prefer regenerating/extending via shadcn conventions rather than hand-rolling new primitives when one already exists in `components/ui/`.

**Styling.** Tailwind v4 (`@tailwindcss/postcss`), with theme tokens/CSS variables defined in `app/globals.css` (referenced by `components.json` as the Tailwind CSS entry). `styles/` holds additional global styles.
