import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import zauqodeLogo from "../../assets/Logos/zauqode-logo.png";

export function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 380);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#071917] px-6 select-none pointer-events-auto"
        >
          <div className="relative flex flex-col items-center">
            {/* Ambient luxury glow behind logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 0.5 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute -inset-10 rounded-full bg-gradient-to-r from-[#0D9488]/30 via-[#DAA520]/25 to-[#136262]/30 blur-2xl"
            />

            {/* Zauqode Logo reveal */}
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex flex-col items-center gap-3"
            >
              <img
                src={zauqodeLogo}
                alt="ZAUQODE emblem"
                width={84}
                height={84}
                className="w-20 h-20 sm:w-22 sm:h-22 object-contain drop-shadow-md"
              />
              <span className="font-alice text-3xl sm:text-4xl text-[#E6F4F1] font-normal tracking-wide">
                Zauqode
              </span>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6 text-xs tracking-wider text-[#9ACCC3] font-normal"
          >
            Creative Studio &amp; Designer Portfolio
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
