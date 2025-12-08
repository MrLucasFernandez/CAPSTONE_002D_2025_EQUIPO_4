import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe } from '@modules/auth/api/authService';
import type { User } from '@models/user';
import {
    UserCircleIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    IdentificationIcon,
    CalendarIcon,
    ArrowLeftIcon,
} from '@heroicons/react/24/outline';

export default function ProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const userData = await getMe();
            if (!userData) {
            // Si no hay usuario autenticado, redirigir al home
            navigate('/', { replace: true });
            return;
            }
            setUser(userData);
        } catch (err: any) {
            console.error('Error al cargar perfil:', err);
            // En caso de error de autenticación, también redirigir
            navigate('/', { replace: true });
        } finally {
            setLoading(false);
        }
        };

        loadProfile();
    }, [navigate]);

    if (loading) {
        return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
            <div className="text-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando perfil...</p>
            </div>
        </div>
        );
    }

    if (error || !user) {
        return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <UserCircleIcon className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar perfil</h2>
            <p className="text-gray-600 mb-6">{error || 'No se pudo obtener la información del usuario'}</p>
            <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
                <ArrowLeftIcon className="h-5 w-5" />
                Volver al inicio
            </button>
            </div>
        </div>
        );
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'No disponible';
        return new Date(dateString).toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
            {/* Header con botón volver */}
            <div className="mb-8">
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
                <ArrowLeftIcon className="h-5 w-5" />
                Volver
            </button>
            </div>

            {/* Card principal */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header con gradiente */}
            <div className="relative h-48 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute -bottom-16 left-8 sm:left-12">
                <div className="relative">
                    <div className="h-32 w-32 rounded-full bg-white p-2 shadow-xl">
                    <div className="h-full w-full rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                        <UserCircleIcon className="h-20 w-20 text-white" />
                    </div>
                    </div>
                    {/* Badge de roles */}
                    {user.roles && user.roles.length > 0 && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                        {user.roles[0].tipoRol}
                    </div>
                    )}
                </div>
                </div>
            </div>

            {/* Contenido del perfil */}
            <div className="pt-20 pb-8 px-8 sm:px-12">
                {/* Nombre y apellido */}
                <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                    {user.nombreUsuario} {user.apellidoUsuario}
                </h1>
                <p className="text-gray-500 text-lg">Perfil de usuario</p>
                </div>

                {/* Grid de información */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <EnvelopeIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Correo electrónico</p>
                    <p className="text-base font-medium text-gray-900 truncate mt-1">{user.correo}</p>
                    </div>
                </div>

                {/* RUT */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <IdentificationIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">RUT</p>
                    <p className="text-base font-medium text-gray-900 mt-1">{user.rut || 'No disponible'}</p>
                    </div>
                </div>

                {/* Teléfono */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <PhoneIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Teléfono</p>
                    <p className="text-base font-medium text-gray-900 mt-1">{user.telefono || 'No disponible'}</p>
                    </div>
                </div>

                {/* Dirección */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <MapPinIcon className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Dirección</p>
                    <p className="text-base font-medium text-gray-900 mt-1">{user.direccionUsuario || 'No disponible'}</p>
                    </div>
                </div>
                </div>

                {/* Información adicional */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Información de la cuenta</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Fecha de creación</p>
                        <p className="text-sm font-medium text-gray-900">{formatDate(user.fechaCreacion)}</p>
                    </div>
                    </div>
                    <div className="flex items-center gap-3">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Última actualización</p>
                        <p className="text-sm font-medium text-gray-900">{formatDate(user.fechaActualizacion)}</p>
                    </div>
                    </div>
                </div>
                </div>

                {/* Roles */}
                {user.roles && user.roles.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                    {user.roles.map((role, index) => (
                        <span
                        key={index}
                        className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                        >
                        {role.tipoRol}
                        </span>
                    ))}
                    </div>
                </div>
                )}
            </div>
            </div>

            {/* Card de acciones */}
            <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Acciones rápidas</h3>
            <div className="flex flex-col sm:flex-row gap-4">
                <button
                onClick={() => navigate('/')}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                >
                Ir al inicio
                </button>
                {user.roles?.some(r => r.tipoRol === 'ADMIN') && (
                <button
                    onClick={() => navigate('/admin')}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
                >
                    Panel de administración
                </button>
                )}
            </div>
            </div>
        </div>
        </div>
    );
}
