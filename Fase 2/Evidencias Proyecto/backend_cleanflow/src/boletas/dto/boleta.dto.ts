import { Usuario } from '../../usuarios/entities/usuario.entity';

export class CreateBoletaDto {
    idUsuario: Usuario;
    estadoBoleta: string;
    subtotalBoleta: number;
    impuesto: number;
    totalBoleta: number;
}

export class UpdateBoletaDto {
    idUsuario?: Usuario;
    estadoBoleta?: string;
    subtotalBoleta?: number;
    impuesto?: number;
    totalBoleta?: number;
}
