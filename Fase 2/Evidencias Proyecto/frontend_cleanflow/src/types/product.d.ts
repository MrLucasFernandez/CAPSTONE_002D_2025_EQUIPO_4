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

export interface Bodega {
  idBodega: number;
  nombre: string;
  direccionBodega?: string | null;
}

export interface StockItem {
  idBodega: number;
  idProducto: number;
  cantidad: number;
  bodega?: Bodega | null;
}

export interface Producto extends Timestamps {
  idProducto: number;
  idCategoria: number;
  idMarca: number;

  sku: string | null;
  nombreProducto: string;
  precioCompraProducto: number;
  precioVentaProducto: number;
  impuestoCompra: number;
  impuestoVenta: number;
  utilidadProducto: number;

  descripcionProducto: string | null;
  productoActivo: boolean;

  /** El backend a veces devuelve string, a veces objeto */
  urlImagenProducto: string | Record<string, any> | null;
  publicIdImagen: string | null;

  stock: Stock;

  idBodega?: number | null;

  /** Relacionales agregadas por tu hook */
  categoria?: Categoria | null;
  marca?: Marca | null;
  bodega?: Bodega | null;
}
