import { Link } from "react-router-dom";
import type { Producto } from "@models/product";

export default function ProductCard({ product }: { product: Producto }) {
    
    const imageUrl =
        typeof product.urlImagenProducto === "string"
            ? product.urlImagenProducto
            : "/placeholder.png";

    return (
        <div className="rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition duration-300 bg-white overflow-hidden flex flex-col">
            
            {/* Imagen */}
            <Link to={`/productos/${product.idProducto}`}>
                <img
                    src={imageUrl}
                    alt={product.nombreProducto}
                    className="h-48 w-full object-cover"
                />
            </Link>

            <div className="p-4 flex flex-col flex-1">
                
                {/* Nombre */}
                <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                    {product.nombreProducto}
                </h3>

                {/* Precio */}
                <p className="mt-2 text-[#405562] text-xl font-bold">
                    ${product.precioVentaProducto}
                </p>

                {/* Botón */}
                <Link
                    to={`/productos/${product.idProducto}`}
                    className="mt-auto bg-[#405562] text-white text-center py-2 rounded-lg hover:bg-[#2f4150] transition"
                >
                    Ver Detalles
                </Link>
            </div>
        </div>
    );
}
