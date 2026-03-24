/**
 * AnimatedBackground — GPU-friendly CSS-only version
 * Uses CSS animations + will-change to keep everything on the compositor layer.
 * Reduced blur on mobile to prevent GPU stalls.
 */
export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {/* Base radial gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, #243447 0%, #1B2838 70%)',
        }}
      />

      {/* Floating orbs — CSS animations only, no JS */}
      <div
        className="animated-orb animated-orb-1"
        aria-hidden="true"
      />
      <div
        className="animated-orb animated-orb-2"
        aria-hidden="true"
      />
      <div
        className="animated-orb animated-orb-3"
        aria-hidden="true"
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Vignette overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(17, 28, 39, 0.7) 100%)',
        }}
      />
    </div>
  )
}
