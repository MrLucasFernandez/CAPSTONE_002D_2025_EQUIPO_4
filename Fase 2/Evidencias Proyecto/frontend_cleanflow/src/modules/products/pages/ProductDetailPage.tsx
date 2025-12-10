import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getProductById } from "../api/productService";
import type { Producto } from "@models/product";
import { useCart } from '@/modules/cart/context/CartContext';
import RecommendedProducts from "../organisms/RecommendedProducts";

export default function ProductDetailPage() {
    const { idProducto } = useParams();
    const id = Number(idProducto);

    const [product, setProduct] = useState<Producto | null>(null);
    const [loading, setLoading] = useState(true);
    const { addItem, openSidebar } = useCart();

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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Imagen del producto */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                        <div className="flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white">
                            <img
                                src={imageUrl}
                                alt={product.nombreProducto}
                                className="max-w-full max-h-80 object-contain drop-shadow-lg"
                            />
                        </div>
                    </div>

                    {/* Información del producto */}
                    <div className="flex flex-col justify-center">
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                            
                            {/* Título */}
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                                {product.nombreProducto}
                            </h1>

                            {/* Categoría y Marca */}
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                                    {product.categoria?.nombreCategoria}
                                </span>
                                <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                                    {product.marca?.nombreMarca}
                                </span>
                            </div>

                            {/* Precio */}
                            <div className="mb-4 bg-gradient-to-r from-[#405562] to-[#2d3e48] text-white rounded-lg p-4 shadow-sm">
                                <p className="text-xs font-medium opacity-90 mb-1">Precio</p>
                                <p className="text-3xl font-bold">
                                    ${product.precioVentaProducto.toLocaleString('es-CL')}
                                </p>
                            </div>

                            {/* Descripción */}
                            <div className="mb-4">
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">Descripción</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {product.descripcionProducto || "Sin descripción disponible."}
                                </p>
                            </div>

                            {/* Detalles adicionales */}
                            <div className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <h3 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                    Información adicional
                                </h3>
                                <div className="space-y-1.5 text-xs text-gray-600">
                                    <div className="flex justify-between">
                                        <span className="font-medium">SKU:</span>
                                        <span>{product.sku || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Categoría:</span>
                                        <span>{product.categoria?.nombreCategoria}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Marca:</span>
                                        <span>{product.marca?.nombreMarca}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Botón de añadir al carrito */}
                            <button
                                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
                                onClick={() => {
                                    const price = Number(product.precioVentaProducto) || 0;
                                    addItem({
                                        id: String(product.idProducto),
                                        title: product.nombreProducto,
                                        price,
                                        quantity: 1,
                                        image: imageUrl,
                                    });
                                    openSidebar();
                                }}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Añadir al carrito
                            </button>
                        </div>
                    </div>

                </div>

                {/* Sección de productos recomendados */}
                <RecommendedProducts />
            </div>
        </div>
    );
}
