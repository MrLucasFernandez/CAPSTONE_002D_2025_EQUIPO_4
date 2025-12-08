import { useEffect, useRef } from "react";
import type { Producto } from "@models/product";

const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-CL', { maximumFractionDigits: 0 })}`;
};

interface ProductTableProps {
    products: Producto[];
    onEdit: (idProducto: number) => void;
    onDelete: (idProducto: number) => void;
    selectedIds: number[];
    onToggleSelect: (idProducto: number) => void;
    onToggleSelectAll: (checked: boolean) => void;
}

export default function ProductTable({
    products,
    onEdit,
    onDelete,
    selectedIds,
    onToggleSelect,
    onToggleSelectAll,
}: ProductTableProps) {
    const allSelected = products.length > 0 && products.every((p) => selectedIds.includes(p.idProducto));
    const someSelected = !allSelected && products.some((p) => selectedIds.includes(p.idProducto));
    const selectAllRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate = someSelected && !allSelected;
        }
    }, [allSelected, someSelected]);

    if (products.length === 0) {
        return (
            <div className="text-center py-8 text-gray-600 bg-white rounded-xl shadow-lg">
                <p className="text-xl font-semibold">No hay productos registrados.</p>
                <p className="mt-2">Utiliza el formulario de creación para empezar a añadir productos.</p>
            </div>
        );
    }
    
    return (
        <div className="overflow-x-auto overflow-y-auto max-h-[620px] shadow-2xl rounded-2xl bg-white border border-slate-200">
            <table className="w-full min-w-[1900px] text-sm text-gray-800">
                <thead className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-500 text-white sticky top-0 shadow-md">
                    <tr>
                        <th className="p-3 text-left w-[40px] rounded-tl-xl">
                            <input
                                ref={selectAllRef}
                                type="checkbox"
                                checked={allSelected}
                                onChange={(e) => onToggleSelectAll(e.target.checked)}
                                className="h-4 w-4 rounded border-white/60 text-blue-600 focus:ring-2 focus:ring-white"
                                aria-checked={someSelected ? "mixed" : allSelected}
                            />
                        </th>
                        <th className="p-3 text-left w-[60px]">ID</th>
                        <th className="p-3 text-left w-[90px]">Imagen</th>
                        <th className="p-3 text-left w-[180px]">Nombre</th>
                        <th className="p-3 text-left w-[120px]">SKU</th>
                        <th className="p-3 text-left w-[220px]">Descripción</th>
                        <th className="p-3 text-right">Costo Neto</th>
                        <th className="p-3 text-right">Imp. Compra</th>
                        <th className="p-3 text-right">P. Venta</th>
                        <th className="p-3 text-right font-black bg-white/10">Utilidad</th>
                        <th className="p-3 text-right">Imp. Venta</th>
                        <th className="p-3 text-left w-[140px]">Categoría</th>
                        <th className="p-3 text-left w-[140px]">Marca</th>
                        <th className="p-3 text-right w-[110px]">Stock</th>
                        <th className="p-3 text-left w-[170px]">Bodega</th>
                        <th className="p-3 text-center w-[110px]">Activo</th>
                        <th className="p-3 text-center w-[180px] rounded-tr-xl">Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((p, index) => (
                        <tr 
                            key={p.idProducto} 
                            className={`border-b border-gray-100 transition duration-150 ${
                                !p.productoActivo
                                    ? 'bg-rose-50/70'
                                    : index % 2 === 0
                                        ? 'bg-white'
                                        : 'bg-slate-50'
                            } hover:bg-blue-50/60 hover:shadow-sm`}
                        >
                            <td className="p-3">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(p.idProducto)}
                                    onChange={() => onToggleSelect(p.idProducto)}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                />
                            </td>
                            <td className="p-3 font-mono">{p.idProducto}</td>
                            <td className="p-3">
                                {p.urlImagenProducto ? (
                                <img
                                    src={
                                        typeof p.urlImagenProducto === "string"
                                            ? p.urlImagenProducto
                                            : ""
                                        }
                                    alt={p.nombreProducto}
                                    onError={(e) => { 
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null; 
                                        target.src = `https://placehold.co/64x64/E0E7FF/4338CA?text=NF`; 
                                    }}
                                    className="w-16 h-16 object-cover rounded-md border border-gray-300"
                                />
                                ) : (
                                <span className="text-gray-400 italic text-xs">No img</span>
                                )}
                            </td>
                            <td className="p-3 font-semibold">{p.nombreProducto}</td>
                            <td className="p-3 font-mono text-gray-500">{p.sku ?? "-"}</td>
                            <td className="p-3 max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap text-gray-600" title={p.descripcionProducto ?? ""}>
                                {p.descripcionProducto ?? "-"}
                            </td>
                            <td className="p-3 text-right font-bold">
                                {formatCurrency(p.precioCompraProducto)}
                            </td>
                            <td className="p-3 text-right text-gray-500">
                                {formatCurrency(p.impuestoCompra)}
                            </td>
                            <td className="p-3 text-right text-blue-700 font-bold">
                                {formatCurrency(p.precioVentaProducto)}
                            </td>
                            <td className="p-3 text-right font-black bg-green-50 text-green-700">
                                {formatCurrency(p.utilidadProducto)}
                            </td>
                            <td className="p-3 text-right text-gray-500">
                                {formatCurrency(p.impuestoVenta)}
                            </td>
                            <td className="p-3 text-xs text-gray-600 font-medium">
                                {p.categoria?.nombreCategoria ?? "Sin Asignar"}
                            </td>
                            <td className="p-3 text-xs text-gray-600 font-medium">
                                {p.marca?.nombreMarca ?? "Sin Asignar"}
                            </td>
                            <td className="p-3 text-right font-semibold text-gray-700">
                                {p.stock?.length ? p.stock[p.stock.length - 1].cantidad : 0}
                            </td>
                            <td className="p-3 text-xs text-gray-600 font-medium">
                                {p.stock?.length
                                    ? p.stock[p.stock.length - 1].bodega?.nombre ?? "Sin Bodega"
                                    : "Sin Bodega"
                                }
                            </td>
                            <td className="p-3 text-center">
                                <span
                                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm border ${
                                        p.productoActivo
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            : 'bg-amber-50 text-amber-700 border-amber-200'
                                    }`}
                                >
                                    <span className={`h-2 w-2 rounded-full ${p.productoActivo ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                    {p.productoActivo ? 'Activo' : 'Inactivo'}
                                </span>
                            </td>
                            <td className="p-3 text-center space-x-2">
                                <button
                                    onClick={() => onEdit(p.idProducto)}
                                    className="px-3 py-1.5 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition shadow-md"
                                    title="Editar Producto"
                                >
                                    Editar
                                </button>

                                <button
                                    onClick={() => onDelete(p.idProducto)}
                                    className="px-3 py-1.5 text-sm bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition shadow-md"
                                    title="Eliminar Producto"
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
