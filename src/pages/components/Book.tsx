import React from 'react';
import Image from 'next/image';

interface BookProps {
    books: {
        title: string;
        imagePath: string;
    }[];
}

const BookComponent: React.FC<BookProps> = ({ books }) => {
    if (!books || books.length === 0) {
        return null;
    }

    const getImagePath = (path: string) => {
        return path.startsWith('/books/') ? path : `/books/${path}`;
    };

    return (
        <div className="grid grid-cols-2 gap-4">
            {books.map((book, index) => (
                <div key={index} className="flex flex-col items-center">
                    <div className="relative w-32 h-48">
                        <Image
                            src={getImagePath(book.imagePath)}
                            alt={book.title}
                            fill
                            className="object-cover rounded-lg border border-orange-600/50"
                        />
                    </div>
                    <span className="text-xs text-center mt-2 text-orange-400 max-w-[120px] truncate">
                        {book.title}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default BookComponent;