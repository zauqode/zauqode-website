export function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none bg-[#050505] transform-gpu">
      {/* Soft Cyan/Teal Ambient Glow Top Left */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full bg-[#14B8A6]/15 blur-[100px] opacity-70 pointer-events-none transform-gpu" />

      {/* Subtle Cyan Glow Bottom Right */}
      <div className="absolute top-[40%] -right-32 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full bg-[#0F6B6B]/20 blur-[110px] opacity-60 pointer-events-none transform-gpu" />

      {/* Deep Teal Glow Bottom */}
      <div className="absolute -bottom-32 left-[20%] w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full bg-[#14B8A6]/15 blur-[100px] opacity-60 pointer-events-none transform-gpu" />
    </div>
  );
}
