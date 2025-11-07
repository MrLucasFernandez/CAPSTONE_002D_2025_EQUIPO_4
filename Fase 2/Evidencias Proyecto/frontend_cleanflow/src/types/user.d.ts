// src/types/user.d.ts

import type { Timestamps } from './auth'; // Usamos import type

/** Tabla Rol */
export interface Rol {
    idRol: number;
    tipoRol: string;
    descripcionRol: string | null;
}

/** Tabla Usuario */
export interface User extends Timestamps {
    idUsuario: number;
    correo: string;
    nombreUsuario: string;
    apellidoUsuario: string | null;
    telefono: number | null;
    rut: string | null;
    direccionUsuario: string | null;
    activo: boolean; 

    // NOTA: 'contrasena' solo se usa al ENVIAR; no se recibe

    // Relaciones
    roles?: Rol[]; 
}

/** Tabla Rol_usuario (Para uso en endpoints de /rol_usuarios) */
export interface RolUsuario {
    idUsuario: number;
    idRol: number;
}