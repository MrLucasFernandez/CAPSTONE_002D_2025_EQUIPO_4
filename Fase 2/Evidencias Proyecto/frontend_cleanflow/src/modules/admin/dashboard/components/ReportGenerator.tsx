import { useState } from 'react';
import { MailIcon, FileDownIcon, Calendar } from 'lucide-react';
import * as reportesService from '../api/reportesService';

type ReportType = 'resumen' | 'topUsuarios' | 'topProductos' | 'ventasMensuales';

interface ReportGeneratorProps {
  onGenerateStart?: () => void;
  onGenerateEnd?: () => void;
}

const ReportGenerator = ({ onGenerateStart, onGenerateEnd }: ReportGeneratorProps) => {
  const [selectedReport, setSelectedReport] = useState<ReportType>('resumen');
  const [selectedAction, setSelectedAction] = useState<'download' | 'email'>('download');
  const [email, setEmail] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [anno, setAnno] = useState(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validaciones
    if (selectedReport !== 'ventasMensuales') {
      if (!desde || !hasta) {
        setMessage({ type: 'error', text: 'Por favor, selecciona el rango de fechas para el reporte' });
        return;
      }
    } else {
      if (!anno) {
        setMessage({ type: 'error', text: 'Por favor, selecciona el año para el reporte' });
        return;
      }
    }

    if (selectedAction === 'email' && !email) {
      setMessage({ type: 'error', text: 'Por favor, ingresa un correo electrónico' });
      return;
    }

    setLoading(true);
    if (onGenerateStart) onGenerateStart();

    try {
      if (selectedAction === 'download') {
        // Descargar PDF
        switch (selectedReport) {
          case 'resumen':
            await reportesService.descargarResumenPdf({ desde, hasta });
            break;
          case 'topUsuarios':
            await reportesService.descargarTopUsuariosPdf({ desde, hasta });
            break;
          case 'topProductos':
            await reportesService.descargarTopProductosPdf({ desde, hasta });
            break;
          case 'ventasMensuales':
            await reportesService.descargarVentasMensualesPdf({ anno: parseInt(anno) });
            break;
        }
        setMessage({ type: 'success', text: 'Reporte descargado exitosamente' });
      } else {
        // Enviar por correo
        switch (selectedReport) {
          case 'resumen':
            await reportesService.enviarResumenPorCorreo({ correo: email, desde, hasta });
            break;
          case 'topUsuarios':
            await reportesService.enviarTopUsuariosPorCorreo({ correo: email, desde, hasta });
            break;
          case 'topProductos':
            await reportesService.enviarTopProductosPorCorreo({ correo: email, desde, hasta });
            break;
          case 'ventasMensuales':
            await reportesService.enviarVentasMensualesPorCorreo({ correo: email, anno: parseInt(anno) });
            break;
        }

        setMessage({ type: 'success', text: 'Reporte enviado exitosamente' });
        setEmail('');
      }
    } catch (err) {
      console.error('Error generando reporte:', err);
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Error al generar el reporte',
      });
    } finally {
      setLoading(false);
      if (onGenerateEnd) onGenerateEnd();
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900">Generador de Reportes</h3>
        <p className="mt-1 text-sm text-gray-600">Crea y descarga o envía tus reportes personalizados</p>
      </div>

      <form onSubmit={handleGenerate} className="space-y-6 p-6">
        {/* Tipo de Reporte */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">Tipo de Reporte</label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { value: 'resumen', label: 'Resumen Ventas' },
              { value: 'topUsuarios', label: 'Top Usuarios' },
              { value: 'topProductos', label: 'Top Productos' },
              { value: 'ventasMensuales', label: 'Ventas Mensuales' },
            ].map((report) => (
              <button
                key={report.value}
                type="button"
                onClick={() => setSelectedReport(report.value as ReportType)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedReport === report.value
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {report.label}
              </button>
            ))}
          </div>
        </div>

        {/* Opciones según el tipo de reporte */}
        <div className="space-y-4">
          {(selectedReport === 'resumen' || selectedReport === 'topUsuarios' || selectedReport === 'topProductos') && (
            <>
              <div>
                <label htmlFor="desde" className="block text-sm font-medium text-gray-900 mb-2">
                  Desde
                </label>
                <input
                  id="desde"
                  type="date"
                  value={desde}
                  onChange={(e) => setDesde(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label htmlFor="hasta" className="block text-sm font-medium text-gray-900 mb-2">
                  Hasta
                </label>
                <input
                  id="hasta"
                  type="date"
                  value={hasta}
                  onChange={(e) => setHasta(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </>
          )}

          {selectedReport === 'ventasMensuales' && (
            <div>
              <label htmlFor="anno" className="block text-sm font-medium text-gray-900 mb-2">
                <Calendar className="inline h-4 w-4 mr-2" />
                Año
              </label>
              <input
                id="anno"
                type="number"
                value={anno}
                onChange={(e) => setAnno(e.target.value)}
                min="2020"
                max={new Date().getFullYear()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          )}
        </div>

        {/* Acción */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">Acción</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedAction('download');
                setEmail('');
              }}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedAction === 'download'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FileDownIcon className="h-5 w-5" />
              Descargar PDF
            </button>
            <button
              type="button"
              onClick={() => setSelectedAction('email')}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedAction === 'email'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <MailIcon className="h-5 w-5" />
              Enviar Correo
            </button>
          </div>
        </div>

        {/* Email input - solo si está seleccionado "enviar correo" */}
        {selectedAction === 'email' && (
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              required={selectedAction === 'email'}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
            />
          </div>
        )}

        {/* Mensaje de estado */}
        {message && (
          <div
            className={`p-4 rounded-lg text-sm font-medium ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
          }`}
        >
          {loading ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              Generando...
            </>
          ) : selectedAction === 'download' ? (
            <>
              <FileDownIcon className="h-5 w-5" />
              Descargar Reporte
            </>
          ) : (
            <>
              <MailIcon className="h-5 w-5" />
              Enviar Reporte
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ReportGenerator;
