import { Timestamps } from './auth';

/** Tabla Categoria */
export interface Categoria {
    idCategoria: number;
    nombreCategoria: string;
    descripcionCategoria: string | null;
    categoriaActiva: boolean;
}

/** Tabla Marca */
export interface Marca {
    idMarca: number;
    nombreMarca: string;
    descripcionMarca: string | null;
    marcaActiva: boolean;
}

/** Tabla Producto */
export interface Producto extends Timestamps {
    idProducto: number;
    idCategoria: number;
    sku: string | null;
    nombreProducto: string;
    precioCompraProducto: number;
    precioVentaProducto: number; // GENERATED ALWAYS AS (...) STORED
    impuestoCompra: number; // GENERATED ALWAYS AS (...) STORED
    impuestoVenta: number; // GENERATED ALWAYS AS (...) STORED
    utilidadProducto: number; // GENERATED ALWAYS AS (...) STORED
    descripcionProducto: string | null;
    productoActivo: boolean;
    urlImagenProducto: string | null;
    idMarca: number;
  // Relaciones anidadas (si tu backend las incluye en la respuesta)
    categoria?: Categoria; 
    marca?: Marca;
}