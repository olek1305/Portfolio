import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingSequenceProps {
    isLoading: boolean;
}

const lines = [
    { text: "PORTFOLIO LOADING SEQUENCE INITIATED", type: "header" },
    { text: "SYSTEM CHECK", type: "normal" },
    { text: "MEMORY ALLOCATION", type: "normal" },
    { text: "RENDER PIPELINE", type: "normal" },
    { text: "SECURITY PROTOCOLS", type: "warning" },
    { text: "BIOS INTERFACE", type: "normal" },
    { text: "INITIALIZING BLACK MESA", type: "special" },
    { text: "LOADING ASSETS", type: "normal" },
    { text: "VERIFYING INTEGRITY", type: "normal" },
    { text: "FINALIZING SETUP", type: "success" }
];

interface LineProgress {
    text: string;
    type: string;
    progress: number;
    completed: boolean;
}

const LoadingSequence = ({ isLoading }: LoadingSequenceProps) => {
    const [globalProgress, setGlobalProgress] = useState(0);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [lineStates, setLineStates] = useState<LineProgress[]>([]);
    const [startTime, setStartTime] = useState<number>(0);

    const TOTAL_DURATION = 1800;
    const TIME_PER_LINE = 200;

    useEffect(() => {
        if (!isLoading) {
            setGlobalProgress(0);
            setCurrentLineIndex(0);
            setLineStates([]);
            setStartTime(0);
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
                setGlobalProgress(100);

                setLineStates(prev => {
                    const remainingLines = lines.slice(prev.length).map(line => ({
                        text: line.text,
                        type: line.type,
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
                text: lines[currentLineIndex].text,
                type: lines[currentLineIndex].type,
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
                }, 30);
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

    const getLineColor = (type: string, completed: boolean) => {
        if (type === "header") return "text-orange-400";
        if (type === "warning") return completed ? "text-yellow-400" : "text-yellow-500";
        if (type === "special") return "text-orange-500";
        if (type === "success") return completed ? "text-green-400" : "text-orange-400";
        return "text-gray-300";
    };

    const getStatusColor = (type: string) => {
        if (type === "warning") return "text-yellow-400";
        if (type === "special") return "text-orange-400";
        if (type === "success") return "text-green-400";
        return "text-green-500";
    };

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const lineHeight = isMobile ? 18 : 22;
    const containerHeight = lineStates.length * lineHeight;

    return (
        <div className="w-full max-w-lg relative mx-auto">
            {/* Scanlines overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-10"
                 style={{
                     backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.3) 1px, rgba(0,0,0,0.3) 2px)',
                     backgroundSize: '100% 2px'
                 }}
            />

            {/* Lambda background */}
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-[8rem] font-bold text-orange-600/5 select-none pointer-events-none">
                λ
            </div>

            <motion.div
                className="font-mono text-[10px] sm:text-sm overflow-hidden relative z-20"
                initial={{ height: 0 }}
                animate={{ height: containerHeight }}
                transition={{ duration: 0.2, ease: "easeOut" }}
            >
                <AnimatePresence>
                    {lineStates.map((lineState, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="flex items-center h-[18px] sm:h-[22px]"
                        >
                            {/* Prefix */}
                            <span className="text-gray-600 mr-2 w-4 text-right text-xs">
                                {lineState.type === "header" ? "//" : ">"}
                            </span>

                            {/* Text */}
                            <span className={`${getLineColor(lineState.type, lineState.completed)} flex-1 tracking-wide`}>
                                {lineState.text}
                                {lineState.type !== "header" && "..."}
                            </span>

                            {/* Blinking cursor for current line */}
                            {!lineState.completed && index === currentLineIndex && (
                                <motion.span
                                    className="text-orange-400 ml-1"
                                    animate={{ opacity: [1, 0] }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                >
                                    _
                                </motion.span>
                            )}

                            {/* Progress or Status */}
                            {!lineState.completed && lineState.type !== "header" && (
                                <span className="text-gray-500 ml-2 w-12 text-right tabular-nums text-xs">
                                    {Math.floor(lineState.progress)}%
                                </span>
                            )}

                            {lineState.completed && lineState.type !== "header" && (
                                <motion.span
                                    className={`${getStatusColor(lineState.type)} ml-2 text-xs font-bold`}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.2, ease: "backOut" }}
                                >
                                    [OK]
                                </motion.span>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Progress bar */}
            <div className="mt-4 relative z-20">
                <div className="flex gap-[2px] h-3">
                    {Array.from({ length: 20 }).map((_, i) => {
                        const segmentProgress = (i + 1) * 5;
                        const isActive = globalProgress >= segmentProgress;
                        const isCurrent = globalProgress >= segmentProgress - 5 && globalProgress < segmentProgress;

                        return (
                            <motion.div
                                key={i}
                                className={`flex-1 rounded-sm ${
                                    isActive
                                        ? 'bg-gradient-to-b from-orange-400 to-orange-600'
                                        : isCurrent
                                            ? 'bg-orange-600/50'
                                            : 'bg-gray-800'
                                }`}
                                initial={{ opacity: 0.5 }}
                                animate={{
                                    opacity: isActive ? 1 : isCurrent ? 0.7 : 0.3,
                                    scale: isCurrent ? [1, 1.1, 1] : 1
                                }}
                                transition={{
                                    duration: isCurrent ? 0.3 : 0.1,
                                    repeat: isCurrent ? Infinity : 0
                                }}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Footer */}
            <div className="mt-3 text-xs text-gray-500 font-mono flex justify-between items-center relative z-20">
                <div className="flex items-center gap-2">
                    <span className="text-orange-400 font-bold">λ</span>
                    <span>Half-Life Portfolio v1.0</span>
                </div>
                <motion.span
                    className="text-orange-400 font-bold tabular-nums"
                    key={Math.floor(globalProgress)}
                >
                    {Math.min(Math.floor(globalProgress), 100)}%
                </motion.span>
            </div>
        </div>
    );
};

export default LoadingSequence;