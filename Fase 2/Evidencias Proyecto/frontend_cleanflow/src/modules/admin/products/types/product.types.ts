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

    /** URL de la imagen actual (para previsualización) */
    urlImagenProducto?: string | null;

    /** ID del servicio de imágenes (para UPDATE) */
    publicIdImagen?: string | null;

    /** Estado del producto */
    productoActivo?: boolean;
}

// -----------------------------------------
// DTO PARA CREAR PRODUCTO (POST /productos)
// Campos obligatorios: Los de la base + precioCompraProducto.
// -----------------------------------------
export interface AdminProductCreateDto extends AdminProductFormBase {
    /** Precio base de costo. Requerido en CREATE. */
    precioCompraProducto: number;
}

// -----------------------------------------
// DTO PARA EDITAR PRODUCTO (PUT /productos/:id)
// -----------------------------------------
/** * En la edición, la mayoría de los campos son opcionales, 
 * ya que solo enviamos lo que se ha modificado.
 * Usamos Partial<AdminProductFormBase> para hacer todos los campos opcionales.
 */
export interface AdminProductUpdateDto extends Partial<AdminProductFormBase> {
    idProducto: number; // Requerido para identificar el producto a modificar

    /** * Precio base de costo. Opcional en UPDATE. 
     * Si se envía, la BD recalculará precioVentaProducto e impuestos.
     * * NOTA: Se eliminó 'precioProducto' (inexistente) y 'precioVentaProducto' (generado).
     */
    precioCompraProducto?: number; 
}

// -----------------------------------------
// TABLA ADMIN (listado)
// -----------------------------------------
// NOTA: Si ya tienes una interfaz 'Producto' global (src/types/product.d.ts)
// que incluye las relaciones Categoria y Marca, es mejor usar esa interfaz.
// Si esta interfaz es necesaria para un mapeo específico, aquí está, 
// ajustada para que los tipos concuerden con las interfaces de relación (Categoria/Marca).

export interface AdminProductTableRow {
    idProducto: number;
    nombreProducto: string;
    descripcionProducto?: string | null;
    sku?: string | null;

    precioCompraProducto: number;
    precioVentaProducto: number;
    impuestoCompra: number;
    impuestoVenta: number;
    utilidadProducto: number;

    // Asumo que tu backend anida la relación completa (Tipo Producto de src/types)
    // Si solo devuelve el nombre como string, el tipo correcto es string.
    // Lo dejaré como string para mantener tu estructura original, pero sé consciente
    // de la posible incompatibilidad si el tipo Producto tiene objetos anidados.
    categoria: string; 
    marca: string; 

    productoActivo: boolean;

    urlImagenProducto: string | null; // Cambiado de 'imagen' a 'urlImagenProducto' para concordar con la BD
    publicIdImagen: string | null;

    fechaCreacion: string;
    fechaActualizacion: string;
}