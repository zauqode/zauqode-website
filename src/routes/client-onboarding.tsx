import { createFileRoute } from "@tanstack/react-router";
import { ClientOnboardingForm } from "@/components/zauqode/ClientOnboardingForm";

export const Route = createFileRoute("/client-onboarding")({
  head: () => ({
    meta: [
      { title: "Client Onboarding — Business Information for Website Creation | ZAUQODE" },
      {
        name: "description",
        content: "Private client onboarding & business information intake form for approved ZAUQODE projects.",
      },
      // Keep this unlisted form off search engines
      { name: "robots", content: "noindex, nofollow" },
      { name: "googlebot", content: "noindex, nofollow" },
    ],
  }),
  component: ClientOnboardingPage,
});

function ClientOnboardingPage() {
  return <ClientOnboardingForm />;
}
