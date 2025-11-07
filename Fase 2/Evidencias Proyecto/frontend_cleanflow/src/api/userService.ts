import { apiRequest } from './apiClient';
// Usamos 'import type' para los tipos de datos
import type { User, Rol } from '../types/user'; 
import type { Timestamps } from '../types/auth';


// 1. Tipos de datos para envío (Creación y Actualización)

// Datos que se envían al crear un nuevo usuario (POST /usuarios)
type UserCreateData = Pick<User, 'correo' | 'nombreUsuario' | 'apellidoUsuario' | 'telefono' | 'rut' | 'direccionUsuario'> & {
    contrasena: string; // Se requiere la contraseña para crear el usuario
    idRoles: number[]; // Asumiendo que se asignan roles al crear
};

// Datos que se envían al actualizar un usuario (PUT /usuarios/{id})
// Hacemos que todos los campos sean opcionales (Partial) y omitimos los autogenerados.
type UserUpdateData = Partial<Omit<User, 'idUsuario' | keyof Timestamps | 'roles'>> & {
    contrasena?: string; // Opcional, solo si se quiere cambiar
    idRoles?: number[];
};

// 🚨 TIPO AÑADIDO: Tipo específico para actualizar solo el estado activo
type UserStatusUpdateData = {
    activo: boolean;
};


// 2. Funciones del CRUD para Usuarios

/**
 * Obtiene la lista completa de usuarios (GET /usuarios)
 * @returns Promesa que resuelve a un array de objetos User.
 */
export function getAllUsers(): Promise<User[]> {
    return apiRequest<User[]>('/usuarios'); 
}

/**
 * Obtiene un usuario por su ID (GET /usuarios/{id})
 * @param id El ID del usuario a obtener.
 */
export function getUserById(id: number): Promise<User> {
    return apiRequest<User>(`/usuarios/${id}`);
}


/**
 * Crea un nuevo usuario (POST /usuarios)
 * @param data Los datos del nuevo usuario, incluyendo contraseña y roles.
 */
export function createUser(data: UserCreateData): Promise<User> {
    return apiRequest<User>('/usuarios', { 
        method: 'POST', 
        body: data 
    });
}

/**
 * Actualiza los datos de un usuario existente (PUT /usuarios/{id})
 * @param id El ID del usuario a actualizar.
 * @param data Los campos a modificar.
 */
export function updateUser(id: number, data: UserUpdateData): Promise<User> {
    return apiRequest<User>(`/usuarios/${id}`, { 
        method: 'PUT', 
        body: data 
    });
}

/**
 * 🚨 FUNCIÓN AÑADIDA: Actualiza el estado activo/inactivo del usuario
 * @param id El ID del usuario.
 * @param activo El nuevo estado (true/false).
 */
export function updateUserStatus(id: number, activo: boolean): Promise<void> {
    // Usamos PUT al endpoint /usuarios/{id} con el cuerpo UserStatusUpdateData
    return apiRequest<void>(`/usuarios/${id}`, { 
        method: 'PUT', 
        body: { activo: activo } as UserStatusUpdateData 
    });
}

/**
 * Elimina un usuario por su ID (DELETE /usuarios/{id})
 * @param id El ID del usuario a eliminar.
 */
export function deleteUser(id: number): Promise<void> {
    return apiRequest<void>(`/usuarios/${id}`, { method: 'DELETE' });
}


// 3. Funciones para Relaciones (Roles)

/**
 * Obtiene todos los roles disponibles (GET /roles)
 */
export function getAllRoles(): Promise<Rol[]> {
    return apiRequest<Rol[]>('/roles');
}