import { motion } from 'framer-motion'

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#141414] px-4 py-20"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-16 md:flex-row">
        {/* Polaroid */}
        <motion.div
          initial={{ opacity: 0, x: -60, rotate: 7 }}
          whileInView={{ opacity: 1, x: 0, rotate: 7 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          whileHover={{ rotate: 3 }}
          className="flex-shrink-0 cursor-default"
        >
          <div className="bg-white p-3 pb-14 shadow-2xl" style={{ width: '240px' }}>
            <img
              src="/assets/matteo.jpg"
              alt="Matteo"
              className="h-56 w-full object-cover"
              onError={(e) => {
                const img = e.target as HTMLImageElement
                img.style.background = '#c5c5c5'
                img.style.minHeight = '224px'
              }}
            />
            <p
              className="mt-3 text-center text-2xl"
              style={{
                fontFamily: 'Permanent Marker, cursive',
                color: '#253149',
              }}
            >
              Matteo
            </p>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex-1"
        >
          <h2
            className="mb-8 font-bold text-white"
            style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '56px' }}
          >
            About us
          </h2>
          <p
            className="mb-6 text-white"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '20px',
              lineHeight: '1.75',
            }}
          >
            We started this service after watching our own family albums fade and
            fall apart. Somewhere along the way, everyone stopped printing
            pictures and the older ones never got the care they needed. So we
            set out to fix that.
          </p>
          <p
            className="text-white"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '20px',
              lineHeight: '1.75',
            }}
          >
            Today we help families protect their history by converting old photos
            into clear, organized digital copies that won't get lost, damaged, or
            forgotten.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
