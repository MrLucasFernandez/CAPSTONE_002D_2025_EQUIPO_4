// src/api/productService.ts
import { apiRequest } from './apiClient';
import type { Producto, Categoria, Marca } from '../types/product'; 

// Tipo para datos que se pueden enviar al crear/actualizar un producto
// Omitimos los campos autogenerados por la base de datos
type ProductoSaveData = Omit<Producto, 
    'idProducto' 
    | 'precioVentaProducto' 
    | 'impuestoCompra' 
    | 'impuestoVenta' 
    | 'utilidadProducto' 
    | 'fechaCreacion' 
    | 'fechaActualizacion'
>;


/**
 * Obtiene la lista de todos los productos (GET /productos)
 * Requiere autenticación (por defecto en apiRequest)
 */
export function getAllProducts(): Promise<Producto[]> {
    return apiRequest<Producto[]>('/productos'); 
}

/**
 * Crea un nuevo producto (POST /productos)
 */
export function createProduct(data: ProductoSaveData): Promise<Producto> {
    return apiRequest<Producto>('/productos', { method: 'POST', body: data });
}

/**
 * 🚨 FUNCIÓN FALTANTE AÑADIDA
 * Elimina un producto por ID (DELETE /productos/{id})
 * @param id El ID del producto a eliminar.
 */
export function deleteProduct(id: number): Promise<void> {
    // Usamos DELETE en el endpoint /productos/{id} y esperamos una respuesta vacía (<void>)
    return apiRequest<void>(`/productos/${id}`, { method: 'DELETE' });
}

// --- Servicios de Relaciones ---

/**
 * Obtiene todas las categorías (GET /categorias)
 */
export function getAllCategorias(): Promise<Categoria[]> {
    return apiRequest<Categoria[]>('/categorias');
}

/**
 * Obtiene todas las marcas (GET /marcas)
 */
export function getAllMarcas(): Promise<Marca[]> {
    return apiRequest<Marca[]>('/marcas');
}