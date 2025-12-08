import { useEffect, useState } from 'react';
import { UsersIcon, TrendingUpIcon } from 'lucide-react';
import * as reportesService from '../api/reportesService';

interface TopUser {
  nombre?: string;
  name?: string;
  usuario?: string;
  username?: string;
  email?: string;
  compras?: number;
  ventasCount?: number;
  totalCompras?: number;
  total_ventas?: number | string;
  monto_total?: number | string;
  totalVentas?: number | string;
  total?: number | string;
  monto?: number | string;
  cantidad?: number | string;
}

const TopUsersChart = ({ desde, hasta }: { desde?: string; hasta?: string }) => {
  const [users, setUsers] = useState<TopUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fmtCLP = (v?: number) => {
    if (v == null || isNaN(Number(v))) return '-';
    try {
      return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(v);
    } catch {
      return String(v);
    }
  };

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        setLoading(true);
        const response = await reportesService.topUsuarios({
          desde,
          hasta,
        });

        let usersData = response;
        if (response.data) usersData = response.data;
        if (response.result) usersData = response.result;

        if (Array.isArray(usersData)) {
          const normalized = usersData.slice(0, 10).map((u: any) => ({
            ...u,
            total_ventas: Number(u.total_ventas ?? u.ventasCount ?? u.compras ?? u.totalCompras ?? u.cantidad ?? 0),
            monto_total: Number(u.monto_total ?? u.totalVentas ?? u.total ?? u.monto ?? 0),
          }));
          setUsers(normalized);
        }
      } catch (err) {
        console.error('Error cargando usuarios top:', err);
        setError('No se pudieron cargar los usuarios');
      } finally {
        setLoading(false);
      }
    };

    fetchTopUsers();
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

  const avatarColors = [
    'bg-gradient-to-br from-blue-400 to-blue-600',
    'bg-gradient-to-br from-purple-400 to-purple-600',
    'bg-gradient-to-br from-pink-400 to-pink-600',
    'bg-gradient-to-br from-green-400 to-green-600',
    'bg-gradient-to-br from-red-400 to-red-600',
    'bg-gradient-to-br from-yellow-400 to-yellow-600',
    'bg-gradient-to-br from-indigo-400 to-indigo-600',
    'bg-gradient-to-br from-teal-400 to-teal-600',
    'bg-gradient-to-br from-orange-400 to-orange-600',
    'bg-gradient-to-br from-cyan-400 to-cyan-600',
  ];

  const maxMonto = Math.max(
    ...users.map((u) => Number(u.monto_total ?? u.totalVentas ?? u.total ?? u.monto ?? 0)),
    1,
  );

  const getInitials = (name?: string, username?: string, email?: string): string => {
    const nameToUse = name || username || email || 'U';
    return nameToUse
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
            <UsersIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Clientes Más Activos</h3>
            <p className="text-xs text-gray-500">Top 10 por cantidad de compras</p>
          </div>
        </div>
        <TrendingUpIcon className="h-5 w-5 text-purple-600" />
      </div>

      <div className="p-6">
        {users.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            No hay datos disponibles
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user, idx) => {
              const userName = user.nombre || user.name || user.usuario || user.username || 'Usuario';
              const userVentas = Number(
                user.total_ventas ??
                  user.ventasCount ??
                  user.compras ??
                  user.totalCompras ??
                  user.cantidad ??
                  0,
              );
              const userMonto = Number(
                user.monto_total ??
                  user.totalVentas ??
                  user.total ??
                  user.monto ??
                  0,
              );
              const initials = getInitials(user.nombre || user.name, user.usuario || user.username, user.email);

              return (
                <div
                  key={idx}
                  className="group flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 ${avatarColors[idx % avatarColors.length]} shadow-md`}>
                    {initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                    <p className="text-xs text-gray-500">{userVentas} ventas • {fmtCLP(userMonto)}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-24 h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                        style={{
                          width: `${(userMonto / maxMonto) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs font-semibold text-gray-600 w-20 text-right">{fmtCLP(userMonto)}</span>
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

export default TopUsersChart;
