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

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Título */}
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
            Categorías
            </h1>

            <button
            onClick={() => navigate("/admin/categorias/crear")}
            className="
                px-4 py-2 rounded-lg text-white bg-blue-600
                hover:bg-blue-700 transition-colors
            "
            >
            + Nueva Categoría
            </button>
        </div>

        {/* Cargando */}
        {loading && (
            <p className="text-center text-gray-500">Cargando categorías...</p>
        )}

        {/* Tabla */}
        {!loading && (
            <div className="overflow-x-auto border rounded-xl bg-white shadow-sm">
            <table className="min-w-full">
                <thead className="bg-gray-100 text-left">
                <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                    ID
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                    Nombre
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                    Descripción
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                    Estado
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                    Acciones
                    </th>
                </tr>
                </thead>

                <tbody>
                {categorias.map((cat) => (
                    <tr key={cat.idCategoria} className="border-t">
                    <td className="px-4 py-3 text-sm">{cat.idCategoria}</td>
                    <td className="px-4 py-3 text-sm">{cat.nombreCategoria}</td>
                    <td className="px-4 py-3 text-sm">
                        {cat.descripcionCategoria || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm flex gap-3">
                        <button
                        onClick={() =>
                            navigate(`/admin/categorias/${cat.idCategoria}/editar`)
                        }
                        className="text-blue-600 hover:underline"
                        >
                        Editar
                        </button>

                        <button
                        onClick={() =>
                            navigate(`/admin/categorias/${cat.idCategoria}`)
                        }
                        className="text-gray-600 hover:underline"
                        >
                        Ver
                        </button>
                    </td>
                    </tr>
                ))}

                {categorias.length === 0 && (
                    <tr>
                    <td
                        colSpan={5}
                        className="text-center py-6 text-gray-500 text-sm"
                    >
                        No hay categorías registradas.
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>
        )}
        </div>
    );
}
