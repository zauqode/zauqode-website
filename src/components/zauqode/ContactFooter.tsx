import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Mail, MessageCircle, Instagram, Send, X } from "lucide-react";
import zauqodeLogo from "../../assets/Logos/zauqode-logo.png";

const PHONE_NUMBER = "+91 89460 77234";
const WHATSAPP_RAW = "918946077234";
const EMAIL_ADDRESS = "zauqode@gmail.com";
const INSTAGRAM_URL = "https://instagram.com/zauqode";

export function ContactFooter() {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "Wedding Invitation Design",
    message: "",
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted =
      `*New Studio Inquiry via zauqode.com*%0A%0A` +
      `*Name:* ${encodeURIComponent(form.name)}%0A` +
      `*Email:* ${encodeURIComponent(form.email)}%0A` +
      `*Category:* ${encodeURIComponent(form.category)}%0A` +
      `*Details:*%0A${encodeURIComponent(form.message)}`;
    window.open(`https://wa.me/${WHATSAPP_RAW}?text=${formatted}`, "_blank");
    setModalOpen(false);
  };

  return (
    <footer id="contact" className="relative text-[#F7F5EF] overflow-hidden bg-[#0E4847]">
      {/* Deep Teal Contact Body — Clean & Solid without any background or border lines */}
      <div className="pt-20 sm:pt-28 lg:pt-36 pb-14 px-6 sm:px-10 lg:px-12 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Main 2-Column Contact Composition */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center pb-20 sm:pb-28">
            {/* Left Column: Script "Let's Create" + "something beautiful." */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 space-y-3"
            >
              <span className="font-script text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-white font-normal block leading-none">
                Let's Create
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl tracking-tight text-[#F7F5EF]/90 font-light">
                something beautiful.
              </h2>
            </motion.div>

            {/* Spacer (no lines) */}
            <div className="hidden lg:block lg:col-span-1" />

            {/* Right Column: Prompt & Action CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 space-y-7"
            >
              <p className="font-editorial text-2xl sm:text-3xl text-[#F7F5EF]/90 leading-snug font-normal max-w-md">
                "Have an idea, a celebration or a brand to bring to life?"
              </p>

              <div className="pt-1 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-[#F7F5EF] text-[#0E4847] hover:bg-[#C9A66B] hover:text-[#0E4847] rounded-full px-8 py-3.5 text-sm font-medium transition-all duration-300 shadow-md hover:scale-105 cursor-pointer"
                >
                  <span>Say Hello</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                <a
                  href={`https://wa.me/${WHATSAPP_RAW}?text=Hi%20Zauqode,%20I'd%20like%20to%20say%20hello%20and%20discuss%20a%20project.`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border border-white/25 hover:border-white text-[#F7F5EF] rounded-full px-6 py-3.5 text-sm font-medium transition-all duration-300"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#23D7D1]" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </motion.div>
          </div>

          {/* Social Links & Studio Channels (Pure Whitespace, No Lines, Natural Case) */}
          <div className="py-8 flex flex-wrap items-center justify-between gap-6 text-sm">
            <div className="flex flex-wrap items-center gap-6 sm:gap-9 text-[#F7F5EF]/85">
              <a
                href={`mailto:${EMAIL_ADDRESS}?subject=Hello%20Zauqode`}
                className="hover:text-white flex items-center gap-2 transition-colors"
              >
                <Mail className="w-4 h-4 text-[#C9A66B]" />
                <span className="lowercase">{EMAIL_ADDRESS}</span>
              </a>

              <a
                href={`https://wa.me/${WHATSAPP_RAW}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white flex items-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#23D7D1]" />
                <span>{PHONE_NUMBER}</span>
              </a>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white flex items-center gap-2 transition-colors"
              >
                <Instagram className="w-4 h-4 text-[#C9A66B]" />
                <span>Instagram</span>
              </a>
            </div>

            <a
              href="#hero"
              className="text-xs text-[#F7F5EF]/60 hover:text-white transition-colors"
            >
              Back to top ↑
            </a>
          </div>

          {/* Bottom Copyright & Wordmark (Natural Case) */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F7F5EF]/60 font-sans">
            <div className="flex items-center gap-2.5">
              <img
                src={zauqodeLogo}
                alt="Zauqode"
                width={20}
                height={20}
                className="w-4 h-4 object-contain opacity-75"
              />
              <span className="font-alice text-base text-white font-normal tracking-wide">
                Zauqode
              </span>
              <span>&bull;</span>
              <span className="italic font-editorial text-sm text-[#F7F5EF]/80">
                Where taste meets digital.
              </span>
            </div>

            <div>
              <p>© 2026 <span className="font-alice text-[13px] text-white/80">Zauqode</span>. Independent creative studio.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Say Hello Inquiry Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 sm:p-6"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#F7F5EF] text-[#0E4847] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#0E4847]/15 relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#0E4847]/10 mb-6">
                <div>
                  <span className="font-script text-3xl text-[#0E8F91] block">
                    Say Hello
                  </span>
                  <h3 className="font-editorial text-2xl text-[#0E4847]">
                    Start a Conversation
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#0E4847]/10 text-[#0E4847] flex items-center justify-center hover:bg-[#0E4847] hover:text-[#F7F5EF] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-[#0E4847] font-semibold block mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Sofia Reyan"
                    className="w-full bg-white border border-[#0E4847]/15 rounded-xl px-4 py-2.5 text-sm text-[#0E4847] focus:outline-none focus:border-[#0E8F91]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#0E4847] font-semibold block mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full bg-white border border-[#0E4847]/15 rounded-xl px-4 py-2.5 text-sm text-[#0E4847] focus:outline-none focus:border-[#0E8F91]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#0E4847] font-semibold block mb-1.5">
                    Project Interest
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-white border border-[#0E4847]/15 rounded-xl px-4 py-2.5 text-sm text-[#0E4847] focus:outline-none focus:border-[#0E8F91]"
                  >
                    <option>Wedding Invitation Design</option>
                    <option>Wedding Website Design</option>
                    <option>Brand Identity</option>
                    <option>UI/UX Design</option>
                    <option>Business Website Development</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-[#0E4847] font-semibold block mb-1.5">
                    Celebration / Project Details
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your date, vision, or timeline..."
                    className="w-full bg-white border border-[#0E4847]/15 rounded-xl px-4 py-2.5 text-sm text-[#0E4847] focus:outline-none focus:border-[#0E8F91] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-3.5 cursor-pointer flex items-center justify-center gap-2 mt-4"
                >
                  <span>Transmit to WhatsApp Studio</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
