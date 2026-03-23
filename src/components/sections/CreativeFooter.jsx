import textLogo from '../../assets/CoorDinQ Logo Wihtout Q Shadow .png'

const quickLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

const socialLinks = [
  { label: 'LinkedIn', href: '#' },
  { label: 'Behance', href: '#' },
  { label: 'Dribbble', href: '#' },
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
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr] md:items-start">
          <div>
            <img src={textLogo} alt="CoorDinQ" className="h-10 w-auto object-contain object-left" />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
              Build faster with a focused digital partner. We design, engineer,
              and grow software products that stay resilient in real-world use.
            </p>
            <a
              href="#home"
              className="mt-5 inline-flex rounded-full border border-teal/35 bg-teal/10 px-5 py-2 text-sm font-semibold text-teal-light transition-colors hover:bg-teal/20"
            >
              Back to top
            </a>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
              Quick Links
            </p>
            <div className="mt-4 flex flex-col gap-2">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-white/75 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
              Connect
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-white/80 transition-all hover:border-teal/40 hover:text-white"
                >
                  {social.label}
                </a>
              ))}
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
