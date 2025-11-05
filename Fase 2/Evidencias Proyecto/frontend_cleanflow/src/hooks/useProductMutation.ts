import { useState } from 'react';
import type { ProductFormData } from '../modules/admin/components/ProductForm';

// Estructura del resultado de la mutación
interface MutationResult {
  data: ProductFormData | null;
  isLoading: boolean;
  error: string | null;
  /**
   * Ejecuta la mutación para crear o editar un producto.
   * @param formData Los datos del formulario a enviar.
   * @param productId ID del producto a editar. Si está ausente, se realiza una creación (POST).
   */
  mutate: (formData: ProductFormData, productId?: number) => Promise<void>;
}

export const useProductMutation = (): MutationResult => {
  const [data, setData] = useState<ProductFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (formData: ProductFormData, productId?: number) => {
    setIsLoading(true);
    setError(null);

    const isEditing = productId !== undefined && productId > 0;
    const method = isEditing ? 'PUT' : 'POST'; 
    // /api/products para POST y /api/products/:id para PUT
    const url = isEditing 
    ? `http://localhost:3001/api/products/${productId}` 
    : `http://localhost:3001/api/products`;
    
    // Obtener token de autenticación (Necesario para rutas de administrador)
    // Usamos 'dummy-admin-token' como fallback, pero debe ser el token real
    const authToken = localStorage.getItem('authToken') || 'dummy-admin-token';

    try {
    const response = await fetch(url, {
        method: method,
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`, 
        },
        body: JSON.stringify(formData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Fallo al ${isEditing ? 'editar' : 'crear'} producto: ${errorData.message || response.statusText}`);
    }
    const resultData = await response.json();
    setData(resultData);
    
    console.log(`Producto ${isEditing ? 'editado' : 'creado'} con éxito.`, resultData);

    } catch (e) {
    if (e instanceof Error) {
        setError(e.message);
    } else {
        setError(`Ocurrió un error desconocido durante la mutación: ${String(e)}`);
    }
    } finally {
    setIsLoading(false);
    }
};

return { data, isLoading, error, mutate };
};
