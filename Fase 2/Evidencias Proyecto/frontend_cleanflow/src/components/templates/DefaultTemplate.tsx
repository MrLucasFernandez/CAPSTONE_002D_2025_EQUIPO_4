import React from 'react';

type DefaultTemplateProps = {
  /** El contenido específico de la página */
  children: React.ReactNode;
  /** Título principal (opcional) */
  pageTitle?: string;
};

const DefaultTemplate: React.FC<DefaultTemplateProps> = ({ children, pageTitle }) => {
  return (
    // 1. Contenedor principal: ocupa toda la altura y fondo
    <div className="min-h-screen bg-gray-50 text-gray-900">
      
      <main className="py-10">
        
        {/* 2. Contenedor de ancho limitado y centrado*/}
        {/* Usamos max-w-xl o max-w-3xl para que el formulario no se extienda demasiado. */}
        <div className="
          max-w-xl 
          mx-auto 
          px-4 sm:px-6 lg:px-8
          bg-[#E6E6E6] /* Fondo para el contenedor limitado */
          shadow-lg /* Sombra sutil para destacarlo */
          rounded-lg /* Bordes redondeados */
          p-8 /* Relleno interior */
        ">
          
          {/* Título de la página (Opcional) */}
          {pageTitle && (
            <div className="mb-6 border-b pb-4">
              <h1 className="text-3xl font-extrabold leading-tight text-gray-900">
                {pageTitle}
              </h1>
            </div>
          )}

          {/* Aquí se inyecta el contenido de la página */}
          {children}

        </div>
      </main>

    </div>
  );
};

export default DefaultTemplate;