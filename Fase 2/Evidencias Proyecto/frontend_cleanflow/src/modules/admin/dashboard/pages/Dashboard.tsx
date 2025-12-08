import { useEffect, useState } from 'react';
import * as reportesService from '../api/reportesService';
import DashboardCharts from '../components/DashboardCharts';

const Dashboard = () => {
  const [metrics, setMetrics] = useState<{
    totalVentas?: number;
    subtotal?: number;
    impuesto?: number;
    cantidadVentas?: number;
    utilidad?: number;
  } | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        let res = await reportesService.resumen({});
        console.debug('reportes.resumen response:', res);
        if (!mounted || !res) return;

        // si la respuesta viene envuelta en { data } o { result }
        if (typeof res === 'object') {
          if ('data' in (res as any) && typeof (res as any).data === 'object')
            res = (res as any).data;
          else if ('result' in (res as any) && typeof (res as any).result === 'object')
            res = (res as any).result;
        }

        const findInObject = (obj: any, candidates: string[], depth = 0): any => {
          if (!obj || typeof obj !== 'object' || depth > 2) return undefined;

          // direct matches
          for (const c of candidates) {
            if (c in obj && obj[c] != null) return obj[c];
          }

          // case-insensitive direct
          const keys = Object.keys(obj);
          for (const c of candidates) {
            const lk = c.toLowerCase();
            const found = keys.find((k) => k.toLowerCase() === lk);
            if (found && obj[found] != null) return obj[found];
          }

          // search nested objects/arrays one level deeper
          for (const k of keys) {
            try {
              const val = obj[k];
              if (val && typeof val === 'object') {
                const sub = findInObject(val, candidates, depth + 1);
                if (sub !== undefined) return sub;
              }
            } catch {
              // ignore
            }
          }

          return undefined;
        };

        const totalVentas = findInObject(res, [
          'totalVentas',
          'total_ventas',
          'ingresosTotales',
          'total',
          'totalventas',
          'ventas_total',
        ]);
        let subtotal = findInObject(res, [
          'subtotal',
          'sub_total',
          'subTotal',
          'subtotal_ventas',
          'subTotalVentas',
        ]);
        const impuesto = findInObject(res, ['impuesto', 'iva', 'tax', 'impuestos']);
        const cantidadVentas = findInObject(res, [
          'cantidadVentas',
          'cantidad_ventas',
          'cantidad',
          'ventasCount',
          'ventas_count',
        ]);
        const utilidad = findInObject(res, [
          'utilidad',
          'profit',
          'ganancia',
          'utilidadTotal',
          'utilidad_total',
        ]);

        // Si no hay subtotal, intentar calcularlo: subtotal = totalVentas - impuesto
        if (
          (subtotal === undefined || subtotal === null) &&
          totalVentas != null &&
          impuesto != null
        ) {
          const t = Number(totalVentas);
          const i = Number(impuesto);
          if (!isNaN(t) && !isNaN(i)) {
            subtotal = t - i;
            console.debug('Computed subtotal as totalVentas - impuesto:', subtotal);
          }
        }

        console.debug('mapped metrics:', {
          totalVentas,
          subtotal,
          impuesto,
          cantidadVentas,
          utilidad,
        });

        setMetrics({
          totalVentas: totalVentas != null ? Number(totalVentas) : undefined,
          subtotal: subtotal != null ? Number(subtotal) : undefined,
          impuesto: impuesto != null ? Number(impuesto) : undefined,
          cantidadVentas: cantidadVentas != null ? Number(cantidadVentas) : undefined,
          utilidad: utilidad != null ? Number(utilidad) : undefined,
        });
      } catch (err) {
        console.error('Error cargando reportes.resumen', err);
        // fallback: dejar en null
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-6 lg:p-10">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Análisis completo de ventas, productos y clientes
          </p>
        </header>

        <DashboardCharts metrics={metrics ?? undefined} />
      </div>
    </div>
  );
};

export default Dashboard;
