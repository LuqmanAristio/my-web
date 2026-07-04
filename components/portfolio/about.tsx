"use client";

import { useSectionInView } from "@/hooks/use-section-in-view";

const expertise = [
  {
    category: "Frontend",
    description:
      "Building responsive and interactive user interfaces with modern frameworks",
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Flutter"],
  },
  {
    category: "Backend",
    description:
      "Designing scalable APIs and robust server architecture",
    technologies: ["Node.js", "Ruby on Rails", "Go", "Python", "Django"],
  },
  {
    category: "Database & Cloud",
    description:
      "Managing data and deploying on cloud infrastructure",
    technologies: ["MySQL", "MongoDB", "MariaDB", "GCP", "Docker"],
  },
];

const highlights = [
  { number: "2+", label: "Years Building" },
  { number: "6+", label: "Projects Completed" },
];

export function About() {
  const { ref, isInView } = useSectionInView(0.3);

  return (
    <section
      ref={ref}
      id="about"
      className="
        fullpage-section
        relative
        min-h-dvh md:h-dvh
        px-4 md:px-6
        py-16 md:py-0
        flex
        items-center
        overflow-hidden
      "
    >
      {/* Background number – desktop only */}
      <div
        className="
          absolute
          right-0
          top-1/2
          -translate-y-1/2
          text-[20rem] lg:text-[28rem]
          font-bold
          text-foreground/6
          select-none
          pointer-events-none
          leading-none
        "
        style={{
          opacity: isInView ? 1 : 0,
          transform: isInView
            ? "translateY(-50%) translateX(0)"
            : "translateY(-50%) translateX(50px)",
          transition:
            "all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
        }}
      >
        02
      </div>

      <div className="w-full max-w-md mx-auto md:max-w-7xl md:mx-auto relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10 lg:gap-16 items-start lg:items-center">
          
          {/* LEFT – INTRO */}
          <div className="lg:col-span-5">
            {/* Label */}
            <div
              className="flex items-center gap-3 mb-6"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView
                  ? "translateX(0)"
                  : "translateX(-20px)",
                transition:
                  "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <span className="font-mono text-accent text-sm">
                ABOUT
              </span>
              <div className="w-10 h-px bg-accent" />
            </div>

            {/* Heading */}
            <h2
              className="
                text-3xl
                sm:text-4xl
                md:text-5xl
                lg:text-6xl
                font-bold
                leading-tight
                mb-6
              "
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView
                  ? "translateY(0)"
                  : "translateY(20px)",
                transition:
                  "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
              }}
            >
              <span className="text-muted-foreground">Crafting</span>
              <br />
              <span className="text-foreground">Digital</span>
              <br />
              <span className="text-accent">Experiences</span>
            </h2>

            {/* Bio */}
            <p
              className="
                text-sm
                sm:text-base
                text-muted-foreground
                leading-relaxed
                mb-8
                max-w-md
              "
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView
                  ? "translateY(0)"
                  : "translateY(15px)",
                transition:
                  "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
              }}
            >
              Bachelor of Computer Science from Udayana University,
              Bali. Certified web developer from Dicoding Indonesia
              with hands-on experience building scalable web
              applications using Ruby on Rails and Next.js.
            </p>

            {/* Highlights */}
            <div className="flex gap-8">
              {highlights.map((item) => (
                <div key={item.label}>
                  <span className="block text-3xl font-bold">
                    {item.number}
                  </span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT – EXPERTISE */}
          <div className="lg:col-span-7 w-full">

            {/* ================= MOBILE: HORIZONTAL SWIPE ================= */}
            <div className="md:hidden">
              <div className="
                flex
                gap-4
                overflow-x-auto
                snap-x snap-mandatory
                px-6
                pb-6
                justify-start
              ">
                {expertise.map((item, index) => (
                  <div
                    key={item.category}
                    className="
                      min-w-[88vw] max-w-[88vw]
                      snap-center
                      p-4
                      rounded-2xl
                      bg-secondary/30
                      border
                      border-border/50
                    "
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-mono text-accent/50 text-sm">
                        0{index + 1}
                      </span>
                      <h3 className="text-lg font-semibold">
                        {item.category}
                      </h3>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {item.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="
                            px-3
                            py-1
                            text-xs
                            font-mono
                            rounded-full
                            bg-background/50
                            border
                            border-border/50
                            text-muted-foreground
                          "
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-3 text-xs text-muted-foreground text-center">
                Swipe to explore →
              </p>
            </div>

            {/* ================= DESKTOP: VERTICAL ================= */}
            <div className="hidden md:block space-y-4">
              {expertise.map((item, index) => (
                <div
                  key={item.category}
                  style={{
                    opacity: isInView ? 1 : 0,
                    transform: isInView
                      ? "translateX(0)"
                      : "translateX(20px)",
                    transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${
                      0.25 + index * 0.12
                    }s`,
                  }}
                >
                  <div
                    className="
                      p-6
                      rounded-2xl
                      bg-secondary/30
                      border
                      border-border/50
                      hover:border-accent/30
                      transition-all
                      duration-500
                    "
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-accent/50 text-sm">
                        0{index + 1}
                      </span>
                      <h3 className="text-xl font-semibold">
                        {item.category}
                      </h3>
                    </div>

                    <p className="text-sm text-muted-foreground mt-3">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {item.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="
                            px-3
                            py-1
                            text-xs
                            font-mono
                            rounded-full
                            bg-background/50
                            border
                            border-border/50
                            text-muted-foreground
                          "
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Bottom note */}
              <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span>Always learning, always building</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
