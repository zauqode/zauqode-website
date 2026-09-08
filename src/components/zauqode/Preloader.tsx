import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import zauqodeLogo from "../../assets/Logos/zauqode-logo.png";

export function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reset scroll to top on page refresh so entrance animations play at top
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] px-6 select-none"
        >
          <div className="relative flex flex-col items-center">
            {/* Ambient liquid glow behind logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 0.5 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute -inset-10 rounded-full bg-gradient-to-r from-[#14B8A6]/30 via-[#2DD4BF]/40 to-[#136262]/30 blur-2xl"
            />

            {/* Zauqode Official Logo reveal */}
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex flex-col items-center gap-3"
            >
              <img
                src={zauqodeLogo}
                alt="ZAUQODE emblem"
                className="w-24 h-24 object-contain drop-shadow-md"
              />
              <span className="font-alice text-3xl sm:text-4xl tracking-[0.25em] text-[#2DD4BF] font-normal">
                ZAUQODE
              </span>
            </motion.div>


          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-6 text-xs uppercase tracking-[0.25em] text-[#94A3B8] font-medium"
          >
            Where taste meets digital
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
