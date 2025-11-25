interface Props {
    icon: React.ReactNode;
    onClick?: () => void;
    variant?: "default" | "danger";
}

const IconButton: React.FC<Props> = ({ icon, onClick, variant = "default" }) => (
    <button
        onClick={onClick}
        className={`p-2 rounded-lg transition 
            ${variant === "danger" ? "bg-red-100 hover:bg-red-200 text-red-600" : "bg-gray-100 hover:bg-gray-200"}`}>
        {icon}
    </button>
);

export default IconButton;
