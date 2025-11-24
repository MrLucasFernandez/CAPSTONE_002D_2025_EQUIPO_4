// src/components/atoms/Textarea.tsx
import React from 'react';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea: React.FC<TextareaProps> = (props) => {
  return (
    <textarea
      // Clases reutilizadas de Input, ajustadas para Textarea
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
        resize-none  /* Evita que el usuario lo redimensione, si lo deseas */
      "
      rows={4} // Número predeterminado de filas
      {...props}
    />
  );
};

export default Textarea;