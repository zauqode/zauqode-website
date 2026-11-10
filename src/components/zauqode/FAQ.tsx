import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles } from "lucide-react";

const faqs = [
  {
    id: 1,
    q: "How do our guests open and experience the digital invitation?",
    a: "Your guests simply tap a link sent via WhatsApp, SMS, Instagram, or email. The invitation opens instantly in their browser with fluid unsealing animations, ambient music, and interactive event details. No apps or sign-ups required — 100% seamless across all iPhones and Androids.",
  },
  {
    id: 2,
    q: "Can we include our favorite song or background music?",
    a: "Yes! You can choose any instrumental piece (violin, piano, harp, shehnai), a favorite romantic song, or even a personalized voice greeting. I integrate a subtle audio controller so guests can effortlessly play or mute the soundtrack.",
  },
  {
    id: 3,
    q: "Where do guest RSVP responses go and how do we track them?",
    a: "Every RSVP submission (attending status, guest count, meal preferences, and heartfelt wishes) is instantly logged in real time into your private, organized Google Sheet. You can monitor your guest list anytime from your phone or computer.",
  },
  {
    id: 4,
    q: "Can we feature multiple events like Haldi, Sangeet, and Reception?",
    a: "Absolutely. My celebration portals elegantly structure multi-day itineraries with separate timings, dress code recommendations, and dedicated 1-tap Google Maps navigation pins for each venue so guests never get lost.",
  },
  {
    id: 5,
    q: "Can you provide matching printable cards for elder relatives?",
    a: "Yes. In my Haute Couture Suite, I provide matching 300 DPI print-ready files (Save the Date, Formal Wedding Card, Reception Itinerary) formatted for physical foil stamping and local luxury printing.",
  },
  {
    id: 6,
    q: "How fast can we receive our invitation for an upcoming date?",
    a: "Standard delivery is 5–7 business days, with initial design concepts delivered within 48–72 hours. If your celebration date is very close, I offer expedited rush turnaround options.",
  },
];

const half = Math.ceil(faqs.length / 2);
const leftFaqs = faqs.slice(0, half);
const rightFaqs = faqs.slice(half);

function AccordionItem({ item, defaultOpen = false }: { item: typeof faqs[0]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#0D9488]/15 last:border-none">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 sm:gap-4 py-4 sm:py-5 text-left group min-h-[48px] cursor-pointer"
      >
        <span className="text-sm sm:text-base font-semibold text-[#0D2626] group-hover:text-[#0D9488] transition-colors leading-snug">
          {item.q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex-shrink-0 w-7 h-7 rounded-full border border-[#0D9488]/30 bg-white/60 flex items-center justify-center text-[#0D9488] text-lg leading-none font-light"
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="text-xs sm:text-sm text-[#3D6060] pb-4 sm:pb-5 leading-relaxed">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="relative py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto text-[#0D2626]">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 rounded-full border border-[#0D9488]/30 bg-white/70 backdrop-blur-md px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-[#0D9488] mb-3"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#0D9488]" />
          <span>Atelier Inquiries</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-editorial text-[clamp(2.1rem,5vw,3.75rem)] text-[#0D2626] leading-tight"
        >
          Frequently asked
          <br />
          <span className="italic font-heading text-[#0D9488]">celebration questions.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-base text-[#3D6060] max-w-lg mx-auto mt-3"
        >
          Everything you need to know about crafting your digital invitation suite.
        </motion.p>
      </div>

      {/* Two Column Accordion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
        <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 border border-white/70 shadow-lg bg-white/70 backdrop-blur-xl">
          {leftFaqs.map((faq, i) => (
            <AccordionItem key={faq.id} item={faq} defaultOpen={i === 0} />
          ))}
        </div>
        <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 border border-white/70 shadow-lg bg-white/70 backdrop-blur-xl">
          {rightFaqs.map((faq) => (
            <AccordionItem key={faq.id} item={faq} />
          ))}
        </div>
      </div>
    </section>
  );
}
