import { motion } from "motion/react";

const testimonials = [
  {
    id: 1,
    quote: "Zauqode delivered a website that exceeded every expectation. The attention to detail in the animations and design is truly world-class.",
    name: "Priya Sharma",
    role: "Founder, Bloom Boutique",
    type: "Business Website",
    stars: 5,
    initials: "PS",
    color: "#0D9488",
  },
  {
    id: 2,
    quote: "Our wedding invitation site was absolutely stunning. Guests kept messaging us asking who designed it. Couldn't be happier.",
    name: "Arjun & Meera",
    role: "Private Clients",
    type: "Wedding Invitation",
    stars: 5,
    initials: "AM",
    color: "#136262",
  },
  {
    id: 3,
    quote: "Professional, fast, and creative. My portfolio finally looks as good as my work. The whole process was smooth and collaborative.",
    name: "Divya Krishnan",
    role: "Graphic Designer",
    type: "Portfolio Website",
    stars: 5,
    initials: "DK",
    color: "#0F6B6B",
  },
  {
    id: 4,
    quote: "Delivered in under 10 days with zero revisions needed. The design understood our brand language immediately.",
    name: "Rahul Menon",
    role: "CEO, TechFlow India",
    type: "Business Website",
    stars: 5,
    initials: "RM",
    color: "#0D9488",
  },
  {
    id: 5,
    quote: "The liquid glass aesthetic Zauqode brought to our brand was exactly the premium feel we were going for. Highly recommended.",
    name: "Nithya Balaji",
    role: "Creative Director",
    type: "Brand Website",
    stars: 5,
    initials: "NB",
    color: "#136262",
  },
];

// Duplicate for seamless infinite scroll
const allTestimonials = [...testimonials, ...testimonials];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div className="liquid-glass-card flex-shrink-0 w-[320px] sm:w-[380px] p-7 flex flex-col gap-4 relative overflow-hidden">
      {/* Background quote mark */}
      <span className="absolute -top-2 -left-1 text-8xl font-serif text-[#0D9488]/8 leading-none select-none pointer-events-none">
        "
      </span>

      {/* Stars */}
      <StarRating count={t.stars} />

      {/* Quote */}
      <p className="text-sm text-[#3D6060] leading-relaxed relative z-10 flex-1">
        "{t.quote}"
      </p>

      {/* Client info */}
      <div className="flex items-center gap-3 pt-3 border-t border-[#0D9488]/10">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${t.color}, #093838)` }}
        >
          {t.initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-[#0D2626] truncate">{t.name}</p>
          <p className="text-[10px] text-[#3D6060] truncate">{t.role}</p>
        </div>
        <span className="text-[9px] font-bold uppercase tracking-wider bg-[#0D9488]/10 text-[#0D9488] px-2 py-1 rounded-full border border-[#0D9488]/20 flex-shrink-0">
          {t.type}
        </span>
      </div>
    </div>
  );
}

export function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 sm:py-32 overflow-hidden text-[#0D2626]">
      {/* Ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#0D9488]/6 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14 px-6"
      >
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#0D9488]">Kind Words</span>
        <h2 className="font-editorial text-4xl sm:text-6xl text-[#0D2626] mt-2">
          What clients say<span className="text-[#0D9488]">.</span>
        </h2>
      </motion.div>

      {/* Marquee Track */}
      <div className="relative overflow-hidden">
        {/* Row 1 — left scroll */}
        <div className="flex gap-5 mb-5 testimonial-marquee-left">
          {allTestimonials.map((t, i) => (
            <TestimonialCard key={`a-${i}`} t={t} />
          ))}
        </div>

        {/* Row 2 — right scroll (offset) */}
        <div className="flex gap-5 testimonial-marquee-right">
          {[...allTestimonials].reverse().map((t, i) => (
            <TestimonialCard key={`b-${i}`} t={t} />
          ))}
        </div>

        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#f5fdf9] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#f5fdf9] to-transparent z-10" />
      </div>
    </section>
  );
}
