import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import shutterImg from '../assets/shutter.png'

const NAV_LINKS = [
  { href: '#about', id: 'about', label: 'ABOUT' },
  { href: '#services', id: 'services', label: 'SERVICES' },
  { href: '#reviews', id: 'reviews', label: 'REVIEWS' },
  { href: '#faq', id: 'faq', label: 'FAQ' },
  { href: '#pricing', id: 'pricing', label: 'PRICING' },
  { href: '#contact', id: 'contact', label: 'CONTACT' },
]

const SECTION_IDS = ['home', 'about', 'services', 'reviews', 'faq', 'pricing', 'contact']

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id)
        },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <nav className="sticky top-0 z-50 bg-[#141414]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2">
          <img
            src={shutterImg}
            alt="PhotoKeep"
            className="h-8 w-8 object-contain"
          />
          <span
            className="text-xl font-bold text-white"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            PhotoKeep
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((l) => {
            const isActive = activeSection === l.id
            return (
              <a
                key={l.href}
                href={l.href}
                className="group relative text-sm font-semibold tracking-widest text-white"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                {l.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-px bg-white transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </a>
            )
          })}
        </div>

        {/* Hamburger button */}
        <button
          className="p-2 text-white md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <div className="flex w-6 flex-col gap-1.5">
            <span
              className={`block h-0.5 bg-white transition-transform duration-300 ${
                open ? 'translate-y-2 rotate-45' : ''
              }`}
            />
            <span
              className={`block h-0.5 bg-white transition-opacity duration-300 ${
                open ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block h-0.5 bg-white transition-transform duration-300 ${
                open ? '-translate-y-2 -rotate-45' : ''
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile slide-down menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-white/10 bg-[#141414] md:hidden"
          >
            <div className="flex flex-col gap-4 px-4 py-6">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`text-sm font-semibold tracking-widest transition-colors ${
                    activeSection === l.id ? 'text-white underline' : 'text-white/70'
                  }`}
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
