import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Categoria } from "@models/product";

export default function CategoriesPage() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        async function load() {
        try {
            const res = await fetch(
            "https://cleanflow-back-v0-1.onrender.com/categorias",
            { credentials: "include" }
            );
            const data = await res.json();
            setCategorias(data);
        } catch (err) {
            console.error("Error cargando categorías:", err);
        } finally {
            setLoading(false);
        }
        }
        load();
    }, []);

    async function handleDelete(id: number) {
        if (!confirm("¿Seguro que quieres eliminar esta categoría?")) return;

        try {
        const res = await fetch(
            `https://cleanflow-back-v0-1.onrender.com/categorias/${id}`,
            {
            method: "DELETE",
            credentials: "include",
            }
        );

        if (!res.ok) {
            alert("No se pudo eliminar la categoría.");
            return;
        }

        // actualizar lista sin recargar
        setCategorias((prev) => prev.filter((c) => c.idCategoria !== id));
        } catch (error) {
        console.error("Error eliminando categoría:", error);
        }
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
            <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
            Categorías
            </h1>

            <button
            onClick={() => navigate("/admin/categorias/crear")}
            className="
                px-5 py-2.5 rounded-full 
                text-white font-medium 
                bg-blue-600 hover:bg-blue-700 
                transition-all shadow-md hover:shadow-lg
            "
            >
            + Nueva Categoría
            </button>
        </div>

        {/* Loading */}
        {loading && (
            <p className="text-center text-gray-500 animate-pulse">
            Cargando categorías...
            </p>
        )}

        {/* Grid cards */}
        {!loading && (
            <div
            className="
                grid gap-6
                sm:grid-cols-2 
                lg:grid-cols-3
            "
            >
            {categorias.map((cat) => (
                <div
                key={cat.idCategoria}
                className="
                    bg-white rounded-2xl p-6 
                    border border-gray-200
                    shadow-sm hover:shadow-md
                    transition-all
                    flex flex-col justify-between
                "
                >
                {/* Top Info */}
                <div>
                    <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                    ID #{cat.idCategoria}
                    </span>

                    <h2 className="mt-3 text-xl font-semibold text-gray-800">
                    {cat.nombreCategoria}
                    </h2>

                    <p className="mt-2 text-sm text-gray-600">
                    {cat.descripcionCategoria || "Sin descripción"}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                    <button
                    onClick={() =>
                        navigate(`/admin/categorias/${cat.idCategoria}/editar`)
                    }
                    className="
                        flex-1 text-center text-sm py-2 
                        rounded-lg bg-blue-50 text-blue-700 
                        hover:bg-blue-100 transition
                    "
                    >
                    Editar
                    </button>

                    <button
                    onClick={() => handleDelete(cat.idCategoria)}
                    className="
                        flex-1 text-center text-sm py-2 
                        rounded-lg bg-red-50 text-red-600 
                        hover:bg-red-100 transition
                    "
                    >
                    Eliminar
                    </button>
                </div>
                </div>
            ))}

            {/* No Categories */}
            {categorias.length === 0 && (
                <p className="col-span-full text-center text-gray-500 py-10">
                No hay categorías registradas.
                </p>
            )}
            </div>
        )}
        </div>
    );
}
