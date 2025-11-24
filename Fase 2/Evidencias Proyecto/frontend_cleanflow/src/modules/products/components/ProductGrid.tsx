import ProductCard from "./ProductCard";
import type { Producto } from "@models/product";

export default function ProductGrid({ products }: { products: Producto[] }) {
    return (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
                <ProductCard key={p.idProducto} product={p} />
            ))}
        </div>
    );
}
