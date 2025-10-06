export class CreateClienteDto {
    nombreCliente: string;
    apellidoCliente?: string;
    telefono?: string;
    rut: string;
    direccionCliente?: string;
}

export class UpdateClienteDto {
    nombreCliente?: string;
    apellidoCliente?: string;
    telefono?: string;
    rut?: string;
    direccionCliente?: string;
}
