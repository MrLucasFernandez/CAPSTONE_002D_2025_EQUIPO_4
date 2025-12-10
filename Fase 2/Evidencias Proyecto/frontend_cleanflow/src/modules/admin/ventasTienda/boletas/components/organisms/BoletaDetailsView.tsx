import { BoletaDetails } from '../molecules/BoletaDetails';
import type { Boleta } from '../../hooks/useBoletas';

interface BoletaDetailsViewProps {
  boleta: Boleta;
  onViewItems?: () => void;
}

export function BoletaDetailsView({ boleta, onViewItems }: BoletaDetailsViewProps) {
  const subtotal = Number(boleta.subtotalBoleta ?? 0);
  const impuesto = Number(boleta.impuesto ?? 0);
  const total = Number(boleta.totalBoleta ?? 0);
  const itemsCount = (boleta.detalle ?? boleta.detalles ?? []).length;
  const usuario = boleta.usuario;
  const isRejected = (boleta.estadoBoleta ?? '').toUpperCase() === 'RECHAZADA';

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Detalles de la Boleta</h2>
      
      <BoletaDetails subtotal={subtotal} impuesto={impuesto} total={total} />

      {/* Resumen adicional: cantidad de productos y usuario */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase text-gray-600">Cantidad de productos</p>
          <p className="text-lg font-bold text-gray-900 mt-1">{isRejected ? '—' : itemsCount}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase text-gray-600">Usuario</p>
          <p className="text-sm font-semibold text-gray-900 mt-1">
            {usuario ? `${usuario.nombreUsuario ?? ''} ${usuario.apellidoUsuario ?? ''}`.trim() || 'No disponible' : 'No disponible'}
          </p>
          {usuario?.rut && <p className="text-xs text-gray-500">RUT: {usuario.rut}</p>}
          {usuario?.correo && <p className="text-xs text-gray-500">{usuario.correo}</p>}
        </div>
      </div>

      {onViewItems && !isRejected && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onViewItems}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Ver Items de la Boleta
          </button>
        </div>
      )}
    </div>
  );
}
