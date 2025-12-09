// src/modules/categories/molecules/CategoryGrid.tsx
import type { Categoria } from "@models/product";
import CategoryCard from "../atoms/CategoryCard";

interface Props {
    categorias: Categoria[];
    onCategoryClick?: (id: number) => void;
}

export default function CategoryGrid({ categorias}: Props) {
    return (
        <div
        className="
            flex
            justify-center
            flex-wrap
            gap-8
        "
        >
        {categorias.map((cat) => (
            <CategoryCard
            key={cat.idCategoria}
            categoria={cat}
            />
        ))}
        </div>
    );
}
