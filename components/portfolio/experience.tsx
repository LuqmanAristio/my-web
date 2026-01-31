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
      className="fullpage-section relative h-screen flex items-center justify-center overflow-hidden px-6"
    >
      {/* Large background number */}
      <div 
        className="absolute right-0 md:right-12 top-1/2 -translate-y-1/2 text-[20rem] md:text-[28rem] font-bold text-foreground/[0.02] select-none pointer-events-none leading-none"
        style={{
          opacity: isInView ? 1 : 0,
          transform: isInView ? "translateY(-50%) translateX(0)" : "translateY(-50%) translateX(50px)",
          transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
        }}
      >
        04
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
          <h2 className="text-3xl md:text-4xl font-bold">Experience</h2>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div 
            className="absolute left-0 md:left-8 top-0 w-px bg-border"
            style={{
              height: isInView ? "100%" : "0%",
              transition: "height 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
            }}
          />

          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div
                key={exp.id}
                className="relative pl-8 md:pl-20"
                style={{
                  opacity: isInView ? 1 : 0,
                  transform: isInView ? "translateX(0)" : "translateX(-30px)",
                  transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + index * 0.15}s`,
                }}
              >
                {/* Timeline dot */}
                <div 
                  className="absolute left-0 md:left-8 top-2 w-3 h-3 rounded-full bg-accent border-4 border-background -translate-x-1/2 z-10"
                  style={{
                    transform: `translateX(-50%) scale(${isInView ? 1 : 0})`,
                    transition: `transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.4 + index * 0.15}s`,
                  }}
                />

                {/* Content */}
                <div className="p-6 rounded-2xl bg-secondary/30 border border-border/50 hover:border-accent/30 transition-all duration-500 hover:shadow-lg hover:shadow-accent/5">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-lg font-semibold">{exp.role}</h3>
                      <p className="text-accent text-sm">{exp.company} <span className="text-muted-foreground">- {exp.location}</span></p>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground px-3 py-1 rounded-full bg-secondary w-fit">
                      {exp.period}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{exp.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {exp.highlights.map((highlight, i) => (
                      <span
                        key={i}
                        className="text-xs text-muted-foreground flex items-center gap-1"
                      >
                        <span className="text-accent">{">"}</span>
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
