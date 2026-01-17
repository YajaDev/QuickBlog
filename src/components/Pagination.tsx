interface Props {
  currentPage: number;
  totalPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const Pagination = ({ setCurrentPage, currentPage, totalPage }: Props) => {
  return (
    <div className="flex justify-center items-center gap-2 my-10">
      {/* Previous */}
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((p) => p - 1)}
        className={`px-3 py-1 border rounded ${
          currentPage === 1 && "opacity-40 "
        }`}
      >
        Prev
      </button>

      {/* Page Numbers */}
      {Array.from({ length: totalPage }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-3 py-1 rounded border ${
            currentPage === page ? "bg-primary text-primary-foreground" : ""
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        disabled={currentPage === totalPage}
        onClick={() => setCurrentPage((p) => p + 1)}
        className={`px-3 py-1 border rounded disabled:opacity-40 ${
          currentPage === totalPage && "opacity-40"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
