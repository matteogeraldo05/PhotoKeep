import { type FormEvent, useState } from 'react'
import { motion } from 'framer-motion'
import shutterImg from '../../assets/shutter.png'

interface Props {
  onLogin: (password: string) => boolean
}

export default function AdminLogin({ onLogin }: Props) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const ok = onLogin(password)
    if (!ok) {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#141414] px-4">
      <motion.div
        animate={shake ? { x: [-10, 10, -10, 10, -5, 5, 0] } : { x: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-sm"
      >
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-white/10 bg-[#1e1e1e] px-10 py-12">
          <div className="flex items-center gap-2">
            <img src={shutterImg} alt="PhotoKeep" className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              PhotoKeep
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Admin Access
          </h1>

          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false) }}
              className="w-full rounded-lg border border-white/20 bg-[#2a2a2a] px-4 py-3 text-white placeholder-white/30 focus:border-white focus:outline-none"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
              autoFocus
            />

            {error && (
              <p className="text-sm text-red-400" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                Incorrect password
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-full bg-white py-3 font-bold text-black transition-colors hover:bg-gray-100"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Login
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
