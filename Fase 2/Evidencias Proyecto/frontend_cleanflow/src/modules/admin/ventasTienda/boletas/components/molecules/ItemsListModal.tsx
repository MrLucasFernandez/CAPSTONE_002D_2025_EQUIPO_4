import { FormattedPrice } from '../atoms/FormattedPrice';
import type { DetalleBoleta } from '@models/sales';

interface ItemsListModalProps {
  items: DetalleBoleta[];
}

export function ItemsListModal({ items }: ItemsListModalProps) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay items en esta boleta.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1"> {/* scroll en modales altos */}
      {items.map((item) => {
        const productName = item.producto?.nombreProducto ?? 'Producto desconocido';
        const productId = item.producto?.idProducto ?? '—';
        const itemTotal = Number(item.cantidad ?? 0) * Number(item.precioUnitario ?? 0);

        return (
          <div
            key={item.idDetalle}
            className="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 hover:shadow-md transition-shadow"
          >
            {/* Encabezado: Nombre e ID */}
            <div className="mb-3 pb-3 border-b border-gray-200">
              <h4 className="font-bold text-gray-900 text-base">{productName}</h4>
              <p className="text-xs text-gray-500 mt-1">ID Producto: <span className="font-semibold text-gray-700">{productId}</span></p>
            </div>

            {/* Grid de información */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Cantidad</p>
                <p className="text-lg font-bold text-gray-900">{Number(item.cantidad ?? 0).toFixed(0)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Precio Unitario</p>
                <p className="text-lg font-bold text-gray-900">
                  <FormattedPrice value={Number(item.precioUnitario ?? 0)} size="sm" />
                </p>
              </div>
            </div>

            {/* Subtotal */}
            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Subtotal:</span>
                <span className="text-lg font-bold text-blue-600">
                  <FormattedPrice value={itemTotal} size="sm" />
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Resumen Total */}
      <div className="mt-6 pt-6 border-t-2 border-blue-300 bg-blue-100 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-900 text-lg">Total Boleta:</span>
          <span className="text-2xl font-extrabold text-blue-600">
            <FormattedPrice
              value={items.reduce((sum, item) => sum + (Number(item.cantidad ?? 0) * Number(item.precioUnitario ?? 0)), 0)}
              size="lg"
            />
          </span>
        </div>
      </div>
    </div>
  );
}
