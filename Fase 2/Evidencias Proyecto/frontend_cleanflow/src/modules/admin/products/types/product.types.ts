// src/modules/admin/products/types/product.types.ts

// -----------------------------------------
// Datos base compartidos creación / edición
// -----------------------------------------
export interface AdminProductFormBase {
    nombreProducto: string;
    descripcionProducto?: string | null;
    sku?: string | null;

    idCategoria: number;
    idMarca: number;

    /** Imagen nueva a subir (opcional en edición) */
    imagen?: File | null;

    /** Imagen previa (solo para edición) */
    urlImagenProducto?: string | null;

    /** Public ID de Cloudinary (solo si existe) */
    publicIdImagen?: string | null;
}

// -----------------------------------------
// Crear producto — tu backend usa precioCompraProducto
// -----------------------------------------
export interface AdminProductCreateDto extends AdminProductFormBase {
  precioCompraProducto: number; // lo mantengo porque tu backend lo usa en POST
}

// -----------------------------------------
// Editar producto — tu backend usa precioProducto y precioVentaProducto
// -----------------------------------------
export interface AdminProductUpdateDto extends AdminProductFormBase {
    idProducto: number;

    /** Tu backend NO acepta precioCompraProducto en PUT */
    precioProducto: number;

    precioVentaProducto: number;

    productoActivo?: boolean;
}

// -----------------------------------------
// Tabla — para mostrar en listados
// -----------------------------------------
export interface AdminProductTableRow {
    idProducto: number;
    nombreProducto: string;
    precioVentaProducto: number;

    categoria: string;
    marca: string;

    productoActivo: boolean;

    /** URL final de Cloudinary */
    imagen: string | null;
}
