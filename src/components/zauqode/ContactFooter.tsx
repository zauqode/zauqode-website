import { useState } from "react";
import { motion } from "motion/react";
import { Instagram, Mail } from "lucide-react";
import zauqodeLogo from "../../assets/Logos/zauqode-logo.png";

const PHONE_NUMBER = "+91 89460 77234";
const WHATSAPP_RAW = "918946077234";
const EMAIL_ADDRESS = "zauqode@gmail.com";

const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);

export function ContactFooter() {
  const [submitted, setSubmitted] = useState(false);
  const [lastWaUrl, setLastWaUrl] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", type: "Business Website", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedMessage =
      `*New Project Inquiry via Zauqode Website*%0A%0A` +
      `*Name:* ${encodeURIComponent(form.name)}%0A` +
      `*Email:* ${encodeURIComponent(form.email)}%0A` +
      (form.phone ? `*Phone:* ${encodeURIComponent(form.phone)}%0A` : "") +
      `*Service:* ${encodeURIComponent(form.type)}%0A%0A` +
      `*Project Vision:*%0A${encodeURIComponent(form.message)}`;

    const waUrl = `https://wa.me/${WHATSAPP_RAW}?text=${formattedMessage}`;
    setLastWaUrl(waUrl);

    // Open WhatsApp directly in new window
    window.open(waUrl, "_blank");
    setSubmitted(true);
  };

  return (
    <footer id="contact" className="relative z-10 pt-20 pb-12 text-[#FDFBF7]">
      {/* Contact Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        className="glass-card bg-[#0D1414]/90 rounded-3xl p-8 md:p-12 max-w-6xl mx-auto mb-20 shadow-2xl space-y-12"
      >
        {/* Closing CTA Box */}
        <div className="text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#2DD4BF]">
            START A PROJECT
          </span>
          <h2 className="font-editorial text-4xl sm:text-6xl text-[#FDFBF7]">
            Have something in mind?
          </h2>
          <p className="font-editorial text-xl sm:text-3xl text-[#2DD4BF] italic">
            Let's turn it into an experience.
          </p>
        </div>

        {/* Form or Success Screen */}
        <div className="max-w-xl mx-auto">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-3xl p-8 text-center space-y-6 shadow-xl"
            >
              <div className="w-14 h-14 rounded-full bg-[#136262] text-white flex items-center justify-center mx-auto text-2xl font-bold border border-[#2DD4BF]/40">
                ✓
              </div>
              <div className="space-y-2">
                <h3 className="font-editorial text-3xl text-[#FDFBF7]">Connecting via WhatsApp...</h3>
                <p className="text-sm text-[#94A3B8]">
                  Your project details have been formatted. If WhatsApp didn't open automatically, click the button below to send your message directly.
                </p>
              </div>
              <a
                href={lastWaUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 liquid-glass-dark rounded-full px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white w-full shadow-xl"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Open in WhatsApp</span>
                <span>→</span>
              </a>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#94A3B8] hover:text-[#2DD4BF] underline font-semibold block mx-auto"
              >
                ← Fill form again
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 space-y-6 shadow-xl">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2DD4BF] mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Elena Rostova"
                    className="w-full bg-[#050505]/70 border border-[#2DD4BF]/30 rounded-xl px-4 py-3 text-sm text-[#FDFBF7] placeholder:text-[#94A3B8]/60 focus:outline-none focus:border-[#2DD4BF] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#2DD4BF] mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="elena@example.com"
                      className="w-full bg-[#050505]/70 border border-[#2DD4BF]/30 rounded-xl px-4 py-3 text-sm text-[#FDFBF7] placeholder:text-[#94A3B8]/60 focus:outline-none focus:border-[#2DD4BF] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#2DD4BF] mb-2">
                      Phone / WhatsApp (Optional)
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#050505]/70 border border-[#2DD4BF]/30 rounded-xl px-4 py-3 text-sm text-[#FDFBF7] placeholder:text-[#94A3B8]/60 focus:outline-none focus:border-[#2DD4BF] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2DD4BF] mb-2">
                    Project Service
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full bg-[#050505]/70 border border-[#2DD4BF]/30 rounded-xl px-4 py-3 text-sm text-[#FDFBF7] focus:outline-none focus:border-[#2DD4BF] transition-colors"
                  >
                    <option value="Business Website" className="bg-[#050505] text-[#FDFBF7]">Business Website</option>
                    <option value="Digital Invitations & Event Websites" className="bg-[#050505] text-[#FDFBF7]">Digital Invitations (All Occasions & Events)</option>
                    <option value="Portfolio Website" className="bg-[#050505] text-[#FDFBF7]">Portfolio Website</option>
                    <option value="Custom Project" className="bg-[#050505] text-[#FDFBF7]">Custom Digital Experience</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2DD4BF] mb-2">
                    Project Vision / Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me about your project goals and timeline..."
                    className="w-full bg-[#050505]/70 border border-[#2DD4BF]/30 rounded-xl px-4 py-3 text-sm text-[#FDFBF7] placeholder:text-[#94A3B8]/60 focus:outline-none focus:border-[#2DD4BF] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                data-cursor="button"
                className="w-full liquid-glass-dark rounded-full py-4 text-xs font-bold uppercase tracking-widest text-white flex items-center justify-center gap-2 shadow-xl"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Send via WhatsApp</span>
              </button>
            </form>
          )}
        </div>
      </motion.div>

      {/* Footer Bottom Bar Outside Card */}
      <div className="max-w-6xl mx-auto px-6 border-t border-[#2DD4BF]/20 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <img src={zauqodeLogo} alt="ZAUQODE" className="h-7 w-auto object-contain" />
            <span className="font-alice text-xl tracking-[0.25em] text-[#2DD4BF] font-normal">
              ZAUQODE
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] italic font-editorial">"Where taste meets digital."</p>
        </div>

        {/* Social Links & Contact Info */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={`https://wa.me/${WHATSAPP_RAW}`}
            target="_blank"
            rel="noreferrer"
            title="Chat on WhatsApp"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 liquid-glass border border-[#2DD4BF]/30 text-xs font-bold text-[#FDFBF7] hover:text-[#2DD4BF] transition-all duration-300 shadow-sm"
          >
            <WhatsAppIcon className="w-4 h-4 text-[#2DD4BF]" />
            <span>{PHONE_NUMBER}</span>
          </a>
          <a
            href={`mailto:${EMAIL_ADDRESS}`}
            title="Send Email"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 liquid-glass border border-[#2DD4BF]/30 text-xs font-bold text-[#FDFBF7] hover:text-[#2DD4BF] transition-all duration-300 shadow-sm"
          >
            <Mail className="w-4 h-4 text-[#2DD4BF] stroke-[2]" />
            <span>{EMAIL_ADDRESS}</span>
          </a>
          <a
            href="https://www.instagram.com/zauqode?stkn=ZnBzZWZ3eXZ4bTVp&utm_source=qr"
            target="_blank"
            rel="noreferrer"
            title="Follow on Instagram"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 liquid-glass border border-[#2DD4BF]/30 text-xs font-bold text-[#FDFBF7] hover:text-[#2DD4BF] transition-all duration-300 shadow-sm"
          >
            <Instagram className="w-4 h-4 text-[#2DD4BF] stroke-[2]" />
            <span>@zauqode</span>
          </a>
        </div>

        <div className="text-center md:text-right space-y-1 text-xs text-[#94A3B8]">
          <p className="font-semibold text-[#FDFBF7]">Tamil Nadu, India</p>
          <p>© 2026 Zauqode. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
