// src/main.tsx (o App.tsx)

import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router'; // Importa el objeto router
import { AuthProvider } from './modules/admin/hooks/useAdminAuth';
import './index.css';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Aquí es donde se renderiza todo el sistema de enrutamiento */}
    <AuthProvider>
      <RouterProvider router={router} /> 
    </AuthProvider>
  </React.StrictMode>,
);