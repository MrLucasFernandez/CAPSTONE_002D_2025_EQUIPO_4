import { BellAlertIcon } from "@heroicons/react/24/outline";
import type { Producto } from "@models/product";
import { LowStockPanel } from "../molecules/LowStockPanel";

interface ProductsHeaderProps {
    lowStockProducts: Producto[];
    showLowStockPanel: boolean;
    onToggleLowStockPanel: () => void;
    onCloseLowStockPanel: () => void;
    onCreate: () => void;
}

export function ProductsHeader({
    lowStockProducts,
    showLowStockPanel,
    onToggleLowStockPanel,
    onCloseLowStockPanel,
    onCreate,
}: ProductsHeaderProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Productos</h1>

            <div className="flex items-center gap-3 flex-wrap sm:justify-end">
                {lowStockProducts.length > 0 && (
                    <div className="relative">
                        <button
                            type="button"
                            onClick={onToggleLowStockPanel}
                            className="relative inline-flex items-center rounded-full bg-amber-100 px-3 py-2 text-amber-800 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                        >
                            <BellAlertIcon className="h-5 w-5" />
                            <span className="ml-2 text-sm font-semibold">Stock bajo</span>
                            <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-600 px-2 text-xs font-bold text-white">
                                {lowStockProducts.length}
                            </span>
                        </button>

                        {showLowStockPanel && (
                            <LowStockPanel products={lowStockProducts} onClose={onCloseLowStockPanel} />
                        )}
                    </div>
                )}

                <button
                    onClick={onCreate}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    + Crear Producto
                </button>
            </div>
        </div>
    );
}
