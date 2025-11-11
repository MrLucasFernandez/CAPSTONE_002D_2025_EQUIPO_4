import React from 'react';

interface ProductTitleProps {
    title: string;
}

export const ProductTitle: React.FC<ProductTitleProps> = ({ title }) => {
    return (
    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
        {title}
    </h3>
    );
};