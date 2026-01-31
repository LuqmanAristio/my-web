"use client";

import { useSectionInView } from "@/hooks/use-section-in-view";

const experiences = [
  {
    id: 1,
    role: "Full Stack Developer",
    company: "PT SUM Digital Konsultan",
    location: "Bali, Indonesia",
    period: "Aug 2024 - Present",
    description:
      "Designing and developing scalable web applications and reservation systems using Ruby on Rails and Next.js.",
    highlights: [
      "Integrated STAAH & SiteMinder channel managers",
      "Optimized queries reducing response time 20-30%",
      "Implemented DOKU payment gateway globally",
    ],
  },
  {
    id: 2,
    role: "Software Developer Intern",
    company: "PT XL Axiata Tbk",
    location: "Jakarta, Indonesia",
    period: "Feb 2023 - Jun 2023",
    description:
      "Developed front-end SPA using React and built backend systems with Node.js on Google Cloud",
    highlights: [
      "Developed multiple SPA with React",
      "Deployed apps on Google Cloud Platform",
      "Top 3 best project award at XLKM 4",
    ],
  },
  {
    id: 3,
    role: "Bachelor of Computer Science",
    company: "Udayana University",
    location: "Bali, Indonesia",
    period: "Sep 2020 - Jun 2024",
    description:
      "Studied Computer Science with focus on Programming, Data Structures, Databases, and AI.",
    highlights: [
      "GPA: 3.93/4.00 (146 credits)",
      "Dicoding Web Development Certified",
    ],
  },
];

export function Experience() {
  const { ref, isInView } = useSectionInView(0.3);

  return (
    <section
      ref={ref}
      id="experience"
      className="
        fullpage-section
        relative
        min-h-dvh md:h-dvh
        flex
        items-center
        px-4 md:px-6
        py-0 md:py-0
        overflow-hidden
      "
    >
      {/* Background number */}
      <div
        className="
          absolute
          right-1/2 translate-x-1/2
          md:right-12 md:translate-x-0
          top-1/2 -translate-y-1/2
          text-[20rem] lg:text-[28rem]
          font-bold
          text-foreground/5
          pointer-events-none
          select-none
          leading-none
        "
        style={{
          opacity: isInView ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}
      >
        04
      </div>

      <div className="w-full max-w-105 md:max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div
          className="flex items-center gap-4 mb-10"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(20px)",
            transition:
              "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Experience
          </h2>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* ================= MOBILE: HORIZONTAL SWIPE ================= */}
        <div className="md:hidden">
          <div
            className="
              flex
              gap-4
              overflow-x-auto
              snap-x snap-mandatory
              pb-6
            "
          >
            {experiences.map((exp) => (
              <article
                key={exp.id}
                className="
                  min-w-full
                  snap-center
                  rounded-2xl
                  bg-secondary/30
                  border border-border/50
                  p-5
                "
              >
                <div className="mb-3">
                  <h3 className="text-lg font-semibold">
                    {exp.role}
                  </h3>
                  <p className="text-accent text-sm">
                    {exp.company}{" "}
                    <span className="text-muted-foreground">
                      - {exp.location}
                    </span>
                  </p>
                </div>

                <span className="inline-block mb-3 text-xs font-mono text-muted-foreground px-3 py-1 rounded-full bg-secondary">
                  {exp.period}
                </span>

                <p className="text-sm text-muted-foreground mb-4">
                  {exp.description}
                </p>

                <div className="flex flex-col gap-2">
                  {exp.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="text-xs text-muted-foreground flex gap-2"
                    >
                      <span className="text-accent">{">"}</span>
                      {h}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <p className="mt-2 text-xs text-muted-foreground text-center">
            Swipe to explore →
          </p>
        </div>

        {/* ================= DESKTOP: TIMELINE ================= */}
        <div className="hidden md:block">
          <div className="relative">
            <div className="absolute left-8 top-0 w-px h-full bg-border" />

            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <div
                  key={exp.id}
                  className="relative pl-20"
                  style={{
                    opacity: isInView ? 1 : 0,
                    transform: isInView
                      ? "translateX(0)"
                      : "translateX(-20px)",
                    transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${
                      0.2 + index * 0.15
                    }s`,
                  }}
                >
                  <div className="absolute left-8 top-2 w-3 h-3 rounded-full bg-accent border-4 border-background -translate-x-1/2" />

                  <div className="p-6 rounded-2xl bg-secondary/30 border border-border/50 hover:border-accent/30 transition-all duration-500">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {exp.role}
                        </h3>
                        <p className="text-accent text-sm">
                          {exp.company}{" "}
                          <span className="text-muted-foreground">
                            - {exp.location}
                          </span>
                        </p>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground px-3 py-1 rounded-full bg-secondary">
                        {exp.period}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">
                      {exp.description}
                    </p>

                    <div className="flex flex-col gap-2">
                      {exp.highlights.map((h, i) => (
                        <div
                          key={i}
                          className="text-xs text-muted-foreground flex gap-2"
                        >
                          <span className="text-accent">{">"}</span>
                          {h}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
