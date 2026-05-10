import { motion } from 'framer-motion'
import photoStackImg from '../assets/photo-stack.jpg'

export default function Home() {
  return (
    <div className="relative flex min-h-[calc(100vh-64px)] flex-col items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${photoStackImg})`, filter: 'grayscale(100%)' }}
      />
      {/* Dark overlay at 51% opacity */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(20, 20, 20, 0.51)' }}
      />

      {/* Hero text */}
      <div className="relative z-10 max-w-4xl px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-6 leading-none text-white"
          style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(48px, 10vw, 96px)',
          }}
        >
          Preserve your memories forever
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="text-lg font-bold text-white md:text-xl"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Turn your old photos into digital memories you can keep for life
        </motion.p>
      </div>

      {/* Scroll chevron */}
      <motion.div
        className="absolute bottom-8 text-white"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </motion.div>
    </div>
  )
}
