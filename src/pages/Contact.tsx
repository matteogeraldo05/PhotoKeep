import { type ChangeEvent, type FormEvent, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

interface FormData {
  name: string
  phone: string
  email: string
  message: string
}

const INPUT_CLASS =
  'w-full rounded-lg border border-white/40 bg-[#2a2a2a] px-4 py-3 text-white placeholder-white/30 focus:border-white focus:outline-none'
const LABEL_CLASS = 'mb-1 block text-sm font-semibold text-white'

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const { name, phone, email, message } = formData

    if (!name || !phone || !email || !message) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error: dbError } = await supabase
        .from('contact_responses')
        .insert([{ name, phone, email, message, created_at: new Date().toISOString() }])

      if (dbError) throw dbError

      const callPhone = import.meta.env.VITE_CALLMEBOT_PHONE
      const callKey = import.meta.env.VITE_CALLMEBOT_APIKEY
      if (callPhone && callKey) {
        const text = encodeURIComponent(
          `New PhotoKeep inquiry from ${name}! Phone: ${phone}, Email: ${email}. Message: ${message}`,
        )
        await fetch(
          `https://api.callmebot.com/whatsapp.php?phone=${callPhone}&text=${text}&apikey=${callKey}`,
        ).catch(() => {
          // Non-critical — swallow network errors silently
        })
      }

      setSuccess(true)
      setFormData({ name: '', phone: '', email: '', message: '' })
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-[#141414]"
    >
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="flex flex-col gap-16 md:flex-row">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex-1"
          >
            <h2
              className="mb-6 font-bold text-white"
              style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '56px' }}
            >
              Contact Us
            </h2>
            <p
              className="mb-8 text-white"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '18px',
                lineHeight: '1.7',
              }}
            >
              Have questions or want to book a pickup? Send us a message and
              we'll get back to you as soon as possible
            </p>
            <img
              src="/assets/stack_of_photos.webp"
              alt="Stack of photos"
              className="w-full rounded-2xl object-cover"
              onError={(e) => {
                const img = e.target as HTMLImageElement
                img.src = '/assets/photos.jpeg'
                img.onerror = () => {
                  img.style.display = 'none'
                }
              }}
            />
          </motion.div>

          {/* Right column — form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-1 flex-col gap-6"
            noValidate
          >
            <div>
              <label
                className={LABEL_CLASS}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={INPUT_CLASS}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              />
            </div>
            <div>
              <label
                className={LABEL_CLASS}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Phone number
              </label>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={INPUT_CLASS}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              />
            </div>
            <div>
              <label
                className={LABEL_CLASS}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Email address
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={INPUT_CLASS}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              />
            </div>
            <div>
              <label
                className={LABEL_CLASS}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Leave a message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className={INPUT_CLASS}
                style={{ fontFamily: 'DM Sans, sans-serif', resize: 'vertical' }}
              />
            </div>

            {error && (
              <p
                className="text-sm text-red-400"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                {error}
              </p>
            )}
            {success && (
              <p
                className="text-sm font-semibold text-green-400"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Thanks! We'll get back to you soon.
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-white py-4 text-lg font-bold text-black transition-colors hover:bg-gray-100 disabled:opacity-60"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg
                    className="h-5 w-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Sending...
                </span>
              ) : (
                'Submit'
              )}
            </button>
          </motion.form>
        </div>
      </div>

      {/* Contact footer bar */}
      <div className="border-t border-white/10 px-4 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 md:flex-row">
          <span
            className="font-semibold text-white"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Further Questions?
          </span>
          <span
            className="text-[#9b9b9b]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Email Address: Matteodeangelisgerado@gmail.com
          </span>
          <span
            className="text-white"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Phone Number: +1(647)830-1540
          </span>
        </div>
      </div>
    </motion.div>
  )
}
