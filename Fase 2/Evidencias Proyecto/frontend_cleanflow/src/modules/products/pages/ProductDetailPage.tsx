import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getProductById } from "../api/productService";
import type { Producto } from "@models/product";

export default function ProductDetailPage() {
    const { idProducto } = useParams();
    const id = Number(idProducto);

    const [product, setProduct] = useState<Producto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProductById(id)
            .then(setProduct)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading)
        return <p className="text-center py-10 text-gray-500">Cargando producto...</p>;

    if (!product)
        return <p className="text-center py-10 text-gray-500">Producto no encontrado.</p>;

    const imageUrl =
        typeof product.urlImagenProducto === "string"
            ? product.urlImagenProducto
            : "/placeholder.png";

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                {/* Imagen */}
                <div>
                    <img
                        src={imageUrl}
                        alt={product.nombreProducto}
                        className="w-full h-[420px] object-cover rounded-2xl shadow-md"
                    />
                </div>

                {/* Información */}
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        {product.nombreProducto}
                    </h1>

                    <p className="text-3xl text-[#405562] font-extrabold mb-6">
                        ${product.precioVentaProducto}
                    </p>

                    <p className="text-gray-700 mb-6 leading-relaxed">
                        {product.descripcionProducto || "Sin descripción."}
                    </p>

                    <div className="mb-8 text-gray-700 space-y-1">
                        <p><strong>Categoría:</strong> {product.categoria?.nombreCategoria}</p>
                        <p><strong>Marca:</strong> {product.marca?.nombreMarca}</p>
                        <p><strong>SKU:</strong> {product.sku || "N/A"}</p>
                    </div>

                    <button className="px-6 py-3 bg-[#405562] text-white rounded-lg hover:bg-[#2f4150] w-full lg:w-auto transition">
                        Añadir al carrito
                    </button>
                </div>

            </div>
        </div>
    );
}
