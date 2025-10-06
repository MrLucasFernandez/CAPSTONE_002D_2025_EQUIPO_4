import { Cliente } from '../../clientes/entities/cliente.entity';

export class CreateBoletaDto {
    idCliente: Cliente;
    estadoBoleta: string;
    subtotalBoleta: number;
    impuesto: number;
    totalBoleta: number;
}

export class UpdateBoletaDto {
    idCliente?: Cliente;
    estadoBoleta?: string;
    subtotalBoleta?: number;
    impuesto?: number;
    totalBoleta?: number;
}
