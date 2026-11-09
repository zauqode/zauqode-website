import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RenovatedPortfolio } from "@/components/zauqode/RenovatedPortfolio";

const title = "Zauqode — Design . Code . Elevate | Invitation Designer & Occasion Websites";
const description =
  "Zauqode is a bespoke studio by an Invitation Designer creating tailored digital suites and websites for celebrations.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { name: "viewport", content: "width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover" },
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.zauqode.com/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.zauqode.com/" }],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    document.title = title;
  }, []);

  return <RenovatedPortfolio />;
}
