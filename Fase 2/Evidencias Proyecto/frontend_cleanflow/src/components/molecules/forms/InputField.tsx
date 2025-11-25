import React from 'react';

// 1. Extender la interfaz para añadir las props específicas
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    id: string;
    error?: string | null; 
}

const InputField: React.FC<InputFieldProps> = ({ 
    label, 
    id, 
    error,
    ...inputProps 
}) => {
    
    // Determinar la clase del borde basada en si hay un error
    const inputClasses = `mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm sm:text-sm transition duration-150 ${
        error 
        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' // Borde rojo si hay error
        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' // Borde normal (azul al hacer focus)
    }`;

    return (
        <div className="space-y-1">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                id={id}
                name={id}
                // Usamos las clases dinámicas definidas arriba
                className={inputClasses} 
                // Aseguramos que el input se marque como inválido si hay un error
                aria-invalid={!!error} 
                {...inputProps}
            />
            
            {/* 3. Mostrar el mensaje de error si existe */}
            {error && (
                <p 
                    className="text-xs text-red-600 mt-1" 
                    role="alert" // Para accesibilidad
                    aria-live="polite" // Para que los lectores de pantalla lo anuncien
                >
                    {error}
                </p>
            )}
        </div>
    );
};

export default InputField;