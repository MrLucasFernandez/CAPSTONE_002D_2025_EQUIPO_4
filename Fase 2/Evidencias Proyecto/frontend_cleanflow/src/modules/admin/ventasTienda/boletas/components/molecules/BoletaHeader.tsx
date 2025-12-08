import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { StatusBadge } from '../atoms/StatusBadge';
import type { Boleta } from '../../hooks/useBoletas';

interface BoletaHeaderProps {
  boleta: Boleta;
  onBackClick: () => void;
}

export function BoletaHeader({ boleta, onBackClick }: BoletaHeaderProps) {
  const fechaDisplay = boleta.fecha
    ? new Date(boleta.fecha).toLocaleString('es-CL')
    : '-';

  return (
    <div className="mb-8">
      <button
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        onClick={onBackClick}
      >
        <ArrowLeftIcon className="h-4 w-4" /> Volver
      </button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">Boleta #{boleta.idBoleta}</h1>
          <p className="text-gray-600 mt-1">Gestión de boletas y pagos</p>
        </div>
        
        <StatusBadge estado={boleta.estadoBoleta ?? '-'} size="md" />
      </div>

      <p className="text-sm text-gray-500 mt-4">
        Fecha: <span className="font-semibold text-gray-900">{fechaDisplay}</span>
      </p>
    </div>
  );
}
