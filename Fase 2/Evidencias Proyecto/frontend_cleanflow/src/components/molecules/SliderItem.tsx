import type { FC } from 'react';
import { Image } from '../atoms/Img';

// Definición del tipo de dato para el slide
export interface SlideData {
  id: number;
  src: string;
  alt: string;
}

interface CarouselItemProps {
  slide: SlideData;
  isActive: boolean;
}

export const CarouselItem: FC<CarouselItemProps> = ({ slide, isActive }) => {
  // Clases de Tailwind para gestionar la visibilidad y la transición
  const activeClasses = isActive ? 'opacity-100' : 'opacity-0 absolute';
  const transitionClasses = 'transition-opacity duration-500 ease-in-out';
  
  // Nota: Usa el estilo de transición 'absolute' en los inactivos para que solo uno ocupe espacio.

  return (
    <div className={`w-full h-full ${transitionClasses} ${activeClasses}`}>
      <Image src={slide.src} alt={slide.alt} />
      {/* Puedes agregar un overlay de texto aquí si fuera necesario */}
    </div>
  );
};