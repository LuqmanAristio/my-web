import { Hero } from "@/components/portfolio/hero";
import { About } from "@/components/portfolio/about";
import { Projects } from "@/components/portfolio/projects";
import { Experience } from "@/components/portfolio/experience";
import { Contact } from "@/components/portfolio/contact";
import { FullPageWrapper } from "@/components/portfolio/fullpage-wrapper";

export default function Portfolio() {
  return (
    <FullPageWrapper>
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Contact />
    </FullPageWrapper>
  );
}
