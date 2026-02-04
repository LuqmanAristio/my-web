"use client";

import { useSectionInView } from "@/hooks/use-section-in-view";
import { ArrowUpRight, Github } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Nakula",
    description:
      "Property management and booking system with integrated payment gateway.",
    tags: ["Next.js", "Ruby on Rails", "Docker", "Node.js"],
    year: "Present",
    liveUrl: "https://nakula.com",
    githubUrl: "#",
  },
  {
    id: 2,
    title: "My Weather",
    description:
      "Real time weather forecast all around the world by location",
    tags: ["Next.js", "Radix UI", "Tailwind", "Typescript"],
    year: "2025",
    liveUrl: "https://my-weather-beta-blush.vercel.app/",
    githubUrl: "#",
  },
  {
    id: 3,
    title: "Iris",
    description:
      "Product landing page for gadget promotion and explanation",
    tags: ["Next.js", "Radix UI", "Tailwind", "Typescript"],
    year: "2025",
    liveUrl: "https://iris-three-drab.vercel.app/",
    githubUrl: "#",
  },
  {
    id: 4,
    title: "LinkedIt",
    description:
      "Similar to linktree, help user create single page for multiple link",
    tags: ["Next.js", "Golang", "Fiber", "Typescript"],
    year: "2025",
    liveUrl: "#",
    githubUrl: "https://github.com/LuqmanAristio/linkedit-next",
  },
  {
    id: 5,
    title: "Melatec",
    description:
      "Music Similarities Checker with ML model integration for detecting similar music patterns.",
    tags: ["Flutter", "Django", "AI/ML", "GCP"],
    year: "2024",
    liveUrl: "#",
    githubUrl: "https://github.com/LuqmanAristio/melatec-frontend",
  },
  {
    id: 6,
    title: "Presence",
    description:
      "Face Recognition Attendance System with custom AI model for accurate and efficient tracking.",
    tags: ["React", "Node.js", "AI/ML", "Python"],
    year: "2022",
    liveUrl: "#",
    githubUrl: "https://github.com/LuqmanAristio/presence-web-app",
  },
];

export function Projects() {
  const { ref, isInView } = useSectionInView(0.3);

  return (
    <section
      ref={ref}
      id="projects"
      className="
        fullpage-section
        relative
        min-h-dvh md:h-dvh
        px-4 md:px-6
        py-16 md:py-0
        flex
        items-center
        bg-secondary/20
        overflow-hidden
      "
    >
      {/* Background number */}
      <div
        className="
          absolute
          left-0
          top-1/2
          -translate-y-1/2
          pointer-events-none
          select-none
          z-0
        "
        style={{ opacity: isInView ? 1 : 0 }}
      >
        <span className="
          block
          font-bold
          leading-none
          text-foreground/5
          text-[20rem] lg:text-[28rem]
          md:text-[28rem]
        ">
          03
        </span>
      </div>

      <div className="w-full md:max-w-6xl md:mx-auto relative z-10">
        {/* Header */}
        <div
          className="flex items-center gap-4 mb-8 md:mb-12"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(20px)",
            transition:
              "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Featured Projects
          </h2>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* ================= MOBILE: HORIZONTAL SWIPE ================= */}
        <div className="md:hidden">
          <div className="
            flex
            gap-4
            overflow-x-auto
            snap-x snap-mandatory
            px-6
            pb-6
          ">
            {projects.map((project) => (
              <article
                key={project.id}
                className="
                  min-w-[88vw]
                  max-w-[88vw]
                  snap-center
                  rounded-2xl
                  bg-card
                  border
                  border-border/50
                  overflow-hidden
                "
              >
                {/* Image placeholder */}
                <div className="h-36 bg-secondary flex items-center justify-center">
                  <span className="text-4xl font-bold text-muted-foreground/10">
                    {project.year}
                  </span>
                </div>

                <div className="p-4 z-50">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-lg font-semibold">
                      {project.title}
                    </h3>
                    <div className="flex gap-1">
                      <a href={project.githubUrl}>
                        <Github className="w-4 h-4" />
                      </a>
                      <a href={project.liveUrl}>
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs font-mono rounded-full bg-secondary text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-2 text-xs text-muted-foreground text-center">
            Swipe to explore →
          </p>
        </div>

        {/* ================= DESKTOP: GRID ================= */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <article
              key={project.id}
              className="
                group
                relative
                rounded-2xl
                overflow-hidden
                bg-card
                border
                border-border/50
                transition-all
                duration-500
                hover:border-accent/30
                hover:shadow-xl
                hover:shadow-accent/5
                hover:-translate-y-2
              "
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView
                  ? "translateY(0)"
                  : "translateY(30px)",
                transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${
                  0.1 + index * 0.15
                }s`,
              }}
            >
              <div className="h-40 bg-secondary flex items-center justify-center">
                <span className="text-5xl font-bold text-muted-foreground/10">
                  {project.year}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold group-hover:text-accent">
                    {project.title}
                  </h3>
                  <div className="flex gap-1">
                    <a href={project.githubUrl}>
                      <Github className="w-4 h-4" />
                    </a>
                    <a href={project.liveUrl}>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs font-mono rounded-full bg-secondary text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
