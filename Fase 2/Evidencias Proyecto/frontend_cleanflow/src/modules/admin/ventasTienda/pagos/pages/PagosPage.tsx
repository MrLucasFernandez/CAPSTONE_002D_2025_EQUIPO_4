import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Pago } from '@models/sales';
import { adminGetPagos } from '../api/adminPagosService';

const PagosPage: React.FC = () => {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState<boolean | null>(null);

  // paginación
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await adminGetPagos();
        setPagos(data || []);
      } catch (err: any) {
        setError(err?.message ?? 'Error al cargar pagos');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pagos;
    return pagos.filter((p) => JSON.stringify(p).toLowerCase().includes(q));
  }, [pagos, query]);

  const sorted = useMemo(() => {
    const list = filtered.slice();
    if (sortAsc === true) {
      list.sort((a, b) => Number(a.idPago) - Number(b.idPago));
    } else if (sortAsc === false) {
      list.sort((a, b) => Number(b.idPago) - Number(a.idPago));
    }
    return list;
  }, [filtered, sortAsc]);

  useEffect(() => setPage(1), [query, pagos.length, sortAsc]);

  const totalItems = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageItems = sorted.slice(startIndex, endIndex);

  const fmtDate = (iso?: string) => (iso ? new Date(iso).toLocaleString('es-PE') : '-');
  const fmtMoney = (v?: number) => (typeof v === 'number' ? new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(v) : '-');

  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Pagos</h2>
      <p className="text-sm text-gray-500 mb-4">Historial y gestión de pagos.</p>

      <div className="mb-3 flex items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar pagos..."
          className="w-full max-w-md rounded-md border bg-white py-2 px-3 text-sm shadow-sm placeholder:text-gray-400"
        />

        <div className="inline-flex items-center gap-2">
          <button
            onClick={() => setSortAsc(prev => prev === true ? null : true)}
            className={`px-3 py-2 rounded-md text-sm font-semibold ${sortAsc === true ? 'bg-emerald-600 text-white' : 'bg-white border'}`}
            title="Ordenar por ID ascendente"
          >
            ID ↑
          </button>

          <button
            onClick={() => setSortAsc(prev => prev === false ? null : false)}
            className={`px-3 py-2 rounded-md text-sm font-semibold ${sortAsc === false ? 'bg-emerald-600 text-white' : 'bg-white border'}`}
            title="Ordenar por ID descendente"
          >
            ID ↓
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-100 bg-white shadow overflow-x-auto">
        <div className="p-3 border-b border-gray-100">
          <button
            onClick={() => navigate('/admin/ventas')}
            className="w-full rounded-md bg-gray-50 border border-gray-200 py-2 px-3 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            ← Volver a ventas
          </button>
        </div>
        <table className="min-w-full w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID PAGO</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID BOLETA</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Monto (CLP)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">Cargando pagos...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-red-600">{error}</td>
              </tr>
            ) : totalItems === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">No se encontraron pagos.</td>
              </tr>
            ) : (
              currentPageItems.map((p: Pago) => (
                <tr key={p.idPago} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{p.idPago}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-[100px] truncate">{p.idBoleta}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-[160px] truncate">{fmtDate(p.fecha)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-[140px] truncate">{p.metodoPago}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-semibold max-w-[120px] truncate">{p.estado}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-900">{fmtMoney(p.monto)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalItems > 0 && (
        <div className="mt-4 flex items-center justify-between px-2">
          <div className="text-sm text-gray-600">Mostrando {Math.min(totalItems, startIndex + 1)} - {Math.min(totalItems, endIndex)} de {totalItems}</div>
          <div className="inline-flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-3 py-1 rounded-md border text-sm ${page === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white hover:bg-gray-50'}`}
            >Anterior</button>

            <div className="text-sm text-gray-700">{page} / {totalPages}</div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded-md border text-sm ${page === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white hover:bg-gray-50'}`}
            >Siguiente</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PagosPage;
