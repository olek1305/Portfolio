import { useEffect } from 'react';
import Image from 'next/image';

export const ImageLightbox = ({ src, alt, onClose }: {
    src: string;
    alt: string;
    onClose: () => void
}) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white text-2xl z-50 hover:text-orange-400"
                aria-label="Close image viewer"
            >
                ✕
            </button>
            <div className="relative w-full h-full max-w-5xl max-h-[90vh]">
                <Image
                    src={src}
                    alt={alt || "Enlarged image view"}
                    fill
                    className="object-contain"
                    unoptimized={src.endsWith('.gif')}
                />
            </div>
            <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm opacity-80">
                {alt || "Image"} - Click anywhere to close
            </div>
        </div>
    );
};