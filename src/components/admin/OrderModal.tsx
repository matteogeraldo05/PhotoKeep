import { type FormEvent, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export interface Order {
  id?: number
  order_id?: string
  customer_name: string
  phone: string
  email: string
  status: string
  photo_count: number
  package: string
  enhancements: string
  usb: boolean
  total_cost: number
  paid: boolean
  date_received: string
  delivery_date: string
  notes: string
  created_at?: string
}

const STATUSES = ['Pending', 'Picked Up', 'Scanning', 'Ready', 'Delivered']
const PACKAGES = ['Standard', 'Enhanced', 'Premium']
const RATES: Record<string, number> = { Standard: 0.3, Enhanced: 0.5, Premium: 0.7 }

const today = () => new Date().toISOString().split('T')[0]

const DEFAULTS: Order = {
  customer_name: '',
  phone: '',
  email: '',
  status: 'Pending',
  photo_count: 0,
  package: 'Standard',
  enhancements: '',
  usb: false,
  total_cost: 0,
  paid: false,
  date_received: today(),
  delivery_date: '',
  notes: '',
}

interface Props {
  order: Partial<Order> | null
  onSave: (order: Partial<Order>) => Promise<void>
  onClose: () => void
}

const INPUT =
  'w-full rounded-lg border border-white/20 bg-[#2a2a2a] px-3 py-2 text-sm text-white placeholder-white/30 focus:border-white focus:outline-none'
const LABEL =
  'mb-1 block text-xs font-semibold uppercase tracking-wider text-[#9b9b9b]'

export default function OrderModal({ order, onSave, onClose }: Props) {
  const [form, setForm] = useState<Order>({ ...DEFAULTS, ...order })
  const [saving, setSaving] = useState(false)
  const [manualTotal, setManualTotal] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Auto-calculate total unless user has manually overridden it
  useEffect(() => {
    if (manualTotal) return
    const rate = RATES[form.package] ?? 0.3
    const total = +(form.photo_count * rate + (form.usb ? 5 : 0)).toFixed(2)
    setForm(prev => ({ ...prev, total_cost: total }))
  }, [form.photo_count, form.package, form.usb, manualTotal])

  function set<K extends keyof Order>(key: K, value: Order[K]) {
    // Changing photos/package/usb resets manual override so auto-calc takes back over
    if (key === 'photo_count' || key === 'package' || key === 'usb') setManualTotal(false)
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaveError(null)
    try {
      await onSave(form)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setSaveError(msg)
    } finally {
      setSaving(false)
    }
  }

  const isEdit = Boolean(order?.id)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 16 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1e1e1e]"
        onClick={e => e.stopPropagation()}
        style={{ fontFamily: 'DM Sans, sans-serif' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="text-lg font-bold text-white">
            {isEdit ? 'Edit Order' : 'New Order'}
            {order?.order_id && (
              <span className="ml-2 font-mono text-sm font-normal text-[#9b9b9b]">
                {order.order_id}
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="text-[#9b9b9b] transition-colors hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className={LABEL}>Customer Name *</label>
              <input
                className={INPUT}
                value={form.customer_name}
                onChange={e => set('customer_name', e.target.value)}
                required
              />
            </div>

            <div>
              <label className={LABEL}>Phone</label>
              <input
                className={INPUT}
                type="tel"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
              />
            </div>

            <div>
              <label className={LABEL}>Email</label>
              <input
                className={INPUT}
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
              />
            </div>

            <div>
              <label className={LABEL}>Status</label>
              <select
                className={INPUT}
                value={form.status}
                onChange={e => set('status', e.target.value)}
              >
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className={LABEL}># Photos</label>
              <input
                className={INPUT}
                type="number"
                min={0}
                value={form.photo_count}
                onChange={e => set('photo_count', Number(e.target.value))}
              />
            </div>

            <div>
              <label className={LABEL}>Package</label>
              <select
                className={INPUT}
                value={form.package}
                onChange={e => set('package', e.target.value)}
              >
                {PACKAGES.map(p => (
                  <option key={p} value={p}>
                    {p} — ${RATES[p].toFixed(2)}/photo
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={LABEL}>Enhancements</label>
              <input
                className={INPUT}
                value={form.enhancements}
                onChange={e => set('enhancements', e.target.value)}
                placeholder="e.g. colour correction"
              />
            </div>

            <div>
              <label className={LABEL}>Total Cost ($)</label>
              <input
                className={INPUT}
                type="number"
                step="0.01"
                min={0}
                value={form.total_cost}
                onChange={e => {
                  setManualTotal(true)
                  set('total_cost', Number(e.target.value))
                }}
              />
            </div>

            <div>
              <label className={LABEL}>Date Received</label>
              <input
                className={INPUT}
                type="date"
                value={form.date_received}
                onChange={e => set('date_received', e.target.value)}
              />
            </div>

            <div>
              <label className={LABEL}>Delivery Date</label>
              <input
                className={INPUT}
                type="date"
                value={form.delivery_date}
                onChange={e => set('delivery_date', e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label className={LABEL}>Notes</label>
              <textarea
                className={INPUT}
                rows={3}
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="flex gap-6 md:col-span-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.usb}
                  onChange={e => set('usb', e.target.checked)}
                  className="h-4 w-4 accent-white"
                />
                <span className="text-sm text-white">USB Drive (+$5)</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.paid}
                  onChange={e => set('paid', e.target.checked)}
                  className="h-4 w-4 accent-green-400"
                />
                <span className="text-sm text-white">Paid</span>
              </label>
            </div>
          </div>

          {saveError && (
            <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              Save failed: {saveError}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/20 px-5 py-2 text-sm text-white transition-colors hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-white px-5 py-2 text-sm font-bold text-black transition-colors hover:bg-gray-100 disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save Order'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
