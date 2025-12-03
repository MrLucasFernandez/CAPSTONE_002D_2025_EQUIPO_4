import UsersTable from "@organisms/admin/UsersTable";
import type { User } from "@models/user";

interface Props {
    users: User[];
    loading: boolean;
    onToggleActive: (id: number, active: boolean) => void;
    onDelete: (id: number) => void;
    onEdit?: (id: number) => void;
}

const UsersTemplate: React.FC<Props> = ({ users, loading, onToggleActive, onDelete, onEdit }) => {
    return (
        <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>

        <UsersTable
            users={users}
            loading={loading}
            onToggleActive={onToggleActive}
            onDelete={onDelete}
            onEdit={onEdit}
        />
        </div>
    );
};

export default UsersTemplate;
