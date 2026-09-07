import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

export function Preloader() {
  const reduced = useReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), reduced ? 200 : 1500);
    return () => clearTimeout(t);
  }, [reduced]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="bg-background fixed inset-0 z-[90] flex items-center justify-center"
        >
          <div
            aria-hidden
            className="bg-gradient-brand absolute h-[38rem] w-[38rem] rounded-full opacity-40 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, y: 16, filter: "blur(14px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative text-center"
          >
            <p className="font-display text-4xl tracking-tight sm:text-5xl">Aafrin Aaysha</p>
            <p className="eyebrow mt-3">Invitation & Brand Design</p>
            <div className="bg-border relative mx-auto mt-6 h-[2px] w-40 overflow-hidden rounded-full">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="bg-gradient-brand h-full w-full"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
