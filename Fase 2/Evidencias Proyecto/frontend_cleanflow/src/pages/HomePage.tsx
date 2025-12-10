import React, { useState } from 'react';
import { ImageCarousel } from '@organisms/home/Slider';
import { BellIcon } from '@heroicons/react/24/solid';

import slider1 from '@assets/imgs/slider1.png'; 
import slider2 from '@assets/imgs/slider2.png';
import slider3 from '@assets/imgs/slider3.png';

import CategoriesSection from '@modules/categories/organisms/CategorySection';
import FeaturedProductsCarousel from '@modules/products/organisms/FeaturedProductsCarousel';
import { useAuth } from '@modules/auth/hooks/useAuth';
import { registerSwAndGetToken } from '@/firebaseClient';

const dummySlides = [
  { id: 1, src: slider1, alt: 'Slide 1' },
  { id: 2, src: slider2, alt: 'Slide 2' },
  { id: 3, src: slider3, alt: 'Slide 3' },
];

const HomePage: React.FC = () => {
  const [notificationStatus, setNotificationStatus] = useState<string>('');
  const { user } = useAuth();

  const handleEnableNotifications = async () => {
    try {
      if (!user) {
        setNotificationStatus('❌ Debes iniciar sesión primero');
        return;
      }

      setNotificationStatus('Solicitando permiso...');
      
      const token = await registerSwAndGetToken();
      if (token) {
        setNotificationStatus('✅ Notificaciones activadas');
        console.log('Token FCM:', token);
      } else {
        setNotificationStatus('❌ No se pudo obtener el token');
      }
    } catch (err) {
      setNotificationStatus('❌ Error: ' + String(err));
      console.error('Error:', err);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      
      {/* Botón flotante para probar notificaciones */}
      <button
        onClick={handleEnableNotifications}
        className="fixed bottom-20 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110"
        title="Activar notificaciones push"
      >
        <BellIcon className="w-6 h-6" />
      </button>
      
      {notificationStatus && (
        <div className="fixed bottom-36 right-6 z-50 bg-white rounded-lg shadow-lg p-3 max-w-xs text-sm">
          {notificationStatus}
        </div>
      )}
      
      {/* Slider */}
      <div className="pt-4 pb-10 px-4">
        <ImageCarousel slides={dummySlides} />
      </div>

      {/* Productos Destacados Carrusel */}
      <FeaturedProductsCarousel />
      
      {/* Categorías destacadas */}
      <CategoriesSection />
    </div>
  );
};

export default HomePage;
