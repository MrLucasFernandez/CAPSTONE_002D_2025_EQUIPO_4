import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getProductsByMarca, getBrandById } from "../api/productService";
import type { Producto, Marca } from "@models/product";
import ProductGrid from "../components/ProductGrid";
import Pagination from '@/components/atoms/Pagination/Pagination';

export default function ProductsByBrandPage() {
    const { idMarca } = useParams();
    const id = Number(idMarca);

    const [products, setProducts] = useState<Producto[]>([]);
    const [brand, setBrand] = useState<Marca | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const [brandRes, productRes] = await Promise.all([
                    getBrandById(id),
                    getProductsByMarca(id),
                ]);

                setBrand(brandRes);
                setProducts(productRes);
            } finally {
                setLoading(false);
            }
        }

        if (!Number.isNaN(id) && id > 0) {
            load();
        } else {
            setLoading(false);
        }
    }, [id]);

    const ITEMS_PER_PAGE = 12;
    const [page, setPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));
    const start = (page - 1) * ITEMS_PER_PAGE;
    const paged = products.slice(start, start + ITEMS_PER_PAGE);

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">

        <h1 className="text-3xl font-bold mb-8 text-center">
            {brand ? brand.nombreMarca : "Cargando marca..."}
        </h1>

        {loading ? (
            <p className="text-center text-gray-500">Cargando...</p>
        ) : products.length === 0 ? (
            <p className="text-center text-gray-500">No hay productos relacionados a esta marca.</p>
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
