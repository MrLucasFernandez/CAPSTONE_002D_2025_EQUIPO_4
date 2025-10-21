export class CreateUsuarioDto {
    nombreUsuario: string;
    apellidoUsuario: string;
    telefono?: number;
    rut: string;
    direccionUsuario?: string;
    correo: string;
    contraseña: string;
}

export class UpdateUsuarioDto {
    nombreUsuario?: string;
    apellidoUsuario?: string
    telefono?: number;
    direccionUsuario?: string;
    correo?: string;
    contraseña?: string;
}
