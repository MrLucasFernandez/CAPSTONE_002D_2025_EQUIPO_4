import { apiRequest } from '../../../../api/apiClient';
import type { User, Rol } from '@models/user';
import type { Timestamps } from '@models/auth';

/* ============================================================
    TIPOS PARA ENVIAR DATA AL BACKEND
============================================================ */

export type UserCreateData = Pick<
    User,
    'correo' | 'nombreUsuario' | 'apellidoUsuario' | 'telefono' | 'rut' | 'direccionUsuario'
> & {
    contrasena: string;     // requerido al crear
    idRoles: number[];      // roles asignados
};

export type UserUpdateData = Partial<
    Omit<User, 'idUsuario' | keyof Timestamps | 'roles'>
> & {
    contrasena?: string;
    idRoles?: number[];
};

export interface UserStatusUpdateData {
    activo: boolean;
}

/* ============================================================
    NORMALIZADOR — Backend → Frontend
============================================================ */
function normalizeUser(b: any): User {
    return {
        idUsuario: b.idUsuario,
        correo: b.correo,
        nombreUsuario: b.nombreUsuario,
        apellidoUsuario: b.apellidoUsuario ?? null,
        telefono: b.telefono ?? null,
        rut: b.rut ?? null,
        direccionUsuario: b.direccionUsuario ?? null,
        activo: b.activo ?? true,
        fechaCreacion: b.fechaCreacion ?? '',
        fechaActualizacion: b.fechaActualizacion ?? '',
        roles: Array.isArray(b.roles)
            ? b.roles.map((r: any): Rol => ({
                    idRol: r.idRol ?? r.id ?? 0,
                    tipoRol: r.tipoRol ?? r.nombreRol ?? '',
                    descripcionRol: r.descripcionRol ?? null
                }))
            : []
    };
}

/* ============================================================
    CRUD: USUARIOS
============================================================ */

/** GET /usuarios — lista completa */
export async function getAllUsers(): Promise<User[]> {
    const res = await apiRequest<any[]>('/usuarios');
    return res.map(normalizeUser);
}

/** GET /usuarios/{id} */
export async function getUserById(id: number): Promise<User> {
    if (!id || id <= 0) throw new Error('ID inválido');
    const res = await apiRequest<any>(`/usuarios/${id}`);
    return normalizeUser(res);
}

/** POST /usuarios — crear usuario */
export async function createUser(data: UserCreateData): Promise<User> {
    // normalizar teléfono (backend puede esperar string)
    const payload = {
        ...data,
        telefono: String(data.telefono)
    };

    const res = await apiRequest<any>('/usuarios', {
        method: 'POST',
        body: payload
    });

    return normalizeUser(res);
}

/** PUT /usuarios/{id} — actualizar usuario */
export async function updateUser(id: number, data: UserUpdateData): Promise<User> {
    if (!id || id <= 0) throw new Error('ID inválido');

    const payload = {
        ...data,
        telefono: data.telefono ? Number(data.telefono) : undefined
    };

    const res = await apiRequest<any>(`/usuarios/${id}`, {
        method: 'PUT',
        body: payload
    });

    return normalizeUser(res);
}

/** PUT /usuarios/{id} — activar / desactivar usuario */
export async function updateUserStatus(id: number, activo: boolean): Promise<void> {
    if (!id || id <= 0) throw new Error('ID inválido');
    await apiRequest(`/usuarios/${id}`, {
        method: 'PUT',
        body: { activo }
    });
}

/** DELETE /usuarios/{id} */
export async function deleteUser(id: number): Promise<void> {
    if (!id || id <= 0) throw new Error('ID inválido');
    await apiRequest(`/usuarios/${id}`, { method: 'DELETE' });
}

/* ============================================================
    ROLES
============================================================ */

/** GET /roles */
export async function getAllRoles(): Promise<Rol[]> {
    const res = await apiRequest<any[]>('/roles');

    return res.map(
        (r): Rol => ({
            idRol: r.idRol ?? 0,
            tipoRol: r.tipoRol ?? r.nombreRol ?? '',
            descripcionRol: r.descripcionRol ?? null
        })
    );
}
