import { useEffect, useState } from "react";
import type { Producto } from "@models/product";
import FeaturedProductCard from "../molecules/FeaturedProductCard";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

export default function FeaturedProductsCarousel() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [direction, setDirection] = useState<'left' | 'right'>('right');
    const [itemsPerView, setItemsPerView] = useState(1);

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

                // Tomar los 8 productos con más stock
                const topProducts = productsWithStock
                    .sort((a, b) => b.totalStock - a.totalStock)
                    .slice(0, 8);

                setProductos(topProducts);
            } catch (error) {
                console.error("Error cargando productos destacados:", error);
            } finally {
                setLoading(false);
            }
        }

        loadFeaturedProducts();
    }, []);

    useEffect(() => {
        const updateItemsPerView = () => {
            const width = window.innerWidth;
            if (width < 640) {
                setItemsPerView(1);
            } else if (width < 1024) {
                setItemsPerView(2);
            } else {
                setItemsPerView(4);
            }
        };

        updateItemsPerView();
        window.addEventListener('resize', updateItemsPerView);
        return () => window.removeEventListener('resize', updateItemsPerView);
    }, []);

    const handlePrev = () => {
        if (isAnimating) return;
        setDirection('left');
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev === 0 ? productos.length - 1 : prev - 1));
        setTimeout(() => setIsAnimating(false), 500);
    };

    const handleNext = () => {
        if (isAnimating) return;
        setDirection('right');
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev === productos.length - 1 ? 0 : prev + 1));
        setTimeout(() => setIsAnimating(false), 500);
    };

    // Obtener los productos visibles según el índice actual y el viewport
    const getVisibleProducts = () => {
        if (productos.length === 0) return [];
        const count = Math.min(itemsPerView, productos.length);
        const visible = [];
        for (let i = 0; i < count; i++) {
            const index = (currentIndex + i) % productos.length;
            visible.push(productos[index]);
        }
        return visible;
    };

    const visibleProducts = getVisibleProducts();

    return (
        <section className="py-16 px-4 max-w-7xl mx-auto">
            <div className="mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-2 text-center">
                    Productos Destacados
                </h2>
                <p className="text-gray-600 text-center text-lg">
                    Los productos con mayor disponibilidad en stock
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
                <div className="relative overflow-hidden">
                    {/* Botón Anterior */}
                    <button
                        onClick={handlePrev}
                        disabled={isAnimating}
                        className="absolute left-2 lg:left-0 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-blue-50 shadow-xl rounded-full p-3 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-blue-100"
                        aria-label="Producto anterior"
                    >
                        <ChevronLeftIcon className="w-6 h-6 text-blue-600" />
                    </button>

                    {/* Contenedor de productos con animación */}
                    <div className="relative px-4 lg:px-16">
                        <div className="overflow-hidden">
                            <div 
                                className={`
                                    grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center
                                    transition-all duration-500 ease-in-out
                                    ${isAnimating ? (direction === 'right' ? 'opacity-0 translate-x-8' : 'opacity-0 -translate-x-8') : 'opacity-100 translate-x-0'}
                                `}
                            >
                                {visibleProducts.map((product, idx) => (
                                    <div 
                                        key={`${product.idProducto}-${currentIndex}-${idx}`}
                                        className={`
                                            w-full max-w-xs
                                            transition-all duration-500 ease-out
                                            ${isAnimating ? 'scale-95' : 'scale-100'}
                                        `}
                                        style={{
                                            transitionDelay: `${idx * 50}ms`
                                        }}
                                    >
                                        <FeaturedProductCard producto={product} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Botón Siguiente */}
                    <button
                        onClick={handleNext}
                        disabled={isAnimating}
                        className="absolute right-2 lg:right-0 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-blue-50 shadow-xl rounded-full p-3 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-blue-100"
                        aria-label="Producto siguiente"
                    >
                        <ChevronRightIcon className="w-6 h-6 text-blue-600" />
                    </button>

                    {/* Indicadores de posición */}
                    <div className="flex justify-center gap-2 mt-10">
                        {productos.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    if (!isAnimating && idx !== currentIndex) {
                                        setDirection(idx > currentIndex ? 'right' : 'left');
                                        setIsAnimating(true);
                                        setCurrentIndex(idx);
                                        setTimeout(() => setIsAnimating(false), 500);
                                    }
                                }}
                                disabled={isAnimating}
                                className={`
                                    h-2.5 rounded-full transition-all duration-300
                                    ${idx === currentIndex 
                                        ? 'w-10 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg' 
                                        : 'w-2.5 bg-gray-300 hover:bg-gray-400 hover:w-4'
                                    }
                                    disabled:cursor-not-allowed
                                `}
                                aria-label={`Ir a producto ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
