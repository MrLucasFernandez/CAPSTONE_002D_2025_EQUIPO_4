import { useState, useMemo } from "react";

// 1. DEFINICIÓN DE LA INTERFAZ ROL (Basada en user.d.ts)
interface Role {
    idRol: number;
    tipoRol: string; // Ejemplo: "Administrador", "Cliente"
    descripcionRol: string | null;
}

// 2. DEFINICIÓN DE LA INTERFAZ USER (Basada en user.d.ts)
interface User {
    idUsuario: number; 
    nombreUsuario: string;
    apellidoUsuario: string | null; // Incluido desde user.d.ts
    correo: string;
    rut: string | null; // Puede ser null
        activo: boolean; // Se confirma su existencia en user.d.ts
        telefono?: string | number | null; // Número de teléfono opcional (puede venir como number)
    roles?: Role[]; // Array de roles (Opcional)
}

// 3. COMPONENTE LOADER (Simula Loader)
const Loader: React.FC = () => (
    <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-blue-600 border-t-4"></div>
        <span className="ml-3 text-blue-600 font-medium">Cargando datos de usuarios...</span>
    </div>
);

// 4. COMPONENTE CONFIRM MODAL (Simula ConfirmModal)
interface ConfirmModalProps {
    open: boolean;
    message: string;
    onCancel: () => void;
    onConfirm: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ open, message, onCancel, onConfirm }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
                <p className="text-gray-700 mb-6 text-center font-medium">{message}</p>
                <div className="flex justify-around space-x-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-md"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

// COMPONENTE UserRow (fila individual de la tabla)
interface UserRowProps {
    user: User;
    onEdit?: () => void;
    onDelete: () => void;
}

const UserRow: React.FC<UserRowProps> = ({ user, onEdit, onDelete }) => {
    const primaryRole = user.roles && user.roles.length > 0 ? user.roles[0].tipoRol : 'Sin Rol';
    let roleClasses = 'bg-gray-100 text-gray-800';
    if (primaryRole.toLowerCase().includes('administrador')) roleClasses = 'bg-blue-100 text-blue-800';
    else if (primaryRole.toLowerCase().includes('cliente')) roleClasses = 'bg-purple-100 text-purple-800';

    const fullName = `${user.nombreUsuario} ${user.apellidoUsuario || ''}`.trim();

    const formatPhone = (phone?: string | number | null) => {
        if (phone === undefined || phone === null || phone === '') return 'N/A';
        const digits = String(phone).replace(/\D/g, '');
        if (digits.length === 9) {
            // Ej: 9 1234 567 -> +56 9 1234 567
            return `+56 ${digits[0]} ${digits.slice(1,5)} ${digits.slice(5)}`;
        }
        if (digits.length === 8) {
            return `${digits.slice(0,4)} ${digits.slice(4)}`;
        }
        if (digits.length > 9) return `+${digits}`;
        return phone;
    };

    return (
        <tr className="border-t border-gray-100 hover:bg-gray-50 transition duration-150">
            <td className="py-3 px-4 text-sm text-gray-700 font-mono">
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 font-semibold">{user.idUsuario}</span>
            </td>
            <td className="py-3 px-4 text-sm text-gray-900 font-medium whitespace-nowrap">{fullName}</td>
            <td className="py-3 px-4 text-sm text-sky-700 truncate max-w-[170px] sm:max-w-none hover:underline cursor-pointer">{user.correo}</td>
            <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">{user.rut || 'N/A'}</td>
            <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">{formatPhone(user.telefono)}</td>
                <td className="py-3 px-4 text-sm"><span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${roleClasses} shadow-sm capitalize`}>{primaryRole}</span></td>
            <td className="py-3 px-4 text-center space-x-2 whitespace-nowrap">
                <button onClick={onEdit} className="text-xs font-semibold px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition duration-150 shadow-sm" title="Editar usuario">Editar</button>
                <button onClick={onDelete} className="text-xs font-semibold px-3 py-1 rounded-md bg-white border border-red-100 text-red-600 hover:bg-red-50 transition duration-150 shadow-sm" title="Eliminar usuario">Eliminar</button>
            </td>
        </tr>
    );
};


// 6. COMPONENTE PRINCIPAL: UsersTable
interface Props {
    users: User[];
    loading: boolean;
    onToggleActive: (id: number, active: boolean) => void;
    onEdit?: (id: number) => void;
    onDelete: (id: number) => void;
}

const UsersTable: React.FC<Props> = ({ users, loading, onEdit, onDelete }) => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [queryName, setQueryName] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [sortAsc, setSortAsc] = useState<boolean | null>(null); // null = sin orden, true = asc, false = desc

    // calcular roles únicos disponibles para el filtro
    const availableRoles = useMemo(() => {
        const setRoles = new Set<string>();
        users.forEach(u => {
            (u.roles || []).forEach(r => setRoles.add(r.tipoRol));
        });
        return Array.from(setRoles).sort();
    }, [users]);

    // usuarios filtrados/ordenados según controles
    const displayedUsers = useMemo(() => {
        let list = users.slice();

        if (queryName.trim()) {
            const q = queryName.trim().toLowerCase();
            list = list.filter(u => (`${u.nombreUsuario} ${u.apellidoUsuario || ''}`).toLowerCase().includes(q));
        }

        if (filterRole) {
            list = list.filter(u => (u.roles || []).some(r => r.tipoRol === filterRole));
        }

        if (sortAsc === true) {
            list.sort((a, b) => a.idUsuario - b.idUsuario);
        } else if (sortAsc === false) {
            list.sort((a, b) => b.idUsuario - a.idUsuario);
        }

        return list;
    }, [users, queryName, filterRole, sortAsc]);

    if (loading) return <Loader />;

    return (
        <>
        {/* Controles: búsqueda por nombre, filtro por rol y orden */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto bg-white/60 p-2 rounded-lg shadow-sm">
                <div className="relative w-full sm:w-80">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <input
                        value={queryName}
                        onChange={(e) => setQueryName(e.target.value)}
                        placeholder="Buscar por nombre..."
                        className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-3 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <label className="sr-only">Filtrar por rol</label>
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="rounded-lg border border-gray-200 bg-white py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    >
                        <option value="">Todos los roles</option>
                        {availableRoles.map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => setSortAsc(prev => prev === true ? null : true)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${sortAsc === true ? 'bg-emerald-600 text-white shadow' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                    title="Ordenar por ID ascendente"
                >
                    <span>ID</span>
                    <span className="text-xs opacity-80">↑</span>
                </button>

                <button
                    onClick={() => setSortAsc(prev => prev === false ? null : false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${sortAsc === false ? 'bg-emerald-600 text-white shadow' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                    title="Ordenar por ID descendente"
                >
                    <span>ID</span>
                    <span className="text-xs opacity-80">↓</span>
                </button>
            </div>
        </div>

        {/* El contenedor principal con `overflow-x-auto` permite el scroll horizontal en pantallas pequeñas */}
        <div className="overflow-x-auto rounded-xl shadow-2xl">
            <table className="min-w-full bg-white rounded-xl border-separate border-spacing-0">
                <thead className="bg-blue-600 text-white text-sm uppercase tracking-wider sticky top-0">
                <tr>
                    <th className="py-3 px-4 text-left font-extrabold rounded-tl-xl">ID</th> 
                    <th className="py-3 px-4 text-left font-extrabold">Nombre</th>
                    <th className="py-3 px-4 text-left font-extrabold">Correo</th>
                    <th className="py-3 px-4 text-left font-extrabold">RUT</th>
                    <th className="py-3 px-4 text-left font-extrabold">NÚMERO</th>
                    <th className="py-3 px-4 text-left font-extrabold">Rol</th>
                    <th className="py-3 px-4 text-center font-extrabold rounded-tr-xl">Acciones</th>
                </tr>
                </thead>

                <tbody>
                {displayedUsers.length === 0 ? (
                    <tr>
                        <td colSpan={7} className="text-center py-8 text-gray-500">
                            No hay usuarios para mostrar.
                        </td>
                    </tr>
                ) : (
                    displayedUsers.map((u) => (
                        <UserRow
                        key={u.idUsuario}
                        user={u}
                        onEdit={() => onEdit?.(u.idUsuario)}
                        onDelete={() => setSelectedUser(u)}
                        />
                    ))
                )}
                </tbody>
            </table>
        </div>

        {/* Modal de confirmación */}
        <ConfirmModal
            open={!!selectedUser}
            message={`¿Eliminar definitivamente a ${selectedUser?.nombreUsuario || 'este usuario'}?`}
            onCancel={() => setSelectedUser(null)}
            onConfirm={() => {
            if (selectedUser) onDelete(selectedUser.idUsuario);
            setSelectedUser(null);
            }}
        />
        </>
    );
};

export default UsersTable;