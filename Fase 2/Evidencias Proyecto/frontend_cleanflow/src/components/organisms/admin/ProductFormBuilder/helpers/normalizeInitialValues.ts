import type { Producto } from "@models/product";

export function normalizeInitialValues(product: Producto) {
    return {
        idCategoria: product.idCategoria,
        idMarca: product.idMarca,
        idBodega: product.idBodega ?? "",
        nombreProducto: product.nombreProducto,
        descripcionProducto: product.descripcionProducto ?? "",
        precioCompraProducto: product.precioCompraProducto,
        sku: product.sku ?? "",
        productoActivo: !!product.productoActivo,
    };
}

export function getDefaultCreateValues() {
    return {
        nombreProducto: "",
        precioCompraProducto: 0,
        idCategoria: "",
        idMarca: "",
        descripcionProducto: "",
        sku: "",
        productoActivo: true,
        imagen: null,
        stockInicial: 0,
        idBodega: "",
    };
}

export function getImagePreviewUrl(product?: Producto | null) {
    if (
        !product ||
        typeof product.urlImagenProducto !== "string" ||
        !product.urlImagenProducto.startsWith("http")
    ) {
        return null;
    }

    return product.urlImagenProducto;
}
