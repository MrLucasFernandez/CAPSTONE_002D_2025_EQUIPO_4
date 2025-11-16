// src/modules/admin/products/types/product.types.ts

// -----------------------------------------
// BASE COMPARTIDA ENTRE CREATE / UPDATE
// -----------------------------------------
export interface AdminProductFormBase {
    nombreProducto: string;
    descripcionProducto?: string | null;
    sku?: string | null;

    idCategoria: number;
    idMarca: number;

    /** Nueva imagen seleccionada (solo si usuario sube una) */
    imagen?: File | null;

    /** Imagen actual (solo edición) */
    urlImagenProducto?: string | null;

    /** ID de Cloudinary (solo edición si existe) */
    publicIdImagen?: string | null;

    /** Estado del producto */
    productoActivo?: boolean;
}

// -----------------------------------------
// DTO PARA CREAR PRODUCTO (POST /productos)
// Tu backend usa precioCompraProducto
// -----------------------------------------
export interface AdminProductCreateDto extends AdminProductFormBase {
    precioCompraProducto: number;
}

// -----------------------------------------
// DTO PARA EDITAR PRODUCTO (PUT /productos/:id)
// Tu backend usa precioProducto + precioVentaProducto
// ❗ No usa precioCompraProducto en PUT (según tu error)
// -----------------------------------------
export interface AdminProductUpdateDto extends AdminProductFormBase {
    idProducto: number;

    precioProducto: number;
    precioVentaProducto: number;
}

// -----------------------------------------
// TABLA ADMIN (listado)
// -----------------------------------------
export interface AdminProductTableRow {
    idProducto: number;
    nombreProducto: string;

    precioCompraProducto: number;
    precioVentaProducto: number;

    impuestoCompra: number;
    impuestoVenta: number;
    utilidadProducto: number;

    categoria: string;
    marca: string;

    productoActivo: boolean;

    imagen: string | null;

    fechaCreacion: string;
    fechaActualizacion: string;
}
