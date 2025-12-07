import React from 'react';
import { useNavigate } from 'react-router-dom';

const VentasPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="p-6">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Ventas</h1>
            <p className="text-sm text-gray-500 mb-6">Selecciona una opción para ver la información detallada.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="rounded-lg border border-gray-100 bg-white shadow p-6 flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Ver boletas</h2>
                        <p className="text-sm text-gray-500 mt-2">Listado completo de boletas — ver detalles, anular y más.</p>
                    </div>
                    <div className="mt-4">
                        <button
                            onClick={() => navigate('/admin/ventas/boletas')}
                            className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:brightness-105"
                        >
                            Ir a boletas
                        </button>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-100 bg-white shadow p-6 flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Ver pagos</h2>
                        <p className="text-sm text-gray-500 mt-2">Historial de pagos — filtrar, ordenar y revisar montos.</p>
                    </div>
                    <div className="mt-4">
                        <button
                            onClick={() => navigate('/admin/ventas/pagos')}
                            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:brightness-105"
                        >
                            Ir a pagos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VentasPage;
