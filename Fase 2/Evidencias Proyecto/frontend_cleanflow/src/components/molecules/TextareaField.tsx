// src/components/molecules/TextareaField.tsx
import React from 'react';
import Textarea from '../atoms/Textarea'; 

type TextareaFieldProps = {
  label: string;
  id: string;
  // ... otras props de TextareaProps
};

const TextareaField: React.FC<TextareaFieldProps> = ({ label, id, ...props }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <Textarea id={id} {...props} />
    </div>
  );
};

export default TextareaField;