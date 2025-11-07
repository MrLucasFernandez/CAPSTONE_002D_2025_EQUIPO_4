import { useState, useEffect, useCallback } from 'react';
// Importamos la función de servicio para la obtención y la actualización
import { getAllUsers, updateUserStatus as apiUpdateUserStatus } from '../../../api/userService'; 
import type { User } from '../../../types/user'; 

interface UseUsersResult {
    users: User[];
    isLoading: boolean;
    error: Error | null;
    refetch: () => void; // Función para recargar la lista de forma manual
    updateUserStatus: (id: number, activo: boolean) => Promise<void>; // Definición de la función
}

/**
 * Hook para la administración de usuarios. 
 * Obtiene la lista de todos los usuarios de la API y expone funciones de gestión.
 */
export const useUsers = (): UseUsersResult => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Función para obtener los datos
    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getAllUsers(); 
            setUsers(data);
        } catch (err) {
            console.error("Error al obtener usuarios:", err);
            setError(err instanceof Error ? err : new Error("Error desconocido al cargar usuarios."));
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 🚨 FUNCIÓN IMPLEMENTADA: Lógica para actualizar el estado del usuario
    const handleUpdateUserStatus = useCallback(async (id: number, activo: boolean) => {
        // Esta función NO maneja el estado de carga ni el error global, solo la llamada API
        try {
            // Llama a la función del servicio API
            await apiUpdateUserStatus(id, activo); 
            
            // OPTIMIZACIÓN: Actualizar el estado local sin refetch completo (mejor UX)
            setUsers(prevUsers => 
                prevUsers.map(user => 
                    user.idUsuario === id ? { ...user, activo: activo } : user
                )
            );
        } catch (err) {
            console.error("Fallo al actualizar estado:", err);
            throw err; // Relanzamos el error para que la UsersPage lo maneje en la UI
        }
    }, []);


    // Ejecuta la obtención de datos al montar el componente
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return {
        users,
        isLoading,
        error,
        refetch: fetchUsers,
        // ✅ CORRECCIÓN FINAL: La función es expuesta aquí
        updateUserStatus: handleUpdateUserStatus, 
    };
};