import { createFileRoute } from "@tanstack/react-router";
import { SmoothScroll } from "@/components/zauqode/SmoothScroll";
import { AmbientBackground } from "@/components/zauqode/AmbientBackground";
import { Preloader } from "@/components/zauqode/Preloader";
import { CinematicCursor } from "@/components/zauqode/CinematicCursor";
import { Navbar } from "@/components/zauqode/Navbar";
import { Hero } from "@/components/zauqode/Hero";
import { IntroStatement } from "@/components/zauqode/IntroStatement";
import { InteractiveShowcase } from "@/components/zauqode/InteractiveShowcase";
import { Services } from "@/components/zauqode/Services";
import { WhyZauqode } from "@/components/zauqode/WhyZauqode";
import { Portfolio } from "@/components/zauqode/Portfolio";
import { Testimonials } from "@/components/zauqode/Testimonials";
import { ProcessTimeline } from "@/components/zauqode/ProcessTimeline";
import { CtaFooter } from "@/components/zauqode/CtaFooter";
import { ContactFooter } from "@/components/zauqode/ContactFooter";

const title = "ZAUQODE — Where Taste Meets Digital | Freelance Creative Studio";
const description =
  "Zauqode creates thoughtfully designed websites for businesses, celebrations, and personal brands. Where taste meets digital.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "ZAUQODE — Creative Studio",
          description,
          areaServed: "Worldwide",
          knowsAbout: [
            "Business Websites",
            "Wedding Websites",
            "Portfolio Websites",
            "Digital Experience Design",
          ],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SmoothScroll>
      <Preloader />
      <CinematicCursor />
      <AmbientBackground />
      <Navbar />
      <main className="relative overflow-x-hidden bg-[#050505] text-[#FDFBF7] z-10">
        <Hero />
        <IntroStatement />
        <InteractiveShowcase />
        <Services />
        <WhyZauqode />
        <Portfolio />
        <Testimonials />
        <ProcessTimeline />
        <CtaFooter />
        <ContactFooter />
      </main>
    </SmoothScroll>
  );
}

