// src/firebaseClient.ts
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, deleteToken, onMessage } from 'firebase/messaging';

const app = initializeApp({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
});

const messaging = getMessaging(app);

/**
 * Registra el SW, pide permiso, obtiene token y lo envía al backend.
 * Devuelve token o null.
 */
export async function registerSwAndGetToken(): Promise<string | null> {
    try {
        if (!('serviceWorker' in navigator)) {
        console.warn('Service Worker no soportado en este navegador');
        return null;
    }

    // registra /firebase-messaging-sw.js y espera a que esté listo
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    await navigator.serviceWorker.ready; // asegura que esté activo

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
        console.log('Permiso de notificaciones no concedido');
        return null;
    }

    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY as string | undefined;
    if (!vapidKey) {
        console.warn('VAPID key no configurada en env');
    }

    const token = await getToken(messaging, { 
        vapidKey,
        serviceWorkerRegistration: registration 
    });

    if (!token) {
        console.warn('No se obtuvo token FCM (puede que el navegador no soporte o la app no esté habilitada)');
        return null;
    }

    // enviar token al backend — añade auth header si usas JWT
    try {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/push_token/register`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, platform: 'web' }),
        });
        } catch (err) {
        console.warn('No se pudo enviar token al backend:', err);
        // no abortes el flujo; aún devolvemos el token
        }

        console.log('FCM token obtenido:', token);
        return token;
    } catch (err) {
        console.error('Error en registerSwAndGetToken:', err);
        return null;
    }
}

/**
 * Elimina token del navegador y notifica al backend para unregister.
 */
export async function unregisterTokenAndRemoveFromServer(currentToken?: string) {
    try {
        const tokenToDelete = currentToken || (await getCurrentTokenSafely());
        if (!tokenToDelete) return false;

    // eliminar en firebase messaging
    await deleteToken(messaging);

    // avisar al backend
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/push_token/unregister`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: tokenToDelete }),
        });

        console.log('Token eliminado y backend notificado');
        return true;
    } catch (err) {
        console.error('Error eliminando token:', err);
        return false;
    }
}

/** Helper: obtiene el token actual sin pedir permisos (puede devolver undefined) */
async function getCurrentTokenSafely() {
    try {
        const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY as string | undefined;
        const token = await getToken(messaging, { vapidKey });
        return token || null;
    } catch {
        return null;
    }
}

/**
 * Listener para mensajes en primer plano (cuando la app está abierta).
 * El callback recibe el payload (data) de la notificación.
 */
export function onForegroundMessage(callback: (payload: any) => void) {
    onMessage(messaging, (payload) => {
        try {
        callback(payload);
        } catch (err) {
        console.error('Error en foreground callback:', err);
        }
    });
}