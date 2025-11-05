// src/hooks/useProducts.ts

import { useState, useEffect } from 'react';

// Estructura de producto 
interface Product {
  idproducto: number;
  nombreproducto: string;
  precioproducto: number;
  sku: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/products');
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (e) {
  // 1. Verifica si 'e' es una instancia de la clase Error
  if (e instanceof Error) {
    setError(e.message);
  } else {
    // 2. Si no es un Error estándar (podría ser una cadena o un objeto simple), se convierte a string.
    setError('Ocurrió un error desconocido: ' + String(e));
  }
} finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, isLoading, error };
};