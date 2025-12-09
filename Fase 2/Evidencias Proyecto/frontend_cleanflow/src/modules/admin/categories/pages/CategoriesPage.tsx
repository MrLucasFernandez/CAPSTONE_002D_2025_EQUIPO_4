import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { Categoria } from "@models/product";
import { fetchAdminCategories, updateCategory } from "../api/adminCategoryService";
import Modal from "@components/ui/Modal";
import Toast from "@components/ui/Toast";
import AdminTable from "@components/tables/AdminTable";
import AdminFilters from "@components/tables/AdminFilters";
import AdminPagination from "@components/tables/AdminPagination";

export default function CategoriesPage() {
    const navigate = useNavigate();
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);

    // Filtros
    const [searchNombre, setSearchNombre] = useState("");
    const [filterEstado, setFilterEstado] = useState<string>("all"); // "all", "active", "inactive"
    const [sortById, setSortById] = useState<"ASC" | "DESC">("DESC");

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Modal y toast
    const [isActionModalOpen, setActionModalOpen] = useState(false);
    const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
    const [actionType, setActionType] = useState<"activate" | "deactivate" | null>(null);
    const [actionMessage, setActionMessage] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);
    const [showActionToast, setShowActionToast] = useState(false);

    // Cargar categorías
    useEffect(() => {
        async function load() {
            try {
                const data = await fetchAdminCategories();
                setCategorias(data);
            } catch (err) {
                console.error("Error cargando categorías:", err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    // Filtrado
    const filteredCategorias = useMemo(() => {
        let filtered = [...categorias];

        if (searchNombre.trim()) {
            filtered = filtered.filter((c) =>
                c.nombreCategoria.toLowerCase().includes(searchNombre.toLowerCase())
            );
        }

        if (filterEstado === "active") {
            filtered = filtered.filter((c) => c.categoriaActiva === true);
        } else if (filterEstado === "inactive") {
            filtered = filtered.filter((c) => c.categoriaActiva === false);
        }

        filtered.sort((a, b) => {
            if (sortById === "ASC") {
                return a.idCategoria - b.idCategoria;
            } else {
                return b.idCategoria - a.idCategoria;
            }
        });

        return filtered;
    }, [categorias, searchNombre, filterEstado, sortById]);

    // Paginación
    const totalPages = Math.ceil(filteredCategorias.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedCategorias = filteredCategorias.slice(startIndex, endIndex);

    useMemo(() => {
        setCurrentPage(1);
    }, [searchNombre, filterEstado, sortById]);

    const clearFilters = () => {
        setSearchNombre("");
        setFilterEstado("all");
        setSortById("DESC");
        setCurrentPage(1);
    };

    const openActionModal = (categoria: Categoria, type: "activate" | "deactivate") => {
        setSelectedCategoria(categoria);
        setActionType(type);
        setActionModalOpen(true);
    };

    const confirmAction = async () => {
        if (!selectedCategoria || !actionType) return;

        try {
            await updateCategory(selectedCategoria.idCategoria, {
                nombreCategoria: selectedCategoria.nombreCategoria,
                descripcionCategoria: selectedCategoria.descripcionCategoria,
                categoriaActiva: actionType === "activate",
            });

            setCategorias((prev) =>
                prev.map((c) =>
                    c.idCategoria === selectedCategoria.idCategoria
                        ? { ...c, categoriaActiva: actionType === "activate" }
                        : c
                )
            );

            setActionMessage({
                message: `Categoría ${actionType === "activate" ? "activada" : "desactivada"} correctamente.`,
                type: "success",
            });
            setShowActionToast(true);
            
            // Recargar la página después de desactivar para que se actualicen los productos
            if (actionType === "deactivate") {
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        } catch (err) {
            setActionMessage({
                message: "Error: " + (err as Error).message,
                type: "error",
            });
            setShowActionToast(true);
        }
        setActionModalOpen(false);
    };

    if (loading) return <p className="p-6">Cargando categorías...</p>;

    const tableColumns = [
        {
            key: "idCategoria" as const,
            label: "ID",
            render: (id: number) => `#${id}`,
        },
        {
            key: "nombreCategoria" as const,
            label: "Nombre",
            render: (name: string) => <span className="font-medium text-gray-800">{name}</span>,
        },
        {
            key: "descripcionCategoria" as const,
            label: "Descripción",
            render: (desc: string | null) => (
                <span className="max-w-xs truncate text-gray-600">{desc || "-"}</span>
            ),
        },
    ];

    return (
        <div className="p-6">
            {showActionToast && actionMessage && (
                <Toast
                    message={actionMessage.message}
                    type={actionMessage.type}
                    onClose={() => setShowActionToast(false)}
                    duration={actionMessage.type === "success" ? 2000 : 4000}
                />
            )}

            {/* HEADER */}
            <div className="flex justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Categorías</h1>
                <button
                    onClick={() => navigate("/admin/categorias/crear")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    + Crear Categoría
                </button>
            </div>

            {/* FILTROS */}
            <AdminFilters
                filters={[
                    {
                        key: "searchNombre",
                        label: "Buscar por nombre",
                        type: "text",
                        placeholder: "Nombre de la categoría...",
                    },
                    {
                        key: "filterEstado",
                        label: "Estado",
                        type: "select",
                        options: [
                            { value: "all", label: "Todos" },
                            { value: "active", label: "Activas" },
                            { value: "inactive", label: "Inactivas" },
                        ],
                    },
                    {
                        key: "sortById",
                        label: "Ordenar por ID",
                        type: "select",
                        options: [
                            { value: "DESC", label: "Mayor a menor" },
                            { value: "ASC", label: "Menor a mayor" },
                        ],
                    },
                ]}
                values={{
                    searchNombre,
                    filterEstado,
                    sortById,
                }}
                onFilterChange={(key, value) => {
                    if (key === "searchNombre") setSearchNombre(value);
                    else if (key === "filterEstado") setFilterEstado(value);
                    else if (key === "sortById") setSortById(value as "ASC" | "DESC");
                }}
                onClear={clearFilters}
                itemCount={filteredCategorias.length}
                totalCount={categorias.length}
                currentPage={currentPage}
                totalPages={totalPages}
            />

            {/* TABLA */}
            <AdminTable
                data={paginatedCategorias}
                columns={tableColumns}
                onEdit={(cat) => navigate(`/admin/categorias/${cat.idCategoria}/editar`)}
                onToggleStatus={(cat) =>
                    openActionModal(cat, cat.categoriaActiva ? "deactivate" : "activate")
                }
                getStatus={(cat) => cat.categoriaActiva}
                getStatusLabel={(status) => (status ? "Activa" : "Inactiva")}
                emptyMessage="No hay categorías para mostrar"
            />

            {/* PAGINACIÓN */}
            <AdminPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            {/* MODAL */}
            <Modal
                isOpen={isActionModalOpen}
                onClose={() => setActionModalOpen(false)}
                title={actionType === "activate" ? "Activar categoría" : "Desactivar categoría"}
                width="max-w-md"
            >
                <p className="text-gray-700">
                    ¿Estás seguro que deseas{" "}
                    <span className="font-semibold">
                        {actionType === "activate" ? "activar" : "desactivar"}
                    </span>{" "}
                    la categoría <span className="font-semibold">{selectedCategoria?.nombreCategoria}</span>?
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={() => setActionModalOpen(false)}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={confirmAction}
                        className={`px-4 py-2 text-white rounded ${
                            actionType === "activate"
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-red-600 hover:bg-red-700"
                        }`}
                    >
                        {actionType === "activate" ? "Activar" : "Desactivar"}
                    </button>
                </div>
            </Modal>
        </div>
    );
}
