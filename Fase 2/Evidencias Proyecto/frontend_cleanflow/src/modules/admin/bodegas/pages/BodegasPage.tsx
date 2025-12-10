import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBodegas } from "../api/adminBodegasService";
import type { Bodega } from "@models/product";
import Toast from "@/components/ui/Toast";

export default function BodegasPage() {
    const navigate = useNavigate();
    const [bodegas, setBodegas] = useState<Bodega[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    useEffect(() => {
        async function load() {
        try {
            const data = await fetchBodegas();
            setBodegas(data);
        } catch (err) {
            setToast({ message: (err as Error).message || "Error al cargar bodegas", type: "error" });
        } finally {
            setLoading(false);
        }
        }
        load();
    }, []);

    const filtered = useMemo(() => {
        if (!search.trim()) return bodegas;
        return bodegas.filter((b) => b.nombre.toLowerCase().includes(search.toLowerCase()));
    }, [bodegas, search]);

    if (loading) return <p className="p-6">Cargando bodegas...</p>;

    return (
        <div className="p-6">
        {toast && (
            <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
            duration={toast.type === "success" ? 2000 : 4000}
            />
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
            <h1 className="text-3xl font-bold text-gray-800">Bodegas</h1>
            <p className="text-gray-500">Listado de bodegas registradas.</p>
            </div>
            <div className="flex items-center gap-2">
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={() => navigate("/admin/bodegas/crear")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
                + Crear Bodega
            </button>
            </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Dirección</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-700 text-center">Acciones</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {filtered.map((bodega) => (
                    <tr key={bodega.idBodega} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">#{bodega.idBodega}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{bodega.nombre}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{bodega.direccion || bodega.direccionBodega || "-"}</td>
                    <td className="px-6 py-4 text-sm text-center align-middle">
                        <button
                        onClick={() => navigate(`/admin/bodegas/${bodega.idBodega}/editar`)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 active:scale-95 transition-all ring-1 ring-blue-200 hover:ring-blue-300"
                        >
                        Editar
                        </button>
                    </td>
                    </tr>
                ))}
                {filtered.length === 0 && (
                    <tr>
                    <td colSpan={4} className="text-center py-10 text-gray-400">
                        No se encontraron bodegas.
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>
        </div>
        </div>
    );
}
