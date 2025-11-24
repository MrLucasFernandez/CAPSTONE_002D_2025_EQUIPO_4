import type { User } from './user';
import type { Producto } from './product';

/** Tabla Boleta (encabezado) */
export interface Boleta {
    idBoleta: number;
    idUsuario: number;
    fecha: string; // TIMESTAMPTZ
    estadoBoleta: string;
    subtotalBoleta: number;
    impuesto: number;
    totalBoleta: number;
  // Relaciones 
    usuario?: User;
    detalle?: DetalleBoleta[];
}

/** Tabla Detalle_boleta (líneas) */
export interface DetalleBoleta {
    idDetalle: number;
    idBoleta: number;
    idProducto: number;
    cantidad: number;
    precioUnitario: number;
  // Relación
    producto?: Producto;
}

/** Tabla Pago */
export interface Pago {
    idPago: number;
    idBoleta: number;
    fecha: string; // TIMESTAMPTZ
    monto: number;
    estado: string;
    metodoPago: string;
}