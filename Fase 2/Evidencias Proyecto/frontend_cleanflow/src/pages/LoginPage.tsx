// src/pages/LoginPage.tsx (Contenido clave para el manejo del formulario)

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { AuthCredentials } from '../types/auth';
// Importa el Organismo refactorizado
import { LoginForm } from '../components/organisms/LoginForm'; 

export function LoginPage() {
    
    // El estado de error y envío VIVE AQUÍ (en la Página)
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Obtenemos la función de login del contexto global
    const { login } = useAuth();
    // NOTA: La lógica de redirección ya está en el useEffect de esta página (si la creaste).
    
    // 🚨 Función que ejecuta el FETCH/API
    const handleLoginSubmit = async (credentials: AuthCredentials) => {
        setIsSubmitting(true);
        setError(null);
        
        try {
            // Llama a la lógica del Contexto (que a su vez llama a authService.ts)
            await login(credentials); 
            
            // Si tiene éxito, el useEffect de esta página redirigirá a /dashboard o /admin

        } catch (err) {
            // El Contexto lanza el error que viene del API, aquí lo mostramos.
            const errorMessage = err instanceof Error ? err.message : 'Error de conexión desconocido.';
            setError('Fallo al iniciar sesión: ' + errorMessage);
            
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // ... (El resto del código de la Página, incluyendo el return)

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            {/* ... */}
            <LoginForm 
                onLoginSubmit={handleLoginSubmit} // Pasa la función de API
                isLoading={isSubmitting}         // Pasa el estado de envío
                error={error}                    // Pasa el mensaje de error
            />
            {/* ... */}
        </div>
    );
}