// src/components/organisms/ProductGrid.tsx
import React from 'react';
import { type Product, ProductCard } from '../molecules/ProductCard';

interface ProductGridProps {
    products: Product[];
    category: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, category }) => {
    if (products.length === 0) {
    return (
        <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-gray-700">
            No hay productos en la categoría "{category}".
        </h2>
        <p className="mt-2 text-gray-500">Intenta seleccionar otra opción.</p>
        </div>
    );
}

return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
        {products.map(product => (
        <ProductCard key={product.id} product={product} />
        ))}
    </div>
);
};