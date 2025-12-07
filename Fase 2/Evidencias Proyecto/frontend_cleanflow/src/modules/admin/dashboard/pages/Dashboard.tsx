import { ArrowDownTrayIcon, ChartBarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import * as reportesService from '../api/reportesService';

const Dashboard = () => {
  const [metrics, setMetrics] = useState<{ totalVentas?: number; subtotal?: number; impuesto?: number; cantidadVentas?: number } | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement | null>(null);

  const fmtCLP = (v?: number) => {
    if (v == null || isNaN(Number(v))) return '-';
    try {
      return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(v);
    } catch {
      return String(v);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        let res = await reportesService.resumen({});
        console.debug('reportes.resumen response:', res);
        if (!mounted || !res) return;

        // si la respuesta viene envuelta en { data } o { result }
        if (typeof res === 'object') {
          if ('data' in (res as any) && typeof (res as any).data === 'object') res = (res as any).data;
          else if ('result' in (res as any) && typeof (res as any).result === 'object') res = (res as any).result;
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
            const found = keys.find(k => k.toLowerCase() === lk);
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

        const totalVentas = findInObject(res, ['totalVentas', 'total_ventas', 'ingresosTotales', 'total', 'totalventas', 'ventas_total']);
        let subtotal = findInObject(res, ['subtotal', 'sub_total', 'subTotal', 'subtotal_ventas', 'subTotalVentas']);
        const impuesto = findInObject(res, ['impuesto', 'iva', 'tax', 'impuestos']);
        const cantidadVentas = findInObject(res, ['cantidadVentas', 'cantidad_ventas', 'cantidad', 'ventasCount', 'ventas_count']);

        // Si no hay subtotal, intentar calcularlo: subtotal = totalVentas - impuesto
        if ((subtotal === undefined || subtotal === null) && totalVentas != null && impuesto != null) {
          const t = Number(totalVentas);
          const i = Number(impuesto);
          if (!isNaN(t) && !isNaN(i)) {
            subtotal = t - i;
            console.debug('Computed subtotal as totalVentas - impuesto:', subtotal);
          }
        }

        console.debug('mapped metrics:', { totalVentas, subtotal, impuesto, cantidadVentas });

        setMetrics({
          totalVentas: totalVentas != null ? Number(totalVentas) : undefined,
          subtotal: subtotal != null ? Number(subtotal) : undefined,
          impuesto: impuesto != null ? Number(impuesto) : undefined,
          cantidadVentas: cantidadVentas != null ? Number(cantidadVentas) : undefined,
        });
      } catch (err) {
        console.error('Error cargando reportes.resumen', err);
        // fallback: dejar en null
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleExportPDF = async () => {
    setExportError(null);
    setExporting(true);
    try {
      await reportesService.exportarResumenPdf({}, 'resumen_ventas.pdf');
    } catch (err) {
      console.error('Error exportando PDF del dashboard', err);
      setExportError('No se pudo exportar el PDF. Intenta nuevamente.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-6 lg:p-10">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Resumen de ventas</p>
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          <button
            type="button"
            onClick={handleExportPDF}
            disabled={exporting}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:opacity-60"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            {exporting ? 'Generando PDF...' : 'Exportar PDF'}
          </button>
          {exportError && <p className="text-xs text-red-600">{exportError}</p>}
        </div>
      </header>

      <div ref={reportRef} className="space-y-4">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Total Ventas</div>
                <div className="mt-2 text-2xl font-semibold text-rose-600">{fmtCLP(metrics?.totalVentas)}</div>
              </div>
              <div className="p-2 bg-rose-50 rounded-full">
                <CurrencyDollarIcon className="h-6 w-6 text-rose-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Subtotal</div>
                <div className="mt-2 text-2xl font-semibold text-amber-600">{fmtCLP(metrics?.subtotal)}</div>
              </div>
              <div className="p-2 bg-amber-50 rounded-full">
                <CurrencyDollarIcon className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Impuestos</div>
                <div className="mt-2 text-2xl font-semibold text-green-600">{fmtCLP(metrics?.impuesto)}</div>
              </div>
              <div className="p-2 bg-green-50 rounded-full">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Cantidad de ventas</div>
                <div className="mt-2 text-2xl font-semibold text-sky-600">{metrics?.cantidadVentas ?? '-'}</div>
              </div>
              <div className="p-2 bg-sky-50 rounded-full">
                <ChartBarIcon className="h-6 w-6 text-sky-600" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
