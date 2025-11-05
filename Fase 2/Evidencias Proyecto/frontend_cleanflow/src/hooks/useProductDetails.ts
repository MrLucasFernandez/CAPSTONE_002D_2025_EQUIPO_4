import { useState, useEffect } from 'react';

// Interfaz del producto 
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
 */
export const useProductDetails = (productId: number | null): ProductDetailsResult => {
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const authToken = localStorage.getItem('authToken') || 'dummy-admin-token';

    useEffect(() => {
        if (!productId || productId <= 0 || !authToken) {
            setIsLoading(false);
            return;
        }

        const fetchProduct = async () => {
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
