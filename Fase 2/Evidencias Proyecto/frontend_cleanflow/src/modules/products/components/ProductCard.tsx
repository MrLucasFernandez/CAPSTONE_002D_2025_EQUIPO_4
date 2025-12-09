import { Link } from "react-router-dom";
import type { Producto } from "@models/product";
import { useCart } from '@/modules/cart/context/CartContext';
import { formatCLP } from '@/utils/currency';
import ResponsiveImage from '@/components/atoms/ResponsiveImage/ResponsiveImage';

export default function ProductCard({ product }: { product: Producto }) {
    const src = typeof product.urlImagenProducto === "string"
        ? product.urlImagenProducto
        : "/placeholder.png";

    const totalStock = Array.isArray(product.stock)
        ? product.stock.reduce((sum, s) => sum + (s?.cantidad || 0), 0)
        : 0;

    return (
        <div className="group rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 bg-white overflow-hidden flex flex-col">
            {/* Imagen con contenedor responsive (componente reutilizable) */}
            <Link to={`/productos/${product.idProducto}`} className="block">
                <ResponsiveImage src={src} alt={product.nombreProducto} className="rounded-2xl" sizeClass="h-48 md:h-56 lg:h-64">
                    <div className="absolute left-3 top-3 bg-white/70 backdrop-blur rounded-full px-3 py-1 text-sm font-semibold text-[#163243]">
                        {formatCLP(product.precioVentaProducto)}
                    </div>
                </ResponsiveImage>
            </Link>

            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                    {product.nombreProducto}
                </h3>

                {totalStock <= 5 && (
                    <span className="mt-2 inline-flex items-center gap-2 w-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
                        Pocas unidades disponibles
                    </span>
                )}

                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{product.descripcionProducto}</p>
                <div className="mt-auto flex gap-3">
                    <Link
                        to={`/productos/${product.idProducto}`}
                        className="flex-1 inline-flex items-center justify-center border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:shadow-sm transition"
                    >
                        Ver Detalles
                    </Link>

                    <AddToCartButton product={product} img={src} />
                </div>
            </div>
        </div>
    );
}

function AddToCartButton({ product, img }: { product: Producto; img?: string }) {
    const { addItem, openSidebar } = useCart();

    const handleAdd = () => {
        addItem({
            id: String(product.idProducto),
            title: product.nombreProducto,
            price: Number(product.precioVentaProducto) || 0,
            quantity: 1,
            image: typeof product.urlImagenProducto === 'string' ? product.urlImagenProducto : img,
        });
        // abrir sidebar para dar feedback al usuario
        openSidebar();
    };

    return (
        <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center justify-center bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
            Añadir
        </button>
    );
}
