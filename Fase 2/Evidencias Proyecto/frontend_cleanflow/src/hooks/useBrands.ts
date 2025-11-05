// src/hooks/useBrands.ts

import { useState, useEffect } from 'react';

// Define la estructura para la Marca (coincide con tu DB)
export interface Brand {
  idMarca: number;
  nombreMarca: string;
}

export const useBrands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      // ⚠️ ADVERTENCIA: Reemplaza esta URL con el endpoint real de tu API para Marcas
      const API_URL = 'http://localhost:3001/api/brands';
      
      try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error(`Error HTTP al cargar marcas: ${response.status}`);
        }
        
        const data: Brand[] = await response.json();
        setBrands(data);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('Ocurrió un error desconocido al cargar marcas: ' + String(e));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return { brands, isLoading, error };
};