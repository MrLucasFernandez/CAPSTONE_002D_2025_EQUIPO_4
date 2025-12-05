import { useState, useEffect, useCallback } from 'react';
import { adminGetBoletas } from '../api/adminBoletasService';
import type { Boleta } from '@models/sales';

export const useBoletas = () => {
  const [boletas, setBoletas] = useState<Boleta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBoletas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminGetBoletas();
      // Asegurar tipos y normalizar números
      const normalized = (data ?? []).map((b: any) => ({
        idBoleta: b.idBoleta,
        fecha: b.fecha,
        estadoBoleta: b.estadoBoleta,
        subtotalBoleta: Number(b.subtotalBoleta ?? 0),
        impuesto: Number(b.impuesto ?? 0),
        totalBoleta: Number(b.totalBoleta ?? 0),
        detalle: b.detalle ?? undefined,
        usuario: b.usuario ?? undefined,
      }));

      setBoletas(normalized as Boleta[]);
    } catch (err: any) {
      console.error('Error cargando boletas', err);
      setError(err?.message || 'Error al cargar boletas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBoletas();
  }, [fetchBoletas]);

  return {
    boletas,
    loading,
    error,
    refresh: fetchBoletas,
  };
};

export type { Boleta };
