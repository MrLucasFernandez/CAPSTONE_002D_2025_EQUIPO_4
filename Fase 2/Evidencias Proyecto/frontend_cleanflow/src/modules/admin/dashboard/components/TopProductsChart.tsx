import { useEffect, useState } from 'react';
import { ShoppingBagIcon, TrendingDownIcon } from 'lucide-react';
import * as reportesService from '../api/reportesService';

interface TopProduct {
  nombre?: string;
  nombreProducto?: string;
  name?: string;
  producto?: string;
  cantidad?: number;
  cantidad_vendida?: number | string;
  count?: number;
  ventas?: number;
  total_ventas?: number | string;
  totalVentas?: number;
  total?: number;
  monto_total?: number | string;
  precioVenta?: number | string;
  precioVentaProducto?: number | string;
  utilidad?: number | string;
}

const TopProductsChart = ({ desde, hasta }: { desde?: string; hasta?: string }) => {
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fmtCLP = (v?: number | string) => {
    const n = Number(v);
    if (v == null || isNaN(n)) return '-';
    try {
      return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);
    } catch {
      return String(v);
    }
  };

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setLoading(true);
        const response = await reportesService.topProductos({
          desde,
          hasta,
        });

        let productsData = response;
        if (response.data) productsData = response.data;
        if (response.result) productsData = response.result;

        if (Array.isArray(productsData)) {
          const normalized = productsData.slice(0, 8).map((p: any) => ({
            ...p,
            totalVentas: Number(p.totalVentas ?? p.total_ventas ?? p.ventas ?? p.total ?? p.monto_total ?? 0),
          }));
          setProducts(normalized);
        }
      } catch (err) {
        console.error('Error cargando productos top:', err);
        setError('No se pudieron cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, [desde, hasta]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-gray-500">Cargando datos...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <p className="text-sm text-red-800">{error}</p>
      </div>
    );
  }

  const colors = [
    'from-amber-500 to-orange-500',
    'from-rose-500 to-red-500',
    'from-purple-500 to-pink-500',
    'from-cyan-500 to-blue-500',
    'from-emerald-500 to-teal-500',
    'from-indigo-500 to-purple-500',
    'from-yellow-500 to-amber-500',
    'from-fuchsia-500 to-rose-500',
  ];

  const maxVentas = Math.max(
    ...products.map((p) => Number(p.totalVentas ?? p.total_ventas ?? p.ventas ?? p.total ?? p.monto_total ?? 0)),
    1
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
            <ShoppingBagIcon className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Productos Más Vendidos</h3>
            <p className="text-xs text-gray-500">Top 8 por monto de ventas</p>
          </div>
        </div>
        <TrendingDownIcon className="h-5 w-5 text-amber-600" />
      </div>

      <div className="p-6">
        {products.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            No hay datos disponibles
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product, idx) => {
              const productName =
                product.producto ||
                product.nombreProducto ||
                product.nombre ||
                product.name ||
                `Producto ${idx + 1}`;
              const productSales = Number(
                product.totalVentas ??
                  product.total_ventas ??
                  product.ventas ??
                  product.total ??
                  product.monto_total ??
                  0,
              );
              const productCantidad = Number(product.cantidad_vendida ?? product.cantidad ?? product.count ?? 0);
              const gradientClass = colors[idx % colors.length];

              return (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-xs font-bold text-gray-400 w-6">#{idx + 1}</span>
                      <span className="text-sm font-medium text-gray-700 truncate">{productName}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 ml-2">
                      {fmtCLP(productSales)}
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${gradientClass} shadow-lg`}
                      style={{
                        width: `${(productSales / maxVentas) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                    <span>{productCantidad} unidades</span>
                    <span>Utilidad: {fmtCLP(product.utilidad)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopProductsChart;
