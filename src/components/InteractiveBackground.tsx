import { useEffect, useRef } from "react";

const InteractiveBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
    const particlesRef = useRef<Array<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        size: number;
        alpha: number;
        life: number;
    }>>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;
        let w: number, h: number;

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            w = canvas.width = window.innerWidth * dpr;
            h = canvas.height = window.innerHeight * dpr;
            canvas.style.width = window.innerWidth + "px";
            canvas.style.height = window.innerHeight + "px";
            ctx.scale(dpr, dpr);
        };

        resize();
        window.addEventListener("resize", resize);

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.targetX = e.clientX;
            mouseRef.current.targetY = e.clientY;

            if (Math.random() > 0.7) {
                particlesRef.current.push({
                    x: e.clientX,
                    y: e.clientY,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    size: Math.random() * 3 + 1,
                    alpha: 0.6,
                    life: 1
                });
            }
        };

        window.addEventListener("mousemove", handleMouseMove);

        const tick = () => {
            const dpr = window.devicePixelRatio || 1;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, w, h);
            ctx.scale(dpr, dpr);

            const mouse = mouseRef.current;
            mouse.x += (mouse.targetX - mouse.x) * 0.08;
            mouse.y += (mouse.targetY - mouse.y) * 0.08;

            const gradient = ctx.createRadialGradient(
                mouse.x, mouse.y, 0,
                mouse.x, mouse.y, 400
            );
            gradient.addColorStop(0, "rgba(251, 150, 56, 0.25)");
            gradient.addColorStop(0.3, "rgba(251, 150, 56, 0.15)");
            gradient.addColorStop(0.6, "rgba(166, 95, 30, 0.08)");
            gradient.addColorStop(1, "transparent");

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

            const gradient2 = ctx.createRadialGradient(
                mouse.x, mouse.y, 0,
                mouse.x, mouse.y, 180
            );
            gradient2.addColorStop(0, "rgba(255, 220, 150, 0.2)");
            gradient2.addColorStop(0.5, "rgba(251, 150, 56, 0.1)");
            gradient2.addColorStop(1, "transparent");

            ctx.fillStyle = gradient2;
            ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

            const particles = particlesRef.current;
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.015;
                p.alpha = p.life * 0.5;

                if (p.life <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(251, 150, 56, ${p.alpha * 1.5})`;
                ctx.fill();
            }

            if (particles.length > 50) {
                particles.splice(0, particles.length - 50);
            }

            const gridSize = 60;
            ctx.strokeStyle = "rgba(251, 150, 56, 0.015)";
            ctx.lineWidth = 1;

            for (let x = 0; x < window.innerWidth; x += gridSize) {
                const distX = Math.abs(x - mouse.x);
                const influence = Math.max(0, 1 - distX / 400);
                ctx.strokeStyle = `rgba(251, 150, 56, ${0.02 + influence * 0.08})`;
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, window.innerHeight);
                ctx.stroke();
            }

            for (let y = 0; y < window.innerHeight; y += gridSize) {
                const distY = Math.abs(y - mouse.y);
                const influence = Math.max(0, 1 - distY / 400);
                ctx.strokeStyle = `rgba(251, 150, 56, ${0.02 + influence * 0.08})`;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(window.innerWidth, y);
                ctx.stroke();
            }

            animationId = requestAnimationFrame(tick);
        };

        tick();

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 1,
                pointerEvents: "none",
                mixBlendMode: "screen"
            }}
        />
    );
};

export default InteractiveBackground;
