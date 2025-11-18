import { Timestamps } from './auth';

export interface Categoria {
    idCategoria: number;
    nombreCategoria: string;
    descripcionCategoria: string | null;
    categoriaActiva: boolean;
}

export interface Marca {
    idMarca: number;
    nombreMarca: string;
    descripcionMarca: string | null;
    marcaActiva: boolean;
}

/** Modelo real de la tabla Producto */
export interface Producto extends Timestamps {
    idProducto: number;
    idCategoria: number;
    sku: string | null;
    nombreProducto: string;
    precioCompraProducto: number;
    precioVentaProducto: number;
    impuestoCompra: number;
    impuestoVenta: number;
    utilidadProducto: number;
    descripcionProducto: string | null;
    productoActivo: boolean;
    urlImagenProducto: string | null;
    publicIdImagen: string | null;
    idMarca: number;

    categoria: Categoria | null; // El backend devuelve el objeto o null
    marca: Marca | null;         // El backend devuelve el objeto o null
}
