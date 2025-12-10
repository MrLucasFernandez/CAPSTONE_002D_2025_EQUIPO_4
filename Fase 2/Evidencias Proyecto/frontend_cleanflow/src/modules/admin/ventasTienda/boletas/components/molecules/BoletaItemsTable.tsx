import { DocumentCheckIcon, EyeIcon } from '@heroicons/react/24/outline';
import { FormattedPrice } from '../atoms/FormattedPrice';
import type { DetalleBoleta } from '@models/sales';

interface BoletaItemsTableProps {
  items: DetalleBoleta[];
  onItemClick?: (itemId: number) => void;
}

export function BoletaItemsTable({ items, onItemClick }: BoletaItemsTableProps) {
  console.log('BoletaItemsTable items:', items); // DEBUG
  
  if (!items || items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
        <DocumentCheckIcon className="h-10 w-10 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">No hay items en esta boleta.</p>
      </div>
    );
  }

  return (
    <>
      {/* Versión Desktop: Tabla */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Producto (ID)</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Cantidad</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Valor Unitario</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Total</th>
              {onItemClick && <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Acción</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => {
              const itemTotal = Number(item.cantidad ?? 0) * Number(item.precioUnitario ?? 0);
              const productName = item.producto?.nombreProducto ?? `Producto ${item.idDetalle ?? 'desconocido'}`;
              const productId = item.producto?.idProducto ?? '—';
              return (
                <tr key={item.idDetalle} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">
                    <div>{productName}</div>
                    <div className="text-xs text-gray-500 mt-1">ID: {productId}</div>
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-gray-600">
                    {Number(item.cantidad ?? 0).toFixed(0)}
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-semibold text-gray-900">
                    <FormattedPrice value={Number(item.precioUnitario ?? 0)} size="sm" />
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-bold text-blue-600">
                    <FormattedPrice value={itemTotal} size="sm" />
                  </td>
                  {onItemClick && (
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => onItemClick(item.idDetalle)}
                        className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition-colors"
                        title="Ver detalles del item"
                      >
                        <EyeIcon className="h-4 w-4" />
                        Ver
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Versión Mobile: Grid */}
      <div className="md:hidden space-y-4">
        {items.map((item) => {
          const itemTotal = Number(item.cantidad ?? 0) * Number(item.precioUnitario ?? 0);
          const productName = item.producto?.nombreProducto ?? `Producto ${item.idDetalle ?? 'desconocido'}`;
          const productId = item.producto?.idProducto ?? '—';
          return (
            <div key={item.idDetalle} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              {/* Nombre y ID del Producto */}
              <div className="mb-4 pb-4 border-b border-gray-100">
                <h4 className="font-semibold text-gray-900">{productName}</h4>
                <p className="text-xs text-gray-500 mt-1">ID Producto: {productId}</p>
              </div>

              {/* Grid de detalles */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Cantidad</p>
                  <p className="text-lg font-bold text-gray-900">{Number(item.cantidad ?? 0).toFixed(0)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Valor Unit.</p>
                  <p className="text-lg font-bold text-gray-900">
                    <FormattedPrice value={Number(item.precioUnitario ?? 0)} size="sm" />
                  </p>
                </div>
              </div>

              {/* Total */}
              <div className="mb-4 pb-4 border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total:</span>
                  <span className="text-lg font-bold text-blue-600">
                    <FormattedPrice value={itemTotal} size="sm" />
                  </span>
                </div>
              </div>

              {/* Botón Ver */}
              {onItemClick && (
                <button
                  onClick={() => onItemClick(item.idDetalle)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                  title="Ver detalles del item"
                >
                  <EyeIcon className="h-4 w-4" />
                  Ver Detalles
                </button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
