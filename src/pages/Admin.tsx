import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAdminAuth } from '../hooks/useAdminAuth'
import AdminLogin from '../components/admin/AdminLogin'
import LeadCard, { type Lead } from '../components/admin/LeadCard'
import OrderTable from '../components/admin/OrderTable'
import OrderModal, { type Order } from '../components/admin/OrderModal'

export default function Admin() {
  const { authenticated, login, logout } = useAdminAuth()
  const [tab, setTab] = useState<'leads' | 'orders'>('leads')
  const [leads, setLeads] = useState<Lead[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Partial<Order> | null>(null)
  const [convertingLeadId, setConvertingLeadId] = useState<number | null>(null)

  const fetchLeads = useCallback(async () => {
    const { data } = await supabase
      .from('contact_responses')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setLeads(data as Lead[])
  }, [])

  const fetchOrders = useCallback(async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setOrders(data as Order[])
  }, [])

  useEffect(() => {
    if (!authenticated) return
    setLoading(true)
    Promise.all([fetchLeads(), fetchOrders()]).finally(() => setLoading(false))

    // Real-time: new contact form submissions appear instantly
    const leadsChannel = supabase
      .channel('admin-leads-rt')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'contact_responses' },
        payload => setLeads(prev => [payload.new as Lead, ...prev]),
      )
      .subscribe()

    // Real-time: order changes
    const ordersChannel = supabase
      .channel('admin-orders-rt')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => fetchOrders(),
      )
      .subscribe()

    return () => {
      supabase.removeChannel(leadsChannel)
      supabase.removeChannel(ordersChannel)
    }
  }, [authenticated, fetchLeads, fetchOrders])

  const stats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    inProgress: orders.filter(o => ['Picked Up', 'Scanning', 'Ready'].includes(o.status)).length,
    completed: orders.filter(o => o.status === 'Delivered').length,
    revenue: orders.filter(o => o.paid).reduce((s, o) => s + (o.total_cost ?? 0), 0),
    unpaid: orders.filter(o => !o.paid).reduce((s, o) => s + (o.total_cost ?? 0), 0),
  }), [orders])

  async function generateOrderId(): Promise<string> {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const prefix = `PK-${dateStr}`
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .like('order_id', `${prefix}%`)
    const seq = ((count ?? 0) + 1).toString().padStart(4, '0')
    return `${prefix}-${seq}`
  }

  async function handleSaveOrder(formData: Partial<Order>) {
    if (editingOrder?.id) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, order_id, created_at, ...payload } = formData as Order
      const { error } = await supabase.from('orders').update(payload).eq('id', editingOrder.id)
      if (error) { console.error('Order update error:', error); throw new Error(error.message) }
      setOrders(prev =>
        prev.map(o => (o.id === editingOrder.id ? { ...o, ...payload } : o)),
      )
    } else {
      const orderId = await generateOrderId()
      const insertPayload = {
        ...formData,
        order_id: orderId,
        delivery_date: (formData.delivery_date || null) as string | null,
        date_received: (formData.date_received || null) as string | null,
      }
      const { data, error } = await supabase
        .from('orders')
        .insert([insertPayload])
        .select()
      if (error) { console.error('Order insert error:', error); throw new Error(error.message) }
      if (data?.[0]) setOrders(prev => [data[0] as Order, ...prev])

      if (convertingLeadId !== null) {
        await supabase.from('contact_responses').delete().eq('id', convertingLeadId)
        setLeads(prev => prev.filter(l => l.id !== convertingLeadId))
        setConvertingLeadId(null)
      }
    }
    closeModal()
  }

  async function handleUpdateOrder(id: number, changes: Partial<Order>) {
    await supabase.from('orders').update(changes).eq('id', id)
    setOrders(prev => prev.map(o => (o.id === id ? { ...o, ...changes } : o)))
  }

  async function handleDeleteOrder(id: number) {
    await supabase.from('orders').delete().eq('id', id)
    setOrders(prev => prev.filter(o => o.id !== id))
  }

  async function handleDeleteLead(id: number) {
    await supabase.from('contact_responses').delete().eq('id', id)
    setLeads(prev => prev.filter(l => l.id !== id))
  }

  function handleConvertLead(lead: Lead) {
    setConvertingLeadId(lead.id)
    setEditingOrder({
      customer_name: lead.name,
      phone: lead.phone,
      email: lead.email,
      notes: lead.message,
    })
    setModalOpen(true)
  }

  function handleAddOrder() {
    setEditingOrder(null)
    setConvertingLeadId(null)
    setModalOpen(true)
  }

  function handleEditOrder(order: Order) {
    setEditingOrder(order)
    setConvertingLeadId(null)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingOrder(null)
    setConvertingLeadId(null)
  }

  if (!authenticated) return <AdminLogin onLogin={login} />

  return (
    <div className="min-h-screen bg-[#141414]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      {/* Top navbar */}
      <div className="border-b border-white/10 bg-[#1e1e1e]">
        <div className="mx-auto flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3" style={{ maxWidth: 1600 }}>
          <span className="text-lg font-bold text-white">PhotoKeep Admin</span>

          <div className="flex flex-1 flex-wrap gap-x-5 gap-y-1">
            <Stat label="Orders" value={stats.total} />
            <Stat label="Pending" value={stats.pending} color="text-yellow-400" />
            <Stat label="In Progress" value={stats.inProgress} color="text-blue-400" />
            <Stat label="Completed" value={stats.completed} color="text-green-400" />
            <Stat label="Revenue" value={`$${stats.revenue.toFixed(2)}`} color="text-green-400" />
            <Stat label="Unpaid" value={`$${stats.unpaid.toFixed(2)}`} color="text-red-400" />
          </div>

          <button
            onClick={logout}
            className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white transition-colors hover:bg-white/10"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10 bg-[#1a1a1a]">
        <div className="mx-auto flex px-4" style={{ maxWidth: 1600 }}>
          {(['leads', 'orders'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`border-b-2 px-6 py-3 text-sm font-semibold capitalize transition-colors ${
                tab === t
                  ? 'border-white text-white'
                  : 'border-transparent text-[#9b9b9b] hover:text-white'
              }`}
            >
              {t === 'leads' ? `Leads (${leads.length})` : `Orders (${orders.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto p-4" style={{ maxWidth: 1600 }}>
        {loading ? (
          <p className="py-12 text-center text-[#9b9b9b]">Loading…</p>
        ) : tab === 'leads' ? (
          leads.length === 0 ? (
            <p className="py-12 text-center text-[#9b9b9b]">No new leads yet. Form submissions will appear here automatically.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {leads.map(lead => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onConvert={handleConvertLead}
                  onDelete={handleDeleteLead}
                />
              ))}
            </div>
          )
        ) : (
          <OrderTable
            orders={orders}
            onEdit={handleEditOrder}
            onDelete={handleDeleteOrder}
            onUpdate={handleUpdateOrder}
            onAdd={handleAddOrder}
          />
        )}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <OrderModal
            key="order-modal"
            order={editingOrder}
            onSave={handleSaveOrder}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function Stat({
  label,
  value,
  color = 'text-white',
}: {
  label: string
  value: string | number
  color?: string
}) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-[#9b9b9b]">{label}</span>
      <span className={`text-sm font-bold ${color}`}>{value}</span>
    </div>
  )
}
