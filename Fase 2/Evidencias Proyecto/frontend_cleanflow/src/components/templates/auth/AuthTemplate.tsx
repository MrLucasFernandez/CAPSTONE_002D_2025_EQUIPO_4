import React from 'react';

type AuthTemplateProps = {
  children: React.ReactNode;
  title: string;
  subtitle?: string;       // Nuevo prop opcional
  logoSrc?: string;        // Logo opcional arriba del título
  logoAlt?: string;        // Alt del logo
};

const AuthTemplate: React.FC<AuthTemplateProps> = ({ children, title, subtitle, logoSrc, logoAlt }) => {
  return (
    <div 
      className="
        min-h-screen 
        flex 
        items-center 
        justify-center 
        bg-gray-100 
        p-4
      "
    >
      <div 
        className="
          w-full 
          max-w-lg 
          bg-white 
          rounded-xl 
          shadow-2xl 
          p-8 
          sm:p-10
        "
      >
        {/* Logo opcional */}
        {logoSrc && (
          <div className="flex justify-center mb-6">
            <img src={logoSrc} alt={logoAlt || 'Logo'} className="h-16 w-auto" />
          </div>
        )}

        {/* Título principal */}
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-4">
          {title}
        </h1>

        {/* Subtitle opcional */}
        {subtitle && (
          <p className="text-center text-gray-600 mb-8">
            {subtitle}
          </p>
        )}

        {/* Contenido inyectado (formularios, botones, etc.) */}
        {children}
      </div>
    </div>
  );
};

export default AuthTemplate;
