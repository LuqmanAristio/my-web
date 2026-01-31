"use client";

import { useState } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import { useSectionInView } from "@/hooks/use-section-in-view";

const projects = [
  {
    id: 1,
    title: "Nakula",
    description:
      "Property management and booking system with integrated payment gateway.",
    tags: ["Next.js", "Ruby on Rails", "Docker", "Node.js"],
    year: "Present",
    liveUrl: "#",
    githubUrl: "https://github.com/LuqmanAristio",
  },
  {
    id: 2,
    title: "Melatec",
    description:
      "Music Similarities Checker with ML model integration for detecting similar music patterns.",
    tags: ["Flutter", "Django", "AI/ML", "GCP"],
    year: "2024",
    liveUrl: "#",
    githubUrl: "https://github.com/LuqmanAristio",
  },
  {
    id: 3,
    title: "Presence",
    description:
      "Face Recognition Attendance System with custom AI model for accurate and efficient tracking.",
    tags: ["React", "Node.js", "AI/ML", "Python"],
    year: "2023",
    liveUrl: "#",
    githubUrl: "https://github.com/LuqmanAristio",
  },
];

export function Projects() {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const { ref, isInView } = useSectionInView(0.3);

  return (
    <section
      ref={ref}
      id="projects"
      className="fullpage-section relative h-screen flex items-center justify-center overflow-hidden px-6 bg-secondary/20"
    >
      {/* Large background number */}
      <div 
        className="absolute left-0 md:left-12 top-1/2 -translate-y-1/2 text-[20rem] md:text-[28rem] font-bold text-foreground/6 select-none pointer-events-none leading-none"
        style={{
          opacity: isInView ? 1 : 0,
          transform: isInView ? "translateY(-50%) translateX(0)" : "translateY(-50%) translateX(-50px)",
          transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
        }}
      >
        03
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10">
        {/* Section header */}
        <div 
          className="flex items-center gap-4 mb-12"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold">Featured Projects</h2>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <article
              key={project.id}
              className="group relative rounded-2xl overflow-hidden bg-card border border-border/50 transition-all duration-500 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-2"
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? "translateY(0) scale(1)" : "translateY(40px) scale(0.95)",
                transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + index * 0.15}s`,
              }}
            >
              {/* Project image placeholder */}
              <div className="relative h-40 overflow-hidden">
                <div className="absolute inset-0 bg-secondary flex items-center justify-center">
                  <div className="text-5xl font-bold text-muted-foreground/10">
                    {project.year}
                  </div>
                </div>
                <div
                  className="absolute inset-0 bg-accent/10"
                  style={{
                    opacity: hoveredProject === project.id ? 1 : 0,
                    transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
              </div>

              {/* Project info */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-lg font-semibold group-hover:text-accent transition-colors duration-300">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-1">
                    <a
                      href={project.githubUrl}
                      className="p-1.5 rounded-full hover:bg-secondary transition-colors duration-300"
                      aria-label="View source code"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                    <a
                      href={project.liveUrl}
                      className="p-1.5 rounded-full hover:bg-secondary transition-colors duration-300"
                      aria-label="View live site"
                    >
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

        {/* View all button */}
        <div 
          className="text-center mt-8"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s",
          }}
        >
        </div>
      </div>
    </section>
  );
}
