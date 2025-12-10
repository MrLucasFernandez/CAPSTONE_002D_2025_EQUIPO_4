interface AdminPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function AdminPagination({
    currentPage,
    totalPages,
    onPageChange,
}: AdminPaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="mt-8 flex justify-center items-center gap-2">
            <button
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all active:scale-95 ${
                    currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                        : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-lg hover:shadow-blue-500/30"
                }`}
            >
                ← Anterior
            </button>

            <div className="flex gap-1.5 mx-4">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                        return (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`w-10 h-10 rounded-lg font-semibold transition-all active:scale-95 ${
                                    currentPage === page
                                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                                }`}
                            >
                                {page}
                            </button>
                        );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                            <span key={page} className="px-2 py-2 text-gray-400 font-semibold">
                                •••
                            </span>
                        );
                    }
                    return null;
                })}
            </div>

            <button
                onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all active:scale-95 ${
                    currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                        : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-lg hover:shadow-blue-500/30"
                }`}
            >
                Siguiente →
            </button>
        </div>
    );
}
