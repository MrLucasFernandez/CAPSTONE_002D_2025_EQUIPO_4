import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdminAuth } from '@admin/context/AdminAuthContext';
import { useBoletas, type Boleta } from '../hooks/useBoletas';
import { adminGetBoletaById } from '../api/adminBoletasService';
import { adminGetDetalleById } from '../api/adminDetalleService';
import { useEffect, useState } from 'react';
import { ArrowLeftIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';
import Modal from '@components/ui/Modal';
import { BoletaHeader } from '../components/molecules/BoletaHeader';
import { BoletaDetailsView } from '../components/organisms/BoletaDetailsView';
import { BoletaSummary } from '../components/molecules/BoletaSummary';
import { ItemsListModal } from '../components/molecules/ItemsListModal';

const BoletaDetailPage: React.FC = () => {
  const { isAdmin } = useAdminAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loading: listLoading } = useBoletas();

  const [boleta, setBoleta] = useState<Boleta | null>(null);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [itemsListModal, setItemsListModal] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoadingDetail(true);
      setError(null);
      try {
        const data = await adminGetBoletaById(id);
        console.log('Boleta cargada:', data); // DEBUG
        
        // Normalizar estructura: aceptar múltiples claves de backend
        const rawDetalles = (data as any).detalles
          ?? (data as any).detalle
          ?? (data as any).detalleBoleta
          ?? (data as any).items
          ?? [];
        let detalles = rawDetalles;
        
        // Enriquecer detalles con información del producto usando /detalle/{id}
        const enrichedDetalles = await Promise.all(
          detalles.map(async (det: any) => {
            try {
              const fullDetail = await adminGetDetalleById(det.idDetalle);
              console.log('Full detail cargado:', fullDetail); // DEBUG
              return {
                idDetalle: det.idDetalle,
                idBoleta: det.idBoleta ?? fullDetail.idBoleta,
                cantidad: det.cantidad ?? fullDetail.cantidad,
                precioUnitario: det.precioUnitario ?? fullDetail.precioUnitario,
                producto: fullDetail.idProducto, // Producto completo con todos sus campos
              };
            } catch (err) {
              console.warn(`Error al cargar detalle ${det.idDetalle}:`, err);
              return det; // Devolver sin enriquecer si falla
            }
          })
        );
        
        const normalizedBoleta = {
          ...data,
          detalle: enrichedDetalles,
          detalles: enrichedDetalles,
          usuario: (data as any).usuario ?? (data as any).idUsuario ?? undefined,
        } as Boleta;
        
        console.log('Boleta normalizada con detalles enriquecidos:', normalizedBoleta); // DEBUG
        setBoleta(normalizedBoleta);
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

  if (listLoading || loadingDetail) return (
    <div className="p-6 flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500 mx-auto mb-4"></div>
        <p className="text-sm text-gray-500">Cargando boleta...</p>
      </div>
    </div>
  );

  if (error || !boleta) {
    return (
      <div className="p-6">
        <button
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon className="h-4 w-4" /> Volver
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <DocumentCheckIcon className="h-12 w-12 text-red-400 mx-auto mb-3" />
          <p className="text-red-700 font-medium">{error ?? 'Boleta no encontrada.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <BoletaHeader boleta={boleta} onBackClick={() => navigate(-1)} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BoletaDetailsView boleta={boleta} onViewItems={() => setItemsListModal(true)} />
        </div>

        <BoletaSummary boleta={boleta} />
      </div>

      {/* Modal de Items de la Boleta */}
      <Modal
        isOpen={itemsListModal}
        onClose={() => setItemsListModal(false)}
        title="Items de la Boleta"
      >
        <ItemsListModal items={(boleta?.detalle ?? boleta?.detalles) ?? []} />
      </Modal>
    </div>
  );
};

export default BoletaDetailPage;
