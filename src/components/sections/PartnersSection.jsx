import LogoLoop from '../reactbits/LogoLoop'

import partner1 from '../../assets/partnerslogo/logo.png'
import partner2 from '../../assets/partnerslogo/logo-ZhCuiw89.png'
import partner3 from '../../assets/partnerslogo/GOLDLOGO-D3KmTgfs.png'
import partner4 from '../../assets/partnerslogo/k.jpeg'
import partner5 from '../../assets/partnerslogo/WhatsApp_Image_2026-03-27_at_7.29.36_PM-removebg-preview.png'
import partner6 from '../../assets/partnerslogo/WhatsApp_Image_2026-03-27_at_7.33.46_PM-removebg-preview.png'
import partner7 from '../../assets/partnerslogo/تدريب.png'

const logos = [
  { src: partner1, alt: 'Partner' },
  { src: partner2, alt: 'Partner' },
  { src: partner3, alt: 'Partner' },
  { src: partner4, alt: 'Partner' },
  { src: partner5, alt: 'Partner' },
  { src: partner6, alt: 'Partner' },
  { src: partner7, alt: 'Partner' },
]

export default function PartnersSection() {
  return (
    <section
      className="relative overflow-hidden py-20 md:py-28"
      style={{
        background:
          'linear-gradient(165deg, #111C27 0%, #1B2838 20%, #1a3040 40%, #1B2838 60%, #162430 80%, #111C27 100%)',
      }}
    >
      {/* Teal radial glow — center */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(55% 70% at 50% 50%, rgba(58,191,176,0.10) 0%, rgba(58,191,176,0.03) 40%, transparent 70%)',
        }}
        aria-hidden="true"
      />
      {/* Secondary subtle warm glow — top-left */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(40% 50% at 15% 20%, rgba(92,212,198,0.06) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />
      {/* Accent glow — bottom-right */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(35% 45% at 85% 80%, rgba(42,154,141,0.06) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Header */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-light">
            Partners &amp; Technologies
          </p>
          <h2 className="mt-4 text-2xl font-black tracking-tight text-white lg:text-4xl">
            Built with the best in class
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/50 md:text-base">
            We work alongside industry-leading tools and platforms to deliver results that scale.
          </p>
        </div>
      </div>

      {/* Logo slider with wide fade overlays */}
      <div className="relative mt-14">
        {/* Left fade overlay — 50% */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-20"
          style={{
            width: '50%',
            background:
              'linear-gradient(to right, #1B2838 0%, rgba(27,40,56,0.92) 18%, rgba(27,40,56,0.6) 45%, rgba(27,40,56,0) 100%)',
          }}
          aria-hidden="true"
        />
        {/* Right fade overlay — 50% */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-20"
          style={{
            width: '50%',
            background:
              'linear-gradient(to left, #1B2838 0%, rgba(27,40,56,0.92) 18%, rgba(27,40,56,0.6) 45%, rgba(27,40,56,0) 100%)',
          }}
          aria-hidden="true"
        />

        <LogoLoop
          logos={logos}
          speed={50}
          direction="left"
          logoHeight={90}
          gap={72}
          hoverSpeed={0}
          scaleOnHover
          ariaLabel="Partner and technology logos"
        />
      </div>
    </section>
  )
}
