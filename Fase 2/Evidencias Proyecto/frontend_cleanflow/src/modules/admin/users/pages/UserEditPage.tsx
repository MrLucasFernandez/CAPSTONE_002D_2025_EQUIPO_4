import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserById, updateUser, getAllRoles } from '../api/userService';
import { updateRolUsuario } from '../api/rolService';
import { useAdminAuth } from '@admin/context/AdminAuthContext';
import { useAuth } from '@modules/auth/hooks/useAuth';
import FormBuilder from '@components/organisms/admin/FormBuilder';
import Toast from '@components/ui/Toast';
import type { FieldConfig } from '@components/organisms/admin/FormBuilder';
import type { Rol, User } from '@models/user';

export default function UserEditPage() {
  const { id } = useParams();
  const idUsuario = Number(id);
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { isAdmin } = useAdminAuth();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Verificar si se está editando el usuario actual
  const isEditingOwnUser = currentUser?.idUsuario === idUsuario;

  // Cargar usuario y roles
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setLoadError(null);
        const [u, allRoles] = await Promise.all([getUserById(idUsuario), getAllRoles()]);
        if (!mounted) return;
        setUser(u);
        setRoles(allRoles);
        const userRoles = u.roles?.map((r: any) => r.idRol) ?? [];
        setSelectedRoleId(userRoles.length > 0 ? userRoles[0] : null);
      } catch (err) {
        if (mounted) {
          setLoadError('Error al cargar usuario o roles.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();
    return () => { mounted = false; };
  }, [idUsuario]);

  // Configurar campos del formulario
  const fields: FieldConfig[] = [
    {
      name: 'nombreUsuario',
      label: 'Nombre',
      type: 'text',
      required: true,
    },
    {
      name: 'apellidoUsuario',
      label: 'Apellido',
      type: 'text',
      required: true,
    },
    {
      name: 'correo',
      label: 'Correo Electrónico',
      type: 'text',
      required: true,
    },
    {
      name: 'telefono',
      label: 'Teléfono',
      type: 'text',
      required: false,
    },
    {
      name: 'direccionUsuario',
      label: 'Dirección',
      type: 'text',
      required: false,
    },
    // Solo mostrar campo de contraseña si está editando su propio usuario
    ...(isEditingOwnUser ? [{
      name: 'contrasena',
      label: 'Contraseña (dejar en blanco para no cambiar)',
      type: 'text' as const,
      required: false,
    }] : []),
  ];

  // Manejar actualización del formulario
  const handleSubmit = async (formData: any) => {
    setFeedback(null);
    try {
      // Limpiar contraseña vacía
      const userData: any = { ...formData };
      if (!userData.contrasena) {
        delete userData.contrasena;
      }

      // 1. Actualizar datos del usuario
      await updateUser(idUsuario, userData);

      // 2. Actualizar roles si cambiaron
      const oldRoleIds = user?.roles?.map((r: any) => r.idRol) ?? [];
      const newRoleIds = selectedRoleId ? [selectedRoleId] : [];
      const rolesChanged = JSON.stringify(oldRoleIds.sort()) !== JSON.stringify(newRoleIds.sort());

      if (rolesChanged) {
        await updateRolUsuario(idUsuario, oldRoleIds, newRoleIds);
      }

      setFeedback({ type: 'success', msg: 'Usuario actualizado correctamente.' });
      setShowToast(true);
      setTimeout(() => navigate('/admin/usuarios'), 1500);
    } catch (err) {
      const errorMsg = (err as Error).message || 'Error actualizando usuario.';
      setFeedback({ type: 'error', msg: errorMsg });
      setShowToast(true);
    }
  };

  // Manejar cancelación
  const handleCancel = () => {
    navigate('/admin/usuarios');
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-4 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Cargando usuario...</p>
      </div>
    );
  }

  if (loadError || !user) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold">Error</p>
          <p>{loadError || 'Usuario no encontrado.'}</p>
        </div>
        <button
          onClick={() => navigate('/admin/usuarios')}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Volver a usuarios
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {showToast && feedback && (
        <Toast
          message={feedback.msg}
          type={feedback.type}
          onClose={() => setShowToast(false)}
          duration={feedback.type === 'success' ? 1500 : 4000}
        />
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Editando el usuario #{idUsuario}
        </h1>
        <p className="text-gray-600">
          {user.nombreUsuario} {user.apellidoUsuario}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario de datos del usuario */}
        <div className="lg:col-span-2">
          <FormBuilder
            title="Información del Usuario"
            fields={fields}
            initialValues={{
              nombreUsuario: user.nombreUsuario,
              apellidoUsuario: user.apellidoUsuario,
              correo: user.correo,
              telefono: user.telefono,
              direccionUsuario: user.direccionUsuario,
              contrasena: '',
            }}
            submitLabel="Guardar Cambios"
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            cancelLabel="Cancelar"
          />
        </div>

        {/* Panel de roles */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Roles del Usuario</h3>
              {isEditingOwnUser && isAdmin && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Solo lectura
                </span>
              )}
            </div>
            
            <div className="space-y-3">
              {roles.map((role) => (
                <div
                  key={role.idRol}
                  className={`flex items-center gap-3 p-3 border border-gray-200 rounded-lg transition ${
                    isEditingOwnUser && isAdmin ? 'bg-gray-50 cursor-default' : 'hover:bg-gray-50 cursor-pointer'
                  }`}
                  onClick={() => {
                    if (!(isEditingOwnUser && isAdmin)) {
                      setSelectedRoleId(selectedRoleId === role.idRol ? null : role.idRol);
                    }
                  }}
                >
                  {!(isEditingOwnUser && isAdmin) ? (
                    <input
                      type="radio"
                      name="roleSelection"
                      checked={selectedRoleId === role.idRol}
                      onChange={() => setSelectedRoleId(role.idRol)}
                      className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
                      {selectedRoleId === role.idRol && (
                        <span className="text-blue-600 font-bold">●</span>
                      )}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{role.tipoRol}</p>
                    {role.descripcionRol && (
                      <p className="text-sm text-gray-600">{role.descripcionRol}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-4">
              {isEditingOwnUser && isAdmin ? 'Los roles de tu usuario no pueden ser editados.' : 'Los roles se actualizarán cuando guardes los cambios.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
