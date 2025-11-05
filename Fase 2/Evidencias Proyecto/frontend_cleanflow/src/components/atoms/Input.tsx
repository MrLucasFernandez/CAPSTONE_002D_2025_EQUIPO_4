import React from 'react';

// Define las props extendiendo las de un input HTML estándar 
// para incluir todas las propiedades nativas como 'value', 'onChange', etc.
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = (props) => {
  return (
    <input
      // Aplicación de clases Tailwind CSS v4
      className="
        block w-full 
        px-3 py-2 
        text-gray-900 
        border border-gray-300 
        rounded-md 
        focus:outline-none 
        focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        placeholder-gray-500 
        transition duration-150
      "
      {...props} // Pasa todas las demás props (type, id, value, onChange, placeholder, etc.)
    />
  );
};

export default Input;