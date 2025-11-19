import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getProductsByCategory } from "../api/productService";
import ProductGrid from "../components/ProductGrid";
import type { Producto } from "../../../types/product";

export default function ProductsByCategoryPage() {
    const { idCategoria } = useParams();
    const id = Number(idCategoria);

    const [products, setProducts] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProductsByCategory(id)
            .then(setProducts)
            .finally(() => setLoading(false));
    }, [id]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            
            <h1 className="text-3xl font-bold mb-8 text-center">
                Productos de la categoría {idCategoria}
            </h1>

            {loading ? (
                <p className="text-center text-gray-500">Cargando...</p>
            ) : products.length === 0 ? (
                <p className="text-center text-gray-500">No hay productos.</p>
            ) : (
                <ProductGrid products={products} />
            )}
        </div>
    );
}
