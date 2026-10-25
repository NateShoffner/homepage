interface Props {
  showImage?: boolean
  showDate?: boolean
}

export function SkeletonListCard({ showImage = true, showDate = false }: Props) {
  return (
    <div className="list-card skeleton-card" aria-hidden="true">
      {showImage && <div className="list-card-thumbnail skeleton-block" />}
      <div className="list-card-body">
        <div className="skeleton-line skeleton-title" />
        <div className="skeleton-line skeleton-excerpt" />
        <div className="skeleton-line skeleton-excerpt short" />
        <div className="skeleton-line skeleton-badge" />
      </div>
      {showDate && (
        <div className="list-card-date skeleton-date">
          <div className="skeleton-line skeleton-date-month" />
          <div className="skeleton-line skeleton-date-day" />
          <div className="skeleton-line skeleton-date-year" />
        </div>
      )}
    </div>
  )
}
