interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    onSelectPage: (page: number) => void;
}

export function PaginationControls({ currentPage, totalPages, onSelectPage }: PaginationControlsProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 sm:gap-4 px-2">
            <button
                onClick={() => onSelectPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg text-sm font-semibold min-w-[96px] text-center ${
                    currentPage === 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
                Anterior
            </button>

            <div className="flex-1 max-w-full">
                <div className="flex gap-1 sm:gap-2 justify-center flex-wrap overflow-x-auto no-scrollbar px-1">
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
                                    className={`px-3 py-2 rounded-lg text-sm font-semibold min-w-[42px] ${
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
            </div>

            <button
                onClick={() => onSelectPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-lg text-sm font-semibold min-w-[96px] text-center ${
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
