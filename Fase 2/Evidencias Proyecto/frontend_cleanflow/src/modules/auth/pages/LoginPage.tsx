import React, { useState, useEffect } from 'react';
import { LoginForm } from '../components/LoginForm';
import type { LoginCredentials } from '@models/auth';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Toast from '@components/ui/Toast';

const LoginPage: React.FC = () => {

    const [isLoading, setIsLoading] = useState(false);
    const { login, authError, user } = useAuth();
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [loginSuccess, setLoginSuccess] = useState(false);

    const handleLoginSubmit = async (credentials: LoginCredentials) => {
        setIsLoading(true);

        try {
            await login(credentials);
            setLoginSuccess(true);
            setToastMessage({
                message: "¡Bienvenido! Iniciando sesión...",
                type: "success",
            });
            setShowToast(true);
            // Redirigir después de mostrar el toast
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            console.error("Login falló en el componente:", err);
            setToastMessage({
                message: authError || "Error al iniciar sesión",
                type: "error",
            });
            setShowToast(true);
            setIsLoading(false);
        }
    };

    // Si el user cambia (login exitoso), redirige automáticamente
    useEffect(() => {
        if (user && !loginSuccess) {
            navigate('/');
        }
    }, [user, navigate, loginSuccess]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            {showToast && toastMessage && (
                <Toast
                    message={toastMessage.message}
                    type={toastMessage.type}
                    onClose={() => setShowToast(false)}
                    duration={toastMessage.type === "success" ? 2000 : 4000}
                />
            )}
            <LoginForm
                onLoginSubmit={handleLoginSubmit}
                isLoading={isLoading}
                error={authError}
            />
        </div>
    );
};

export default LoginPage;
