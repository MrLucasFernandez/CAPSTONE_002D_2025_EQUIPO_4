import type { FC } from 'react';
import { Button } from '@components/atoms/home/BtnSlider';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselControlsProps {
  totalSlides: number;
  activeIndex: number;
  onPrev: () => void;
  onNext: () => void;
  goToSlide: (index: number) => void;
}

export const CarouselControls: FC<CarouselControlsProps> = ({
  totalSlides,
  activeIndex,
  onPrev,
  onNext,
  goToSlide,
}) => {
  return (
    <>
      {/* Flechas de navegación */}
      <div className="absolute top-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2 p-4 z-10">
        <Button onClick={onPrev} className="ml-2">
          <ChevronLeft size={24} />
        </Button>
        <Button onClick={onNext} className="mr-2">
          <ChevronRight size={24} />
        </Button>
      </div>

      {/* Indicadores de posición */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === activeIndex ? 'bg-white' : 'bg-gray-400 opacity-50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </>
  );
};