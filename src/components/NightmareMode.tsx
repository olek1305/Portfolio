import { useEffect, useRef, useState } from "react";

interface NightmareModeProps {
    isActive: boolean;
    onToggle: () => void;
}

const NightmareMode = ({ isActive, onToggle }: NightmareModeProps) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const targetPos = useRef({ x: 0, y: 0 });
    const animationRef = useRef<number>();

    useEffect(() => {
        if (!isActive) return;

        const handleMouseMove = (e: MouseEvent) => {
            targetPos.current = { x: e.clientX, y: e.clientY };
        };

        const animate = () => {
            setMousePos(prev => ({
                x: prev.x + (targetPos.current.x - prev.x) * 0.15,
                y: prev.y + (targetPos.current.y - prev.y) * 0.15
            }));
            animationRef.current = requestAnimationFrame(animate);
        };

        window.addEventListener("mousemove", handleMouseMove);
        animationRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isActive]);

    if (!isActive) return null;

    return (
        <div
            className="fixed inset-0 pointer-events-none"
            style={{
                zIndex: 9998,
                background: `radial-gradient(circle 160px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, transparent 100px, rgba(0,0,0,0.97) 160px, rgba(0,0,0,0.99) 100%)`,
            }}
        >
            <div
                className="absolute rounded-full pointer-events-none"
                style={{
                    left: mousePos.x - 120,
                    top: mousePos.y - 120,
                    width: 240,
                    height: 240,
                    background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 50%, transparent 70%)",
                    filter: "blur(2px)",
                }}
            />
            <button
                onClick={onToggle}
                className="fixed bottom-2 left-1/2 -translate-x-1/2 pointer-events-auto z-[9999] text-white hover:text-orange-400 text-sm font-mono tracking-wider transition-colors px-4 py-2 border border-white/30 rounded bg-black/50 backdrop-blur-sm"
            >
                EXIT NIGHTMARE
            </button>
        </div>
    );
};

export default NightmareMode;
