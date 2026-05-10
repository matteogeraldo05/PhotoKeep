import { motion } from 'framer-motion'
import holdingImg from '../assets/holding.jpg'

const SERVICES = [
  {
    num: '01',
    title: 'High Quality Scanning',
    desc: 'Your photos are scanned at 300–1200 DPI, giving you crisp digital versions that look clean on any screen and print well if you ever want physical copies again',
  },
  {
    num: '02',
    title: 'Pick Your Storage',
    desc: "Choose what works for you. We can upload everything to your cloud of choice or save it to a USB drive if you'd prefer something you can hold",
  },
  {
    num: '03',
    title: 'Pick-Up & Drop-Off',
    desc: "You don't need to go anywhere. We pick up the photos from your home and drop them off when the job's done. Everything handled with care",
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const itemVariants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
}

export default function Services() {
  return (
    <div className="min-h-screen bg-[#141414] px-4 py-20">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-16 md:flex-row">
        {/* Left column */}
        <div className="w-full flex-shrink-0 md:w-80">
          <h2
            className="mb-8 leading-none text-white"
            style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '72px' }}
          >
            Our
            <br />
            Services
          </h2>
          <motion.img
            src={holdingImg}
            alt="Holding photos"
            className="w-full rounded-2xl object-cover"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        </div>

        {/* Right column — service items */}
        <motion.div
          className="flex flex-1 flex-col gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {SERVICES.map((s) => (
            <motion.div key={s.num} variants={itemVariants}>
              <p
                className="mb-1 font-bold"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '48px',
                  color: '#9b9b9b',
                }}
              >
                {s.num}
              </p>
              <h3
                className="mb-3 font-bold text-white"
                style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '34px' }}
              >
                {s.title}
              </h3>
              <p
                className="text-white"
                style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '18px' }}
              >
                {s.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
