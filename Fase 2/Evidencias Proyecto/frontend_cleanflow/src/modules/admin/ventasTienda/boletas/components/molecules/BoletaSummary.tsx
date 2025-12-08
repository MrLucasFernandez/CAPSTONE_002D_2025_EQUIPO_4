import { StatusBadge } from '../atoms/StatusBadge';
import { FormattedPrice } from '../atoms/FormattedPrice';
import type { Boleta } from '../../hooks/useBoletas';

interface BoletaSummaryProps {
  boleta: Boleta;
}

export function BoletaSummary({ boleta }: BoletaSummaryProps) {
  const fechaDisplay = boleta.fecha
    ? new Date(boleta.fecha).toLocaleString('es-CL')
    : '-';
  const total = Number(boleta.totalBoleta ?? 0);
  const itemsCount = (boleta.detalle ?? boleta.detalles ?? []).length;
  const isRejected = (boleta.estadoBoleta ?? '').toUpperCase() === 'RECHAZADA';

  return (
    <aside className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Resumen</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">ID Boleta</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{boleta.idBoleta}</p>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Estado</p>
          <div className="mt-2">
            <StatusBadge estado={boleta.estadoBoleta ?? '-'} size="md" />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Fecha</p>
          <p className="text-sm font-semibold text-gray-900 mt-1">{fechaDisplay}</p>
        </div>

        {!isRejected && (
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Cantidad de items</p>
            <p className="text-lg font-bold text-gray-900 mt-1">{itemsCount}</p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-100 bg-blue-50 rounded-lg p-4">
          <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Monto Total</p>
          <div className="mt-2">
            <FormattedPrice value={total} size="lg" bold gradient />
          </div>
        </div>
      </div>
    </aside>
  );
}
