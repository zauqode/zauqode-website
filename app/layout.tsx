import type { Metadata } from "next";
import { Antic_Didone, Sacramento, Poiret_One, Croissant_One, Jost } from "next/font/google";
import "./globals.css";

const anticDidone = Antic_Didone({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-antic-didone",
  display: "swap",
});

const sacramento = Sacramento({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-sacramento",
  display: "swap",
});

const poiretOne = Poiret_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-poiret-one",
  display: "swap",
});

const croissantOne = Croissant_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-croissant-one",
  display: "swap",
});

const jost = Jost({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zauqode | Design & Development Studio",
  description:
    "Zauqode is a bespoke design & development studio, thoughtfully connecting with emotions. I craft premium, modern invitations and occasion websites that satisfy your needs with genuine feeling.",
  keywords: [
    "designer",
    "developer",
    "design and development studio",
    "invitation designer",
    "occasion designer",
    "bespoke invitations",
    "wedding invitations",
    "occasion websites",
    "premium design",
    "modern invitations",
    "Zauqode",
  ],
  authors: [{ name: "Zauqode" }],
  openGraph: {
    type: "website",
    url: "https://www.zauqode.com/",
    siteName: "Zauqode",
    title: "Zauqode | Design & Development Studio",
    description:
      "A bespoke design & development studio, thoughtfully connecting with emotions. Crafting premium, modern invitations and occasion websites that satisfy your needs with genuine feeling.",
    images: [{ url: "https://www.zauqode.com/zauqode-logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zauqode | Design & Development Studio",
    description:
      "A bespoke design & development studio, thoughtfully connecting with emotions. Crafting premium, modern invitations and occasion websites that satisfy your needs with genuine feeling.",
    images: ["https://www.zauqode.com/zauqode-logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${anticDidone.variable} ${sacramento.variable} ${poiretOne.variable} ${croissantOne.variable} ${jost.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}

