import { createFileRoute } from "@tanstack/react-router";
import { ClientOnboardingForm } from "@/components/zauqode/ClientOnboardingForm";

export const Route = createFileRoute("/client-onboarding")({
  head: () => ({
    meta: [
      { title: "Client Onboarding — Business Information for Website Creation | Zauqode" },
      {
        name: "description",
        content: "Private client onboarding & business information intake form for approved Zauqode projects.",
      },
      // Keep this unlisted form off search engines
      { name: "robots", content: "noindex, nofollow" },
      { name: "googlebot", content: "noindex, nofollow" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Manrope:wght@400;700&display=swap",
      },
    ],
  }),
  component: ClientOnboardingPage,
});

function ClientOnboardingPage() {
  return <ClientOnboardingForm />;
}
