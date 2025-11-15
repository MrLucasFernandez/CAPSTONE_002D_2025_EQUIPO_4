import React, { useState, useEffect } from 'react';
import { LoginForm } from '../components/LoginForm';
import type { LoginCredentials } from '../../../types/auth';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {

    const [isLoading, setIsLoading] = useState(false);
    const { login, authError, user } = useAuth();
    const navigate = useNavigate();

    const handleLoginSubmit = async (credentials: LoginCredentials) => {
        setIsLoading(true);

        try {
            await login(credentials);
        } catch (err) {
            console.error("Login falló en el componente:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Si el user cambia (login exitoso), redirige automáticamente
    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

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
