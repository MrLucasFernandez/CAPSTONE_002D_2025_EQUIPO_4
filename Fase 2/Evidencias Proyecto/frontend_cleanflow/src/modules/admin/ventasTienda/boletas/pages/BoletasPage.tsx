import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@admin/context/AdminAuthContext';
import { useBoletas } from '../hooks/useBoletas';
import { MagnifyingGlassIcon, EyeIcon, ArrowPathIcon, TrashIcon } from '@heroicons/react/24/outline';
import { adminUpdateBoleta } from '../api/adminBoletasService';
import Modal from '@components/ui/Modal';
import { useToast } from '@components/ui/ToastContext';
import type { Boleta } from '@models/sales';

const BoletasPage: React.FC = () => {
  const { isAdmin } = useAdminAuth();
  const { boletas, loading, refresh } = useBoletas();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  // Paginación
  const [page, setPage] = useState(1);
  const pageSize = 10; // 10 boletas por página

  // Estado para el modal de confirmación
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBoletaId, setSelectedBoletaId] = useState<number | null>(null);
  const { addToast } = useToast();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return boletas;
    return boletas.filter((b: Boleta) =>
      String(b.idBoleta).includes(q) ||
      String(b.estadoBoleta ?? '').toLowerCase().includes(q) ||
      String(b.fecha ?? '').toLowerCase().includes(q)
    );
  }, [boletas, query]);

  // reset page cuando cambia la búsqueda o la lista
  useEffect(() => {
    setPage(1);
  }, [query, boletas.length]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageItems = filtered.slice(startIndex, endIndex);

  if (!isAdmin) {
    return (
      <div className="p-6 text-center text-red-600 font-bold">No tienes permisos para ver esta página.</div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Boletas</h1>
          <p className="text-sm text-gray-500">Gestión de boletas de tienda — revisa ventas y pagos.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refresh()}
            className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-emerald-600 to-green-500 px-4 py-2 text-sm font-semibold text-white shadow hover:brightness-105"
            title="Refrescar"
          >
            <ArrowPathIcon className="h-5 w-5" />
            Refrescar
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative w-full max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              className="w-full rounded-md border border-gray-200 bg-white py-2 pl-10 pr-3 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              placeholder="Buscar por ID, estado o fecha (YYYY-MM-DD)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ESTADO</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">Cargando boletas...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">No se encontraron boletas.</td>
                </tr>
              ) : (
                currentPageItems.map((b: Boleta) => {
                  const totalNum = Number(b.totalBoleta ?? 0);
                  const fechaDisplay = b.fecha ? new Date(b.fecha).toLocaleString() : '-';

                  return (
                      <tr key={b.idBoleta} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{b.idBoleta}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{fechaDisplay}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 font-semibold">{b.estadoBoleta ?? '-'}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-900">CLP {new Intl.NumberFormat('es-CL',{maximumFractionDigits:0}).format(Math.round(totalNum))}</td>
                      <td className="px-6 py-4 text-center text-sm">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/ventas/boletas/${b.idBoleta}`)}
                          className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                          title="Ver boleta"
                        >
                          <EyeIcon className="h-4 w-4 text-gray-600" />
                          Ver
                        </button>

                        <button
                          onClick={() => {
                            setSelectedBoletaId(b.idBoleta);
                            setDeleteModalOpen(true);
                          }}
                          className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-1 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-100"
                          title="Anular boleta"
                        >
                          <TrashIcon className="h-4 w-4 text-red-600" />
                          Anular
                        </button>
                      </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

          {/* Paginación */}
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
      </div>

      {/* Modal de confirmación para borrar */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Anular boleta" width="max-w-md">
        <p className="text-gray-700">¿Estás seguro que deseas anular la boleta <span className="font-semibold">#{selectedBoletaId}</span>? El estado cambiará a <span className="font-semibold">RECHAZADA</span>.</p>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">Cancelar</button>

          <button
            onClick={async () => {
              if (!selectedBoletaId) return;
              try {
                await adminUpdateBoleta(selectedBoletaId, { estadoBoleta: 'RECHAZADA' });
                addToast('Boleta anulada correctamente.', 'success');
                setDeleteModalOpen(false);
                setSelectedBoletaId(null);
                await refresh();
              } catch (err: any) {
                console.error('Error anulando boleta', err);
                addToast('No se pudo anular la boleta: ' + (err?.message ?? ''), 'error');
                setDeleteModalOpen(false);
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Anular
          </button>
        </div>
      </Modal>

    </div>
  );
};

export default BoletasPage;
