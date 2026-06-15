import "./styles/PrestamoPagination.css"

function PrestamoPagination({
  currentPage,
  totalPages,
  onPageChange
}) {
  if (totalPages <= 1) return null

  const getPages = () => {
    const delta = 2
    const range = []

    const left = Math.max(2, currentPage - delta)
    const right = Math.min(totalPages - 1, currentPage + delta)

    range.push(1)

    if (left > 2) range.push("...")

    for (let i = left; i <= right; i++) {
      range.push(i)
    }

    if (right < totalPages - 1) range.push("...")

    if (totalPages > 1) range.push(totalPages)

    return range
  }

  const pages = getPages()

  return (
    <div className="prestamo-pagination">

      {/* FIRST */}
      <button
        className="nav-btn"
        disabled={currentPage === 1}
        onClick={() => onPageChange(1)}
      >
        «
      </button>

      {/* PREV */}
      <button
        className="nav-btn"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ‹
      </button>

      {/* PAGES */}
      {pages.map((page, idx) => {
        if (page === "...") {
          return (
            <span key={idx} className="dots">
              ...
            </span>
          )
        }

        return (
          <button
            key={idx}
            className={
              currentPage === page ? "active" : ""
            }
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        )
      })}

      {/* NEXT */}
      <button
        className="nav-btn"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        ›
      </button>

      {/* LAST */}
      <button
        className="nav-btn"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
      >
        »
      </button>

    </div>
  )
}

export default PrestamoPagination