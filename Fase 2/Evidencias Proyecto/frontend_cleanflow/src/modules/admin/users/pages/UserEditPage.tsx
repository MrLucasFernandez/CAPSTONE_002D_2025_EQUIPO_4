import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserById, updateUser, getAllRoles } from '../api/userService';
import type { Rol } from '@models/user';

export default function UserEditPage() {
  const { id } = useParams();
  const idUsuario = Number(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [u, allRoles] = await Promise.all([getUserById(idUsuario), getAllRoles()]);
        if (!mounted) return;
        setUser(u);
        setRoles(allRoles);
        setSelectedRoleIds(u.roles?.map((r: any) => r.idRol) ?? []);
      } catch (err) {
        setFeedback({ type: 'error', msg: 'Error al cargar usuario o roles.' });
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [idUsuario]);

  const toggleRole = (idRol: number) => {
    setSelectedRoleIds(prev => prev.includes(idRol) ? prev.filter(x => x !== idRol) : [...prev, idRol]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    try {
      await updateUser(idUsuario, { idRoles: selectedRoleIds });
      setFeedback({ type: 'success', msg: 'Usuario actualizado.' });
      setTimeout(() => navigate('/admin/usuarios'), 900);
    } catch (err) {
      setFeedback({ type: 'error', msg: (err as Error).message || 'Error actualizando usuario.' });
    }
  };

  if (loading) return <div className="p-6">Cargando usuario...</div>;
  if (!user) return <div className="p-6 text-red-600">Usuario no encontrado.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Editar Usuario: {user.nombreUsuario} {user.apellidoUsuario}</h1>

      {feedback && (
        <div className={`p-3 mb-4 rounded ${feedback.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {feedback.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm text-gray-600">Correo</label>
          <div className="mt-1 text-sm text-gray-900">{user.correo}</div>
        </div>

        <div>
          <label className="block text-sm text-gray-600">Roles</label>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {roles.map(r => (
              <label key={r.idRol} className="flex items-center gap-2 p-2 border rounded">
                <input type="checkbox" checked={selectedRoleIds.includes(r.idRol)} onChange={() => toggleRole(r.idRol)} />
                <span className="text-sm">{r.tipoRol}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
          <button type="button" onClick={() => navigate('/admin/usuarios')} className="px-4 py-2 border rounded">Cancelar</button>
        </div>
      </form>
    </div>
  );
}
