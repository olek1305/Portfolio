import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface BookData {
    title: string;
    imagePath: string;
}

const Book: React.FC<{ books: BookData[] }> = ({ books }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const [currentBookIndex, setCurrentBookIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const componentRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 200);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isOpen || isPinned) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!componentRef.current || !panelRef.current) return;

            const buttonRect = componentRef.current.getBoundingClientRect();
            // Add extra margin around button for better detection
            const extendedButtonRect = {
                left: buttonRect.left - 10,
                right: buttonRect.right + 10,
                top: buttonRect.top - 10,
                bottom: buttonRect.bottom + 10
            };

            const panelRect = panelRef.current.getBoundingClientRect();

            const isOverButton =
                e.clientX >= extendedButtonRect.left &&
                e.clientX <= extendedButtonRect.right &&
                e.clientY >= extendedButtonRect.top &&
                e.clientY <= extendedButtonRect.bottom;

            const isOverPanel =
                e.clientX >= panelRect.left &&
                e.clientX <= panelRect.right &&
                e.clientY >= panelRect.top &&
                e.clientY <= panelRect.bottom;

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            if (!isOverButton && !isOverPanel) {
                timeoutRef.current = setTimeout(() => {
                    if (!isPinned) {
                        setIsOpen(false);
                    }
                }, 1000);
            }
        };

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [isOpen, isPinned]);

    const cancelCloseTimer = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    if (!books || books.length === 0) {
        return null;
    }

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

    const togglePin = () => {
        setIsPinned(!isPinned);
    };

    return (
        <div
            ref={componentRef}
            className={`flex w-[40px] transition-transform duration-500 ease-in-out ${
                isVisible ? 'translate-x-0' : 'translate-x-full'
            }`}
            onMouseEnter={cancelCloseTimer}
        >
            {/* Book content panel */}
            <div
                ref={panelRef}
                className={`absolute top-0 right-full mt-0 mr-2 p-3 bg-[#0d1117] border rounded-l-lg shadow-lg z-100 transition-opacity duration-300 ease-in-out ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                } ${isPinned ? 'border-purple-500 border-2' : ''}`}
                style={{ width: '320px', maxHeight: '80vh', overflowY: 'auto' }}
                onMouseEnter={cancelCloseTimer}
            >
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                        <button
                            onClick={previousBook}
                            className="text-white px-1.5 py-0.5 rounded hover:bg-gray-700 text-xs"
                        >
                            ←
                        </button>
                        <div className="overflow-hidden flex-1 mx-2">
                            <h3 className="text-purple-400 text-sm break-words text-center flex items-center justify-center">
                                {books[currentBookIndex].title}
                            </h3>
                        </div>
                        <button
                            onClick={nextBook}
                            className="text-white px-1.5 py-0.5 rounded hover:bg-gray-700 text-xs"
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
                    <div className="flex justify-end">
                        <button
                            onClick={togglePin}
                            className={`px-1.5 py-0.5 rounded text-xs ${
                                isPinned
                                    ? 'bg-purple-700 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                            title={isPinned ? "Unpin panel (will close on mouse leave)" : "Pin panel open"}
                        >
                            {isPinned ? "📌 Pinned" : "📌 Pin"}
                        </button>
                    </div>
                </div>
            </div>

            <button
                onClick={toggleOpen}
                className="flex items-center justify-center px-2 py-6 rounded-l-lg hover:bg-purple-700 group
                transition-all duration-200 w-[40px] h-32 relative bg-[#0d1117] border"
                onMouseEnter={cancelCloseTimer}
            >
                <span
                    className="text-white font-medium whitespace-nowrap select-none text-sm group-hover:text-white"
                    style={{
                        writingMode: 'vertical-lr',
                        transform: 'rotate(180deg)',
                        letterSpacing: '0.05em'
                    }}
                >
                    {isOpen ? 'Books ↓' : '↑ Books'}
                </span>
            </button>
        </div>
    );
};

export default Book;