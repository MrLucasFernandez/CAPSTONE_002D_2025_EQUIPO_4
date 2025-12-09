import type { Categoria } from "@models/product";
import { useNavigate } from "react-router-dom";

interface Props {
    categoria: Categoria;
}

export default function CategoryCard({ categoria }: Props) {
    const navigate = useNavigate();

    const handleClick = () => {
        // Navega a la página de productos filtrados por categoría
        navigate(`/productos/categoria/${categoria.idCategoria}`);
    };

    const colors = [
        { bg: 'bg-gradient-to-br from-blue-500 to-blue-600', hover: 'hover:from-blue-600 hover:to-blue-700' },
        { bg: 'bg-gradient-to-br from-green-500 to-green-600', hover: 'hover:from-green-600 hover:to-green-700' },
        { bg: 'bg-gradient-to-br from-purple-500 to-purple-600', hover: 'hover:from-purple-600 hover:to-purple-700' },
        { bg: 'bg-gradient-to-br from-orange-500 to-orange-600', hover: 'hover:from-orange-600 hover:to-orange-700' },
        { bg: 'bg-gradient-to-br from-pink-500 to-pink-600', hover: 'hover:from-pink-600 hover:to-pink-700' },
        { bg: 'bg-gradient-to-br from-indigo-500 to-indigo-600', hover: 'hover:from-indigo-600 hover:to-indigo-700' },
    ];

    // Usar el ID de categoría para seleccionar un color consistente
    const colorIndex = (categoria.idCategoria % colors.length);
    const selectedColor = colors[colorIndex];

    return (
        <button
        onClick={handleClick}
        className={`
            flex flex-col items-center justify-center
            p-8 rounded-3xl
            ${selectedColor.bg} ${selectedColor.hover}
            shadow-lg
            transition-all duration-300
            hover:shadow-2xl
            hover:-translate-y-2
            w-56 h-40
        `}
        >
        <p className="text-xl font-bold text-white text-center">
            {categoria.nombreCategoria}
        </p>
        </button>
    );
}
