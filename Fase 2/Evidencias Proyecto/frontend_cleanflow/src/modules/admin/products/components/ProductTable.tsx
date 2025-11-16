import type { Producto } from "../../../../types/product";

interface ProductTableProps {
    products: Producto[];
    onEdit: (idProducto: number) => void;
    onDelete: (idProducto: number) => void;
    }

    export default function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
    return (
        <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="w-full min-w-[900px] text-sm text-gray-800">

            {/* ENCABEZADOS */}
            <thead className="bg-gray-200 font-semibold">
            <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Imagen</th>
                <th className="p-3 text-left">Nombre</th>
                <th className="p-3 text-left">Precio Venta</th>
                <th className="p-3 text-left">Categoría</th>
                <th className="p-3 text-left">Marca</th>
                <th className="p-3 text-left">Activo</th>
                <th className="p-3 text-center">Acciones</th>
            </tr>
            </thead>

            {/* FILAS */}
            <tbody>
            {products.map((p) => (
                <tr key={p.idProducto} className="border-b hover:bg-gray-50">

                {/* ID */}
                <td className="p-3">{p.idProducto}</td>

                {/* IMAGEN */}
                <td className="p-3">
                    {p.urlImagenProducto ? (
                    <img
                        src={p.urlImagenProducto}
                        alt={p.nombreProducto}
                        className="w-16 h-16 object-cover rounded border"
                    />
                    ) : (
                    <span className="text-gray-400 italic">Sin imagen</span>
                    )}
                </td>

                {/* NOMBRE */}
                <td className="p-3 font-medium">{p.nombreProducto}</td>

                {/* PRECIO VENTA */}
                <td className="p-3">${p.precioVentaProducto}</td>

                {/* CATEGORÍA */}
                <td className="p-3">{p.categoria?.nombreCategoria ?? "-"}</td>

                {/* MARCA */}
                <td className="p-3">{p.marca?.nombreMarca ?? "-"}</td>

                {/* ESTADO */}
                <td className="p-3">
                    {p.productoActivo ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        Activo
                    </span>
                    ) : (
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                        Inactivo
                    </span>
                    )}
                </td>

                {/* ACCIONES */}
                <td className="p-3 text-center space-x-2">
                    <button
                    onClick={() => onEdit(p.idProducto)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                    Editar
                    </button>

                    <button
                    onClick={() => onDelete(p.idProducto)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                    Eliminar
                    </button>
                </td>

                </tr>
            ))}
            </tbody>

        </table>

        {products.length === 0 && (
            <p className="text-center py-4 text-gray-600">No hay productos registrados.</p>
        )}
        </div>
    );
}
