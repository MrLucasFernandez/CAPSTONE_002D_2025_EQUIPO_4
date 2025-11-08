/** Campos para la creación y actualización de registros */
export interface Timestamps {
    fechaCreacion: string; // TIMESTAMPTZ
    fechaActualizacion: string; // TIMESTAMPTZ
}

/** Credenciales para POST /auth/login y POST /auth/register */
// 💡 MODIFICADA: Incluye todos los campos necesarios para el REGISTRO.
export interface AuthCredentials {
    // Campos necesarios para LOGIN (Siempre requeridos)
    correo: string;      // Coincide con la columna 'correo' de Usuario
    contrasena: string;  // Coincide con la columna 'contrasena' de Usuario
    
    // --- CAMPOS ADICIONALES REQUERIDOS PARA EL REGISTRO (Según tu esquema) ---
    // NOTA: Se hacen requeridos aquí porque son obligatorios en el RegisterForm
    nombreUsuario: string;     // Coincide con la columna 'nombreUsuario'
    apellidoUsuario: string;   // Coincide con la columna 'apellidoUsuario'
    telefono: string;          // Coincide con la columna 'telefono' (Aunque es INTEGER en DB, se maneja como string en el frontend)
    rut: string;               // Coincide con la columna 'rut'
    direccionUsuario: string;  // Coincide con la columna 'direccionUsuario'
}

/** Respuesta exitosa después de login o register */
export interface AuthResponse {
    token: string;
    user: User; // Importaremos el tipo User aquí
}

// Importar tipos de otros archivos
import { User } from './user';