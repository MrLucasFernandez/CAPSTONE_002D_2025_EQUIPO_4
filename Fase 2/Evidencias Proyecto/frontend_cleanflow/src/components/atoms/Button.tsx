// src/components/atoms/Button.tsx
import React from 'react';

// 1. Definimos los tipos para las props del botón
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  // Aquí definimos las variantes que aceptará tu botón
  variant: 'primary' | 'secondary';
  // 'className' es opcional para añadir clases extra desde fuera
  className?: string;
}

export const Button = ({ 
  children, 
  variant, 
  className = '', 
  ...props 
}: ButtonProps) => {

  // 2. Definimos las clases base que todos los botones comparten
  const baseClasses =
    'rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50';

  // 3. Definimos las clases específicas para cada variante
  const variantClasses = {
    primary:
      'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600',
    secondary:
      'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
  };

  // 4. Combinamos las clases
  const combinedClasses = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${className}
  `;

  return (
    <button 
      type="button" // Tipo por defecto
      className={combinedClasses.trim()} 
      {...props} // Pasamos el resto de props (como 'type', 'onClick', 'disabled')
    >
      {children}
    </button>
  );
};