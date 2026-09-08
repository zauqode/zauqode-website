import { createFileRoute } from "@tanstack/react-router";
import { SmoothScroll } from "@/components/zauqode/SmoothScroll";
import { AmbientBackground } from "@/components/zauqode/AmbientBackground";
import { Preloader } from "@/components/zauqode/Preloader";
import { Navbar } from "@/components/zauqode/Navbar";
import { Hero } from "@/components/zauqode/Hero";
import { Services } from "@/components/zauqode/Services";
import { WhyZauqode } from "@/components/zauqode/WhyZauqode";
import { Portfolio } from "@/components/zauqode/Portfolio";
import { ProcessTimeline } from "@/components/zauqode/ProcessTimeline";
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
            "Digital Invitations & Event Websites",
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
      <AmbientBackground />
      <Navbar />
      <main className="relative overflow-x-hidden bg-[#050505] text-[#FDFBF7] z-10">
        <Hero />
        <Services />
        <WhyZauqode />
        <Portfolio />
        <ProcessTimeline />
        <ContactFooter />
      </main>
    </SmoothScroll>
  );
}




