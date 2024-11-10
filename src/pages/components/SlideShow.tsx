import React, { useState } from 'react';
import Image from 'next/image';

type SlideshowProps = {
  images: string[];
  altText?: string;
};

export default function MarkdownSlideshow({ images, altText = 'Slideshow image' }: SlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => setCurrentIndex((currentIndex + 1) % images.length);
  const prevSlide = () => setCurrentIndex((currentIndex - 1 + images.length) % images.length);

  return (
    <div className="slideshow-container mx-auto text-center">
      <div className="flex justify-center items-center space-x-4 my-4">
        <button onClick={prevSlide} className="text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition">
          Previous
        </button>

        <Image
          src={images[currentIndex]}
          alt={altText}
          width={800}
          height={600}
          className="rounded-lg"
        />

        <button onClick={nextSlide} className="text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition">
          Next
        </button>
      </div>
      <p className="text-sm text-gray-400">Image {currentIndex + 1} of {images.length}</p>
    </div>
  );
}