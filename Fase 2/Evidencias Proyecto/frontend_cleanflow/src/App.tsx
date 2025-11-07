// src/App.tsx

import React from 'react';
// 🚨 Importante: Eliminamos BrowserRouter, Routes, Route, y todas las Páginas.
// El enrutamiento es manejado por el RouterProvider en main.tsx.

// Este componente no necesita props y actúa como un wrapper simple.
const App: React.FC = () => {
    
    // Si necesitas un wrapper global de estilos o providers de terceros
    // que no dependan del Router, irían aquí.
    
    // Como tu router ya usa PublicLayout y AdminLayout como contenedores,
    // este App.tsx puede ser un componente contenedor vacío o simple.
    return (
        // Retornamos un fragmento. El RouterProvider inyectará el contenido
        // de la ruta correspondiente (PublicLayout o AdminLayout) aquí.
        <React.Fragment>
            {/* El contenido específico de la ruta activa se renderiza automáticamente */}
        </React.Fragment>
    );
};

export default App;