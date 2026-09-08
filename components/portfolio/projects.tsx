"use client";

import { useSectionInView } from "@/hooks/use-section-in-view";
import { ArrowUpRight, Github } from "lucide-react";

// Preview gambar project disimpan di `public/projects/` (path di bawah relatif ke /public).
const projects = [
  {
    id: 1,
    title: "PawBack",
    description:
      "Lost and found platform for pets in Bali, Indonesia.",
    image: "/projects/pawback.webp",
    liveUrl: "https://pawback-id.vercel.app",
    githubUrl: "#",
  },
  {
    id: 2,
    title: "Havenly Booking",
    description:
      "All-in-one property management for villas: reservations, front desk, housekeeping, night audit, payments, tax reports, owner payouts",
    image: "/projects/havenly.webp",
    liveUrl: "https://havenly-booking.vercel.app/",
    githubUrl: "#",
  },
  {
    id: 3,
    title: "Tirta Villa",
    description:
      "Showcase site for a luxury tirta estate: villa collection, experiences, gallery, availability, booking checkout, enquiries",
    image: "/projects/tirta-villa.webp",
    liveUrl: "https://tirta-villa.vercel.app",
    githubUrl: "#",
  },
  {
    id: 4,
    title: "Sawarna Villa",
    description:
      "A booking website for a quiet private villa in Ubud, Bali — see it, then book.",
    image: "/projects/sawarna-villa.webp",
    liveUrl: "https://sawarna-villa.vercel.app/",
    githubUrl: "#",
  },
  {
    id: 5,
    title: "Nova Villa",
    description:
      "Minimalist Architectural Web Experience for a Private Contemporary Bali Villa, with a Complete Booking Flow",
    image: "/projects/nova-villa.webp",
    liveUrl: "https://nova-villa-bali.vercel.app",
    githubUrl: "#",
  },
  {
    id: 6,
    title: "My Weather",
    description:
      "Real time weather forecast all around the world by location",
    image: "/projects/my-weather.webp",
    liveUrl: "https://my-weather-beta-blush.vercel.app/",
    githubUrl: "#",
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
        py-6 md:py-0
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
          className="flex items-center gap-4 mb-6 md:mb-12"
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
            hscroll
            flex
            gap-4
            overflow-x-auto
            -mx-4 px-4
            pb-4
          ">
            {projects.map((project) => (
              <article
                key={project.id}
                className="
                  w-[85vw]
                  shrink-0
                  rounded-2xl
                  bg-card
                  border
                  border-border/50
                  overflow-hidden
                "
              >
                <div className="h-44 bg-secondary overflow-hidden">
                  <img
                    src={project.image}
                    alt={`${project.title} preview`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 z-50">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-lg font-semibold">
                      {project.title}
                    </h3>
                    <div className="flex gap-2">
                      {project.githubUrl && project.githubUrl !== "#" && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.title} source code on GitHub`}
                          className="text-muted-foreground hover:text-accent transition-colors"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveUrl && project.liveUrl !== "#" && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${project.title} live site`}
                          className="text-muted-foreground hover:text-accent transition-colors"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {project.description}
                  </p>
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
              <div className="h-48 lg:h-56 bg-secondary overflow-hidden">
                <img
                  src={project.image}
                  alt={`${project.title} preview`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold group-hover:text-accent">
                    {project.title}
                  </h3>
                  <div className="flex gap-2">
                    {project.githubUrl && project.githubUrl !== "#" && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} source code on GitHub`}
                        className="text-muted-foreground hover:text-accent transition-colors"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.liveUrl && project.liveUrl !== "#" && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${project.title} live site`}
                        className="text-muted-foreground hover:text-accent transition-colors"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
