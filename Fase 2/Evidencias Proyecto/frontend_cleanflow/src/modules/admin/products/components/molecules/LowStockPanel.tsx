import { XMarkIcon } from "@heroicons/react/24/outline";
import type { Producto } from "@models/product";

interface LowStockPanelProps {
    products: Producto[];
    onClose: () => void;
}

export function LowStockPanel({ products, onClose }: LowStockPanelProps) {
    return (
        <div
            className="
                z-30 rounded-xl border border-amber-200 bg-white shadow-xl
                fixed left-4 right-4 top-24 max-h-[70vh] overflow-hidden sm:overflow-visible
                sm:absolute sm:top-auto sm:mt-2 sm:w-96 sm:right-0 sm:left-auto sm:translate-x-0 sm:max-h-80
                flex flex-col
            "
        >
            <div className="flex items-start justify-between px-4 py-3 border-b border-amber-100">
                <div>
                    <p className="text-sm font-semibold text-amber-800">Productos con stock ≤ 5</p>
                    <p className="text-xs text-amber-600">Solo productos activos</p>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="text-amber-500 hover:text-amber-700"
                >
                    <XMarkIcon className="h-5 w-5" />
                </button>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-2 text-sm text-amber-800">
                {products.map((product) => {
                    const totalStock = product.stock?.reduce((sum, s) => sum + (s.cantidad || 0), 0) || 0;
                    return (
                        <div key={product.idProducto} className="rounded-lg bg-amber-50 border border-amber-100 p-3">
                            <div className="font-semibold text-amber-900 flex justify-between gap-2">
                                <span className="truncate">{product.nombreProducto}</span>
                                <span>{totalStock} {totalStock === 1 ? "unidad" : "unidades"}</span>
                            </div>
                            {product.stock && product.stock.length > 0 && (
                                <p className="mt-1 text-xs text-amber-700 leading-snug">
                                    {product.stock.map((s) => `${s.bodega?.nombre || "Bodega"}: ${s.cantidad}`).join(", ")}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
