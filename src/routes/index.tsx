import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RenovatedPortfolio } from "@/components/zauqode/RenovatedPortfolio";
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/seo";
import { getAdminDataFn } from "@/lib/adminServerFns";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      return await getAdminDataFn();
    } catch {
      return null;
    }
  },
  head: () => ({
    meta: [
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover",
      },
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESCRIPTION },
      { name: "keywords", content: SITE_KEYWORDS },
      { name: "author", content: SITE_NAME },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:image", content: `${SITE_URL}/zauqode-logo.png` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SITE_TITLE },
      { name: "twitter:description", content: SITE_DESCRIPTION },
      { name: "twitter:image", content: `${SITE_URL}/zauqode-logo.png` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
  }),
  component: Index,
});

function Index() {
  const initialData = Route.useLoaderData();

  useEffect(() => {
    document.title = SITE_TITLE;
  }, []);

  return <RenovatedPortfolio initialData={initialData} />;
}
