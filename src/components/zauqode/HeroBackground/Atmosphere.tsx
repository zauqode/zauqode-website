export function Atmosphere() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-0"
      style={{
        background: `
          radial-gradient(
            circle at 10% 65%,
            rgba(15, 130, 135, 0.10),
            transparent 30%
          ),
          radial-gradient(
            circle at 85% 50%,
            rgba(10, 100, 110, 0.05),
            transparent 35%
          ),
          #050708
        `,
      }}
    />
  );
}
