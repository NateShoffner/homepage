interface Props {
  date?: Date | string | null
}

// Right-hand date column shared by blog and project rows. When there is no
// usable date it still renders the column, so a dateless row keeps the same
// body width as its neighbours instead of running wide.
function ListCardDate({ date }: Props) {
  const parsed = date ? new Date(date) : null
  const valid = parsed && !isNaN(parsed.getTime()) ? parsed : null

  if (!valid) {
    return <span className="list-card-date" aria-hidden="true" />
  }

  const iso = [
    valid.getFullYear(),
    String(valid.getMonth() + 1).padStart(2, '0'),
    String(valid.getDate()).padStart(2, '0'),
  ].join('-')

  return (
    <time className="list-card-date" dateTime={iso}>
      <span className="list-card-date-month">
        {valid.toLocaleDateString('en-US', { month: 'short' })}
      </span>
      <span className="list-card-date-day">{valid.getDate()}</span>
      <span className="list-card-date-year">{valid.getFullYear()}</span>
    </time>
  )
}

export { ListCardDate }
