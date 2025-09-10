
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../Icons';

interface CarouselProps {
  images: string[];
  autoPlay?: boolean;
  interval?: number;
}

const Carousel: React.FC<CarouselProps> = ({ images, autoPlay = true, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = useCallback(() => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, images.length]);

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, images.length]);

  useEffect(() => {
    if (autoPlay) {
      const slideInterval = setInterval(goToNext, interval);
      return () => clearInterval(slideInterval);
    }
  }, [currentIndex, autoPlay, interval, goToNext]);

  if (!images || images.length === 0) {
    return <div className="aspect-video bg-gray-300 animate-pulse"></div>;
  }

  return (
    <div className="relative w-full h-full group">
      <div
        style={{ backgroundImage: `url(${images[currentIndex]})` }}
        className="w-full h-full bg-center bg-cover duration-500 transition-all"
      ></div>
      {images.length > 1 && (
        <>
          {/* Left Arrow */}
          <div className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer" onClick={goToPrevious}>
            <ChevronLeftIcon className="w-6 h-6" />
          </div>
          {/* Right Arrow */}
          <div className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer" onClick={goToNext}>
            <ChevronRightIcon className="w-6 h-6" />
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center py-2 space-x-2">
            {images.map((_, slideIndex) => (
              <div
                key={slideIndex}
                onClick={() => setCurrentIndex(slideIndex)}
                className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                  currentIndex === slideIndex ? 'bg-white' : 'bg-white/50'
                }`}
              ></div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Carousel;
