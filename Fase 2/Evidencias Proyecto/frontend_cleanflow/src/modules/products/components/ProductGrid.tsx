import ProductCard from "./ProductCard";
import type { Producto } from "@models/product";

export default function ProductGrid({ products }: { products: Producto[] }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 justify-items-center">
            {products.map((p) => (
                <ProductCard key={p.idProducto} product={p} />
            ))}
        </div>
    );
}
