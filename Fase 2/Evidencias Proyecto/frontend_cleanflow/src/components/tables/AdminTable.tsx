import React from "react";

interface Column<T> {
    key: keyof T;
    label: string;
    render?: (value: any, item: T) => React.ReactNode;
    className?: string;
}

interface AdminTableProps<T> {
    data: T[];
    columns: Column<T>[];
    onEdit: (item: T) => void;
    onToggleStatus: (item: T) => void;
    getStatus: (item: T) => boolean;
    getStatusLabel?: (status: boolean) => string;
    emptyMessage?: string;
}

export default function AdminTable<T extends { [key: string]: any }>({
    data,
    columns,
    onEdit,
    onToggleStatus,
    getStatus,
    getStatusLabel = (status) => (status ? "Activo" : "Inactivo"),
    emptyMessage = "No hay datos para mostrar",
}: AdminTableProps<T>) {
    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                            {columns.map((col) => (
                                <th
                                    key={String(col.key)}
                                    className={`px-6 py-4 text-left text-sm font-semibold text-gray-700 ${col.className || ""}`}
                                >
                                    {col.label}
                                </th>
                            ))}
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Estado</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.map((item, idx) => (
                            <tr
                                key={idx}
                                className="hover:bg-blue-50/50 transition-colors duration-200 group"
                            >
                                {columns.map((col) => (
                                    <td
                                        key={String(col.key)}
                                        className={`px-6 py-4 text-sm text-gray-600 group-hover:text-gray-900 transition-colors ${col.className || ""}`}
                                    >
                                        {col.render
                                            ? col.render(item[col.key], item)
                                            : item[col.key]}
                                    </td>
                                ))}
                                <td className="px-6 py-4 text-sm">
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                                            getStatus(item)
                                                ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
                                                : "bg-rose-100 text-rose-700 ring-1 ring-rose-200"
                                        }`}
                                    >
                                        <span className={`w-2 h-2 rounded-full mr-2 ${getStatus(item) ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                                        {getStatusLabel(getStatus(item))}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex gap-2 justify-center flex-wrap sm:flex-nowrap">
                                        <button
                                            onClick={() => onEdit(item)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 active:scale-95 transition-all ring-1 ring-blue-200 hover:ring-blue-300"
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            onClick={() => onToggleStatus(item)}
                                            className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md active:scale-95 transition-all ring-1 ${
                                                getStatus(item)
                                                    ? "text-rose-700 bg-rose-50 hover:bg-rose-100 ring-rose-200 hover:ring-rose-300"
                                                    : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 ring-emerald-200 hover:ring-emerald-300"
                                            }`}
                                        >
                                            {getStatus(item) ? "⊘ Desactivar" : "✓ Activar"}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {data.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    <svg
                        className="w-12 h-12 mx-auto mb-4 opacity-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                    </svg>
                    {emptyMessage}
                </div>
            )}
        </div>
    );
}
