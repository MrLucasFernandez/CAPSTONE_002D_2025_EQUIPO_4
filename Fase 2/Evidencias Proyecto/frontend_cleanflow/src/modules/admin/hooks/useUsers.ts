import { useState, useEffect, useCallback } from 'react';
// 🚨 Asegúrate de que esta ruta a tu hook de Auth sea correcta 🚨
import { useAdminAuth } from '../../../modules/admin/hooks/useAdminAuth'; 

// Define la interfaz de los datos de usuario
interface User {
    id: number;
    nombre: string;
    correo: string;
    rol: string;
    activo: boolean;
}

interface UseUsersResult {
    users: User[];
    isLoading: boolean;
    error: string | null;
    fetchUsers: () => Promise<void>; // Para recargar la lista
    updateUserStatus: (userId: number, newStatus: boolean) => Promise<boolean>;
}

const API_BASE_URL = 'http://localhost:3001/api/admin/users';

export const useUsers = (): UseUsersResult => {
    const { user, isAuthenticated } = useAdminAuth(); 
    
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ----------------------------------------------------------------------
    // 1. FUNCIÓN PARA OBTENER DATOS (FETCH)
    // ----------------------------------------------------------------------

    const fetchUsers = useCallback(async () => {
        if (!isAuthenticated || !user?.token) {
            // Este caso debería ser bloqueado por ProtectedAdminRoute, pero es una buena medida defensiva.
            setError("No autenticado o token faltante.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`, // Usar el token del administrador
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Fallo HTTP: ${response.status}`);
            }

            const data = await response.json();
            
            // Tu server.js devuelve { users: [...] }
            if (!Array.isArray(data.users)) {
                throw new Error("El formato de respuesta de la API es incorrecto (se esperaba un array en la propiedad 'users').");
            }

            setUsers(data.users);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar usuarios.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, user?.token]);

    // ----------------------------------------------------------------------
    // 2. FUNCIÓN PARA ACTUALIZAR EL ESTADO (ACTIVO/INACTIVO)
    // ----------------------------------------------------------------------
    
    const updateUserStatus = useCallback(async (userId: number, newStatus: boolean): Promise<boolean> => {
        if (!isAuthenticated || !user?.token) {
            console.error("Intento de actualización sin autenticación.");
            return false;
        }

        try {
            // La ruta PUT que agregamos en server.js
            const response = await fetch(`http://localhost:3001/api/admin/users/${userId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify({ activo: newStatus }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Fallo al actualizar estado. HTTP: ${response.status}`);
            }
            
            // Actualización optimista del estado local
            setUsers(prevUsers => 
                prevUsers.map(u => 
                    u.id === userId ? { ...u, activo: newStatus } : u
                )
            );

            return true;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al actualizar el estado.';
            console.error(errorMessage);
            setError(errorMessage);
            return false;
        }
    }, [isAuthenticated, user?.token]);


    // ----------------------------------------------------------------------
    // 3. EFECTO: Cargar al montar el componente
    // ----------------------------------------------------------------------

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]); 


    // ----------------------------------------------------------------------
    // 4. Retornar el estado y las funciones
    // ----------------------------------------------------------------------

    return { users, isLoading, error, fetchUsers, updateUserStatus };
};
