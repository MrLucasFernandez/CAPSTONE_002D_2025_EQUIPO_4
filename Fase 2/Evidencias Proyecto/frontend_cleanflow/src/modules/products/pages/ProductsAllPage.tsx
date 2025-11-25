import { useEffect, useState } from "react";
import { getPublicProducts } from "../api/productService";
import ProductGrid from "../components/ProductGrid";
import type { Producto } from "@models/product";

export default function ProductsAllPage() {
    const [products, setProducts] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPublicProducts()
            .then(setProducts)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            
            <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-900">
                Todos los Productos
            </h1>

            {loading ? (
                <p className="text-center text-gray-500">Cargando...</p>
            ) : (
                <ProductGrid products={products} />
            )}
        </div>
    );
}
