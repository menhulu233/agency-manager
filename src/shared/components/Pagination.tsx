interface PaginationProps {
  total: number
  pageSize: number
  currentPage: number
  onPageChange: (page: number) => void
}

export default function Pagination({ total, pageSize, currentPage, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize)

  const renderPageButtons = () => {
    const buttons: (number | 'ellipsis')[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) buttons.push(i)
    } else {
      buttons.push(1)
      if (currentPage > 3) buttons.push('ellipsis')
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        buttons.push(i)
      }
      if (currentPage < totalPages - 2) buttons.push('ellipsis')
      buttons.push(totalPages)
    }
    return buttons
  }

  return (
    <div className="flex items-center justify-center gap-1 p-3 border-t border-card">
      <button
        className="page-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ‹
      </button>
      {renderPageButtons().map((page, idx) =>
        page === 'ellipsis' ? (
          <span key={`ellipsis-${idx}`} className="page-ellipsis">…</span>
        ) : (
          <button
            key={page}
            className={`page-btn ${currentPage === page ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        )
      )}
      <button
        className="page-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        ›
      </button>
    </div>
  )
}
