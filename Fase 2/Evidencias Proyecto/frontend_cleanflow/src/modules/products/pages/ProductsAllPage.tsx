import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getPublicProducts } from "../api/productService";
import ProductGrid from "../components/ProductGrid";
import Pagination from '@/components/atoms/Pagination/Pagination';
import type { Producto } from "@models/product";

export default function ProductsAllPage() {
    const [products, setProducts] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';

    useEffect(() => {
        getPublicProducts()
            .then((list) => {
                // Excluir productos cuyas categorías o marcas estén inactivas
                const filtered = list.filter(
                    (p) => p.categoria?.categoriaActiva !== false && p.marca?.marcaActiva !== false,
                );
                setProducts(filtered);
            })
            .finally(() => setLoading(false));
    }, []);

    const filtered = products.filter((p) =>
        p.nombreProducto.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const ITEMS_PER_PAGE = 12;
    const [page, setPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const start = (page - 1) * ITEMS_PER_PAGE;
    const paged = filtered.slice(start, start + ITEMS_PER_PAGE);

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">

            <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-900">
                {searchQuery ? `Resultados para "${searchQuery}"` : 'Todos los Productos'}
            </h1>

            {loading ? (
                <p className="text-center text-gray-500">Cargando...</p>
            ) : (
                <>
                    {filtered.length === 0 ? (
                        <p className="text-center text-gray-500">No se encontraron productos.</p>
                    ) : (
                        <>
                            <ProductGrid products={paged} />
                            {filtered.length > ITEMS_PER_PAGE && (
                                <Pagination current={page} totalPages={totalPages} onChange={(p) => setPage(p)} />
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}
