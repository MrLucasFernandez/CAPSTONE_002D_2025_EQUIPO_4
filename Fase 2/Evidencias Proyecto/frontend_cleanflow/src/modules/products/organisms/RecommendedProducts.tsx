import { useEffect, useState } from "react";
import axios from "axios";
import type { Producto } from "@models/product";
import FeaturedProductCard from "../molecules/FeaturedProductCard";

export default function RecommendedProducts() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function loadTopProducts() {
            try {
                console.log('🔍 Cargando productos recomendados...');

                const response = await axios.get(
                    "https://cleanflow-back-v0-1.onrender.com/productos?activo=true"
                );

                // Ordenar por ID descendente y tomar los últimos 6 productos agregados
                const todosProductos = response.data;
                const ultimosProductos = todosProductos
                    .sort((a: Producto, b: Producto) => b.idProducto - a.idProducto)
                    .slice(0, 6);

                setProductos(ultimosProductos);
            } catch (error) {
                console.error("❌ Error cargando productos recomendados:", error);
            } finally {
                setLoading(false);
            }
        }

        loadTopProducts();
    }, []);

    if (loading) {
        return (
            <section className="py-12 px-4 max-w-7xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                        Productos Recomendados
                    </h2>
                    <p className="text-gray-600 text-center">
                        Productos agregados recientemente
                    </p>
                </div>
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </section>
        );
    }

    if (productos.length === 0) {
        return null;
    }

    return (
        <section className="py-12 px-4 max-w-7xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                    Productos Recomendados
                </h2>
                <p className="text-gray-600 text-center">
                    Productos agregados recientemente
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {productos.map((producto) => (
                    <FeaturedProductCard key={producto.idProducto} producto={producto} />
                ))}
            </div>
        </section>
    );
}
