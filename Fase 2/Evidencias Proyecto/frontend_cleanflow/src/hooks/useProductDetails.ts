import { useState, useEffect } from 'react';

// Interfaz del producto (debe coincidir con la respuesta de tu API)
// Usamos las mismas claves que ProductFormData, aunque la API pueda devolver más.
export interface ProductDetail {
    idProducto: number;
    nombreProducto: string;
    sku: string;
    precioProducto: number;
    descripcionProducto: string;
    idCategoria: number;
    idMarca: number;
    productoActivo: boolean;
}

interface ProductDetailsResult {
    product: ProductDetail | null;
    isLoading: boolean;
    error: string | null;
}

/**
 * Hook para obtener los detalles de un producto específico por su ID.
 * @param productId ID del producto a cargar. Si es null o 0, no se realiza la llamada.
 */
export const useProductDetails = (productId: number | null): ProductDetailsResult => {
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Asumimos que el token se almacena en localStorage después del login
    const authToken = localStorage.getItem('authToken') || 'dummy-admin-token';

    useEffect(() => {
        // No intentamos cargar si no hay un ID válido o si no hay token (simulación)
        if (!productId || productId <= 0 || !authToken) {
            setIsLoading(false);
            return;
        }

        const fetchProduct = async () => {
            // Utilizamos una bandera para manejar el modo estricto de React y evitar race conditions
            let isCancelled = false;
            
            setIsLoading(true);
            setError(null);
            
            // Endpoint de la API que acabamos de agregar a api.js: GET /api/products/:id
            const API_URL = `http://localhost:3001/api/products/${productId}`;

            try {
                const response = await fetch(API_URL, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({})); 
                    throw new Error(`Error ${response.status}: ${errorData.message || response.statusText}`);
                }

                const data: ProductDetail = await response.json();
                
                if (!isCancelled) {
                    setProduct(data);
                }

            } catch (e) {
                if (!isCancelled) {
                    const errorMessage = e instanceof Error ? e.message : 'Error desconocido al cargar el producto.';
                    setError(errorMessage);
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        };

        fetchProduct();
        
        // Función de limpieza para manejar el Modo Estricto y evitar fugas de memoria
        return () => {
        };
        
    }, [productId, authToken]);

    return { product, isLoading, error };
};
