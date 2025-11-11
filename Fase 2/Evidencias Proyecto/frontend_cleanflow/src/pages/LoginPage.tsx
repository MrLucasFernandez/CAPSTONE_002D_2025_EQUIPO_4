import React, { useState } from 'react';
import { LoginForm } from '../components/organisms/LoginForm'; 
import type { LoginCredentials } from '../types/auth'; 
// Asumo que tienes un hook para el contexto, ej:
import { useAuth } from '../context/AuthContext'; 

// Componente LoginPage.tsx
const LoginPage: React.FC = () => {
    // 💡 CAMBIO CLAVE: Quitamos los estados locales de error y loading.
    // Usamos el estado global si es posible, aunque aquí solo necesitamos el loading.
    const [isLoading, setIsLoading] = useState(false);
    
    // Obtenemos las funciones de login y el estado de error del contexto
    const { login, authError } = useAuth(); // <- Ahora authError existe

    // La LoginPage ya no necesita su propio estado de error
    // Solo necesita manejar la llamada asíncrona y la redirección
    const handleLoginSubmit = async (credentials: LoginCredentials) => {
        setIsLoading(true);
        
        try {
            // Llama a la API a través del contexto
            await login(credentials); 

            // ✅ LÓGICA DE REDIRECCIÓN Y RECARGA
            // Si el login del contexto tiene éxito (no lanzó error), redirigimos.
            window.location.href = '/'; 
            
        } catch (err) {
            // Si el login del contexto lanza un error (ya capturado y guardado en authError), 
            // no hacemos nada más que registrarlo y el formulario lo mostrará.
            console.error("Login falló a nivel de componente:", err);
            // El mensaje de error se mostrará automáticamente porque authError se actualizó
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <LoginForm 
                onLoginSubmit={handleLoginSubmit} 
                isLoading={isLoading} // Usamos el estado de loading local para el spinner
                error={authError} // Mostramos el error del contexto
            />
        </div>
    );
};

// 🚨 CORRECCIÓN CLAVE: Exportación por defecto
export default LoginPage;