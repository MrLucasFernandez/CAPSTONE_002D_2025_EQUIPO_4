// src/hooks/useCategories.ts

import { useState, useEffect } from 'react';

// Define la estructura para la Categoria (coincide con tu DB)
export interface Category {
  idCategoria: number;
  nombreCategoria: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      // ⚠️ ADVERTENCIA: Reemplaza esta URL con el endpoint real de tu API para Categorías
      const API_URL = 'http://localhost:3001/api/categories';
      
      try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error(`Error HTTP al cargar categorías: ${response.status}`);
        }
        
        const data: Category[] = await response.json();
        setCategories(data);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('Ocurrió un error desconocido al cargar categorías: ' + String(e));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoading, error };
};