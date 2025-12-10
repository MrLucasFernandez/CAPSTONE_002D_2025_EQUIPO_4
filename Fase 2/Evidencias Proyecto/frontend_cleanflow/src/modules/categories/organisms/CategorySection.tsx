// src/modules/categories/organisms/CategoriesSection.tsx
import { useEffect, useState } from "react";
import CategoryGrid from "../molecules/CategoryGrid";
import type { Categoria } from "@models/product";
import { getPublicCategorias, getPublicProducts } from "@modules/products/api/productService";

export default function CategoriesSection() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
        try {
            // Obtener categorías y productos activos
            const [categoriesData, productsData] = await Promise.all([
                getPublicCategorias(),
                getPublicProducts(),
            ]);

            // Contar productos por categoría (solo activos)
            const categoryProductCount = new Map<number, number>();
            
            productsData.forEach(product => {
                if (product.idCategoria) {
                    const count = categoryProductCount.get(product.idCategoria) || 0;
                    categoryProductCount.set(product.idCategoria, count + 1);
                }
            });

            // Ordenar categorías por cantidad de productos (descendente) y tomar las 3 primeras
            const topCategories = categoriesData
                .sort((a: Categoria, b: Categoria) => {
                    const countA = categoryProductCount.get(a.idCategoria) || 0;
                    const countB = categoryProductCount.get(b.idCategoria) || 0;
                    return countB - countA;
                })
                .slice(0, 3);

            setCategorias(topCategories);
        } catch (error) {
            console.error("Error cargando categorías:", error);
        } finally {
            setLoading(false);
        }
        }

        load();
    }, []);

    return (
        <section className="py-10 px-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Categorías destacadas
        </h2>

        {loading ? (
            <p className="text-gray-500">Cargando categorías...</p>
        ) : (
            <CategoryGrid categorias={categorias} />
        )}
        </section>
    );
}
