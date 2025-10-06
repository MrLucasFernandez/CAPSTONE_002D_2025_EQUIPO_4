import { Boleta } from '../../boletas/entities/boleta.entity';
import { Producto } from '../../productos/entities/producto.entity';

export class CreateDetalleBoletaDto {
    idBoleta: Boleta;
    idProducto: Producto;
    cantidad: number;
    precioUnitario: number;
    tasaIva: number;
}

export class UpdateDetalleBoletaDto {
    idBoleta?: Boleta;
    idProducto?: Producto;
    cantidad?: number;
    precioUnitario?: number;
    tasaIva?: number;
}
