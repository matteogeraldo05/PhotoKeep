import { useState } from 'react'
import type { Order } from './OrderModal'

const STATUSES = ['Pending', 'Picked Up', 'Scanning', 'Ready', 'Delivered']

const STATUS_PILL: Record<string, string> = {
  Pending: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40',
  'Picked Up': 'bg-blue-500/20 text-blue-400 border border-blue-500/40',
  Scanning: 'bg-purple-500/20 text-purple-400 border border-purple-500/40',
  Ready: 'bg-orange-500/20 text-orange-400 border border-orange-500/40',
  Delivered: 'bg-green-500/20 text-green-400 border border-green-500/40',
}

interface Props {
  orders: Order[]
  onEdit: (order: Order) => void
  onDelete: (id: number) => void
  onUpdate: (id: number, changes: Partial<Order>) => Promise<void>
  onAdd: () => void
}

function fmt(d: string | null | undefined) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString()
}

export default function OrderTable({ orders, onEdit, onDelete, onUpdate, onAdd }: Props) {
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const filtered = orders
    .filter(o => statusFilter === 'all' || o.status === statusFilter)
    .filter(o => {
      if (!search) return true
      const q = search.toLowerCase()
      return (
        (o.customer_name ?? '').toLowerCase().includes(q) ||
        (o.email ?? '').toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      const da = a.date_received || a.created_at || ''
      const db = b.date_received || b.created_at || ''
      return db.localeCompare(da)
    })

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }}>
      {/* Filter bar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="rounded-lg border border-white/20 bg-[#2a2a2a] px-3 py-2 text-sm text-white placeholder-white/30 focus:border-white focus:outline-none"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="rounded-lg border border-white/20 bg-[#2a2a2a] px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
        >
          <option value="all">All Statuses</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <div className="flex-1" />
        <button
          onClick={onAdd}
          className="rounded-full bg-white px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-gray-100"
        >
          + Add Order
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm text-white" style={{ minWidth: '1300px' }}>
          <thead>
            <tr className="border-b border-white/10 bg-[#1e1e1e]">
              {[
                'Order ID', 'Name', 'Phone', 'Email', 'Status',
                'Photos', 'Package', 'Enhancements', 'USB',
                'Total', 'Paid', 'Received', 'Delivery', 'Notes', 'Actions',
              ].map(h => (
                <th
                  key={h}
                  className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#9b9b9b]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={15} className="px-4 py-10 text-center text-[#9b9b9b]">
                  No orders found
                </td>
              </tr>
            ) : (
              filtered.map((order, i) => (
                <tr
                  key={order.id}
                  onClick={() => onEdit(order)}
                  className={`cursor-pointer border-b border-white/5 transition-colors hover:bg-white/[0.04] ${
                    i % 2 === 0 ? 'bg-[#141414]' : 'bg-[#181818]'
                  }`}
                  style={order.paid ? { boxShadow: 'inset 3px 0 0 #10B981' } : undefined}
                >
                  <td className="px-3 py-2.5 font-mono text-xs text-[#9b9b9b]">
                    {order.order_id ?? '—'}
                  </td>
                  <td className="px-3 py-2.5 font-medium">{order.customer_name}</td>
                  <td className="px-3 py-2.5 text-[#9b9b9b]">{order.phone || '—'}</td>
                  <td className="px-3 py-2.5 text-[#9b9b9b]">{order.email || '—'}</td>

                  {/* Inline status dropdown */}
                  <td className="px-3 py-2.5" onClick={e => e.stopPropagation()}>
                    <select
                      value={order.status}
                      onChange={e =>
                        onUpdate(order.id!, { status: e.target.value })
                      }
                      className={`cursor-pointer rounded-full border-0 px-2.5 py-1 text-xs font-semibold focus:outline-none ${
                        STATUS_PILL[order.status] ?? ''
                      }`}
                      style={{ background: 'transparent' }}
                    >
                      {STATUSES.map(s => (
                        <option key={s} className="bg-[#2a2a2a] text-white">
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-3 py-2.5 text-center">{order.photo_count ?? '—'}</td>
                  <td className="px-3 py-2.5 text-[#9b9b9b]">{order.package || '—'}</td>
                  <td className="max-w-[110px] truncate px-3 py-2.5 text-[#9b9b9b]">
                    {order.enhancements || '—'}
                  </td>
                  <td className="px-3 py-2.5 text-center">{order.usb ? '✓' : '—'}</td>
                  <td className="px-3 py-2.5 font-medium">
                    ${(order.total_cost ?? 0).toFixed(2)}
                  </td>

                  {/* Inline paid checkbox */}
                  <td className="px-3 py-2.5 text-center" onClick={e => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={order.paid ?? false}
                      onChange={e => onUpdate(order.id!, { paid: e.target.checked })}
                      className="h-4 w-4 cursor-pointer accent-green-500"
                    />
                  </td>

                  <td className="px-3 py-2.5 text-[#9b9b9b]">{fmt(order.date_received)}</td>
                  <td className="px-3 py-2.5 text-[#9b9b9b]">{fmt(order.delivery_date)}</td>
                  <td className="max-w-[100px] truncate px-3 py-2.5 text-[#9b9b9b]">
                    {order.notes || '—'}
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-2.5" onClick={e => e.stopPropagation()}>
                    <div className="flex gap-1">
                      <button
                        onClick={() => onEdit(order)}
                        className="rounded px-2 py-1 text-xs text-blue-400 hover:bg-blue-500/10"
                      >
                        Edit
                      </button>
                      {deletingId === order.id ? (
                        <button
                          onClick={() => {
                            onDelete(order.id!)
                            setDeletingId(null)
                          }}
                          className="rounded px-2 py-1 text-xs text-red-400 hover:bg-red-500/10"
                        >
                          Confirm
                        </button>
                      ) : (
                        <button
                          onClick={() => setDeletingId(order.id!)}
                          className="rounded px-2 py-1 text-xs text-red-400 hover:bg-red-500/10"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-right text-xs text-[#9b9b9b]">
        {filtered.length} of {orders.length} orders
      </p>
    </div>
  )
}
