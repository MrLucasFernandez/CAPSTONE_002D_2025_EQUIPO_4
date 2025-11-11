import React, { useState } from 'react';
import InputField from '../molecules/InputField';
import { Button } from '../atoms/Button';
import type { LoginCredentials } from '../../types/auth'; 

// 1. Definimos la interfaz de las PROPS que recibe de la LoginPage
interface LoginFormProps {
    // 👈 CAMBIO CLAVE 2: onLoginSubmit debe esperar LoginCredentials
    onLoginSubmit: (credentials: LoginCredentials) => void;
    isLoading: boolean;
    error: string | null;
}


export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSubmit, isLoading, error }) => {
    
    // 2. Estado local: SOLO para los valores de los inputs
    const [correo, setEmail] = useState('');
    const [contrasena, setPassword] = useState('');

    // La función handleSubmit llama a la función delegada de la Página
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // El objeto a enviar solo tiene correo y contrasena
        const credentials: LoginCredentials = {
            correo: correo, 
            contrasena: contrasena,
        };

        // 🚨 DELEGACIÓN: Ahora TypeScript sabe que la función onLoginSubmit
        // espera el tipo LoginCredentials, ¡y coincide!
        onLoginSubmit(credentials);
    };

    return (
        <form onSubmit={handleSubmit} className="p-8 w-full max-w-md bg-white rounded-xl shadow-2xl space-y-6">
            <h2 className="text-3xl font-bold text-center text-gray-800">Iniciar Sesión</h2>
            
            {/* Mensaje de Error (Pasado por props) */}
            {error && (
                <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
                    {error}
                </div>
            )}
            
            <InputField
                label="Correo Electrónico"
                id="email"
                type="email"
                value={correo}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />

            <InputField
                label="Contraseña"
                id="password"
                type="password"
                value={contrasena}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
            
            {/* El botón usa el estado de carga pasado por props */}
            <Button type="submit" variant='primary' disabled={isLoading}>
                {isLoading ? 'Accediendo...' : 'Acceder'}
            </Button>
            
            {/* Enlace de Registro (Asumiendo que RegisterPage está en /register) */}
            <p className="text-center text-sm mt-4">
                ¿No tienes cuenta? 
                <a href="/register" className="text-blue-600 hover:text-blue-800 font-medium ml-1 transition duration-150 ease-in-out">
                Regístrate
                </a>
            </p>
        </form>
    );
};