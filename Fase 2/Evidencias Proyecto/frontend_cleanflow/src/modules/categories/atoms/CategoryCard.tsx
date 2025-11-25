import type { Categoria } from "@models/product";
import CategoryIcon from "./CategoryIcon";
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

    return (
        <button
        onClick={handleClick}
        className="
            flex flex-col items-center justify-center
            p-4 rounded-2xl border border-gray-200
            bg-white shadow-sm
            transition-all duration-300
            hover:shadow-lg
            hover:-translate-y-1
            hover:bg-gray-50
        "
        >
        <CategoryIcon id={categoria.idCategoria} />

        <p className="mt-3 text-sm font-semibold text-gray-700 text-center">
            {categoria.nombreCategoria}
        </p>
        </button>
    );
}
