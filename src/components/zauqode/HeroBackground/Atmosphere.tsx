export function Atmosphere() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-0"
      style={{
        background: `
          radial-gradient(
            ellipse at 0% 0%,
            rgba(154, 216, 200, 0.55) 0%,
            transparent 55%
          ),
          radial-gradient(
            ellipse at 100% 100%,
            rgba(154, 216, 200, 0.45) 0%,
            transparent 55%
          ),
          #f5fdf9
        `,
      }}
    />
  );
}
