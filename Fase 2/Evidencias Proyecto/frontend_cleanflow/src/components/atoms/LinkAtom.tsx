// src/components/atoms/LinkAtom.tsx

import type { FC } from 'react';

// 1. ACTUALIZAR LinkAtomProps para aceptar la ruta del icono
interface LinkAtomProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  iconSrc?: string; // Nueva propiedad para la URL/ruta del icono
}

export const LinkAtom: FC<LinkAtomProps> = ({ 
  href, 
  children, 
  className = '', 
  iconSrc 
}) => {
  return (
    <a
      href={href}
      // Clases de Tailwind: usar 'flex' para alinear el icono y el texto
      className={`text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2 ${className}`}
    >
      {/* 2. RENDERIZAR el icono si existe la ruta (iconSrc) */}
      {iconSrc && (
        <img 
          src={iconSrc} 
          alt={`Icono de ${typeof children === 'string' ? children : 'enlace'}`} 
          className="w-4 h-4" // <--- Definir un tamaño pequeño con Tailwind
        />
      )}
      
      {children}
    </a>
  );
};