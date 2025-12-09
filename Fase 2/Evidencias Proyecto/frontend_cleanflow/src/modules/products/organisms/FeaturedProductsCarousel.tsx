import { useEffect, useState } from "react";
import type { Producto } from "@models/product";
import FeaturedProductCard from "../molecules/FeaturedProductCard";

export default function FeaturedProductsCarousel() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadFeaturedProducts() {
            try {
                // Obtener todos los productos activos
                const res = await fetch(
                    "https://cleanflow-back-v0-1.onrender.com/productos?activo=true",
                    { credentials: "include" }
                );
                const data: Producto[] = await res.json();

                // Calcular stock total por producto y ordenar por stock descendente
                const productsWithStock = data.map(product => ({
                    ...product,
                    totalStock: product.stock?.reduce((sum: number, s: any) => sum + (s.cantidad || 0), 0) || 0
                }));

                // Tomar los 3 productos con más stock
                const topProducts = productsWithStock
                    .sort((a, b) => b.totalStock - a.totalStock)
                    .slice(0, 3);

                setProductos(topProducts);
            } catch (error) {
                console.error("Error cargando productos destacados:", error);
            } finally {
                setLoading(false);
            }
        }

        loadFeaturedProducts();
    }, []);

    return (
        <section className="py-16 px-4 max-w-7xl mx-auto">
            <div className="mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-2 text-center">
                    Productos Destacados
                </h2>
                <p className="text-gray-600 text-center text-lg">
                    Los 3 productos con mayor disponibilidad en stock
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin">
                        <div className="h-12 w-12 border-4 border-blue-500 border-t-purple-600 rounded-full"></div>
                    </div>
                </div>
            ) : productos.length === 0 ? (
                <p className="text-gray-500 text-center text-lg">No hay productos disponibles</p>
            ) : (
                <div className="flex flex-wrap justify-center gap-8">
                    {productos.map((product) => (
                        <div key={product.idProducto} className="flex justify-center">
                            <FeaturedProductCard producto={product} />
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
