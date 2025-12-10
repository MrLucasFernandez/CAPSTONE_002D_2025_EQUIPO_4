import Modal from "@components/ui/Modal";

interface DeleteProductModalProps {
    isOpen: boolean;
    productName?: string;
    onCancel: () => void;
    onConfirm: () => void;
}

export function DeleteProductModal({ isOpen, productName, onCancel, onConfirm }: DeleteProductModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onCancel}
            title="Eliminar producto"
            width="max-w-md"
        >
            <p className="text-gray-700">
                ¿Estás seguro que deseas eliminar {" "}
                <span className="font-semibold">{productName}</span>?
            </p>

            <div className="mt-6 flex justify-end gap-3">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                    Cancelar
                </button>

                <button
                    onClick={onConfirm}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Eliminar
                </button>
            </div>
        </Modal>
    );
}
