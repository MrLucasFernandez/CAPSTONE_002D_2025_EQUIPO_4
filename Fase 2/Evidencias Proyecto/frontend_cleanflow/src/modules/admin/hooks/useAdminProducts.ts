import { useState, useEffect, useCallback } from 'react';
import { useAdminAuth } from './useAdminAuth'; 

// Define el tipo de dato para un producto (debe coincidir con tu BD)
export interface Product {
    idProducto: number;
    nombreProducto: string;
    precioProducto: number; // O number si lo conviertes
    sku: string;
    productoActivo: boolean;
    categoriaNombre: string; // Traeremos el nombre de la categoría
}

const API_PRODUCTS_URL = 'http://localhost:3001/api/admin/products';

export const useAdminProducts = () => {
    const { user, isAuthenticated } = useAdminAuth(); 
    
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async (isCancelled: boolean) => { // 👈 Recibe un parámetro
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

            if (isCancelled) return; // 👈 Chequeo de cancelación

            if (!response.ok) {
                // -----------------------------------------------------
                // 🚨 CAMBIO CLAVE: Manejo de respuesta que no es JSON
                // -----------------------------------------------------
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
                    // Si es HTML u otro formato (donde ocurre el error '<!doctype...'),
                    // simplemente reportamos el estado HTTP.
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
            if (isCancelled) return; // 👈 Chequeo de cancelación
            
            let errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar productos.';
            
            // 🚨 Mejora Diagnóstica para errores de conexión
            if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
                errorMessage = "Error de conexión: El servidor (http://localhost:3001) parece estar inactivo o inaccesible. Asegúrate de que tu API de Express esté corriendo.";
            }

            console.error("Error en useAdminProducts:", errorMessage);
            setError(errorMessage);
        } finally {
            if (!isCancelled) { // 👈 Solo cambia el estado si no fue cancelado
                setIsLoading(false);
            }
        }
    }, [isAuthenticated, user?.token]);

    // Implementa el mecanismo de limpieza del useEffect
    useEffect(() => {
        let isCancelled = false; // Bandera de cancelación
        
        // Pasamos la bandera a la función de fetch
        fetchProducts(isCancelled); 

        // Función de limpieza: se ejecuta al desmontar (o antes del segundo mount en Strict Mode)
        return () => {
            isCancelled = true; // Establece la bandera para detener el procesamiento de la primera llamada
        };
    }, [fetchProducts]); 

    // Exporta los datos y el estado para que la página los use
    return { products, isLoading, error, fetchProducts };
};
