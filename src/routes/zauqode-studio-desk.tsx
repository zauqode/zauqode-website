import { createFileRoute } from "@tanstack/react-router";
import { StudioDesk } from "@/components/zauqode/admin/StudioDesk";

export const Route = createFileRoute("/zauqode-studio-desk")({
  head: () => ({
    meta: [
      { title: "Studio Desk" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "googlebot", content: "noindex, nofollow" },
    ],
  }),
  component: StudioDeskPage,
});

function StudioDeskPage() {
  return <StudioDesk />;
}
