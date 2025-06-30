import React, { useState } from 'react';
import Image from 'next/image';

interface BookProps {
    books: {
        title: string;
        imagePath: string;
    }[];
}

const BookComponent: React.FC<BookProps> = ({ books }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    if (!books || books.length === 0) {
        return null;
    }

    const getImagePath = (path: string) => {
        return path.startsWith('/books/') ? path : `/books/${path}`;
    };

    return (
        <div className="grid grid-cols-2 gap-4 pb-8">
            {books.map((book, index) => (
                <div key={index} className="flex flex-col items-center relative">
                    {/* Image container with zoom effect - only hover here triggers the effect */}
                    <div
                        className="relative w-32 h-48 transition-all duration-300 group"
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <div className={`absolute inset-0 transition-all duration-300 ${
                            hoveredIndex === index ? 'scale-110 -translate-y-2 z-10' : ''
                        }`}>
                            <Image
                                src={getImagePath(book.imagePath)}
                                alt={book.title}
                                fill
                                className="object-cover rounded-lg border border-orange-600/50"
                            />
                        </div>
                    </div>

                    {/* Text - normally cropped, shows full only when image is hovered */}
                    <div className="w-full max-w-[120px] mt-2 relative mb-4">
                        <div className={`transition-all duration-300 ${
                            hoveredIndex === index ? 'opacity-0' : 'opacity-100'
                        }`}>
                            <span className="text-xs text-center text-orange-400 truncate block">
                                {book.title}
                            </span>
                        </div>
                        <div className={`absolute top-0 left-0 right-0 transition-all duration-300 ${
                            hoveredIndex === index ? 'opacity-100 z-30' : 'opacity-0'
                        }`}>
                            <span className="text-lg text-center text-orange-400 whitespace-normal block bg-[#1a1a1a] p-1 rounded border border-orange-600/30">
                                {book.title}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BookComponent;