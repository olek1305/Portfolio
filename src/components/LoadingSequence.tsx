import { motion, AnimatePresence } from "framer-motion";
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

interface LineProgress {
    text: string;
    progress: number;
    completed: boolean;
}

const LoadingSequence = ({ isLoading }: LoadingSequenceProps) => {
    const [globalProgress, setGlobalProgress] = useState(0);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [lineStates, setLineStates] = useState<LineProgress[]>([]);
    const [startTime, setStartTime] = useState<number>(0);
    const [hasCompletedAll, setHasCompletedAll] = useState(false);

    const TOTAL_DURATION = 1800;
    const TIME_PER_LINE = 250;

    useEffect(() => {
        if (!isLoading) {
            setGlobalProgress(0);
            setCurrentLineIndex(0);
            setLineStates([]);
            setStartTime(0);
            setHasCompletedAll(false);
            return;
        }

        setStartTime(Date.now());
    }, [isLoading]);

    useEffect(() => {
        if (!isLoading || startTime === 0) return;

        let completed = false;

        const globalProgressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const calculatedProgress = Math.min((elapsed / TOTAL_DURATION) * 100, 100);

            setGlobalProgress(calculatedProgress);

            if (calculatedProgress >= 99 && !completed) {
                completed = true;
                setHasCompletedAll(true);

                // Instantly set to 100%
                setGlobalProgress(100);

                setLineStates(prev => {
                    const remainingLines = lines.slice(prev.length).map(text => ({
                        text,
                        progress: 100,
                        completed: true
                    }));

                    return [
                        ...prev.map(line => ({
                            ...line,
                            progress: 100,
                            completed: true
                        })),
                        ...remainingLines
                    ];
                });

                setCurrentLineIndex(lines.length);
            }

            if (calculatedProgress >= 100) {
                clearInterval(globalProgressInterval);
                setGlobalProgress(100);
            }
        }, 50);

        return () => clearInterval(globalProgressInterval);
    }, [isLoading, startTime]);

    useEffect(() => {
        if (!isLoading || currentLineIndex >= lines.length || startTime === 0) return;

        setLineStates(prev => {
            if (prev.length > currentLineIndex) {
                return prev;
            }

            return [...prev, {
                text: lines[currentLineIndex],
                progress: 0,
                completed: false
            }];
        });

        const lineStartTime = Date.now();
        const updateInterval = 50;

        const lineProgressInterval = setInterval(() => {
            const elapsed = Date.now() - lineStartTime;
            const baseProgress = Math.min((elapsed / TIME_PER_LINE) * 100, 100);

            const randomVariation = (Math.random() - 0.5) * 15;
            const displayProgress = Math.max(0, Math.min(100, baseProgress + randomVariation));

            if (baseProgress >= 100) {
                clearInterval(lineProgressInterval);

                setLineStates(prev =>
                    prev.map((line, i) =>
                        i === currentLineIndex ? { ...line, progress: 100, completed: true } : line
                    )
                );

                setTimeout(() => {
                    setCurrentLineIndex(prev => prev + 1);
                }, 50);
            } else {
                setLineStates(prev =>
                    prev.map((line, i) =>
                        i === currentLineIndex ? { ...line, progress: displayProgress } : line
                    )
                );
            }
        }, updateInterval);

        return () => {
            clearInterval(lineProgressInterval);
        };
    }, [currentLineIndex, isLoading, startTime]);

    const lineHeight = 24;
    const lineSpacing = 4;
    const containerHeight = lineStates.length * (lineHeight + lineSpacing);

    return (
        <div className="w-full max-w-lg">
            <motion.div
                className="text-orange-400 font-mono text-sm space-y-1 overflow-hidden"
                initial={{ height: 0 }}
                animate={{ height: containerHeight }}
                transition={{
                    duration: 0.3,
                    ease: "easeOut"
                }}
            >
                <AnimatePresence>
                    {lineStates.map((lineState, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.3,
                                ease: "easeOut"
                            }}
                            className="flex items-center"
                        >
                            <span className="text-yellow-500 mr-2">{">"}</span>
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                {lineState.text}
                            </motion.span>

                            {!lineState.completed && (
                                <motion.span
                                    className="text-orange-300 ml-2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {Math.floor(lineState.progress)}%
                                </motion.span>
                            )}

                            {lineState.completed && (
                                <motion.span
                                    className="text-green-500 ml-2"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        duration: 0.3,
                                        ease: "backOut"
                                    }}
                                >
                                    [OK]
                                </motion.span>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            <div className="mt-4 bg-gray-800 rounded-sm h-4 overflow-hidden">
                <motion.div
                    className="bg-gradient-to-r from-orange-500 to-yellow-500 h-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${globalProgress}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                />
            </div>

            <div className="mt-2 text-xs text-gray-400 font-mono flex justify-between">
                <span>Half-Life Portfolio v1.0</span>
                <motion.span
                    key={Math.floor(globalProgress)}
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.1 }}
                >
                    {Math.min(Math.floor(globalProgress), 100)}%
                </motion.span>
            </div>
        </div>
    );
};

export default LoadingSequence;
