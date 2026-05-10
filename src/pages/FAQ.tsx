import { motion } from 'framer-motion'

interface FaqItem {
  q: string
  a: string
  link?: { to: string; label: string }
}

const FAQS: FaqItem[] = [
  {
    q: 'What is the cost for this service?',
    a: 'Prices vary based on the DPI and any selected add-ons. For detailed pricing information, please visit our pricing page',
    link: { to: '/pricing', label: 'Learn More →' },
  },
  {
    q: 'Do you digitize undeveloped film?',
    a: "Unfortunately I only work with physical prints. I don't process negatives, slides, or undeveloped film, but if you're unsure what you have, send a photo and I'll be happy to help",
  },
  {
    q: 'Why pick PhotoKeep?',
    a: 'Your photos stay local and secure. I handle everything myself, keep the pricing simple, and return your photos quickly and safely',
  },
  {
    q: 'Why should I digitize my photos?',
    a: "Printed photos fade, bend, and get damaged over time. Digitizing keeps them safe, easy to share, and backed up so you never lose decades of family memories.",
  },
  {
    q: 'What is DPI?',
    a: "DPI (dots per inch) measures image sharpness. Higher DPI means cleaner detail and better quality scans. It's best for older photos or anything you may want to reprint",
  },
  {
    q: 'How do pick up and drop off work?',
    a: "I can come to your door, pick up your photos, and return them once they're digitized. If you'd rather drop them off instead, just message me and we'll set a time.",
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function FAQ() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#141414] px-4 py-20"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          className="mb-16 text-center text-white"
          style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(40px, 6vw, 72px)',
            letterSpacing: '0.05em',
          }}
        >
          FREQUENTLY ASKED QUESTIONS
        </h2>

        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className="border border-white p-6"
            >
              <h3
                className="mb-4 font-bold text-white"
                style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '18px' }}
              >
                {faq.q}
              </h3>
              <hr className="mb-4 border-white/30" />
              <p
                className="text-white"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '16px',
                  lineHeight: '1.65',
                }}
              >
                {faq.a}
              </p>
              {faq.link && (
                <a
                  href={`#${faq.link.to.replace('/', '')}`}
                  className="mt-4 inline-block text-white underline hover:text-[#9b9b9b]"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  {faq.link.label}
                </a>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}
