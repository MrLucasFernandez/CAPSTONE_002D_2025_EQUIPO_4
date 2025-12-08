import Modal from "@components/ui/Modal";

interface BulkDeleteModalProps {
    isOpen: boolean;
    selectedCount: number;
    isProcessing: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

export function BulkDeleteModal({
    isOpen,
    selectedCount,
    isProcessing,
    onCancel,
    onConfirm,
}: BulkDeleteModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onCancel}
            title="Eliminar productos seleccionados"
            width="max-w-md"
        >
            <p className="text-gray-700">
                ¿Estás seguro de eliminar {selectedCount} producto(s) seleccionados? Esta acción no se puede deshacer.
            </p>

            <div className="mt-6 flex justify-end gap-3">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                    disabled={isProcessing}
                >
                    Cancelar
                </button>

                <button
                    onClick={onConfirm}
                    disabled={isProcessing}
                    className={`px-4 py-2 rounded text-white ${
                        isProcessing ? 'bg-red-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                    }`}
                >
                    {isProcessing ? 'Eliminando...' : 'Eliminar'}
                </button>
            </div>
        </Modal>
    );
}
