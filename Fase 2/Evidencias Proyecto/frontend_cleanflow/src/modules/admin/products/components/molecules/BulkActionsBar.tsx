interface BulkActionsBarProps {
    selectedCount: number;
    isProcessing: boolean;
    onActivateAll: () => void;
    onDeactivateAll: () => void;
    onDeleteAll: () => void;
}

export function BulkActionsBar({
    selectedCount,
    isProcessing,
    onActivateAll,
    onDeactivateAll,
    onDeleteAll,
}: BulkActionsBarProps) {
    return (
        <div className="flex items-center justify-between mb-4 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
            <div className="text-sm text-gray-700">
                {selectedCount > 0
                    ? `${selectedCount} producto(s) seleccionados`
                    : "Selecciona productos para acciones masivas"}
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={onActivateAll}
                    disabled={selectedCount === 0 || isProcessing}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold ${
                        selectedCount === 0 || isProcessing
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-emerald-500 text-white hover:bg-emerald-600'
                    }`}
                >
                    Activar seleccionados
                </button>
                <button
                    onClick={onDeactivateAll}
                    disabled={selectedCount === 0 || isProcessing}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold ${
                        selectedCount === 0 || isProcessing
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-amber-500 text-white hover:bg-amber-600'
                    }`}
                >
                    Desactivar seleccionados
                </button>
                <button
                    onClick={onDeleteAll}
                    disabled={selectedCount === 0 || isProcessing}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold ${
                        selectedCount === 0 || isProcessing
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-rose-600 text-white hover:bg-rose-700'
                    }`}
                >
                    Eliminar seleccionados
                </button>
            </div>
        </div>
    );
}
