import { Link } from "react-router-dom";
import type { Producto } from "@models/product";
import { useCart } from '@/modules/cart/context/CartContext';
import { formatCLP } from '@/utils/currency';

export default function ProductCard({ product }: { product: Producto }) {
    const src = typeof product.urlImagenProducto === "string"
        ? product.urlImagenProducto
        : "/placeholder.png";

    return (
        <div className="group rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-transform duration-300 bg-white overflow-hidden flex flex-col">
            {/* Imagen con ratio */}
            <Link to={`/productos/${product.idProducto}`} className="block">
                <div className="relative w-full" style={{ paddingTop: "66.66%" }}>
                    <img
                        src={src}
                        alt={product.nombreProducto}
                        onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            if (target.src !== "/placeholder.png") target.src = "/placeholder.png";
                        }}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute left-3 top-3 bg-white/70 backdrop-blur rounded-full px-3 py-1 text-sm font-semibold text-[#163243]">
                        {formatCLP(product.precioVentaProducto)}
                    </div>
                </div>
            </Link>

            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                    {product.nombreProducto}
                </h3>

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
            className="inline-flex items-center justify-center bg-[#405562] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#2f4150] transition"
        >
            Añadir
        </button>
    );
}
