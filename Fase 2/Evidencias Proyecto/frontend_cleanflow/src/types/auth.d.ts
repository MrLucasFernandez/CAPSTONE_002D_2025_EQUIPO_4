/** Campos para la creación y actualización de registros */
export interface Timestamps {
    fechaCreacion: string; // TIMESTAMPTZ
    fechaActualizacion: string; // TIMESTAMPTZ
}

/** Credenciales para POST /auth/login y POST /auth/register */
export interface AuthCredentials {
    correo: string; // Coincide con la columna 'correo' de Usuario
    contrasena: string; // Coincide con la columna 'contrasena' de Usuario
    nombreUsuario?: string; // Opcional, podría usarse en el registro
}

/** Respuesta exitosa después de login o register */
export interface AuthResponse {
    token: string;
    user: User; // Importaremos el tipo User aquí
}

// Importar tipos de otros archivos
import { User } from './user';