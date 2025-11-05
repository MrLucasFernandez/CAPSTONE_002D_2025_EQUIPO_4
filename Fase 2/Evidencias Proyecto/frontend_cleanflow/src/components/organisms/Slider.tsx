import type { FC } from 'react';
import { CarouselControls } from '../molecules/SliderCtrls';
import { CarouselItem } from '../molecules/SliderItem';
import type { SlideData } from '../molecules/SliderItem';
import { useState } from 'react';
import { useEffect } from 'react';

interface ImageCarouselProps {
  slides: SlideData[];
  autoSlide?: boolean; 
  autoSlideInterval?: number; 
}

export const ImageCarousel: FC<ImageCarouselProps> = ({ 
  slides, 
  autoSlide = true, 
  autoSlideInterval = 4000 // (4 segundos)
}) => {

  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = slides.length;

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

 // --- IMPLEMENTACIÓN DE AUTO-SLIDE ---
  useEffect(() => {
    if (autoSlide && totalSlides > 1) {
      // Crear el intervalo
      const slideInterval = setInterval(nextSlide, autoSlideInterval);

      // Función de limpieza
      return () => {
        clearInterval(slideInterval);
      };
    }
  }, [autoSlide, autoSlideInterval, totalSlides]);
// -----------------------------------------------------
  return (
    <div className="relative w-full max-w-4xl mx-auto h-96 overflow-hidden rounded-lg shadow-xl">
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