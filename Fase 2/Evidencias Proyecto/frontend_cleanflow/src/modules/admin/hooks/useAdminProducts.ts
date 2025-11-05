import { useState, useEffect, useCallback } from 'react';
import { useAdminAuth } from './useAdminAuth'; 

// Define el tipo de dato para un producto
export interface Product {
    idProducto: number;
    nombreProducto: string;
    precioProducto: number; 
    sku: string;
    productoActivo: boolean;
    categoriaNombre: string; 
}

const API_PRODUCTS_URL = 'http://localhost:3001/api/admin/products';

export const useAdminProducts = () => {
    const { user, isAuthenticated } = useAdminAuth(); 
    
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async (isCancelled: boolean) => { 
        // 1. Verificar autenticación y token
        if (!isAuthenticated || !user?.token) {
            setError("Error de autenticación: Token de admin faltante.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        
        try {
            const response = await fetch(API_PRODUCTS_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`, 
                },
            });

            if (isCancelled) return; 

            if (!response.ok) {
                
                const contentType = response.headers.get("content-type");
                let errorMessage = `Fallo HTTP: ${response.status} ${response.statusText}`;

                if (contentType && contentType.includes("application/json")) {
                    // Si es JSON, intentamos obtener el mensaje de error del cuerpo
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.message || errorMessage;
                    } catch (parseError) {
                        console.warn("Fallo al parsear JSON de error:", parseError);
                    }
                } else {
                    // Si es HTML u otro formato 
                    console.error(`La API devolvió contenido no-JSON (Content-Type: ${contentType}) para un error ${response.status}.`);
                }
                
                throw new Error(errorMessage);
            }

            const data = await response.json();
            
            if (!Array.isArray(data.products)) {
                throw new Error("El formato de respuesta de la API es incorrecto (se esperaba un array en la propiedad 'products').");
            }
            
            setProducts(data.products);
            
        } catch (err) {
            if (isCancelled) return; 
            
            let errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar productos.';
            
            if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
                errorMessage = "Error de conexión: El servidor (http://localhost:3001) parece estar inactivo o inaccesible. Asegúrate de que tu API de Express esté corriendo.";
            }

            console.error("Error en useAdminProducts:", errorMessage);
            setError(errorMessage);
        } finally {
            if (!isCancelled) { 
                setIsLoading(false);
            }
        }
    }, [isAuthenticated, user?.token]);

    useEffect(() => {
        let isCancelled = false;
        
        fetchProducts(isCancelled); 

        return () => {
            isCancelled = true; 
        };
    }, [fetchProducts]); 

    return { products, isLoading, error, fetchProducts };
};
