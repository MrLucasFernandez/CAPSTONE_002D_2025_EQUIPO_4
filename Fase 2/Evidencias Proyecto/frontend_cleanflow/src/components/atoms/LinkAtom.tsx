// src/components/atoms/LinkAtom.tsx

import type { FC } from 'react';

interface LinkAtomProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  iconSrc?: string; 
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
      className={`text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2 ${className}`}
    >
      {iconSrc && (
        <img 
          src={iconSrc} 
          alt={`Icono de ${typeof children === 'string' ? children : 'enlace'}`} 
          className="w-4 h-4"
        />
      )}
      
      {children}
    </a>
  );
};