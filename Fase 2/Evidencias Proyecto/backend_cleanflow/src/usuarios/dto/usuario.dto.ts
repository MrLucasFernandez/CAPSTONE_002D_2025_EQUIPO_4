import { Cliente } from '../../clientes/entities/cliente.entity';

export class CreateUsuarioDto {
    correo: string;
    contraseña: string;
    idCliente?: Cliente;
}

export class UpdateUsuarioDto {
    correo?: string;
    contraseña?: string;
    idCliente?: Cliente;
}
