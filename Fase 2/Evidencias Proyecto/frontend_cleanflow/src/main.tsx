// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router';

// 1. Contexto Global de Autenticación (Login/Logout/Token)
import { AuthProvider } from './modules/auth/context/AuthContext.tsx'; 
// 2. Contexto Específico de Autorización (Roles/Permisos de Admin)
import { AdminAuthProvider } from './modules/admin/context/AdminAuthContext.tsx'; 

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 🔑 NIVEL 1: AUTENTICACIÓN GLOBAL (DEBE SER EL MÁS EXTERNO) */}
    <AuthProvider>
      {/* 🛡️ NIVEL 2: AUTORIZACIÓN DE ADMIN (Depende del estado de AuthProvider) */}
      <AdminAuthProvider>
        {/* 🗺️ NIVEL 3: EL SISTEMA DE RUTAS */}
        <RouterProvider router={router} /> 
      </AdminAuthProvider>
    </AuthProvider>
  </React.StrictMode>,
);