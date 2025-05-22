import React, { useState, useEffect, useRef } from 'react';

interface SlideOverData {
    title: string;
    description: string;
}

interface SlideOverProps {
    items: SlideOverData[] | Record<string, string>[];
    name?: string;
}

const SlideOver: React.FC<SlideOverProps> = ({ items, name = "SlideOver" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
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
            const panelRect = panelRef.current.getBoundingClientRect();

            const isOverButton =
                e.clientX >= buttonRect.left &&
                e.clientX <= buttonRect.right &&
                e.clientY >= buttonRect.top &&
                e.clientY <= buttonRect.bottom;

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
    }, [isOpen, isPinned]);

    const cancelCloseTimer = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    if (!items || items.length === 0) {
        return null;
    }

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const togglePin = () => {
        setIsPinned(!isPinned);
    };

    // Render the content differently based on data structure
    const renderContent = () => {
        // Check if we have a title / description structure or key/value structure
        if ('title' in items[0] && 'description' in items[0]) {
            // The standard SlideOverData format
            return (
                <div className="space-y-3">
                    {(items as SlideOverData[]).map((item, index) => (
                        <div key={index} className="border-b border-gray-700 pb-3 last:border-b-0 last:pb-0">
                            <h3 className="text-purple-400 text-2xl font-medium mb-1">{item.title}</h3>
                            <div className="text-green-400 text-lg p-1.5 rounded-lg bg-[#161b22] overflow-auto">
                                {item.description}
                            </div>
                        </div>
                    ))}
                </div>
            );
        } else {
            // Treat as a key-value record object
            return (
                <div className="space-y-2">
                    {items.map((item, index) => (
                        <div key={index} className="border-b border-gray-700 pb-2 last:border-b-0 last:pb-0">
                            {Object.entries(item).map(([key, value]) => (
                                <div key={key} className="flex py-0.5">
                                    <span className="text-purple-400 text-lg font-medium w-1/3">{key}:</span>
                                    <span className="text-green-400 text-lg w-2/3">{value}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            );
        }
    };

    return (
        <div
            ref={componentRef}
            className={`flex w-[40px] transition-transform duration-500 ease-in-out ${
                isVisible ? 'translate-x-0' : 'translate-x-full'
            }`}
            onMouseEnter={cancelCloseTimer}
        >
            {/* SlideOver content panel */}
            <div
                ref={panelRef}
                className={`absolute top-0 right-full mt-0 mr-2 p-3 bg-[#0d1117] border rounded-l-lg shadow-lg z-50 transition-opacity duration-300 ease-in-out ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                } ${isPinned ? 'border-purple-500 border-2' : ''}`}
                style={{ width: '320px', maxHeight: '80vh', overflowY: 'auto' }}
                onMouseEnter={cancelCloseTimer}
            >
                <div className="flex flex-col gap-2">
                    <h3 className="text-purple-400 text-sm font-medium text-center">
                        {name}
                    </h3>
                    <div className="text-green-400 p-2 rounded-lg bg-[#161b22] overflow-auto max-h-[400px]">
                        {renderContent()}
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
                transition-all duration-200 min-w-[40px] h-32 relative bg-[#0d1117] border border-white"
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
                    {isOpen ? `${name} ↓` : `↑ ${name}`}
                </span>
            </button>
        </div>
    );
};

export default SlideOver;