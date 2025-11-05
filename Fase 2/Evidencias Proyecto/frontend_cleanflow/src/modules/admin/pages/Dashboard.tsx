import { 
  ChartBarIcon, 
  UsersIcon, 
  CurrencyDollarIcon, 
  CubeIcon 
} from '@heroicons/react/24/outline';

const stats = [
  { name: 'Ingresos Totales', stat: '$71,897', icon: CurrencyDollarIcon },
  { name: 'Nuevos Usuarios (Hoy)', stat: '25', icon: UsersIcon },
  { name: 'Productos Activos', stat: '142', icon: CubeIcon },
  { name: 'Pedidos Pendientes', stat: '8', icon: ChartBarIcon },
];

const Dashboard = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Título de la página */}
      <h1 className="text-2xl font-semibold leading-6 text-gray-900">
        Dashboard
      </h1>
      <p className="mt-2 text-sm text-gray-700">
        Resumen general de tu tienda.
      </p>

      {/* Contenedor de Estadísticas (Molecules) */}
      <div className="mt-8">
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Tarjeta de Estadística */}
          {stats.map((item) => (
            <div 
              key={item.name} 
              className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
            >
              <dt className="truncate text-sm font-medium text-gray-500">
                {item.name}
              </dt>
              <dd className="mt-1 flex items-baseline justify-between sm:block lg:flex">
                <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
                  {item.stat}
                </div>
                {/* Ícono (átomo) */}
                <item.icon 
                  className="size-8 text-gray-400 absolute right-4 top-4" 
                  aria-hidden="true" 
                />
              </dd>
            </div>
          ))}
          {/* Fin de Tarjeta */}

        </dl>
      </div>

      <div className="mt-8">
        <div className="h-96 rounded-lg border-4 border-dashed border-gray-200 bg-white p-4">
          <p className="text-center text-gray-500">
            (Aquí se puede poner un gráfico)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;