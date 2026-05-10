const FOOTER_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#faq', label: 'FAQ' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#contact', label: 'Contact' },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#141414] px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <p
          className="text-sm text-[#9b9b9b]"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          © 2025 PhotoKeep. All rights reserved.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          {FOOTER_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-[#9b9b9b] transition-colors hover:text-white"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
