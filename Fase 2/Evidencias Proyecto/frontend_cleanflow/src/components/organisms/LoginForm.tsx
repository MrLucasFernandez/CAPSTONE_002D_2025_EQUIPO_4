import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../molecules/InputField'; 
import { Button } from '../atoms/Button';
import { useAdminAuth } from '../../modules/admin/hooks/useAdminAuth'; 

const fetchWithTimeout = (url: string, options: RequestInit, timeout = 10000): Promise<Response> => {
    return Promise.race([
        fetch(url, options),
        new Promise<Response>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout de API alcanzado (10 segundos). El servidor no respondió.')), timeout)
        )
    ]);
};


const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const { login } = useAdminAuth(); 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // 1. Llamada al endpoint de login USANDO EL TIMEOUT
            const response = await fetchWithTimeout('http://localhost:3001/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo: email, contrasena: password }),
            });
            
            // 2. Manejar la respuesta
            if (!response.ok) {
                // Intentar leer JSON para un mensaje de error detallado del servidor
                let errorData;
                try {
                    errorData = await response.json(); 
                } catch (jsonError) {
                    // Si falla la lectura de JSON, usar el estado HTTP
                    throw new Error(`Error HTTP ${response.status}: El servidor devolvió una respuesta no JSON.`);
                }
                
                throw new Error(errorData.message || `Error ${response.status}: Fallo de autenticación.`);
            }

            const data = await response.json();

            if (data.success) {
                // Normalizar el rol a minúsculas
                const normalizedRole = data.rol.toLowerCase() === 'administrador' ? 'admin' : 'customer';

                // 3. Llamar a la función 'login' del hook para actualizar el estado global
                login({
                    id: data.idUsuario, 
                    nombre: data.nombreUsuario || 'Usuario Logueado', 
                    role: normalizedRole as 'admin' | 'customer',
                    token: data.token, 
                });
                
                // 4. Redireccionar basándose en el rol
                if (normalizedRole === 'admin') {
                    navigate('/admin'); 
                } else {
                    navigate('/'); 
                }

            } else {
                // Manejar error de credenciales si success es false
                setError(data.message || 'Credenciales incorrectas.');
            }

        } catch (err) {
            // Manejar errores de red, Timeout, o los errores lanzados arriba
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido.';
            setError('Error de Conexión: ' + errorMessage);
        } finally {
            // Esto se ejecutará SIEMPRE, incluso después de un error, para desbloquear el botón
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-8 w-full max-w-md bg-white rounded-xl shadow-2xl space-y-6">
            <h2 className="text-3xl font-bold text-center text-gray-800">Iniciar Sesión</h2>
            
            {/* Mensaje de Error */}
            {error && (
                <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
                    {error}
                </div>
            )}
            
            <InputField
                label="Correo Electrónico"
                id="email"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />

            <InputField
                label="Contraseña"
                id="password"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
            
            <Button type="submit" variant='primary' disabled={isSubmitting}>
                {isSubmitting ? 'Accediendo...' : 'Acceder'}
            </Button>
            
            <p className="text-center text-sm mt-4">
                ¿No tienes cuenta? 
                <a 
                href="/register" 
                className="text-blue-600 hover:text-blue-800 font-medium ml-1 transition duration-150 ease-in-out"
                >
                Regístrate
                </a>
            </p>
        </form>
    );
};

export default LoginForm;