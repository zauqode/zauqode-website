/**
 * Canonical SEO metadata and Schema.org structured data for Zauqode.
 */
export const SITE_URL = "https://www.zauqode.com";
export const SITE_NAME = "Zauqode";
export const SITE_TITLE = "Zauqode | Where Taste Meets Digital";
export const SITE_DESCRIPTION =
  "Zauqode is a design and development, freelance designing studio crafting customized designs by understanding your business needs and occasions.";
export const SITE_KEYWORDS =
  "Zauqode, design and development studio, freelance designing studio, customized designs, business needs, occasion websites, digital invitations, bespoke design studio";

export const SITE_SCHEMA_JSON = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: SITE_NAME,
      alternateName: SITE_TITLE,
      url: `${SITE_URL}/`,
    },
    {
      "@type": "ProfessionalService",
      name: SITE_NAME,
      alternateName: SITE_TITLE,
      url: SITE_URL,
      logo: `${SITE_URL}/zauqode-logo.png`,
      description: SITE_DESCRIPTION,
      knowsAbout: [
        "Design and Development Studio",
        "Freelance Designing Studio",
        "Customized Designs",
        "Business Websites",
        "Occasion Websites",
        "Digital Invitations",
      ],
      sameAs: ["https://www.instagram.com/zauqode"],
    },
  ],
});
