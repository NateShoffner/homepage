export function SkeletonListCard({ showImage = true }: { showImage?: boolean }) {
  return (
    <div className="list-card skeleton-card" aria-hidden="true">
      {showImage && <div className="list-card-thumbnail skeleton-block" />}
      <div className="list-card-body">
        <div className="skeleton-line skeleton-title" />
        <div className="skeleton-line skeleton-excerpt" />
        <div className="skeleton-line skeleton-excerpt short" />
        <div className="skeleton-line skeleton-badge" />
      </div>
    </div>
  )
}
