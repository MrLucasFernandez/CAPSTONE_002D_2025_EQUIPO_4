// src/molecules/InputField.tsx

import React from 'react';

// Define las props que espera el InputField, extendiendo las props nativas de input
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, id, ...inputProps }) => {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        name={id}
        // Clases de Tailwind para el estilo del input
        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150"
        {...inputProps} // Aquí se reciben y aplican todas las props (value, onChange, type, etc.)
      />
    </div>
  );
};

export default InputField;