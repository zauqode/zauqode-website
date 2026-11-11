export interface WorkItem {
  id: string;
  name: string;
  sub: string;
  category: "websites" | "invitations" | "stalls" | "videos" | "business";
  label: string;
  thumb: string;
  url?: string;
  mobileImg?: string;
  videoUrl?: string;
  canIframe?: boolean;
  theme?: string;
  story?: string;
  occasion?: string;
  style?: string;
  included?: string[];
}

export interface TestimonialItem {
  name: string;
  project: string;
  quote: string;
}

export interface WhyPillar {
  num: string;
  title: string;
  description: string;
}

export interface ActiveMockupState {
  url?: string;
  title: string;
  mobileImg?: string;
  videoUrl?: string;
  canIframe?: boolean;
}

export function getOptimizedThumbSources(thumbPath: string) {
  const fileName = thumbPath.split("/").pop() || "";
  const stem = fileName.replace(/\.[^/.]+$/, "");
  if (!stem) {
    return null;
  }
  return {
    avif400: `/works/opt/${stem}-400.avif`,
    avif800: `/works/opt/${stem}-800.avif`,
    webp400: `/works/opt/${stem}-400.webp`,
    webp800: `/works/opt/${stem}-800.webp`,
  };
}

export const PORTFOLIO_WORKS: WorkItem[] = [
  {
    id: "01",
    name: "Sonali & Pallav",
    sub: "Occasion Website & RSVP Concierge",
    category: "websites",
    label: "Wedding Website",
    thumb: "/works/pallav-sonali.jpg",
    url: "https://pallav-weds-sonali.vercel.app/",
    mobileImg: "/works/mobile-pallav-sonali.png",
    canIframe: true,
  },
  {
    id: "02",
    name: "Bala & Shahin",
    sub: "Grand Celebration & Itinerary Portal",
    category: "websites",
    label: "Wedding Celebration",
    thumb: "/works/bala-shahin.jpg",
    url: "https://bala-weds-shahin.vercel.app/",
    mobileImg: "/works/mobile-bala-shahin.png",
    canIframe: true,
  },
  {
    id: "03",
    name: "Aravinda & Salini",
    sub: "Sacred Temple Wedding Portal",
    category: "websites",
    label: "Sacred Wedding",
    thumb: "/works/aravinda-salini.jpg",
    url: "https://aravinda-weds-salini.vercel.app/",
    mobileImg: "/works/mobile-aravinda-salini.png",
    canIframe: true,
  },
  {
    id: "04",
    name: "Akash & Megha",
    sub: "Celebration Portal & Digital Invitation",
    category: "websites",
    label: "Wedding Portal",
    thumb: "/works/akash-megha.jpg",
    url: "https://akash-weds-megha.vercel.app/",
    mobileImg: "/works/mobile-akash-megha.png",
    canIframe: true,
  },
  {
    id: "05",
    name: "Giridhar & Renee",
    sub: "A Sacred Wedding Celebration & Portal",
    category: "websites",
    label: "Wedding Celebration",
    thumb: "/works/giridhar-renee.jpg",
    url: "https://giridhar-weds-renee.vercel.app/",
    mobileImg: "/works/mobile-giridhar-renee.jpg",
    canIframe: true,
  },
  {
    id: "06",
    name: "Akash & Yazhini",
    sub: "Four-Ceremony Royal Folio Suite",
    category: "invitations",
    label: "Heirloom Suite",
    thumb: "/works/invite-akash-yazhini.jpg",
    mobileImg: "/works/invite-akash-yazhini.jpg",
    canIframe: false,
    story:
      "The couple wished for an opulent royal heritage tribute to their lineage. I crafted a four-ceremony folio with emerald foil borders, sacred kolam motifs, and dedicated ceremony cards.",
    occasion: "Four-Ceremony Royal Wedding",
    style: "Deep Forest & Heritage Gold Folio",
    included: ["4 Ceremony Folios", "Custom Monogram", "Wax Seal Motif", "WhatsApp Suite"],
  },
  {
    id: "07",
    name: "Karthik & Divya",
    sub: "Emerald Lotus & Translucent Vellum Suite",
    category: "invitations",
    label: "Vellum & Lotus",
    thumb: "/works/invite-karthik-divya.jpg",
    mobileImg: "/works/invite-karthik-divya.jpg",
    canIframe: false,
    story:
      "A modern botanical dream requested with ethereal serenity. Hand-painted emerald lotus blossoms paired with translucent vellum overlays and delicate gold serif typography.",
    occasion: "Traditional Temple Wedding",
    style: "Emerald Lotus & Translucent Vellum",
    included: ["Translucent Vellum Overlay", "Hand-Painted Lotus Card", "Keepsake RSVP", "Digital Envelope"],
  },
  {
    id: "08",
    name: "Mohammed & Shakila",
    sub: "Imperial Burgundy & Gold Arch Suite",
    category: "invitations",
    label: "Royal Nikkah",
    thumb: "/works/invite-nikkah.jpg",
    mobileImg: "/works/invite-nikkah.jpg",
    canIframe: false,
    story:
      "Designed for a grand imperial celebration. Incorporates majestic Islamic arch silhouettes, intricate damask borders, and rich imperial burgundy hues with gilded calligraphy.",
    occasion: "Royal Nikkah Celebration",
    style: "Imperial Burgundy & Gilded Arch",
    included: ["Gilded Arch Main Folio", "Reception Card", "Bespoke Calligraphy", "Mobile Preview Suite"],
  },
  {
    id: "09",
    name: "Malligai Manam",
    sub: "மல்லிகை மணம் சூடிக்கொள் — Jasmine Stall Board",
    category: "stalls",
    label: "Wedding Stall Board",
    thumb: "/works/invite-jasmine.jpg",
    mobileImg: "/works/invite-jasmine.jpg",
    canIframe: false,
    story:
      "Custom wedding event stall board crafted for a fresh jasmine flower counter. Designed with auspicious emerald-teal tones, hand-drawn kolam motifs, and poetic Tamil calligraphy.",
    occasion: "Wedding Event Flower Stall",
    style: "Emerald Teal, Temple Gold & Tamil Script",
    included: ["Custom Event Stall Signage", "Tamil Calligraphy Artwork", "Large-Format Print Ready", "Traditional Kolam Borders"],
  },
  {
    id: "10",
    name: "Kaadhalum Valaiyalum",
    sub: "காதலும் கை வளையலும் — Bangle Stall Board",
    category: "stalls",
    label: "Wedding Stall Board",
    thumb: "/works/invite-valaiyal.jpg",
    mobileImg: "/works/invite-valaiyal.jpg",
    canIframe: false,
    story:
      "Bespoke event stall board crafted for a traditional wedding bangle counter. Combines nostalgic Tamil lyrical charm with illustrated bangle stand artwork, temple bells, and festive borders.",
    occasion: "Wedding Event Bangle Stall",
    style: "Warm Ivory, Crimson & Festive Gold",
    included: ["Event Counter Display Board", "Custom Bangle Illustration", "Large-Format Print Ready", "Themed Event Coordination"],
  },
  {
    id: "11",
    name: "Dr. Vamsi & Ritika",
    sub: "Traditional Musical & Vedic Motion Suite",
    category: "videos",
    label: "Video Invitation",
    thumb: "/works/vamsi-ritika.jpg",
    videoUrl: "/works/vamsi-ritika-video.mp4",
    canIframe: false,
  },
  {
    id: "12",
    name: "Zara Invitations",
    sub: "Artisan Stationery & Bespoke Showcase",
    category: "business",
    label: "Business Website",
    thumb: "/works/zara-mockup.png",
    url: "https://zara-invitation-website.vercel.app/",
    mobileImg: "/works/zara-mockup.png",
    canIframe: true,
  },
  {
    id: "13",
    name: "Thrive Properties",
    sub: "Premium Real Estate & Property Discovery",
    category: "business",
    label: "Business Website",
    thumb: "/works/thrive-mockup.jpg",
    url: "https://thriveproperties.vercel.app/",
    mobileImg: "/works/thrive-mockup.jpg",
    canIframe: true,
  },
  {
    id: "14",
    name: "Santhosh & Harini",
    sub: "Wedding Ceremony & Courtyard Reception Portal",
    category: "websites",
    label: "Wedding Website",
    thumb: "/works/santhosh-harini.jpg",
    url: "https://santhosh-weds-harini.vercel.app/",
    mobileImg: "/works/mobile-santhosh-harini.png",
    canIframe: true,
  },
  {
    id: "15",
    name: "Sanjay & Ramya",
    sub: "London Savoy Celebration & Wedding Portal",
    category: "websites",
    label: "Wedding Website",
    thumb: "/works/sanjay-ramya.jpg",
    url: "https://sanjay-weds-ramya.vercel.app/",
    mobileImg: "/works/mobile-sanjay-ramya.png",
    canIframe: true,
  },
  {
    id: "16",
    name: "Valaikaappu & Baby Shower",
    sub: "South Indian Valaikaappu Celebration Website",
    category: "websites",
    label: "Occasion Website",
    thumb: "/works/baby-shower.jpg",
    url: "https://baby-shower-theta-one.vercel.app/",
    mobileImg: "/works/mobile-baby-shower.png",
    canIframe: true,
  },
  {
    id: "17",
    name: "Dr. Ananya & Siddharth",
    sub: "Sacred South Indian Hindu Wedding Portal",
    category: "websites",
    label: "Sacred Wedding",
    thumb: "/works/ananya-siddharth.jpg",
    url: "https://ananya-siddharth-zauqode.vercel.app/",
    mobileImg: "/works/mobile-ananya-siddharth.png",
    canIframe: true,
  },
  {
    id: "18",
    name: "Amina & Yusuf",
    sub: "Nikah & Royal Ballroom Wedding Invitation",
    category: "websites",
    label: "Nikah Website",
    thumb: "/works/amina-yusuf.jpg",
    url: "https://amina-and-yusuf.vercel.app/",
    mobileImg: "/works/mobile-amina-yusuf.png",
    canIframe: true,
  },
];

export const HOME_SELECTED_WORKS: WorkItem[] = [
  PORTFOLIO_WORKS.find((w) => w.id === "01")!,
  PORTFOLIO_WORKS.find((w) => w.id === "06")!,
  PORTFOLIO_WORKS.find((w) => w.id === "11")!,
  PORTFOLIO_WORKS.find((w) => w.id === "12")!,
].filter(Boolean);

export const INVITATION_WORKS: WorkItem[] = PORTFOLIO_WORKS.filter(
  (w) => w.category === "invitations" || w.category === "stalls"
);

export const TESTIMONIALS: TestimonialItem[] = [
  {
    name: "Sonali & Major Pallav",
    project: "Occasion Portal & Folio",
    quote:
      "“Absolutely loved how our invitation turned out! You were so understanding, patient, and creative throughout the process. Highly recommended! ❤️”",
  },
  {
    name: "Aravind & Salini",
    project: "Sacred Temple Portal",
    quote:
      "“What a dreamy invitation! Impressed by the creativity and attention to detail. Truly the best invitation I’ve seen! ✨”",
  },
  {
    name: "Bala & Shahin",
    project: "Digital Wedding Invitation",
    quote:
      "“Such a unique and elegant digital invitation! It’s not just an invitation; it’s a beautiful expression of thoughtfulness and style. Absolutely loved it! ❤️”",
  },
  {
    name: "Giridhar & Renee",
    project: "Celebration & RSVP Suite",
    quote:
      "“You understood exactly what we envisioned. Your amazing taste, creativity, and editing made our special occasion even more memorable! 💗”",
  },
];

export const WHY_PILLARS: WhyPillar[] = [
  {
    num: "01",
    title: "Thoughtful, not templated.",
    description:
      "No mass-produced framework skins. Every layout, serif pairing, and detail is specifically conceived around your celebration or brand’s unique character.",
  },
  {
    num: "02",
    title: "Beautiful, and engineered to perform.",
    description:
      "Editorial visual aesthetics backed by clean custom code, effortless loading, and crisp mobile responsiveness for guests and visitors everywhere.",
  },
  {
    num: "03",
    title: "Refined, without unnecessary clutter.",
    description:
      "Measured interactive motion and intentional white space that invite quiet admiration—elevating delight without overwhelming the moment.",
  },
  {
    num: "04",
    title: "Direct 1-on-1 creative partnership.",
    description:
      "From your very first message to live launch and print coordination, you collaborate directly with me so every nuance feels deeply personal.",
  },
];

