import type { FC } from 'react';
import { Image } from '@atoms/Img';

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

  const activeClasses = isActive ? 'opacity-100' : 'opacity-0 absolute';
  const transitionClasses = 'transition-opacity duration-500 ease-in-out';

  return (
    <div className={`w-full h-full ${transitionClasses} ${activeClasses}`}>
      <Image src={slide.src} alt={slide.alt} />
    </div>
  );
};