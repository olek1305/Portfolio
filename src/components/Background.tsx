import { useEffect, useRef } from "react";

/**
 * Background
 * ----------
 * Fixed, full-viewport Canvas 2D backdrop for a dark cyberpunk portfolio.
 *
 * Concept: a faint orange hexagonal grid sitting on a deep warm-black void.
 * Every few seconds a "pulse wave" originates from a random hex and
 * propagates outward as an expanding ring; cells the ring sweeps over
 * brighten briefly and fade back. A subtle vignette + scanline overlay
 * sells the augmented-vision / surveillance-monitor feel.
 *
 * No props, no variants, no external libs. Pure Canvas 2D.
 */
export default function Background() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        // ---- config ----
        const HEX_RADIUS = 26;
        const HEX_LINE_ALPHA = 0.06;
        const HEX_DOT_ALPHA = 0.09;
        const PULSE_SPEED = 260;
        const PULSE_THICKNESS = 90;
        const PULSE_LIFETIME = 4.2;
        const PULSE_INTERVAL_MIN = 1.6;
        const PULSE_INTERVAL_MAX = 3.4;
        const MAX_PULSES = 3;
        const BG_COLOR = "#050302";
        const ACCENT = { r: 251, g: 150, b: 56 };

        // ---- state ----
        let dpr = Math.min(window.devicePixelRatio || 1, 2);
        let width = window.innerWidth;
        let height = window.innerHeight;
        let hexCenters: { x: number; y: number }[] = [];
        let pulses: { x: number; y: number; t: number }[] = [];
        let nextPulseIn = 0.8;
        let lastTime = performance.now();
        let rafId = 0;
        let running = true;

        // ---- helpers ----
        const buildHexGrid = () => {
            hexCenters = [];
            const dx = Math.sqrt(3) * HEX_RADIUS;
            const dy = 1.5 * HEX_RADIUS;
            const cols = Math.ceil(width / dx) + 2;
            const rows = Math.ceil(height / dy) + 2;
            for (let row = -1; row < rows; row++) {
                const offsetX = (row & 1) === 0 ? 0 : dx / 2;
                for (let col = -1; col < cols; col++) {
                    hexCenters.push({
                        x: col * dx + offsetX,
                        y: row * dy,
                    });
                }
            }
        };

        const resize = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            buildHexGrid();
        };

        const drawHex = (cx: number, cy: number, r: number) => {
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const a = (Math.PI / 3) * i + Math.PI / 6;
                const x = cx + r * Math.cos(a);
                const y = cy + r * Math.sin(a);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
        };

        const spawnPulse = () => {
            if (pulses.length >= MAX_PULSES) return;
            const x = Math.random() * width;
            const y = Math.random() * height;
            pulses.push({ x, y, t: 0 });
        };

        const frame = (now: number) => {
            rafId = requestAnimationFrame(frame);
            if (!running || document.hidden) {
                lastTime = now;
                return;
            }
            const dt = Math.min(0.05, (now - lastTime) / 1000);
            lastTime = now;

            nextPulseIn -= dt;
            if (nextPulseIn <= 0) {
                spawnPulse();
                nextPulseIn =
                    PULSE_INTERVAL_MIN +
                    Math.random() * (PULSE_INTERVAL_MAX - PULSE_INTERVAL_MIN);
            }
            for (const p of pulses) p.t += dt;
            pulses = pulses.filter((p) => p.t < PULSE_LIFETIME);

            ctx.fillStyle = BG_COLOR;
            ctx.fillRect(0, 0, width, height);

            ctx.lineWidth = 1;
            const baseStroke = `rgba(${ACCENT.r}, ${ACCENT.g}, ${ACCENT.b}, ${HEX_LINE_ALPHA})`;
            ctx.strokeStyle = baseStroke;

            for (let i = 0; i < hexCenters.length; i++) {
                const { x, y } = hexCenters[i];

                drawHex(x, y, HEX_RADIUS - 2);
                ctx.stroke();

                let boost = 0;
                for (const p of pulses) {
                    const radius = p.t * PULSE_SPEED;
                    const dist = Math.hypot(x - p.x, y - p.y);
                    const delta = Math.abs(dist - radius);
                    if (delta > PULSE_THICKNESS) continue;
                    const band = 1 - delta / PULSE_THICKNESS;
                    const lifeFrac = p.t / PULSE_LIFETIME;
                    const life =
                        lifeFrac < 0.15
                            ? lifeFrac / 0.15
                            : 1 - (lifeFrac - 0.15) / 0.85;
                    const contribution = band * Math.max(0, life);
                    if (contribution > boost) boost = contribution;
                }

                if (boost > 0.02) {
                    ctx.strokeStyle = `rgba(${ACCENT.r}, ${ACCENT.g}, ${ACCENT.b}, ${
                        0.55 * boost
                    })`;
                    ctx.lineWidth = 1 + boost * 0.6;
                    drawHex(x, y, HEX_RADIUS - 2);
                    ctx.stroke();
                    ctx.strokeStyle = baseStroke;
                    ctx.lineWidth = 1;
                }

                const dotAlpha = HEX_DOT_ALPHA + boost * 0.55;
                ctx.fillStyle = `rgba(${ACCENT.r}, ${ACCENT.g}, ${ACCENT.b}, ${dotAlpha})`;
                ctx.fillRect(x - 0.75, y - 0.75, 1.5, 1.5);
            }

            for (const p of pulses) {
                const lifeFrac = p.t / PULSE_LIFETIME;
                const a = Math.max(0, 1 - lifeFrac * 4) * 0.5;
                if (a <= 0) continue;
                ctx.fillStyle = `rgba(${ACCENT.r}, ${ACCENT.g}, ${ACCENT.b}, ${a})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
            for (let y = 0; y < height; y += 3) {
                ctx.fillRect(0, y, width, 1);
            }

            const grd = ctx.createRadialGradient(
                width / 2,
                height / 2,
                Math.min(width, height) * 0.25,
                width / 2,
                height / 2,
                Math.max(width, height) * 0.75
            );
            grd.addColorStop(0, "rgba(0, 0, 0, 0)");
            grd.addColorStop(1, "rgba(0, 0, 0, 0.7)");
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, width, height);
        };

        const onResize = () => resize();
        const onVisibility = () => {
            running = !document.hidden;
            lastTime = performance.now();
        };

        resize();
        window.addEventListener("resize", onResize);
        document.addEventListener("visibilitychange", onVisibility);
        lastTime = performance.now();
        rafId = requestAnimationFrame(frame);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", onResize);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                display: "block",
                zIndex: 0,
                pointerEvents: "none",
            }}
        />
    );
}
