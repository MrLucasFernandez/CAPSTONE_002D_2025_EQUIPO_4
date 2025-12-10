import React from 'react';

interface Props {
  src?: string;
  alt?: string;
  className?: string;
  /** Tailwind height classes to apply to the container (default responsive sizes) */
  sizeClass?: string;
  onErrorSrc?: string;
  children?: React.ReactNode;
}

export default function ResponsiveImage({ src = '/placeholder.png', alt = '', className = '', sizeClass = 'h-48 md:h-56 lg:h-64', onErrorSrc = '/placeholder.png', children }: Props) {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const t = e.currentTarget;
    if (t.src !== onErrorSrc) t.src = onErrorSrc;
  };

  return (
    <div className={`relative w-full overflow-hidden bg-gray-100 ${sizeClass} ${className}`}>
      <img
        src={src}
        alt={alt}
        onError={handleError}
        className="absolute inset-0 w-full h-full object-contain object-center transition-all duration-500"
      />
      {children}
    </div>
  );
}
