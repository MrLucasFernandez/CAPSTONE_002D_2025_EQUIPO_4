import { useState } from "react";

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
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full transform scale-100 transition-transform duration-300">
                <p className="text-gray-700 mb-6 text-center font-medium">{message}</p>
                <div className="flex justify-around space-x-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};


// 5. COMPONENTE USER ROW (Muestra Nombre Completo y maneja Rol opcional)
interface UserRowProps {
    user: User;
    onEdit?: () => void;
    onDelete: () => void;
}

const UserRow: React.FC<UserRowProps> = ({ user, onDelete }) => {
    // Determinar el primer rol para mostrar (maneja 'roles' opcional)
    const primaryRole = user.roles && user.roles.length > 0 
        ? user.roles[0].tipoRol 
        : 'Sin Rol';

    const statusClasses = user.activo
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800";

    // Lógica de estilos basada en el rol
    let roleClasses = "bg-gray-100 text-gray-800";
    if (primaryRole.toLowerCase().includes('administrador')) {
        roleClasses = "bg-blue-100 text-blue-800";
    } else if (primaryRole.toLowerCase().includes('cliente')) {
        roleClasses = "bg-purple-100 text-purple-800";
    }

    // Combina nombre y apellido
    const fullName = `${user.nombreUsuario} ${user.apellidoUsuario || ''}`.trim();

    return (
        <tr className="border-t border-gray-200 hover:bg-blue-50 transition duration-150 ease-in-out">
            {/* ID */}
            <td className="py-3 px-4 text-sm text-gray-700 font-mono">
                <span className="font-semibold text-blue-600">{user.idUsuario}</span>
            </td>
            {/* Nombre Completo */}
            <td className="py-3 px-4 text-sm text-gray-900 font-medium whitespace-nowrap">
                {fullName}
            </td>
            {/* Correo */}
            <td className="py-3 px-4 text-sm text-blue-700 truncate max-w-[150px] sm:max-w-none hover:underline cursor-pointer">
                {user.correo}
            </td>
            {/* RUT */}
            <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                {user.rut || 'N/A'}
            </td>
            {/* Rol */}
            <td className="py-3 px-4 text-sm">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${roleClasses} shadow-sm capitalize`}>
                    {primaryRole}
                </span>
            </td>
            {/* Estado */}
            <td className="py-3 px-4 text-sm">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${statusClasses} shadow-sm`}>
                    {user.activo ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            {/* Acciones */}
            <td className="py-3 px-4 text-center space-x-2 whitespace-nowrap">
                {/* Editar (temporalmente comentado hasta implementar formulario de edición)
                <button
                    onClick={onEdit}
                    className="text-xs font-semibold px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition duration-150 shadow-md"
                    title="Editar usuario"
                >
                    Editar
                </button>
                */}
                <button
                    onClick={onDelete}
                    className="text-xs font-semibold px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700 transition duration-150 shadow-md"
                    title="Eliminar usuario"
                >
                    Eliminar
                </button>
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

    if (loading) return <Loader />;

    return (
        <>
        {/* El contenedor principal con `overflow-x-auto` permite el scroll horizontal en pantallas pequeñas */}
        <div className="overflow-x-auto rounded-xl shadow-2xl">
            <table className="min-w-full bg-white rounded-xl border-separate border-spacing-0">
                <thead className="bg-blue-600 text-white text-sm uppercase tracking-wider sticky top-0">
                <tr>
                    <th className="py-3 px-4 text-left font-extrabold rounded-tl-xl">ID</th> 
                    <th className="py-3 px-4 text-left font-extrabold">Nombre</th>
                    <th className="py-3 px-4 text-left font-extrabold">Correo</th>
                    <th className="py-3 px-4 text-left font-extrabold">RUT</th>
                    <th className="py-3 px-4 text-left font-extrabold">Rol</th>
                    <th className="py-3 px-4 text-left font-extrabold">Estado</th>
                    <th className="py-3 px-4 text-center font-extrabold rounded-tr-xl">Acciones</th>
                </tr>
                </thead>

                <tbody>
                {users.length === 0 ? (
                    <tr>
                        <td colSpan={7} className="text-center py-8 text-gray-500">
                            No hay usuarios para mostrar.
                        </td>
                    </tr>
                ) : (
                    users.map((u) => (
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