import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const faqs = [
  {
    id: 1,
    q: "How long does a typical website project take?",
    a: "Most projects are delivered within 7–14 days depending on scope. Starter projects take 5–7 days, Business websites 10–14 days, and complex custom projects are scoped individually with a clear timeline upfront.",
  },
  {
    id: 2,
    q: "What's included in the price?",
    a: "Design, development, mobile responsiveness, basic SEO, and deployment are all included. Revision rounds vary by plan. There are no hidden fees — everything is agreed before the project begins.",
  },
  {
    id: 3,
    q: "How many revisions do I get?",
    a: "Starter includes 2 rounds of revisions, Business includes 3 rounds, and Custom projects include revisions structured to scope. Any extra revision rounds beyond the included package are available with additional charges.",
  },
  {
    id: 4,
    q: "Are domain, hosting, and database charges included?",
    a: "No, domain registration, cloud hosting, and database charges are excluded from the project pricing. You maintain 100% direct ownership of your accounts and subscriptions, and Zauqode will guide you through setup and handle all technical deployment.",
  },
  {
    id: 5,
    q: "Do you offer ongoing maintenance?",
    a: "Yes — available with paid charges (via monthly retainer packages) for content updates, performance monitoring, and feature additions. Ask about this when inquiring.",
  },
  {
    id: 6,
    q: "What do I need to get started?",
    a: "Just a brief about your goals, some reference links if you have them, and a clear idea of what you need. I'll guide you through the rest in our first consultation.",
  },
];

// Split FAQs into two columns
const half = Math.ceil(faqs.length / 2);
const leftFaqs = faqs.slice(0, half);
const rightFaqs = faqs.slice(half);

function AccordionItem({ item, defaultOpen = false }: { item: typeof faqs[0]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#0D9488]/15 last:border-none">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
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
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="text-sm text-[#3D6060] leading-relaxed pb-5 pr-10">
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
    <section id="faq" className="relative py-8 sm:py-10 lg:py-12 px-6 max-w-7xl mx-auto text-[#0D2626]">
      {/* Ambient */}
      <div className="absolute bottom-1/3 right-0 w-72 h-72 bg-[#0D9488]/6 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-6 sm:mb-8"
      >
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#0D9488]">FAQ</span>
        <h2 className="font-editorial text-3xl sm:text-5xl lg:text-6xl text-[#0D2626] mt-1">
          Common questions<span className="text-[#0D9488]">.</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#3D6060] mt-2 max-w-sm mx-auto">
          Everything you need to know before starting your project.
        </p>
      </motion.div>

      {/* Two-column accordion */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12 liquid-glass-card p-8 sm:p-10"
      >
        {/* Left column */}
        <div>
          {leftFaqs.map((item, i) => (
            <AccordionItem key={item.id} item={item} defaultOpen={i === 0} />
          ))}
        </div>

        {/* Vertical divider (desktop) */}
        <div className="hidden lg:block absolute left-1/2 top-12 bottom-12 w-px bg-[#0D9488]/10" />

        {/* Right column */}
        <div>
          {rightFaqs.map((item) => (
            <AccordionItem key={item.id} item={item} />
          ))}
        </div>
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mt-10"
      >
        <p className="text-sm text-[#3D6060]">
          Still have questions?{" "}
          <a
            href={`https://wa.me/918946077234`}
            target="_blank"
            rel="noreferrer"
            className="text-[#0D9488] font-semibold underline underline-offset-2 hover:no-underline"
          >
            Start a direct conversation →
          </a>
        </p>
      </motion.div>
    </section>
  );
}
