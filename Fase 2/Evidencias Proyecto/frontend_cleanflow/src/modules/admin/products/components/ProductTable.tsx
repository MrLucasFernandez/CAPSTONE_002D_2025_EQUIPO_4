import type { Producto } from "../../../../types/product";

// Formateador de números (para pesos chilenos o similar)
const formatCurrency = (amount: number) => {
    // Usamos 'es-CL' para formato de moneda (ej: $1.234) sin decimales.
    return `$${amount.toLocaleString('es-CL', { maximumFractionDigits: 0 })}`;
};

interface ProductTableProps {
    products: Producto[];
    onEdit: (idProducto: number) => void;
    onDelete: (idProducto: number) => void;
}

export default function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
    if (products.length === 0) {
        return (
            <div className="text-center py-8 text-gray-600 bg-white rounded-xl shadow-lg">
                <p className="text-xl font-semibold">No hay productos registrados.</p>
                <p className="mt-2">Utiliza el formulario de creación para empezar a añadir productos.</p>
            </div>
        );
    }
    
    return (
        // Contenedor principal para manejar el desbordamiento horizontal
        <div className="overflow-x-auto shadow-xl rounded-xl bg-white border border-gray-100">
            {/* Tabla: Aumentar el min-width para mostrar todas las columnas financieras */}
            <table className="w-full min-w-[1800px] text-sm text-gray-800"> 

                {/* ENCABEZADOS */}
                <thead className="bg-blue-600 text-white sticky top-0">
                    <tr>
                        <th className="p-3 text-left w-[50px] rounded-tl-xl">ID</th>
                        <th className="p-3 text-left w-[80px]">Imagen</th>
                        <th className="p-3 text-left w-[150px]">Nombre</th>
                        <th className="p-3 text-left w-[120px]">SKU</th>
                        <th className="p-3 text-left w-[200px]">Descripción</th>
                        <th className="p-3 text-right">Costo Neto</th>
                        <th className="p-3 text-right">Imp. Compra</th>
                        <th className="p-3 text-right">P. Venta</th>
                        <th className="p-3 text-right font-black bg-blue-700">Utilidad</th>
                        <th className="p-3 text-right">Imp. Venta</th>
                        <th className="p-3 text-left w-[120px]">Categoría</th>
                        <th className="p-3 text-left w-[120px]">Marca</th>
                        <th className="p-3 text-right w-[100px]">Stock</th>
                        <th className="p-3 text-left w-[150px]">Bodega</th>
                        <th className="p-3 text-center w-[100px]">Activo</th>
                        <th className="p-3 text-center w-[150px] rounded-tr-xl">Acciones</th>
                    </tr>
                </thead>

                {/* FILAS */}
                <tbody>
                    {products.map((p, index) => (
                        
                        <tr 
                            key={p.idProducto} 
                            className={`border-b border-gray-100 transition duration-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}
                        >

                            {/* ID */}
                            <td className="p-3 font-mono">{p.idProducto}</td>

                            {/* IMAGEN */}
                            <td className="p-3">
                                {p.urlImagenProducto ? (
                                <img
                                    src={
                                        typeof p.urlImagenProducto === "string"
                                            ? p.urlImagenProducto
                                            : ""
                                        }
                                    alt={p.nombreProducto}
                                    // Usamos un placeholder genérico en caso de error de carga
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

                            {/* NOMBRE */}
                            <td className="p-3 font-semibold">{p.nombreProducto}</td>

                            {/* SKU */}
                            <td className="p-3 font-mono text-gray-500">{p.sku ?? "-"}</td>

                            {/* DESCRIPCIÓN */}
                            <td className="p-3 max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap text-gray-600" title={p.descripcionProducto ?? ""}>
                                {p.descripcionProducto ?? "-"}
                            </td>
                            
                            {/* PRECIO COMPRA (Costo Neto) */}
                            <td className="p-3 text-right font-bold">
                                {formatCurrency(p.precioCompraProducto)}
                            </td>

                            {/* IMPUESTO COMPRA */}
                            <td className="p-3 text-right text-gray-500">
                                {formatCurrency(p.impuestoCompra)}
                            </td>
                            
                            {/* PRECIO VENTA */}
                            <td className="p-3 text-right text-blue-700 font-bold">
                                {formatCurrency(p.precioVentaProducto)}
                            </td>
                            
                            {/* UTILIDAD (Ganancia Bruta) */}
                            <td className="p-3 text-right font-black bg-green-50 text-green-700">
                                {formatCurrency(p.utilidadProducto)}
                            </td>

                            {/* IMPUESTO VENTA */}
                            <td className="p-3 text-right text-gray-500">
                                {formatCurrency(p.impuestoVenta)}
                            </td>
                            
                            {/* CATEGORÍA (Nota: Asumo que la prop 'p' está enriquecida con estos datos) */}
                            <td className="p-3 text-xs text-gray-600 font-medium">
                                {p.categoria?.nombreCategoria ?? "Sin Asignar"}
                            </td>

                            {/* MARCA */}
                            <td className="p-3 text-xs text-gray-600 font-medium">
                                {p.marca?.nombreMarca ?? "Sin Asignar"}
                            </td>
                           {/* STOCK */}
                            <td className="p-3 text-right font-semibold text-gray-700">
                                {p.stock?.length ? p.stock[p.stock.length - 1].cantidad : 0}
                            </td>

                            {/* BODEGA */}
                            <td className="p-3 text-xs text-gray-600 font-medium">
                                {p.stock?.length
                                    ? p.stock[p.stock.length - 1].bodega?.nombre ?? "Sin Bodega"
                                    : "Sin Bodega"
                                }
                            </td>
                            {/* ESTADO */}
                            <td className="p-3 text-center">
                                {p.productoActivo ? (
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                    Activo
                                </span>
                                ) : (
                                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                                    Inactivo
                                </span>
                                )}
                            </td>

                            {/* ACCIONES */}
                            <td className="p-3 text-center space-x-2">
                                <button
                                onClick={() => onEdit(p.idProducto)}
                                className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition shadow-md"
                                title="Editar Producto"
                                >
                                Editar
                                </button>

                                <button
                                onClick={() => onDelete(p.idProducto)}
                                className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-md"
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