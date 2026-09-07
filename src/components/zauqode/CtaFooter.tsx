import { useEffect, useRef } from "react";
import { ArrowUpRight, MessageCircle, Instagram } from "lucide-react";
import Hls from "hls.js";

const PHONE_NUMBER = "+91 89460 77234";
const WHATSAPP_RAW = "918946077234";

export function CtaFooter() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const src = "https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8";

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    }
  }, []);

  return (
    <section id="contact" className="relative py-32 px-6 md:px-16 lg:px-24 text-center overflow-hidden bg-[#FDFBF7] text-[#1C2524]">
      {/* Background HLS Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 mix-blend-multiply pointer-events-none"
      />

      {/* Top fade into #FDFBF7 */}
      <div
        className="absolute top-0 left-0 right-0 z-[1] pointer-events-none"
        style={{ height: "200px", background: "linear-gradient(to bottom, #FDFBF7, transparent)" }}
      />
      {/* Bottom fade into #FDFBF7 */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[1] pointer-events-none"
        style={{ height: "200px", background: "linear-gradient(to top, #FDFBF7, transparent)" }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading italic text-[#1C2524] tracking-tight leading-[0.85] max-w-3xl mx-auto mb-4">
          Your next website starts here<span className="text-[#0F6B6B]">.</span>
        </h2>
        <p className="text-[#5F706C] font-body font-normal text-sm md:text-base max-w-xl mx-auto mb-8">
          Book a free strategy call. See what AI&#8209;powered design can do. No commitment, no pressure. Just possibilities.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <a
            href={`https://wa.me/${WHATSAPP_RAW}?text=Hello%20Zauqode!%20I'd%20like%20to%20book%20a%20free%20strategy%20call%20for%20my%20website.`}
            target="_blank"
            rel="noreferrer"
            className="glass-button rounded-full px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-[#FDFBF7] flex items-center gap-2 shadow-xl"
          >
            <span>Book a Call</span>
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href="#services"
            className="glass-button-secondary rounded-full px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-[#0F6B6B] border-[#0F6B6B]/20 flex items-center gap-2 shadow-md"
          >
            <span>View Pricing & Services</span>
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        {/* Direct Contact Options */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <a
            href={`https://wa.me/${WHATSAPP_RAW}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-[#E4F5EE] border border-[#0F6B6B]/20 text-xs font-bold text-[#0F6B6B] hover:bg-[#0F6B6B] hover:text-[#FDFBF7] transition-all"
          >
            <MessageCircle className="w-4 h-4 stroke-[2]" />
            <span>WhatsApp: {PHONE_NUMBER}</span>
          </a>
          <a
            href="https://www.instagram.com/zauqode?stkn=ZnBzZWZ3eXZ4bTVp&utm_source=qr"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-[#E4F5EE] border border-[#0F6B6B]/20 text-xs font-bold text-[#0F6B6B] hover:bg-[#0F6B6B] hover:text-[#FDFBF7] transition-all"
          >
            <Instagram className="w-4 h-4 stroke-[2]" />
            <span>Instagram: @zauqode</span>
          </a>
        </div>

        {/* Footer Bar */}
        <div className="mt-32 pt-8 border-t border-[#0F6B6B]/15 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#5F706C] font-body font-light text-xs">
            &copy; 2026 Zauqode Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#top" className="text-[#0F6B6B] hover:text-[#1C2524] font-body font-semibold text-xs transition-colors">
              Home
            </a>
            <a href="#services" className="text-[#0F6B6B] hover:text-[#1C2524] font-body font-semibold text-xs transition-colors">
              Services
            </a>
            <a href="#work" className="text-[#0F6B6B] hover:text-[#1C2524] font-body font-semibold text-xs transition-colors">
              Work
            </a>
            <a href="#process" className="text-[#0F6B6B] hover:text-[#1C2524] font-body font-semibold text-xs transition-colors">
              Process
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaFooter;
