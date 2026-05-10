import { motion } from 'framer-motion'

interface Plan {
  name: string
  price: string
  dpi: string
  output: string
  cloud: string
  usb: string
  org: string
  popular: boolean
  highlight: boolean
  usbFree: boolean
}

const PLANS: Plan[] = [
  {
    name: 'Standard Grade',
    price: '$0.30',
    dpi: '300 DPI Scan',
    output: 'Standard JPEG output',
    cloud: 'Free Cloud Upload',
    usb: 'Optional USB Drive: $5',
    org: 'Organized into simple dated folders',
    popular: false,
    highlight: false,
    usbFree: false,
  },
  {
    name: 'Enhanced Grade',
    price: '$0.50',
    dpi: '600 DPI Scan',
    output: 'High Quality JPEG output',
    cloud: 'Free Cloud Upload',
    usb: 'Optional USB Drive: $5',
    org: 'Organized into simple dated folders',
    popular: true,
    highlight: true,
    usbFree: false,
  },
  {
    name: 'Premium Grade',
    price: '$0.70',
    dpi: '600+ DPI Scan',
    output: 'Ultra High Quality JPEG output',
    cloud: 'Free Cloud Upload',
    usb: 'Free USB Drive included',
    org: 'Organized into simple dated folders',
    popular: false,
    highlight: false,
    usbFree: true,
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export default function Pricing() {
  return (
    <div className="min-h-screen bg-white px-4 py-20">
      <div className="mx-auto max-w-4xl">
        <h2
          className="mb-12 font-bold text-black"
          style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '56px' }}
        >
          Pricing
        </h2>

        <div className="overflow-hidden border border-black">
          <motion.div
            className="grid grid-cols-1 divide-y divide-black md:grid-cols-3 md:divide-x md:divide-y-0"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {PLANS.map((plan) => (
              <motion.div
                key={plan.name}
                variants={cardVariants}
                whileHover={{ scale: 1.02 }}
                className={`relative flex flex-col gap-4 p-8 ${
                  plan.highlight ? 'bg-[#f0fff4]' : 'bg-white'
                }`}
              >
                {plan.popular && (
                  <span
                    className="absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold text-white"
                    style={{
                      background:
                        'linear-gradient(135deg, #ff3131, #ff914d)',
                      transform: 'rotate(10deg)',
                      fontFamily: 'DM Sans, sans-serif',
                    }}
                  >
                    MOST POPULAR
                  </span>
                )}

                <h3
                  className="font-bold text-black"
                  style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '20px' }}
                >
                  {plan.name}
                </h3>
                <hr className="border-black" />

                <p
                  className="text-black"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  <span className="text-3xl font-bold">{plan.price}</span>/photo
                </p>

                <ul
                  className="flex flex-col gap-2 text-sm text-black"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  <li>{plan.dpi}</li>
                  <li>{plan.output}</li>
                  <li>{plan.cloud}</li>
                  <li className={plan.usbFree ? 'font-bold' : ''}>{plan.usb}</li>
                  <li>{plan.org}</li>
                </ul>
              </motion.div>
            ))}
          </motion.div>

          {/* Guarantee bar */}
          <div
            className="bg-black py-4 text-center font-semibold text-white"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            1 Year Quality Guarantee
          </div>
        </div>
      </div>
    </div>
  )
}
