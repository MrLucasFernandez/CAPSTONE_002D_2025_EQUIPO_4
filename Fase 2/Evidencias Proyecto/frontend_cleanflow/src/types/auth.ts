export interface Timestamps {
    /** Fecha de creación del registro */
    fechaCreacion: string;
    /** Fecha de última actualización */
    fechaActualizacion: string;
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
    user: any; 
}