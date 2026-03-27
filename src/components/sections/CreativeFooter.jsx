import textLogo from '../../assets/CoorDinQ Logo Wihtout Q Shadow .png'

const quickLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
]

export default function CreativeFooter() {
  return (
    <footer id="contact" className="relative overflow-hidden border-t border-white/10 bg-[#0F1A26]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 80% at 50% 0%, rgba(58, 191, 176, 0.16) 0%, rgba(15, 26, 38, 0) 72%)',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-12 md:px-10 md:py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr] md:items-start">
          <div>
            <img src={textLogo} alt="CoorDinQ" className="h-10 w-auto object-contain object-left" />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
              Build faster with a focused digital partner. We design, engineer,
              and grow software products that stay resilient in real world use.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
              Quick Links
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="group flex items-center gap-2 text-sm text-white/70 transition-all duration-300 hover:text-teal-light"
                >
                  <span className="inline-block h-px w-0 bg-teal-light transition-all duration-300 group-hover:w-4" />
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
              Get in Touch
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <a
                href="tel:+201012304909"
                className="group flex items-center gap-2 text-sm text-white/70 transition-all duration-300 hover:text-teal-light"
              >
                <span className="inline-block h-px w-0 bg-teal-light transition-all duration-300 group-hover:w-4" />
                {/* System font for digits — Facundo demo has a defective “4” glyph */}
                <span className="font-[ui-sans-serif,system-ui,-apple-system,'Segoe_UI',Roboto,sans-serif] text-[0.9375rem] tabular-nums tracking-wide">
                  0101 230 4909
                </span>
              </a>
              <a
                href="tel:+201060556773"
                className="group flex items-center gap-2 text-sm text-white/70 transition-all duration-300 hover:text-teal-light"
              >
                <span className="inline-block h-px w-0 bg-teal-light transition-all duration-300 group-hover:w-4" />
                <span className="font-[ui-sans-serif,system-ui,-apple-system,'Segoe_UI',Roboto,sans-serif] text-[0.9375rem] tabular-nums tracking-wide">
                  0106 055 6773
                </span>
              </a>
            </div>
          </div>

        </div>

        <div className="mt-10 border-t border-white/10 pt-4 text-xs text-white/55">
          Copyright {new Date().getFullYear()} CoorDinQ. Crafted with strategy, design, and code.
        </div>
      </div>
    </footer>
  )
}
