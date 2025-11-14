import StatusBadge from "../atoms/StatusBadge";
import IconButton from "../atoms/IconButton";
import { Trash2, PowerIcon } from "lucide-react";
import type { User } from "../../../../types/user";

interface Props {
    user: User;
    onToggleActive: () => void;
    onDelete: () => void;
}

const UserRow: React.FC<Props> = ({ user, onToggleActive, onDelete }) => {
    return (
        <tr className="border-b text-sm">
            <td className="py-3 px-4">{user.nombreUsuario} {user.apellidoUsuario}</td>
            <td className="py-3 px-4">{user.correo}</td>
            <td className="py-3 px-4">{user.rut}</td>

            <td className="py-3 px-4">
                <StatusBadge active={user.activo} />
            </td>
            <td className="py-3 px-4 flex gap-2">
                <IconButton
                    icon={<PowerIcon size={18} />}
                    onClick={onToggleActive}
                />
                <IconButton
                    icon={<Trash2 size={18} />}
                    variant="danger"
                    onClick={onDelete}
                />
        </td>
    </tr>
    );
};

export default UserRow;
