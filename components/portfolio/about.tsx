"use client";

import { useSectionInView } from "@/hooks/use-section-in-view";

const expertise = [
  {
    category: "Frontend",
    description: "Building responsive and interactive user interfaces with modern frameworks",
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Flutter"],
  },
  {
    category: "Backend",
    description: "Designing scalable APIs and robust server architecture",
    technologies: ["Node.js", "Ruby on Rails", "Go", "Python", "Django"],
  },
  {
    category: "Database & Cloud",
    description: "Managing data and deploying on cloud infrastructure",
    technologies: ["MySQL", "MongoDB", "MariaDB", "GCP", "Docker"],
  },
];

const highlights = [
  { number: "3+", label: "Years Building" },
  { number: "10+", label: "Projects Shipped" },
];

export function About() {
  const { ref, isInView } = useSectionInView(0.3);

  return (
    <section
      ref={ref}
      id="about"
      className="fullpage-section relative h-screen flex items-center overflow-hidden"
    >
      {/* Large background number */}
      <div
        className="absolute right-0 md:right-12 top-1/2 -translate-y-1/2 text-[20rem] md:text-[28rem] font-bold text-foreground/6 select-none pointer-events-none leading-none"
        style={{
          opacity: isInView ? 1 : 0,
          transform: isInView
            ? "translateY(-50%) translateX(0)"
            : "translateY(-50%) translateX(50px)",
          transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
        }}
      >
        02
      </div>

      {/* Main content */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left side - Title and intro */}
          <div className="lg:col-span-5">
            {/* Section label */}
            <div
              className="flex items-center gap-3 mb-6"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? "translateX(0)" : "translateX(-20px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <span className="font-mono text-accent text-sm">ABOUT</span>
              <div className="w-12 h-px bg-accent" />
            </div>

            {/* Main heading */}
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? "translateY(0)" : "translateY(30px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
              }}
            >
              <span className="text-muted-foreground">Crafting</span>
              <br />
              <span className="text-foreground">Digital</span>
              <br />
              <span className="text-accent">Experiences</span>
            </h2>

            {/* Bio text */}
            <p
              className="text-muted-foreground leading-relaxed mb-8 max-w-md"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
              }}
            >
              Bachelor of Computer Science from Udayana University, Bali. Certified web developer from Dicoding Indonesia with hands-on experience building scalable web applications using Ruby on Rails and Next.js.
            </p>

            {/* Highlights */}
            <div
              className="flex gap-8"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
              }}
            >
              {highlights.map((item, index) => (
                <div
                  key={item.label}
                  className="relative"
                  style={{
                    opacity: isInView ? 1 : 0,
                    transform: isInView ? "translateY(0)" : "translateY(20px)",
                    transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.4 + index * 0.1}s`,
                  }}
                >
                  <span className="block text-3xl md:text-4xl font-bold text-foreground">
                    {item.number}
                  </span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Expertise cards */}
          <div className="lg:col-span-7">
            <div className="space-y-4">
              {expertise.map((item, index) => (
                <div
                  key={item.category}
                  className="group relative"
                  style={{
                    opacity: isInView ? 1 : 0,
                    transform: isInView ? "translateX(0)" : "translateX(40px)",
                    transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + index * 0.15}s`,
                  }}
                >
                  <div className="relative p-6 rounded-2xl bg-secondary/30 border border-border/50 hover:border-accent/30 transition-all duration-500 overflow-hidden">
                    {/* Hover gradient effect */}
                    <div className="absolute inset-0 bg-linear-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
                      {/* Category number and name */}
                      <div className="flex items-center gap-4 md:w-48 shrink-0">
                        <span className="font-mono text-accent/50 text-sm">
                          0{index + 1}
                        </span>
                        <h3 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors duration-300">
                          {item.category}
                        </h3>
                      </div>

                      {/* Vertical divider */}
                      <div className="hidden md:block w-px h-12 bg-border/50 group-hover:bg-accent/30 transition-colors duration-300" />

                      {/* Description and tech */}
                      <div className="flex-1 space-y-3">
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {item.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 text-xs font-mono rounded-full bg-background/50 border border-border/50 text-muted-foreground group-hover:border-accent/20 group-hover:text-foreground transition-all duration-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom note */}
            <div
              className="mt-6 flex items-center gap-3 text-sm text-muted-foreground"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.7s",
              }}
            >
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>Always learning, always building</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
