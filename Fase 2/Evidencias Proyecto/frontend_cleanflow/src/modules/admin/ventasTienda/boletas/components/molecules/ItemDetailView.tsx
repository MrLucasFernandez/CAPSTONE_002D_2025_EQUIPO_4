import { DocumentCheckIcon } from '@heroicons/react/24/outline';
import { DetailField } from '../atoms/DetailField';
import type { DetalleBoletaResponse } from '../../api/adminDetalleService';

interface ItemDetailViewProps {
  detalle: DetalleBoletaResponse;
}

export function ItemDetailView({ detalle }: ItemDetailViewProps) {
  const impuestoUnitario = (detalle.precioUnitario * (Number(detalle.idProducto.impuestoVenta ?? 0) / 100)) || 0;
  const subtotalItem = detalle.precioUnitario * detalle.cantidad;
  const impuestoTotalItem = impuestoUnitario * detalle.cantidad;
  const totalItem = subtotalItem + impuestoTotalItem;

  return (
    <div className="space-y-6">
      {/* Información del Producto */}
      <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Información del Producto</h3>
        <DetailField
          label="Nombre del Producto"
          value={detalle.idProducto.nombreProducto}
          icon={<DocumentCheckIcon className="h-5 w-5" />}
        />
        <DetailField
          label="SKU"
          value={detalle.idProducto.sku}
        />
        <DetailField
          label="ID Producto"
          value={detalle.idProducto.idProducto}
        />
      </div>

      {/* Detalles de Compra */}
      <div className="rounded-lg bg-gray-50 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Detalles de la Compra</h3>
        <DetailField
          label="Cantidad"
          value={Number(detalle.cantidad).toFixed(2)}
        />
        <DetailField
          label="Precio Unitario"
          value={`CLP $${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(detalle.precioUnitario)}`}
        />
        <DetailField
          label="Impuesto Unitario"
          value={`CLP $${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(impuestoUnitario)}`}
        />
      </div>

      {/* Totales */}
      <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Totales del Item</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Subtotal</span>
            <span className="font-semibold text-gray-900">
              CLP ${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(subtotalItem)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Impuesto Total</span>
            <span className="font-semibold text-gray-900">
              CLP ${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(impuestoTotalItem)}
            </span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t-2 border-blue-200">
            <span className="text-sm font-bold text-gray-900">Total del Item</span>
            <span className="text-xl font-extrabold text-blue-600">
              CLP ${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(totalItem)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
