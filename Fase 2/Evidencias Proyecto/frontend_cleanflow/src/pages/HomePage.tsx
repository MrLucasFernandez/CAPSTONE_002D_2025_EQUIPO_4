import React from 'react';
import { ImageCarousel } from '@organisms/home/Slider';

import slider1 from '@assets/imgs/slider1.png'; 
import slider2 from '@assets/imgs/slider2.png';
import slider3 from '@assets/imgs/slider3.png';

const dummySlides = [
  { id: 1, src: slider1, alt: 'Slide 1' },
  { id: 2, src: slider2, alt: 'Slide 2' },
  { id: 3, src: slider3, alt: 'Slide 3' },
];

const HomePage: React.FC = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <ImageCarousel slides={dummySlides} />
    </div>
  );
};

export default HomePage;