export function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none bg-[#f5fdf9] transform-gpu">
      {/* Soft Mint Ambient Glow Top Left */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full bg-[#9AD8C8]/30 blur-[110px] opacity-70 pointer-events-none transform-gpu" />

      {/* Subtle Mint Glow Bottom Right */}
      <div className="absolute top-[40%] -right-32 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full bg-[#A7E3D4]/25 blur-[120px] opacity-60 pointer-events-none transform-gpu" />

      {/* Soft Mint Glow Bottom */}
      <div className="absolute -bottom-32 left-[20%] w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full bg-[#9AD8C8]/25 blur-[110px] opacity-55 pointer-events-none transform-gpu" />
    </div>
  );
}
