import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import ScrollStack, { ScrollStackItem } from '../reactbits/ScrollStack'
import AutoScrollCards from '../ui/AutoScrollCards'

const services = [
  {
    title: 'Web Platforms',
    kicker: 'Scalable by design',
    description:
      'High performance websites and web apps with reliable architecture, modern UX, and measurable growth goals.',
  },
  {
    title: 'Mobile Applications',
    kicker: 'iOS  Android delivery',
    description:
      'Native feel mobile experiences built for performance, usability, and long-term maintainability.',
  },
  {
    title: 'Custom Software',
    kicker: 'Business first engineering',
    description:
      'Tailored systems that automate workflows, integrate data, and remove operational friction across teams.',
  },
  {
    title: 'Digital Marketing',
    kicker: 'Performance channels',
    description:
      'Data led campaigns, analytics setup, and funnel optimization to turn visibility into qualified conversions.',
  },
  {
    title: 'UI UX Design',
    kicker: 'Intentional interfaces',
    description:
      'Clear interaction design, visual systems, and prototyping that turn complex products into intuitive experiences.',
  },
]

export default function ServicesSection() {
  const reduceMotion = useReducedMotion()
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : false,
  )
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : true,
  )

  useEffect(() => {
    const desktopMedia = window.matchMedia('(min-width: 1024px)')
    const mobileMedia = window.matchMedia('(max-width: 767px)')
    const updateDesktop = () => setIsDesktop(desktopMedia.matches)
    const updateMobile = () => setIsMobile(mobileMedia.matches)
    updateDesktop()
    updateMobile()
    desktopMedia.addEventListener('change', updateDesktop)
    mobileMedia.addEventListener('change', updateMobile)
    return () => {
      desktopMedia.removeEventListener('change', updateDesktop)
      mobileMedia.removeEventListener('change', updateMobile)
    }
  }, [])

  return (
    <section id="services" className="relative overflow-hidden bg-navy-dark py-20 md:py-28">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(80% 65% at 50% 15%, rgba(58, 191, 176, 0.14) 0%, rgba(17, 28, 39, 0) 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-light/90">
            Services
          </p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-white lg:text-5xl">
            End to end digital execution
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/65 md:text-base">
            From product strategy to shipping and growth, we build focused
            solutions that move business goals forward.
          </p>
        </div>

        {isMobile ? (
          <div className="mt-10 -mx-6">
            <AutoScrollCards direction="left" speed={0.4} className="px-6">
              {services.map((service, index) => (
                <article
                  key={service.title}
                  className="flex-shrink-0 w-64 h-64 rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.24)] backdrop-blur-xl flex flex-col justify-between"
                >
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-teal-light/90">
                      {service.kicker}
                    </p>
                    <h3 className="mt-2 text-xl font-extrabold text-white">{service.title}</h3>
                  </div>
                  <div>
                    <p className="text-xs leading-relaxed text-white/70">{service.description}</p>
                    <span
                      className="mt-2 block text-sm font-semibold text-white/25 font-[ui-sans-serif,system-ui,-apple-system,'Segoe_UI',Roboto,sans-serif] tabular-nums tracking-wide"
                      aria-hidden
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                </article>
              ))}
            </AutoScrollCards>
          </div>
        ) : !isDesktop || reduceMotion ? (
          <div className="mt-12 space-y-4">
            {services.map((service) => (
              <article
                key={service.title}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.24)] backdrop-blur-xl"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-light/90">
                  {service.kicker}
                </p>
                <h3 className="mt-2 text-2xl font-extrabold text-white">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{service.description}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-14 h-[70vh]">
            <ScrollStack
              itemDistance={82}
              itemScale={0.05}
              itemStackDistance={28}
              stackPosition="20%"
              scaleEndPosition="11%"
              baseScale={0.8}
              blurAmount={0.4}
            >
              {services.map((service, index) => (
                <ScrollStackItem
                  key={service.title}
                  itemClassName="!h-72 !rounded-[34px] border border-white/12 bg-gradient-to-br from-[#243447]/88 via-[#1B2838]/95 to-[#111C27]/96 !p-8 text-white !shadow-[0_26px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl md:!h-80"
                >
                  <div className="flex h-full flex-col justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-light/85">
                        {service.kicker}
                      </p>
                      <h3 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
                        {service.title}
                      </h3>
                    </div>
                    <div className="flex items-end justify-between gap-6">
                      <p className="max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
                        {service.description}
                      </p>
                      <span
                        className="text-lg font-semibold text-white/35 font-[ui-sans-serif,system-ui,-apple-system,'Segoe_UI',Roboto,sans-serif] tabular-nums tracking-wide"
                        aria-hidden
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </ScrollStackItem>
              ))}
            </ScrollStack>
          </div>
        )}
      </div>
    </section>
  )
}
