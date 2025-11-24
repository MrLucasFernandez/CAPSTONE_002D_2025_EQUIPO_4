// src/modules/categories/molecules/CategoryGrid.tsx
import type { Categoria } from "@models/product";
import CategoryCard from "../atoms/CategoryCard";

interface Props {
    categorias: Categoria[];
    onCategoryClick?: (id: number) => void;
}

export default function CategoryGrid({ categorias, onCategoryClick }: Props) {
    return (
        <div
        className="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            gap-4
        "
        >
        {categorias.map((cat) => (
            <CategoryCard
            key={cat.idCategoria}
            categoria={cat}
            onClick={onCategoryClick}
            />
        ))}
        </div>
    );
}
