import UsersTemplate from "../components/templates/UsersTemplate";
import { useUsers } from "../hooks/useUsers";
import { useAdminAuth } from "../context/AdminAuthContext";

const UsersPage = () => {
    const { isAdmin } = useAdminAuth();
    const { users, loading, toggleActive, removeUser } = useUsers();

    if (!isAdmin) {
        return <div className="p-6 text-center text-red-600 font-bold">
        No tienes permisos para ver esta página.
        </div>;
    }

    return (
        <UsersTemplate
        users={users}
        loading={loading}
        onToggleActive={toggleActive}
        onDelete={removeUser}
        />
    );
};

export default UsersPage;
