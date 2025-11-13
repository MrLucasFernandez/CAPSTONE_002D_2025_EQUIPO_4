import React, { useState } from 'react';
import { LoginForm } from '../components/organisms/LoginForm'; 
import type { LoginCredentials } from '../types/auth'; 
import { useAuth } from '../context/AuthContext'; 


// Componente LoginPage.tsx
const LoginPage: React.FC = () => {
    
    const [isLoading, setIsLoading] = useState(false);
    
    // Obtenemos las funciones de login y el estado de error del contexto
    const { login, authError } = useAuth(); 

    const handleLoginSubmit = async (credentials: LoginCredentials) => {
        setIsLoading(true);
        
        try {
            // Llama a la API a través del contexto
            await login(credentials); 

            // 🛑 LÓGICA CORREGIDA:
            // 1. Se ha eliminado 'window.location.href' para evitar la recarga.
            // 2. Se ha eliminado la llamada a 'navigate('/')' para evitar la redirección.
            //    La página de login permanecerá visible hasta que se fuerce la navegación desde fuera.
            
        } catch (err) {
            console.error("Login falló a nivel de componente:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <LoginForm 
                onLoginSubmit={handleLoginSubmit} 
                isLoading={isLoading} 
                error={authError} 
            />
        </div>
    );
};

export default LoginPage;