export function Atmosphere() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-0"
      style={{
        background: `
          radial-gradient(
            circle at 12% 50%,
            rgba(22, 160, 165, 0.12),
            transparent 45%
          ),
          radial-gradient(
            circle at 88% 65%,
            rgba(15, 110, 120, 0.08),
            transparent 35%
          ),
          radial-gradient(
            circle at 20% 85%,
            rgba(45, 212, 191, 0.06),
            transparent 40%
          ),
          #050708
        `,
      }}
    />
  );
}
