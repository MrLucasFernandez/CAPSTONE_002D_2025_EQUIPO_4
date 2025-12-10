import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getProductsByCategory } from "../api/productService";
import type { Producto } from "@models/product";
import ProductGrid from "../components/ProductGrid";
import Pagination from '@/components/atoms/Pagination/Pagination';

import { getCategoryById } from "../api/productService"; // o categoryService
import type { Categoria } from "@models/product";

export default function ProductsByCategoryPage() {
    const { idCategoria } = useParams();
    const id = Number(idCategoria);

    const [products, setProducts] = useState<Producto[]>([]);
    const [category, setCategory] = useState<Categoria | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
        try {
            const [categoryRes, productRes] = await Promise.all([
            getCategoryById(id),
            getProductsByCategory(id),
            ]);

            setCategory(categoryRes);
            setProducts(productRes);
        } finally {
            setLoading(false);
        }
        }

        load();
    }, [id]);

    const ITEMS_PER_PAGE = 12;
    const [page, setPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));
    const start = (page - 1) * ITEMS_PER_PAGE;
    const paged = products.slice(start, start + ITEMS_PER_PAGE);

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">

        <h1 className="text-3xl font-bold mb-8 text-center">
            {category ? category.nombreCategoria : "Cargando categoría..."}
        </h1>

        {loading ? (
            <p className="text-center text-gray-500">Cargando...</p>
        ) : products.length === 0 ? (
            <p className="text-center text-gray-500">No hay productos.</p>
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
