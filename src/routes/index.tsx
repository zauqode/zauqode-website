import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RenovatedPortfolio } from "@/components/zauqode/RenovatedPortfolio";

const title = "Zauqode | Design & Development Studio";
const description =
  "Zauqode is a design & development studio thoughtfully connected with emotions. We craft premium, modern websites and bespoke invitations that satisfy your needs with genuine feeling.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { name: "viewport", content: "width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover" },
      { title },
      { name: "description", content: description },
      { name: "keywords", content: "design and development studio, bespoke invitations, wedding websites, occasion portals, premium web design, modern websites, Zauqode" },
      { name: "author", content: "Zauqode" },
      { property: "og:site_name", content: "Zauqode" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.zauqode.com/" },
      { property: "og:image", content: "https://www.zauqode.com/zauqode-logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: "https://www.zauqode.com/zauqode-logo.png" },
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
