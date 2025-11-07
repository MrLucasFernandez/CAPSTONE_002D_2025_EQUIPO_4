import React from 'react';
import { useUsers } from '../hooks/useUsers'; 
// Importar el tipo User para tipificar correctamente el argumento del manejador de estado
import type { User } from '../../../types/user'; 

const UsersPage: React.FC = () => {
    // 1. Consumir el hook, asegurando que las propiedades coincidan con el hook useUsers.ts
    // Nota: El hook useUsers.ts solo expone users, isLoading, error, y refetch (no updateUserStatus)
    const { 
        users, 
        isLoading, 
        error, 
        updateUserStatus, // Asumimos que esta función existe en el hook.
        refetch // Añadimos refetch por si queremos actualizar la lista
    } = useUsers();

    // 2. Manejar la acción de cambiar el estado (Activo/Inactivo)
    const handleStatusChange = async (userId: number, currentStatus: boolean) => {
        // Confirmar antes de ejecutar la acción
        if (!window.confirm(`¿Seguro que deseas ${currentStatus ? 'desactivar' : 'activar'} al usuario ${userId}?`)) {
            return;
        }

        try {
            // Llama a la función del hook para actualizar el estado en el backend
            // El hook se encarga de llamar a la API
            await updateUserStatus(userId, !currentStatus);
            console.log(`Estado del usuario ${userId} actualizado.`);
            // Recargar la lista para reflejar el cambio
            refetch(); 
        } catch (err) {
            console.error("Fallo al cambiar el estado:", err);
            alert("Error al actualizar el estado del usuario.");
        }
    };
    
    // --- Lógica de renderizado simple ---
    if (isLoading) {
        return <div className="p-6 text-center text-blue-600 font-semibold">Cargando lista de usuarios...</div>;
    }

    // Aseguramos que el error sea una cadena
    if (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return <div className="p-6 text-center text-red-600 font-bold">Error: {errorMessage}</div>;
    }

    // Mensaje si no hay usuarios
    if (users.length === 0) {
        return (
            <div className="p-10 text-center text-gray-500 bg-white shadow-lg rounded-lg">
                <h2 className="text-xl font-semibold">No se encontraron usuarios</h2>
                <p>Verifique que la tabla 'usuario' y 'rol_usuario' de su base de datos no estén vacías.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center pb-4 border-b">
                <h1 className="text-3xl font-bold text-gray-900">👥 Gestión de Usuarios ({users.length})</h1>
                <button 
                    className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
                >
                    + Nuevo Usuario
                </button>
            </header>

            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Correo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rol
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user: User) => (
                            // Asumo que tu objeto 'user' tiene las propiedades idUsuario, nombreUsuario, correo, roles y activo
                            <tr key={user.idUsuario} className="hover:bg-gray-50"> 
                                
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {user.idUsuario}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {user.nombreUsuario} {user.apellidoUsuario}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.correo}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    {/* Muestra el primer rol o 'N/A' */}
                                    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${
                                        user.roles && user.roles.length > 0 && user.roles[0].tipoRol.toUpperCase() === 'ADMINISTRADOR' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {user.roles && user.roles.length > 0 ? user.roles[0].tipoRol : 'N/A'}
                                    </span>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    {/* Asumimos que existe una propiedad 'activo' en el tipo User */}
                                    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${
                                        user.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {user.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button 
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        onClick={() => handleStatusChange(user.idUsuario, user.activo)}
                                        className={user.activo ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}
                                        disabled={false} 
                                    >
                                        {user.activo ? 'Desactivar' : 'Activar'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersPage;