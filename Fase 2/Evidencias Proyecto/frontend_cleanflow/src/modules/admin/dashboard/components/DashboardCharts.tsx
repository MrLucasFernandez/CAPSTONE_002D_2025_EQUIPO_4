import { CurrencyDollarIcon, ChartBarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import SalesMetricsCard from './SalesMetricsCard';
import SalesMonthlyChart from './SalesMonthlyChart';
import TopProductsChart from './TopProductsChart';
import TopUsersChart from './TopUsersChart';
import ReportGenerator from './ReportGenerator';

interface DashboardChartsProps {
  metrics?: {
    totalVentas?: number;
    subtotal?: number;
    impuesto?: number;
    cantidadVentas?: number;
    utilidad?: number;
  };
  desde?: string;
  hasta?: string;
}

const DashboardCharts = ({ metrics = {}, desde, hasta }: DashboardChartsProps) => {

  const fmtCLP = (v?: number) => {
    if (v == null || isNaN(Number(v))) return '-';
    try {
      return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0,
      }).format(v);
    } catch {
      return String(v);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tarjetas de métricas principales */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900">Resumen de Ventas</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <SalesMetricsCard
            title="Total Ventas"
            value={fmtCLP(metrics.totalVentas)}
            icon={<CurrencyDollarIcon className="h-6 w-6" />}
            color="rose"
          />
          <SalesMetricsCard
            title="Subtotal"
            value={fmtCLP(metrics.subtotal)}
            icon={<CurrencyDollarIcon className="h-6 w-6" />}
            color="amber"
          />
          <SalesMetricsCard
            title="Impuestos"
            value={fmtCLP(metrics.impuesto)}
            icon={<CurrencyDollarIcon className="h-6 w-6" />}
            color="green"
          />
          <SalesMetricsCard
            title="Cantidad de Ventas"
            value={metrics.cantidadVentas ?? '-'}
            icon={<ChartBarIcon className="h-6 w-6" />}
            color="sky"
          />
          <SalesMetricsCard
            title="Utilidad"
            value={fmtCLP(metrics.utilidad)}
            icon={<ArrowTrendingUpIcon className="h-6 w-6" />}
            color="purple"
          />
        </div>
      </section>

      {/* Gráficos principales */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900">Análisis Detallado</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SalesMonthlyChart />
          <TopProductsChart desde={desde} hasta={hasta} />
        </div>
      </section>

      {/* Clientes activos */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900">Datos Adicionales</h2>
        <TopUsersChart desde={desde} hasta={hasta} />
      </section>

      {/* Generador de reportes */}
      <section>
        <ReportGenerator />
      </section>
    </div>
  );
};

export default DashboardCharts;
