// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router';

// 1. Contexto Global de Autenticación (Login/Logout/Token)
import { AuthProvider } from './modules/auth/context/AuthContext.tsx'; 
// 2. Contexto Específico de Autorización (Roles/Permisos de Admin)
import { AdminAuthProvider } from './modules/admin/context/AdminAuthContext.tsx'; 
// 3. Contexto del Carrito (global)
import { CartProvider } from './modules/cart/context/CartContext';
// Toasts
import { ToastProvider } from '@/components/ui/ToastContext';

import './index.css';
import CartSidebar from '@/components/organisms/CartSidebar/CartSidebar';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 🔑 NIVEL 1: AUTENTICACIÓN GLOBAL (DEBE SER EL MÁS EXTERNO) */}
    <AuthProvider>
      {/* 🛡️ NIVEL 2: AUTORIZACIÓN DE ADMIN (Depende del estado de AuthProvider) */}
      <AdminAuthProvider>
        {/* 🔔 NIVEL 3.0: Sistema de toasts global */}
        <ToastProvider>
          {/* 🧺 NIVEL 3.1: Carrito global */}
          <CartProvider>
            {/* 🗺️ NIVEL 3: EL SISTEMA DE RUTAS */}
            <RouterProvider router={router} /> 
            {/* Sidebar del carrito montado globalmente para que toggleSidebar funcione en cualquier página */}
            <CartSidebar />
          </CartProvider>
        </ToastProvider>
      </AdminAuthProvider>
    </AuthProvider>
  </React.StrictMode>,
);