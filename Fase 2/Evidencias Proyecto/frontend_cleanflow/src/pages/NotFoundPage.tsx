// src/pages/NotFoundPage.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        // Redirige al usuario a la página de inicio (/)
        navigate('/');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800 p-4">
            
            {/* Título de Error */}
            <h1 className="text-9xl font-extrabold text-indigo-600 tracking-widest animate-bounce">
                404
            </h1>
            
            {/* Mensaje principal */}
            <div className="bg-gray-800 px-2 text-sm rounded rotate-12 absolute text-white">
                Página No Encontrada
            </div>
            
            {/* Descripción */}
            <p className="mt-8 text-xl text-center max-w-lg">
                Lo sentimos, la página que estás buscando no existe. Podría haber sido eliminada o la dirección URL es incorrecta.
            </p>

            {/* Botón de Regreso */}
            <button 
                onClick={handleGoHome}
                className="mt-6 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
                Volver a la Página de Inicio
            </button>
            
            <a 
                href="mailto:soporte@tudominio.com"
                className="mt-4 text-sm text-indigo-500 hover:text-indigo-700"
            >
                Reportar un problema
            </a>
        </div>
    );
};

export default NotFoundPage;