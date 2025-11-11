import React from 'react';

interface ProductImageProps {
    src: string;
    alt: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({ src, alt }) => {
    return (
        <img
            className="h-48 w-full object-cover rounded-t-lg"
            src={src}
            alt={alt}
            loading="lazy"
        />
    );
};