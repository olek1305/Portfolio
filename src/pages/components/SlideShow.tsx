import React, { useState } from 'react';
import Image from 'next/image';
import { ImageLightbox } from './ImageLightbox';

type SlideshowProps = {
    images: string[];
    altText?: string;
};

export default function MarkdownSlideshow({ images, altText = 'Slideshow image' }: SlideshowProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const nextSlide = () => setCurrentIndex((currentIndex + 1) % images.length);
    const prevSlide = () => setCurrentIndex((currentIndex - 1 + images.length) % images.length);

    if (!images || images.length === 0) {
        return <p>No images available</p>;
    }

    return (
        <div className="slideshow-container mx-auto text-center">
            {lightboxOpen && (
                <ImageLightbox
                    src={images[currentIndex]}
                    alt={`${altText} - Image ${currentIndex + 1} of ${images.length}`}
                    onClose={() => setLightboxOpen(false)}
                />
            )}

            <div className="flex justify-center items-center space-x-4 my-4">
                <button onClick={prevSlide} className="text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition">
                    Previous
                </button>

                <div
                    className="relative group cursor-zoom-in"
                    onClick={() => setLightboxOpen(true)}
                >
                    <Image
                        src={images[currentIndex]}
                        alt={`${altText} - Image ${currentIndex + 1} of ${images.length}`}
                        width={700}
                        height={600}
                        className="rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white bg-orange-600/80 px-2 py-1 rounded text-sm">
                Click to enlarge
              </span>
                    </div>
                </div>

                <button onClick={nextSlide} className="text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition">
                    Next
                </button>
            </div>
            <p className="text-sm text-gray-400">Image {currentIndex + 1} of {images.length}</p>
        </div>
    );
}