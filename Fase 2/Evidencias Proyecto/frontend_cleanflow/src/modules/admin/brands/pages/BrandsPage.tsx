import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Marca } from "@models/product";

export default function BrandsPage() {
    const [marcas, setMarcas] = useState<Marca[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch("https://cleanflow-back-v0-1.onrender.com/marcas", {
                    credentials: "include",
                });
                const data = await res.json();
                setMarcas(data);
            } catch (err) {
                console.error("Error cargando marcas:", err);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    async function handleDelete(id: number) {
        if (!confirm("¿Seguro que quieres eliminar esta marca?")) return;

        try {
            const res = await fetch(`https://cleanflow-back-v0-1.onrender.com/marcas/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) {
                alert("No se pudo eliminar la marca.");
                return;
            }

            setMarcas((prev) => prev.filter((m) => m.idMarca !== id));
        } catch (error) {
            console.error("Error eliminando marca:", error);
        }
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="flex items-center justify-between mb-10">
                <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Marcas</h1>

                <button
                    onClick={() => navigate("/admin/marcas/crear")}
                    className="px-5 py-2.5 rounded-full text-white font-medium bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                >
                    + Nueva Marca
                </button>
            </div>

            {loading && <p className="text-center text-gray-500 animate-pulse">Cargando marcas...</p>}

            {!loading && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {marcas.map((marca) => (
                        <div key={marca.idMarca} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                            <div>
                                <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">ID #{marca.idMarca}</span>
                                <h2 className="mt-3 text-xl font-semibold text-gray-800">{marca.nombreMarca}</h2>
                                <p className="mt-2 text-sm text-gray-600">{marca.descripcionMarca || 'Sin descripción'}</p>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button onClick={() => navigate(`/admin/marcas/${marca.idMarca}/editar`)} className="flex-1 text-center text-sm py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition">Editar</button>
                                <button onClick={() => handleDelete(marca.idMarca)} className="flex-1 text-center text-sm py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition">Eliminar</button>
                            </div>
                        </div>
                    ))}

                    {marcas.length === 0 && (
                        <p className="col-span-full text-center text-gray-500 py-10">No hay marcas registradas.</p>
                    )}
                </div>
            )}
        </div>
    );
}
