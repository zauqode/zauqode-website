import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Send, Phone, ChevronDown, Check } from "lucide-react";
import zauqodeLogo from "../../assets/Logos/zauqode-logo.png";

const PHONE_NUMBER = "+91 89460 77234";
const WHATSAPP_RAW = "918946077234";
const EMAIL_ADDRESS = "zauqode@gmail.com";

const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);

// Floating label input field
function FloatingInput({
  label,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder = " ",
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        placeholder={placeholder}
        className="w-full bg-white/40 backdrop-blur-sm border border-white/50 rounded-xl px-4 pt-6 pb-2.5 text-sm text-[#0D2626] focus:outline-none focus:border-[#0D9488]/60 focus:bg-white/60 transition-all duration-300 peer"
      />
      <label
        className={`absolute left-4 pointer-events-none transition-all duration-200 font-medium ${
          active
            ? "top-2 text-[10px] uppercase tracking-wider text-[#0D9488]"
            : "top-1/2 -translate-y-1/2 text-sm text-[#3D6060]/70"
        }`}
      >
        {label}
      </label>
    </div>
  );
}

function FloatingSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={selectRef} className="relative select-none">
      <label className="absolute left-4 top-2 text-[10px] uppercase tracking-wider text-[#0D9488] font-bold pointer-events-none z-10">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full bg-white/50 hover:bg-white/70 backdrop-blur-md border ${
          open ? "border-[#0D9488] ring-2 ring-[#0D9488]/20 bg-white/85" : "border-white/60 hover:border-[#0D9488]/40"
        } rounded-xl px-4 pt-6 pb-2.5 text-left text-sm text-[#0D2626] transition-all duration-200 flex items-center justify-between cursor-pointer group shadow-2xs`}
      >
        <span className="font-semibold truncate pr-2">{selectedOption.label}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0D9488]/10 text-[#0D9488] flex items-center justify-center transition-colors group-hover:bg-[#0D9488]/20"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.span>
      </button>

      {/* Custom Liquid Glass Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 right-0 top-full mt-2 z-50 bg-white/95 backdrop-blur-2xl border border-[#0D9488]/20 rounded-2xl p-1.5 shadow-2xl shadow-teal-950/15 overflow-hidden"
          >
            <div className="space-y-1">
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all duration-200 text-left ${
                      isSelected
                        ? "bg-[#0D9488]/15 text-[#0D9488] font-bold"
                        : "text-[#0D2626] hover:bg-[#0D9488]/8 hover:text-[#0D9488] font-medium"
                    }`}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 rounded-full bg-[#0D9488] text-white flex items-center justify-center flex-shrink-0 ml-2"
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </motion.span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FloatingTextarea({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div className="relative">
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        placeholder=" "
        className="w-full bg-white/40 backdrop-blur-sm border border-white/50 rounded-xl px-4 pt-6 pb-2.5 text-sm text-[#0D2626] focus:outline-none focus:border-[#0D9488]/60 focus:bg-white/60 transition-all duration-300 resize-none"
      />
      <label
        className={`absolute left-4 pointer-events-none transition-all duration-200 font-medium ${
          active
            ? "top-2 text-[10px] uppercase tracking-wider text-[#0D9488]"
            : "top-5 text-sm text-[#3D6060]/70"
        }`}
      >
        {label}
      </label>
    </div>
  );
}

export function ContactFooter() {
  const [submitted, setSubmitted] = useState(false);
  const [lastWaUrl, setLastWaUrl] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    type: "Business Website",
    message: "",
  });

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
    window.open(waUrl, "_blank");
    setSubmitted(true);
  };

  return (
    <footer id="contact" className="relative z-10 overflow-hidden">
      {/* Full-width gradient mesh background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(13,148,136,0.18) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 20%, rgba(19,98,98,0.14) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 90%, rgba(13,148,136,0.12) 0%, transparent 50%),
            linear-gradient(135deg, #e8faf6 0%, #f0fdf9 50%, #e2f8f2 100%)
          `,
        }}
      />
      {/* Mesh grain overlay */}
      <div className="absolute inset-0 -z-10 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "150px",
      }} />

      <div className="pt-8 sm:pt-10 lg:pt-12 pb-12 sm:pb-16 px-6 max-w-7xl mx-auto">
        {/* Large CTA header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto mb-6 sm:mb-8"
        >
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#0D9488]">Start a Project</span>
          <h2 className="font-editorial text-4xl sm:text-6xl lg:text-7xl text-[#0D2626] mt-2 leading-[1.05]">
            Have something
            <br />
            <span className="italic text-[#0D9488]">in mind?</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#3D6060] max-w-xl mx-auto">
            Let's turn your idea into a digital experience. Send me a message and I'll get back to you within 24 hours.
          </p>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="liquid-glass-card max-w-2xl mx-auto p-6 sm:p-8 mb-10 sm:mb-12"
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 py-4"
            >
              <div className="w-16 h-16 rounded-full bg-[#0D9488] text-white flex items-center justify-center mx-auto text-2xl shadow-lg shadow-[#0D9488]/30">
                ✓
              </div>
              <div className="space-y-2">
                <h3 className="font-editorial text-3xl text-[#0D2626]">Inquiry Prepared</h3>
                <p className="text-sm text-[#3D6060]">
                  Your project details are ready. Click below to continue sending your message.
                </p>
              </div>
              <a
                href={lastWaUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 liquid-glass-dark rounded-full px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white w-full shadow-xl"
              >
                <Send className="w-4 h-4" />
                <span>Continue to Send</span>
              </a>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#3D6060] hover:text-[#0D9488] underline font-semibold block mx-auto"
              >
                ← Fill form again
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <FloatingInput
                label="Your Name"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FloatingInput
                  label="Email Address"
                  type="email"
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                  required
                />
                <FloatingInput
                  label="Phone Number (Optional)"
                  type="tel"
                  value={form.phone}
                  onChange={(v) => setForm({ ...form, phone: v })}
                />
              </div>
              <FloatingSelect
                label="Project Type"
                value={form.type}
                onChange={(v) => setForm({ ...form, type: v })}
                options={[
                  { value: "Business Website", label: "Business Website (Startups & SMEs)" },
                  { value: "Digital Invitation", label: "Digital Invitation & Celebration" },
                  { value: "Portfolio Website", label: "Portfolio & Personal Brand" },
                  { value: "Custom Project", label: "Custom Digital Experience" },
                ]}
              />
              <FloatingTextarea
                label="Project Vision / Message"
                value={form.message}
                onChange={(v) => setForm({ ...form, message: v })}
                required
              />
              <button
                type="submit"
                className="w-full liquid-glass-dark rounded-full py-4 text-xs font-bold uppercase tracking-widest text-white flex items-center justify-center gap-2 shadow-xl hover:scale-[1.01] transition-all duration-300"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </motion.div>

        {/* Footer bar */}
        <div className="max-w-6xl mx-auto border-t border-[#0D9488]/15 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <img src={zauqodeLogo} alt="ZAUQODE" className="h-7 w-auto object-contain" />
              <span className="font-alice text-xl tracking-[0.25em] text-[#0D9488] font-normal">ZAUQODE</span>
            </div>
            <p className="text-xs text-[#3D6060] italic font-editorial">"Where taste meets digital."</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={`https://wa.me/${WHATSAPP_RAW}`}
              target="_blank"
              rel="noreferrer"
              title="Direct Message / Call"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 liquid-glass border border-[#0D9488]/30 text-xs font-bold text-[#0D2626] hover:text-[#0D9488] transition-all duration-300 shadow-sm"
            >
              <Phone className="w-4 h-4 text-[#0D9488]" />
              <span>{PHONE_NUMBER}</span>
            </a>
            <a
              href={`mailto:${EMAIL_ADDRESS}`}
              title="Send Email"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 liquid-glass border border-[#0D9488]/30 text-xs font-bold text-[#0D2626] hover:text-[#0D9488] transition-all duration-300 shadow-sm"
            >
              <Mail className="w-4 h-4 text-[#0D9488] stroke-[2]" />
              <span>{EMAIL_ADDRESS}</span>
            </a>
          </div>

          <div className="text-center md:text-right space-y-1 text-xs">
            <p className="font-semibold text-[#0D2626]">Tamil Nadu, India</p>
            <p className="text-[#3D6060]">© 2026 Zauqode. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
