import { useEffect, useState } from 'react';
import { getPublicMarcas } from '@/modules/products/api/productService';
import type { Marca } from '@models/product';
import BrandsList from '../organisms/BrandsList';

export default function BrandsPage() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await getPublicMarcas();
        if (!mounted) return;
        setMarcas(data || []);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar las marcas.');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Marcas</h1>
        <p className="mt-2 text-gray-600">Explora las marcas disponibles en nuestra tienda.</p>
      </header>

      {loading && <p className="text-center text-gray-600 py-8">Cargando marcas...</p>}
      {error && <p className="text-center text-red-600 py-8">{error}</p>}

      {!loading && !error && <BrandsList marcas={marcas} />}
    </div>
  );
}
