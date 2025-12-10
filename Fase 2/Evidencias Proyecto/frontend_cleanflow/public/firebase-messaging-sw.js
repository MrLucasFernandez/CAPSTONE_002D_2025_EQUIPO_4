// public/firebase-messaging-sw.js

// Importar Firebase SDK
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Configuración de Firebase (debe coincidir con tu .env)
firebase.initializeApp({
  apiKey: "AIzaSyAE6O6Tk2hTWUS1pkkoFlxMRPG3kPqcxXY",
  authDomain: "cleanflow-a11c0.firebaseapp.com",
  projectId: "cleanflow-a11c0",
  storageBucket: "cleanflow-a11c0.appspot.com",
  messagingSenderId: "846418516574",
  appId: "1:846418516574:web:157695a81486283df1f2cf"
});

const messaging = firebase.messaging();

// Manejar notificaciones push en segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  
  const notificationTitle = payload.notification?.title || 'Notificación';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: payload.notification?.icon || '/logo.png',
    data: payload.data || {}
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Click en notificación
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click:', event);
  event.notification.close();
  
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.openWindow(url)
  );
});