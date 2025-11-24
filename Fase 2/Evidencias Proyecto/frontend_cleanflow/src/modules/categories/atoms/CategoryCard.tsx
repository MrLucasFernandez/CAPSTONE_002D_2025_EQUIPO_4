import type { Categoria } from "@models/product";

interface Props {
    categoria: Categoria;
    onClick?: (id: number) => void;
}

export default function CategoryCard({ categoria, onClick }: Props) {
    return (
        <button
        onClick={() => onClick?.(categoria.idCategoria)}
        className="
            flex flex-col items-center justify-center
            p-4 rounded-xl border
            bg-white shadow-sm
            hover:shadow-md hover:bg-gray-50
            transition-all duration-300
        "
        >
        <div className="size-16 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-2xl text-blue-600">🧴</span>
        </div>

        <p className="mt-3 text-sm font-semibold text-gray-700 text-center">
            {categoria.nombreCategoria}
        </p>
        </button>
    );
}
