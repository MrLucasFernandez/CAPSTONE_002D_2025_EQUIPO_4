// src/modules/categories/organisms/CategoriesSection.tsx
import { useEffect, useState } from "react";
import CategoryGrid from "../molecules/CategoryGrid";
import type { Categoria } from "@models/product";

export default function CategoriesSection() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
        try {
            const res = await fetch(
            "https://cleanflow-back-v0-1.onrender.com/categorias",
            { credentials: "include" }
            );
            const data = await res.json();
            setCategorias(data);
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
