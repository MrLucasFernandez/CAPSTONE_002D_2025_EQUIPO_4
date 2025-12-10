import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { Marca } from "@models/product";
import { fetchBrands, updateBrand } from "../api/adminBrandService";
import Modal from "@components/ui/Modal";
import Toast from "@components/ui/Toast";
import AdminTable from "@components/tables/AdminTable";
import AdminFilters from "@components/tables/AdminFilters";
import AdminPagination from "@components/tables/AdminPagination";

export default function BrandsPage() {
    const navigate = useNavigate();
    const [marcas, setMarcas] = useState<Marca[]>([]);
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
    const [selectedMarca, setSelectedMarca] = useState<Marca | null>(null);
    const [actionType, setActionType] = useState<"activate" | "deactivate" | null>(null);
    const [actionMessage, setActionMessage] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);
    const [showActionToast, setShowActionToast] = useState(false);

    // Cargar marcas
    useEffect(() => {
        async function load() {
            try {
                const data = await fetchBrands();
                setMarcas(data);
            } catch (err) {
                console.error("Error cargando marcas:", err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    // Filtrado
    const filteredMarcas = useMemo(() => {
        let filtered = [...marcas];

        if (searchNombre.trim()) {
            filtered = filtered.filter((m) =>
                m.nombreMarca.toLowerCase().includes(searchNombre.toLowerCase())
            );
        }

        if (filterEstado === "active") {
            filtered = filtered.filter((m) => m.marcaActiva === true);
        } else if (filterEstado === "inactive") {
            filtered = filtered.filter((m) => m.marcaActiva === false);
        }

        filtered.sort((a, b) => {
            if (sortById === "ASC") {
                return a.idMarca - b.idMarca;
            } else {
                return b.idMarca - a.idMarca;
            }
        });

        return filtered;
    }, [marcas, searchNombre, filterEstado, sortById]);

    // Paginación
    const totalPages = Math.ceil(filteredMarcas.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedMarcas = filteredMarcas.slice(startIndex, endIndex);

    useMemo(() => {
        setCurrentPage(1);
    }, [searchNombre, filterEstado, sortById]);

    const clearFilters = () => {
        setSearchNombre("");
        setFilterEstado("all");
        setSortById("DESC");
        setCurrentPage(1);
    };

    const openActionModal = (marca: Marca, type: "activate" | "deactivate") => {
        setSelectedMarca(marca);
        setActionType(type);
        setActionModalOpen(true);
    };

    const confirmAction = async () => {
        if (!selectedMarca || !actionType) return;

        try {
            await updateBrand(selectedMarca.idMarca, {
                nombreMarca: selectedMarca.nombreMarca,
                descripcionMarca: selectedMarca.descripcionMarca || null,
                marcaActiva: actionType === "activate",
            });

            setMarcas((prev) =>
                prev.map((m) =>
                    m.idMarca === selectedMarca.idMarca
                        ? { ...m, marcaActiva: actionType === "activate" }
                        : m
                )
            );

            setActionMessage({
                message: `Marca ${actionType === "activate" ? "activada" : "desactivada"} correctamente.`,
                type: "success",
            });
            setShowActionToast(true);
        } catch (err) {
            setActionMessage({
                message: "Error: " + (err as Error).message,
                type: "error",
            });
            setShowActionToast(true);
        }
        setActionModalOpen(false);
    };

    if (loading) return <p className="p-6">Cargando marcas...</p>;

    const tableColumns = [
        {
            key: "idMarca" as const,
            label: "ID",
            render: (id: number) => `#${id}`,
        },
        {
            key: "nombreMarca" as const,
            label: "Nombre",
            render: (name: string) => <span className="font-medium text-gray-800">{name}</span>,
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
                <h1 className="text-3xl font-bold text-gray-800">Marcas</h1>
                <button
                    onClick={() => navigate("/admin/marcas/crear")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    + Crear Marca
                </button>
            </div>

            {/* FILTROS */}
            <AdminFilters
                filters={[
                    {
                        key: "searchNombre",
                        label: "Buscar por nombre",
                        type: "text",
                        placeholder: "Nombre de la marca...",
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
                itemCount={filteredMarcas.length}
                totalCount={marcas.length}
                currentPage={currentPage}
                totalPages={totalPages}
            />

            {/* TABLA */}
            <AdminTable
                data={paginatedMarcas}
                columns={tableColumns}
                onEdit={(marca) => navigate(`/admin/marcas/${marca.idMarca}/editar`)}
                onToggleStatus={(marca) =>
                    openActionModal(marca, marca.marcaActiva ? "deactivate" : "activate")
                }
                getStatus={(marca) => marca.marcaActiva}
                getStatusLabel={(status) => (status ? "Activa" : "Inactiva")}
                emptyMessage="No hay marcas para mostrar"
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
                title={actionType === "activate" ? "Activar marca" : "Desactivar marca"}
                width="max-w-md"
            >
                <p className="text-gray-700">
                    ¿Estás seguro que deseas{" "}
                    <span className="font-semibold">
                        {actionType === "activate" ? "activar" : "desactivar"}
                    </span>{" "}
                    la marca <span className="font-semibold">{selectedMarca?.nombreMarca}</span>?
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
