import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router';

import { AuthProvider } from './modules/auth/context/AuthContext.tsx';
import { AdminAuthProvider } from './modules/admin/context/AdminAuthContext.tsx';
import { CartProvider } from './modules/cart/context/CartContext';
import { ToastProvider } from '@/components/ui/ToastContext';

import './index.css';
import CartSidebar from '@/components/organisms/CartSidebar/CartSidebar';

// funciones de firebase
import { registerSwAndGetToken, onForegroundMessage, unregisterTokenAndRemoveFromServer } from './firebaseClient';

declare global {
  interface Window {
    requestFCMToken?: () => Promise<string | null>;
    unregisterFCMToken?: () => Promise<boolean>;
  }
}

/* ------------------------------------------------
    Exponer helpers globales para solicitar token
    ------------------------------------------------ */
window.requestFCMToken = async () => {
  try {
    const token = await registerSwAndGetToken();
    if (token) console.log('✅ Token FCM registrado:', token);
    return token;
  } catch (err) {
    console.error('❌ Error obteniendo token FCM:', err);
    return null;
  }
};

window.unregisterFCMToken = async () => {
  try {
    const ok = await unregisterTokenAndRemoveFromServer();
    return ok;
  } catch (err) {
    console.error('Error eliminando token FCM desde main:', err);
    return false;
  }
};

/* ------------------------------------------------
    3) Mensajes en primer plano (app abierta)
    ------------------------------------------------
    Puedes reemplazar console.log por tu ToastProvider.
*/
onForegroundMessage((payload) => {
  console.log('Mensaje en primer plano:', payload);
  // Ejemplo: mostrar toast
  // showToast(payload.notification?.title || 'Notificación', payload.notification?.body);
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <AdminAuthProvider>
        <ToastProvider>
          <CartProvider>
            <RouterProvider router={router} />
            <CartSidebar />
          </CartProvider>
        </ToastProvider>
      </AdminAuthProvider>
    </AuthProvider>
  </React.StrictMode>,
);