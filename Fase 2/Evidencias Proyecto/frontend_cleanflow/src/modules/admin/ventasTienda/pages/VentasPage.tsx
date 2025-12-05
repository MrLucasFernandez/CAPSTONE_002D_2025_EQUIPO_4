import React, { Suspense, lazy } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';

const BoletasPanel = lazy(() => import('@admin/ventasTienda/boletas/pages/BoletasPage'));
const PagosPanel = lazy(() => import('@admin/ventasTienda/pagos/pages/PagosPage'));

const VentasPage: React.FC = () => {
    return (
        <div className="p-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Ventas</h1>
        <p className="text-sm text-gray-500 mb-6">Panel de ventas — abre una sección para ver boletas o pagos.</p>

        <div className="space-y-4">
            <Disclosure as="div" className="rounded-lg border border-gray-100 bg-white shadow">
            {({ open }) => (
                <>
                <Disclosure.Button className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    <span className="flex items-center gap-3">
                    <strong>Boletas</strong>
                    <span className="text-xs text-gray-500">Listado y gestión de boletas</span>
                    </span>
                    <ChevronUpIcon className={`${open ? 'transform rotate-180' : ''} h-5 w-5 text-gray-500`} />
                </Disclosure.Button>
                <Disclosure.Panel className="px-6 pb-6">
                    <Suspense fallback={<div className="p-6 text-center">Cargando boletas...</div>}>
                    <BoletasPanel />
                    </Suspense>
                </Disclosure.Panel>
                </>
            )}
            </Disclosure>

            <Disclosure as="div" className="rounded-lg border border-gray-100 bg-white shadow">
            {({ open }) => (
                <>
                <Disclosure.Button className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    <span className="flex items-center gap-3">
                    <strong>Pagos</strong>
                    <span className="text-xs text-gray-500">Historial y gestión de pagos</span>
                    </span>
                    <ChevronUpIcon className={`${open ? 'transform rotate-180' : ''} h-5 w-5 text-gray-500`} />
                </Disclosure.Button>
                <Disclosure.Panel className="px-6 pb-6">
                    <Suspense fallback={<div className="p-6 text-center">Cargando pagos...</div>}>
                    <PagosPanel />
                    </Suspense>
                </Disclosure.Panel>
                </>
            )}
            </Disclosure>
        </div>
        </div>
    );
};

export default VentasPage;
