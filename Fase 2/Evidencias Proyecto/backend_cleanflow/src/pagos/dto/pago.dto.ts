import { Boleta } from '../../boletas/entities/boleta.entity';
export class CreatePagoDto {
    idBoleta: Boleta;
    fecha: Date;
    monto: number;
    estado: string;
    metodoPago: string;
}

export class UpdatePagoDto {
    idBoleta?: Boleta;
    fecha?: Date;
    estado?: string;
    monto?: number;
    metodoPago?: string;
}