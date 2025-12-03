import { useEffect, useState } from "react";
import { getPublicProducts } from "../api/productService";
import ProductGrid from "../components/ProductGrid";
import Pagination from '@/components/atoms/Pagination/Pagination';
import type { Producto } from "@models/product";

export default function ProductsAllPage() {
    const [products, setProducts] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPublicProducts()
            .then(setProducts)
            .finally(() => setLoading(false));
    }, []);

    const ITEMS_PER_PAGE = 12;
    const [page, setPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));
    const start = (page - 1) * ITEMS_PER_PAGE;
    const paged = products.slice(start, start + ITEMS_PER_PAGE);

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">

            <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-900">
                Todos los Productos
            </h1>

            {loading ? (
                <p className="text-center text-gray-500">Cargando...</p>
            ) : (
                <>
                    <ProductGrid products={paged} />
                    {products.length > ITEMS_PER_PAGE && (
                        <Pagination current={page} totalPages={totalPages} onChange={(p) => setPage(p)} />
                    )}
                </>
            )}
        </div>
    );
}
