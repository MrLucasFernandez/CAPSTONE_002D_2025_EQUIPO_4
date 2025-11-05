import React from 'react';
import { useUsers } from '../hooks/useUsers'; 

// Componente principal de la página de gestión de usuarios
const UsersPage: React.FC = () => {
    // Consume los datos y funciones del hook useUsers
    const { users, isLoading, error, updateUserStatus } = useUsers();

    // Manejar la acción de cambiar el estado (Activo/Inactivo)
    const handleStatusChange = async (userId: number, currentStatus: boolean) => {
        // Llama a la función del hook para actualizar el estado en el backend
        const success = await updateUserStatus(userId, !currentStatus);
        if (success) {
            console.log(`Estado del usuario ${userId} actualizado.`);
        }
    };
    
    // --- Lógica de renderizado simple ---
    if (isLoading) {
        return <div className="p-6 text-center text-blue-600 font-semibold">Cargando lista de usuarios...</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-600 font-bold">Error: {error}</div>;
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
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                
                                {/* 🚨 CELDA DE ID 🚨 */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {user.id}
                                </td>
                                
                                {/* 🚨 CELDA DE NOMBRE 🚨 */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {user.nombre}
                                </td>
                                
                                {/* 🚨 CELDA DE CORREO 🚨 */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.correo}
                                </td>
                                
                                {/* 🚨 CELDA DE ROL 🚨 */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${
                                        user.rol && user.rol.toLowerCase() === 'administrador' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {user.rol || 'N/A'}
                                    </span>
                                </td>
                                
                                {/* 🚨 CELDA DE ESTADO (ACTIVO) 🚨 */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${
                                        user.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {user.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                
                                {/* CELDA DE ACCIONES */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button 
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        // Llamamos al handler para cambiar el estado
                                        onClick={() => handleStatusChange(user.id, user.activo)}
                                        // Usamos el estado 'activo' para aplicar la clase y el texto correctos
                                        className={user.activo ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}
                                        disabled={false} // Deshabilitar si se está enviando la petición
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
