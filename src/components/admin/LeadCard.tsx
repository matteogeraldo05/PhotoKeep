import { useState } from 'react'

export interface Lead {
  id: number
  name: string
  phone: string
  email: string
  message: string
  created_at: string
}

interface Props {
  lead: Lead
  onConvert: (lead: Lead) => void
  onDelete: (id: number) => void
}

export default function LeadCard({ lead, onConvert, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const isTruncated = lead.message.length > 100

  return (
    <div
      className="flex flex-col gap-3 rounded-xl border border-white/10 bg-[#1e1e1e] p-4"
      style={{ fontFamily: 'DM Sans, sans-serif' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-bold text-white">{lead.name}</p>
          <p className="text-sm text-[#9b9b9b]">{lead.email}</p>
          {lead.phone && <p className="text-sm text-[#9b9b9b]">{lead.phone}</p>}
        </div>
        <p className="shrink-0 text-xs text-[#9b9b9b]">
          {new Date(lead.created_at).toLocaleDateString()}
        </p>
      </div>

      {/* Message */}
      <div>
        <p className={`text-sm leading-relaxed text-white${!expanded && isTruncated ? ' line-clamp-2' : ''}`}>
          {lead.message}
        </p>
        {isTruncated && (
          <button
            onClick={() => setExpanded(v => !v)}
            className="mt-1 text-xs text-[#9b9b9b] underline hover:text-white"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="mt-auto flex gap-2 border-t border-white/10 pt-3">
        <button
          onClick={() => onConvert(lead)}
          className="flex-1 rounded-full bg-white py-1.5 text-xs font-bold text-black transition-colors hover:bg-gray-100"
        >
          Convert to Order
        </button>

        {confirmDelete ? (
          <button
            onClick={() => onDelete(lead.id)}
            className="rounded-full border border-red-500/50 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/10"
          >
            Confirm
          </button>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="rounded-full border border-white/20 px-3 py-1.5 text-xs text-[#9b9b9b] transition-colors hover:border-red-500/50 hover:text-red-400"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  )
}
