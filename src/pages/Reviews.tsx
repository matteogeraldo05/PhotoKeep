import { motion } from 'framer-motion'
import { reviews } from '../data/reviews'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

function Avatar() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="32" fill="#d1d5db" />
      <circle cx="32" cy="24" r="11" fill="#9b9b9b" />
      <ellipse cx="32" cy="54" rx="20" ry="13" fill="#9b9b9b" />
    </svg>
  )
}

function StarRating({ stars }: { stars: number }) {
  return (
    <>
      {Array.from({ length: 5 }, (_v, i) => (
        <span key={i}>{i < stars ? '★' : '☆'}</span>
      ))}
    </>
  )
}

export default function Reviews() {
  return (
    <div className="min-h-screen bg-white px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <h2
          className="mb-16 text-center font-bold text-[#141414]"
          style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '56px' }}
        >
          What our clients are saying...
        </h2>

        <motion.div
          className="grid grid-cols-1 gap-8 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {reviews.map((r) => (
            <motion.div
              key={r.id}
              variants={cardVariants}
              className="flex flex-col items-center gap-6 border border-black p-8"
            >
              <Avatar />
              <p
                className="text-center font-bold text-black"
                style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '18px' }}
              >
                {r.text}
              </p>
              <div
                className="mt-auto rounded-full bg-black px-4 py-2 text-sm font-semibold text-white"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                {r.name} — <StarRating stars={r.stars} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
