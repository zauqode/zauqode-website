import { useRef } from "react";
import { motion, useSpring } from "motion/react";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary";
}

export function MagneticButton({
  children,
  className = "",
  href,
  onClick,
  type = "button",
  variant = "primary",
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useSpring(0, { stiffness: 280, damping: 20 });
  const y = useSpring(0, { stiffness: 280, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    // Soft magnetic pull within ~15px radius
    x.set(distanceX * 0.22);
    y.set(distanceY * 0.22);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Component = href ? motion.a : motion.button;
  const glassStyle = variant === "primary" ? "liquid-glass-dark text-white shadow-lg" : "liquid-glass text-white shadow-md";

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className="inline-block"
    >
      <Component
        href={href}
        onClick={onClick}
        type={href ? undefined : type}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={`${glassStyle} inline-flex items-center justify-center rounded-full font-bold uppercase tracking-widest px-8 py-4 text-xs transition-all duration-300 ${className}`}
      >
        {children}
      </Component>
    </motion.div>
  );
}
