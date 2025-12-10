import { useEffect, useState } from 'react';
import { BarChart3Icon, TrendingUpIcon } from 'lucide-react';
import * as reportesService from '../api/reportesService';

interface MonthlySalesData {
  mes: string;
  ventas: number;
  porcentaje?: number;
}

const SalesMonthlyChart = () => {
  const [data, setData] = useState<MonthlySalesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();

  const fmtCLP = (v?: number | string) => {
    const n = Number(v);
    if (v == null || isNaN(n)) return '-';
    try {
      return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);
    } catch {
      return String(v);
    }
  };

  const normalizeMonth = (raw: string) => {
    if (!raw) return raw;
    const key = raw.trim().toLowerCase();
    const map: Record<string, string> = {
      january: 'Enero',
      february: 'Febrero',
      march: 'Marzo',
      april: 'Abril',
      may: 'Mayo',
      june: 'Junio',
      july: 'Julio',
      august: 'Agosto',
      september: 'Septiembre',
      october: 'Octubre',
      november: 'Noviembre',
      december: 'Diciembre',
      enero: 'Enero',
      febrero: 'Febrero',
      marzo: 'Marzo',
      abril: 'Abril',
      mayo: 'Mayo',
      junio: 'Junio',
      julio: 'Julio',
      agosto: 'Agosto',
      septiembre: 'Septiembre',
      setiembre: 'Septiembre',
      octubre: 'Octubre',
      noviembre: 'Noviembre',
      diciembre: 'Diciembre',
    };
    if (map[key]) return map[key];

    // Fallback: intentar parsear con Intl
    try {
      const monthIndex = new Date(`${raw.trim()} 1, 2000`).getMonth();
      if (!Number.isNaN(monthIndex)) {
        return new Intl.DateTimeFormat('es-CL', { month: 'long' }).format(new Date(2000, monthIndex, 1));
      }
    } catch {
      // ignore
    }
    return raw.trim();
  };

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        const response = await reportesService.ventasMensuales({
          anno: currentYear,
        });

        let salesData = response;
        if (response.data) salesData = response.data;
        if (response.result) salesData = response.result;

        if (Array.isArray(salesData)) {
          const normalized = salesData.map((d: any) => ({
            mes: normalizeMonth(String(d.mes ?? '')),
            ventas: Number(d.ventas ?? d.total ?? d.totalVentas ?? d.monto_total ?? d.total_ventas ?? 0),
            porcentaje: d.porcentaje,
          }));
          setData(normalized);
        }
      } catch (err) {
        console.error('Error cargando ventas mensuales:', err);
        setError('No se pudieron cargar los datos de ventas');
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [currentYear]);

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

  const maxVentas = Math.max(...data.map((d) => d.ventas), 1);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
            <BarChart3Icon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Ventas Mensuales {currentYear}</h3>
            <p className="text-xs text-gray-500">Desglose mensual de ingresos</p>
          </div>
        </div>
        <TrendingUpIcon className="h-5 w-5 text-blue-600" />
      </div>

      <div className="p-6">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            No hay datos disponibles
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.mes}</span>
                  <span className="text-sm font-semibold text-gray-900">{fmtCLP(item.ventas)}</span>
                </div>
                <div className="h-3 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg`}
                    style={{
                      width: `${(item.ventas / maxVentas) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesMonthlyChart;
