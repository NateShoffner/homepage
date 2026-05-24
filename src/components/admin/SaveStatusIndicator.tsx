'use client'

type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error'

interface Props {
  status: SaveStatus
  lastSavedAt: Date | null
}

export default function SaveStatusIndicator({ status, lastSavedAt }: Props) {
  const labels: Record<SaveStatus, string> = {
    saved: lastSavedAt ? `Saved ${lastSavedAt.toLocaleTimeString()}` : 'Saved',
    saving: 'Saving…',
    unsaved: 'Unsaved changes',
    error: 'Save failed',
  }
  const colors: Record<SaveStatus, string> = {
    saved: 'text-success',
    saving: 'text-secondary',
    unsaved: 'text-warning',
    error: 'text-danger',
  }
  return <span className={`small ${colors[status]}`}>{labels[status]}</span>
}
