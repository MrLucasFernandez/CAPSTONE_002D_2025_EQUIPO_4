import React from 'react';


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant: 'primary' | 'secondary';
  className?: string;
}

export const Button = ({ 
  children, 
  variant, 
  className = '', 
  // 🎯 CAMBIO CLAVE: Desestructuramos 'type' y le asignamos un valor por defecto
  type = 'button', 
  ...props 
}: ButtonProps) => {

  // Resto de clases se mantienen igual
  const baseClasses =
    'rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50';


  const variantClasses = {
    primary:
      'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600',
    secondary:
      'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
  };


  const combinedClasses = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${className}
  `;

  return (
    <button 
      // 🚀 AHORA USARÁ 'submit' si se pasa desde el LoginForm, o 'button' por defecto.
      type={type} 
      className={combinedClasses.trim()} 
      {...props}
    >
      {children}
    </button>
  );
};