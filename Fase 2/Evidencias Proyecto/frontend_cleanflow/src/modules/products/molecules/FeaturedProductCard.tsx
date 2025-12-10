import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Producto } from "@models/product";
import { EyeIcon, ShoppingCartIcon } from "@heroicons/react/24/solid";
import { useCart } from "@/modules/cart/context/CartContext";

interface Props {
    producto: Producto;
}

export default function FeaturedProductCard({ producto }: Props) {
    const navigate = useNavigate();
    const { addItem, openSidebar } = useCart();
    const [views, setViews] = useState(0);
    
    // Cargar vistas desde localStorage al montar
    useEffect(() => {
        const storedViews = localStorage.getItem(`product_views_${producto.idProducto}`);
        if (storedViews) {
            setViews(parseInt(storedViews));
        }
    }, [producto.idProducto]);

    const imagenUrl = typeof producto.urlImagenProducto === 'string' 
        ? producto.urlImagenProducto 
        : "https://via.placeholder.com/300x300?text=Sin+imagen";
    const totalStock = producto.stock?.reduce((sum: number, s: any) => sum + (s.cantidad || 0), 0) || 0;
    const precioFormato = producto.precioVentaProducto ? `$${producto.precioVentaProducto.toLocaleString('es-ES')}` : "N/A";

    const handleClick = () => {
        // Incrementar vistas en localStorage
        const newViews = views + 1;
        setViews(newViews);
        localStorage.setItem(`product_views_${producto.idProducto}`, newViews.toString());
        navigate(`/productos/${producto.idProducto}`);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (totalStock > 0) {
            addItem({
                id: producto.idProducto.toString(),
                title: producto.nombreProducto,
                price: producto.precioVentaProducto,
                quantity: 1,
                image: imagenUrl,
            });
            openSidebar();
        }
    };

    return (
        <button
            onClick={handleClick}
            className="
                w-full max-w-xs
                rounded-2xl
                overflow-hidden
                bg-white
                shadow-lg
                transition-all
                duration-300
                hover:shadow-xl
                hover:-translate-y-1
                group
                border border-gray-100
            "
        >
            {/* Imagen contenedor */}
            <div className="relative overflow-hidden bg-gray-100 h-48 w-full flex items-center justify-center">
                <img
                    src={imagenUrl}
                    alt={producto.nombreProducto}
                    className="
                        w-full h-full 
                        object-contain
                        transition-transform 
                        duration-300 
                        group-hover:scale-105
                    "
                />
                
                {/* Badge de stock */}
                <div className="absolute top-2 right-2 z-20">
                    <div className={`
                        px-2 py-1 rounded-full 
                        font-bold text-xs
                        shadow
                        ${totalStock > 5 
                            ? 'bg-emerald-500 text-white' 
                            : totalStock > 0 
                            ? 'bg-amber-500 text-white' 
                            : 'bg-red-500 text-white'
                        }
                    `}>
                        {totalStock > 0 ? `Stock: ${totalStock}` : 'Agotado'}
                    </div>
                </div>
            </div>

            {/* Contenido */}
            <div className="p-4 space-y-3">
                {/* Categoría */}
                {producto.categoria && (
                    <div className="flex items-center">
                        <span className="
                            inline-block px-2 py-1 
                            text-xs font-medium 
                            bg-blue-100 text-blue-700 
                            rounded-full
                        ">
                            {producto.categoria.nombreCategoria}
                        </span>
                    </div>
                )}

                {/* Nombre */}
                <h3 className="
                    text-base font-bold 
                    text-gray-800 
                    text-left 
                    line-clamp-2
                    group-hover:text-blue-600
                    transition-colors duration-300
                ">
                    {producto.nombreProducto}
                </h3>

                {/* Vistas reales */}
                <div className="flex items-center gap-1 text-xs text-gray-500">
                    <EyeIcon className="w-4 h-4" />
                    <span>{views} vistas</span>
                </div>

                {/* Descripción */}
                <p className="
                    text-gray-600 
                    text-xs
                    text-left 
                    line-clamp-2
                ">
                    {producto.descripcionProducto || "Producto de calidad"}
                </p>

                {/* Precio */}
                <div className="flex items-end justify-between gap-2 pt-2 border-t border-gray-100">
                    <span className="
                        text-xl font-bold 
                        bg-gradient-to-r from-blue-600 to-purple-600 
                        bg-clip-text 
                        text-transparent
                    ">
                        {precioFormato}
                    </span>
                    <div
                        onClick={handleAddToCart}
                        className={`
                            p-2 rounded-lg
                            transition-all duration-300
                            ${totalStock > 0
                                ? 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-110 cursor-pointer'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }
                        `}
                    >
                        <ShoppingCartIcon className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </button>
    );
}
