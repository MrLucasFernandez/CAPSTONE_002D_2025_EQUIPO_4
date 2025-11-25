interface Props {
    active: boolean;
}

const StatusBadge: React.FC<Props> = ({ active }) => {
    return (
        <span className={`px-3 py-1 rounded-full text-sm font-semibold 
            ${active ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"}`}>
            {active ? "Activo" : "Inactivo"}
        </span>
    );
};

export default StatusBadge;
