import type { FC } from 'react';

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const Image: FC<ImageProps> = ({ src, alt, className = '' }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`w-full h-full object-cover ${className}`}
    />
  );
};