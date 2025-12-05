import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdminAuth } from '@admin/context/AdminAuthContext';
import { useBoletas, type Boleta } from '../hooks/useBoletas';
import { adminGetBoletaById } from '../api/adminBoletasService';
import { useEffect, useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const BoletaDetailPage: React.FC = () => {
  const { isAdmin } = useAdminAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loading: listLoading } = useBoletas();

  const [boleta, setBoleta] = useState<Boleta | null>(null);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoadingDetail(true);
      setError(null);
      try {
        const data = await adminGetBoletaById(id);
        setBoleta(data as Boleta);
      } catch (err: any) {
        console.error('Error al obtener boleta:', err);
        setError(err?.message || 'Error al cargar la boleta');
      } finally {
        setLoadingDetail(false);
      }
    };

    load();
  }, [id]);

  if (!isAdmin) return <div className="p-6 text-center text-red-600 font-bold">No tienes permisos para ver esta página.</div>;

  if (listLoading || loadingDetail) return <div className="p-6 text-sm text-gray-500">Cargando boleta...</div>;

  if (error || !boleta) {
    return (
      <div className="p-6">
        <button
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon className="h-4 w-4" /> Volver
        </button>

        <div className="mt-6 rounded-lg border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">{error ?? 'Boleta no encontrada.'}</div>
      </div>
    );
  }

  const fechaDisplay = boleta.fecha ? new Date(boleta.fecha).toLocaleString() : '-';
  const subtotal = Number(boleta.subtotalBoleta ?? 0);
  const impuesto = Number(boleta.impuesto ?? 0);
  const total = Number(boleta.totalBoleta ?? 0);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Boleta #{boleta.idBoleta}</h2>
          <p className="text-sm text-gray-500">Fecha: {fechaDisplay}</p>
          <p className="text-sm text-gray-500">Estado: {boleta.estadoBoleta ?? '-'}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-4 w-4" /> Volver
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-2 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Detalles</h3>
          <dl className="mt-3 grid grid-cols-1 gap-3 text-sm text-gray-700">
            <div className="flex justify-between">
              <dt className="font-semibold">Subtotal</dt>
              <dd>S/ {subtotal.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-semibold">Impuesto</dt>
              <dd>S/ {impuesto.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-semibold">Total</dt>
              <dd className="font-semibold">S/ {total.toFixed(2)}</dd>
            </div>
          </dl>

          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-500">Items</h4>
            <p className="mt-2 text-sm text-gray-400">(Si deseas ver items, el endpoint debe incluirlos o llamar al endpoint de detalle.)</p>
          </div>
        </div>

        <aside className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Resumen</h3>
          <div className="mt-4 space-y-3 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>S/ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Impuestos</span>
              <span>S/ {impuesto.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>S/ {total.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BoletaDetailPage;
