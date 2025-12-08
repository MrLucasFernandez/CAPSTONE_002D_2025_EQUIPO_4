interface SortButtonsProps {
    sortAsc: boolean | null;
    onSortChange: (sort: boolean | null) => void;
}

export function SortButtons({ sortAsc, onSortChange }: SortButtonsProps) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Ordenar</span>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onSortChange(sortAsc === true ? null : true)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        sortAsc === true
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                    title="Ordenar ID ascendente"
                >
                    <span>ID</span>
                    <span className="text-sm">↑</span>
                </button>

                <button
                    onClick={() => onSortChange(sortAsc === false ? null : false)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        sortAsc === false
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                    title="Ordenar ID descendente"
                >
                    <span>ID</span>
                    <span className="text-sm">↓</span>
                </button>
            </div>
        </div>
    );
}
