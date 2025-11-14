import UserRow from "../molecules/UserRow";
import Loader from "../atoms/Loader";
import ConfirmModal from "../molecules/ConfirmModal";
import { useState } from "react";
import type { User } from "../../../../types/user";

interface Props {
    users: User[];
    loading: boolean;
    onToggleActive: (id: number, active: boolean) => void;
    onDelete: (id: number) => void;
}

const UsersTable: React.FC<Props> = ({ users, loading, onToggleActive, onDelete }) => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    if (loading) return <Loader />;

    return (
        <>
        <table className="w-full bg-white rounded-lg shadow-xl overflow-hidden">
            <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr>
                <th className="py-3 px-4 text-left">Nombre</th>
                <th className="py-3 px-4 text-left">Correo</th>
                <th className="py-3 px-4 text-left">RUT</th>
                <th className="py-3 px-4 text-left">Estado</th>
                <th className="py-3 px-4 text-left">Acciones</th>
            </tr>
            </thead>

            <tbody>
            {users.map((u) => (
                <UserRow
                key={u.idUsuario}
                user={u}
                onToggleActive={() => onToggleActive(u.idUsuario, !u.activo)}
                onDelete={() => setSelectedUser(u)}
                />
            ))}
            </tbody>
        </table>

        {/* Modal de confirmación */}
        <ConfirmModal
            open={!!selectedUser}
            message={`¿Eliminar definitivamente a ${selectedUser?.nombreUsuario}?`}
            onCancel={() => setSelectedUser(null)}
            onConfirm={() => {
            if (selectedUser) onDelete(selectedUser.idUsuario);
            setSelectedUser(null);
            }}
        />
        </>
    );
};

export default UsersTable;
