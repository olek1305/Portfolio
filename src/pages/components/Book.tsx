import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface BookData {
    title: string;
    imagePath: string;
}

const Book: React.FC<{ books: BookData[] }> = ({ books }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentBookIndex, setCurrentBookIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const componentRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 200);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!componentRef.current) return;

            const rect = componentRef.current.getBoundingClientRect();
            const isOverComponent =
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom;

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            if (!isOverComponent) {
                timeoutRef.current = setTimeout(() => {
                    setIsOpen(false);
                }, 500);
            }
        };

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [isOpen]);

    const getImagePath = (path: string) => {
        return path.startsWith('/books/') ? path : `/books/${path}`;
    };

    const nextBook = () => {
        setCurrentBookIndex((prev) => (prev + 1) % books.length);
    };

    const previousBook = () => {
        setCurrentBookIndex((prev) => (prev - 1 + books.length) % books.length);
    };

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div
            ref={componentRef}
            className={`fixed right-0 top-1/3 flex z-50 transition-transform duration-500 ease-in-out ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
        >
            <div
                className={`p-4 transition-all duration-300 ease-in-out overflow-y-auto max-h-[80vh] border ${
                    isOpen ? 'w-[300px] opacity-100' : 'w-0 opacity-0'
                }`}
            >
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <button
                            onClick={previousBook}
                            className="text-white px-2 py-1 rounded hover:bg-gray-700"
                        >
                            ←
                        </button>
                        <div className="overflow-hidden flex-1 mx-2">
                            <h3 className="text-purple-400 text-base break-words text-center flex items-center justify-center">
                                {books[currentBookIndex].title}
                            </h3>
                        </div>
                        <button
                            onClick={nextBook}
                            className="text-white px-2 py-1 rounded hover:bg-gray-700"
                        >
                            →
                        </button>
                    </div>
                    <div className="relative w-full aspect-[3/4]">
                        <Image
                            src={getImagePath(books[currentBookIndex].imagePath)}
                            alt={books[currentBookIndex].title}
                            fill
                            className="object-cover rounded-lg"
                        />
                    </div>
                </div>
            </div>

            <button
                onClick={toggleOpen}
                className="flex items-center px-2 py-6 rounded-l-lg hover:bg-gray-300 group
                transition-all duration-200 min-w-[40px] h-32 relative bg-[#0d1117] border"
            >
                <span
                    className="text-white whitespace-nowrap select-none text-sm group-hover:text-black"
                    style={{
                        writingMode: 'vertical-rl',
                        textOrientation: 'upright',
                        textTransform: 'uppercase',
                        letterSpacing: '-0.3em'
                    }}
                >
                    {isOpen ? '→ Books' : 'Books ←'}
                </span>
            </button>
        </div>
    );
};

export default Book;