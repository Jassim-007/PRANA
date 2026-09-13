export function StatusBanner({
  loading,
  error,
  empty,
  emptyMessage,
}: {
  loading?: boolean
  error?: string | null
  empty?: boolean
  emptyMessage?: string
}) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white px-4 py-3 font-body text-sm text-stone-600">
        Loading surveillance data…
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 font-body text-sm text-amber-900">
        {error} The dashboard will update when the API is reachable. Empty panels are not a confirmed all-clear.
      </div>
    )
  }

  if (empty) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white px-4 py-3 font-body text-sm text-stone-600">
        {emptyMessage ?? 'No records available.'}
      </div>
    )
  }

  return null
}
