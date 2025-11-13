export interface Timestamps {
    /** Fecha de creación del registro. (Usualmente formato ISO 8601) */
    createdAt: string; 
    /** Fecha de la última actualización del registro. (Usualmente formato ISO 8601) */
    updatedAt: string; 
    // Si tu backend usa Soft Deletes (borrado lógico), podrías añadir:
    // deletedAt?: string | null;
}

export interface LoginCredentials {
    correo: string;      // Coincide con la columna 'correo' de Usuario
    contrasena: string;  // Coincide con la columna 'contrasena' de Usuario
}

/** * Credenciales para POST /auth/login y POST /auth/register 
 * AuthCredentials extiende de LoginCredentials y añade los campos de registro.
 */
export interface AuthCredentials extends LoginCredentials {
    // --- CAMPOS ADICIONALES REQUERIDOS PARA EL REGISTRO ---
    nombreUsuario: string;     // Requerido en Register
    apellidoUsuario: string;   // Requerido en Register
    telefono: string;          // Requerido en Register
    rut: string;               // Requerido en Register
    direccionUsuario: string;  // Requerido en Register
}

/** Respuesta exitosa después de login o register */
export interface AuthResponse {
    token: string;
    // 💡 CAMBIO CLAVE: Usamos 'any' o 'object' aquí para romper la dependencia de módulo
    user: any; 
}