interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    onSelectPage: (page: number) => void;
}

export function PaginationControls({ currentPage, totalPages, onSelectPage }: PaginationControlsProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="mt-6 flex justify-center items-center gap-2">
            <button
                onClick={() => onSelectPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium ${
                    currentPage === 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
                Anterior
            </button>

            <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                        return (
                            <button
                                key={page}
                                onClick={() => onSelectPage(page)}
                                className={`px-3 py-2 rounded-lg font-medium ${
                                    currentPage === page
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                {page}
                            </button>
                        );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="px-2 py-2 text-gray-500">...</span>;
                    }
                    return null;
                })}
            </div>

            <button
                onClick={() => onSelectPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium ${
                    currentPage === totalPages
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
                Siguiente
            </button>
        </div>
    );
}
