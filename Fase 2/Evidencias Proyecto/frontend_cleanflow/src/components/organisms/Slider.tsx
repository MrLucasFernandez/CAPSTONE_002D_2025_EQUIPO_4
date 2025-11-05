import type { FC } from 'react';
import { CarouselControls } from '../molecules/SliderCtrls';
import { CarouselItem } from '../molecules/SliderItem';
import type { SlideData } from '../molecules/SliderItem';
import { useState } from 'react';
import { useEffect } from 'react';

interface ImageCarouselProps {
  slides: SlideData[];
  autoSlide?: boolean; // Booleano para activar/desactivar el auto-slide
  autoSlideInterval?: number; // Intervalo en milisegundos (ej: 3000)
}

export const ImageCarousel: FC<ImageCarouselProps> = ({ 
  slides, 
  autoSlide = true, // Establece el valor por defecto
  autoSlideInterval = 4000 // Establece el valor por defecto (4 segundos)
}) => {

  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = slides.length;

 // ... (Funciones nextSlide y prevSlide no cambian) ...
  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

 // --- FUNCIÓN CENTRAL: IMPLEMENTACIÓN DE AUTO-SLIDE ---

  useEffect(() => {
    // Las variables autoSlide, autoSlideInterval y totalSlides 
    // ahora están disponibles en este scope
    if (autoSlide && totalSlides > 1) {
      // 1. Crear el intervalo
      const slideInterval = setInterval(nextSlide, autoSlideInterval);

      // 2. Función de limpieza
      return () => {
        clearInterval(slideInterval);
      };
    }
  }, [autoSlide, autoSlideInterval, totalSlides]);
// -----------------------------------------------------
  return (
    <div className="relative w-full max-w-4xl mx-auto h-96 overflow-hidden rounded-lg shadow-xl">
      {/* Contenedor de slides - debe ser relative para que los items 'absolute' funcionen */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <CarouselItem
            key={slide.id}
            slide={slide}
            isActive={index === activeIndex}
          />
        ))}
      </div>

      {/* Controles del Carrusel (Molécula) */}
      <CarouselControls
        totalSlides={totalSlides}
        activeIndex={activeIndex}
        onPrev={prevSlide}
        onNext={nextSlide}
        goToSlide={setActiveIndex}
      />
    </div>
  );
};