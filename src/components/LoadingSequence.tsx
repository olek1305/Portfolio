import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingSequenceProps {
    isLoading: boolean;
}

const lines = [
    "// PORTFOLIO LOADING SEQUENCE INITIATED",
    "> SYSTEM CHECK...",
    "> MEMORY ALLOCATION...",
    "> RENDER PIPELINE...",
    "> SECURITY PROTOCOLS...",
    "> BIOS INTERFACE...",
    "> INITIALIZING BLACK MESA...",
    "> LOADING ASSETS...",
    "> VERIFYING INTEGRITY...",
    "> FINALIZING SETUP...\n"
];

const LoadingSequence = ({ isLoading }: LoadingSequenceProps) => {
    const [progress, setProgress] = useState(0);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [displayedLines, setDisplayedLines] = useState<string[]>([]);

    useEffect(() => {
        if (!isLoading) return;

        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + Math.random() * 15;
            });
        }, 100);

        const lineInterval = setInterval(() => {
            setCurrentLineIndex((prevIndex) => {
                if (prevIndex >= lines.length - 1) {
                    clearInterval(lineInterval);
                    return prevIndex;
                }
                setDisplayedLines((prevLines) => [...prevLines, lines[prevIndex]]);
                return prevIndex + 1;
            });
        }, 300);

        return () => {
            clearInterval(progressInterval);
            clearInterval(lineInterval);
        };
    }, [isLoading]);

    return (
        <div className="w-full max-w-lg">
            <div className="text-orange-400 font-mono text-sm">
                {displayedLines.map((line, index) => (
                    <div key={index} className="flex">
                        <span className="text-yellow-500 mr-2">{">"}</span>
                        <span>{line}</span>
                        <span className="text-green-500 ml-2">[OK]</span>
                    </div>
                ))}

                {currentLineIndex < lines.length && (
                    <div className="flex">
                        <span className="text-yellow-500 mr-2">{">"}</span>
                        <span>{lines[currentLineIndex]}</span>
                        <span className="text-orange-300 ml-2">
                            {Math.min(Math.floor(progress), 100)}%
                        </span>
                    </div>
                )}
            </div>

            <div className="mt-4 bg-gray-800 rounded-sm h-4 overflow-hidden">
                <motion.div
                    className="bg-gradient-to-r from-orange-500 to-yellow-500 h-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.2 }}
                />
            </div>

            <div className="mt-2 text-xs text-gray-400 font-mono flex justify-between">
                <span>Half-Life Portfolio v1.0</span>
                <span>{Math.min(Math.floor(progress), 100)}%</span>
            </div>
        </div>
    );
};

export default LoadingSequence;
