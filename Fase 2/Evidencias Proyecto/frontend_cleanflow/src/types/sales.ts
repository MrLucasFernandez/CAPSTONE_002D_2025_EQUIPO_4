import type { User } from './user';
import type { Producto } from './product';

/** Tabla Boleta (encabezado) */
export interface Boleta {
    idBoleta: number;
    fecha: string; // TIMESTAMPTZ (ISO)
    estadoBoleta: string;
    subtotalBoleta: number;
    impuesto: number;
    totalBoleta: number;
  // Relaciones opcionales (pueden no venir desde el endpoint list)
    usuario?: User;
    detalle?: DetalleBoleta[];
    detalles?: DetalleBoleta[]; // Alternativa del backend
}

/** Tabla Detalle_boleta (líneas) */
export interface DetalleBoleta {
    idDetalle: number;
    idBoleta: number;
    cantidad: number;
    precioUnitario: number;
  // Relación opcional con producto, si el backend la incluye
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