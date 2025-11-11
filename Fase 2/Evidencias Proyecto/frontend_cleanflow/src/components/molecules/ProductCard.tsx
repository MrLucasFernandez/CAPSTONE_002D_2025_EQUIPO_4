import React from 'react';
import { ProductImage } from '../atoms/ProductImage';
import { ProductTitle } from '../atoms/ProductTitle';

// Definición de un producto para tipado
export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    imageUrl: string;
}

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden transform transition duration-300 hover:scale-[1.02] hover:shadow-2xl">
        <ProductImage src={product.imageUrl} alt={product.name} />
        <div className="p-4">
        <span className="text-sm font-medium text-indigo-600 uppercase tracking-wider">
            {product.category}
        </span>
        <div className="mt-1">
            <ProductTitle title={product.name} />
        </div>
        <p className="mt-2 text-xl font-bold text-gray-800">
            ${product.price.toFixed(2)}
        </p>
        <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg font-medium transition duration-150 hover:bg-indigo-700">
            Ver Detalles
        </button>
        </div>
    </div>
    );
};