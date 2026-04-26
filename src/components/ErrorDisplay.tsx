import { useEffect, useRef, useState } from "react";

const ErrorDisplay = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [fps, setFps] = useState(60);
    const [frame, setFrame] = useState(0);
    const [runtime, setRuntime] = useState("00:00:00");
    const [signal, setSignal] = useState("— — — —");

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const glyphs = "λ01ΛΣΦΨΩαβγδεζηθικμξπρστφχψω∂∆∇∞⊕⊗01λλ".split("");
        const fontSize = 16;
        let w: number, h: number, cols: number, drops: number[];
        let animationId: number;

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = container.getBoundingClientRect();
            w = canvas.width = rect.width * dpr;
            h = canvas.height = rect.height * dpr;
            canvas.style.width = rect.width + "px";
            canvas.style.height = rect.height + "px";
            cols = Math.floor(w / (fontSize * dpr));
            drops = new Array(cols).fill(0).map(() => Math.random() * (h / (fontSize * dpr)));
        };

        resize();
        window.addEventListener("resize", resize);

        const tick = () => {
            const dpr = window.devicePixelRatio || 1;
            ctx.fillStyle = "rgba(10,6,3,0.10)";
            ctx.fillRect(0, 0, w, h);
            ctx.font = fontSize * dpr + "px JetBrains Mono, monospace";

            for (let i = 0; i < cols; i++) {
                const ch = glyphs[Math.floor(Math.random() * glyphs.length)];
                const x = i * fontSize * dpr;
                const y = drops[i] * fontSize * dpr;

                if (Math.random() < 0.02) ctx.fillStyle = "rgba(255,210,150,0.95)";
                else if (Math.random() < 0.08) ctx.fillStyle = "rgba(251,150,56,0.85)";
                else ctx.fillStyle = "rgba(166,95,30,0.55)";

                ctx.fillText(ch, x, y);

                if (y > h && Math.random() > 0.975) drops[i] = 0;
                drops[i] += 1;
            }

            animationId = requestAnimationFrame(tick);
        };

        tick();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    useEffect(() => {
        const start = performance.now();
        let last = start;
        let frameCount = 0;
        let fpsAcc = 60;
        let animationId: number;

        const fmtTime = (ms: number) => {
            const s = Math.floor(ms / 1000);
            const hh = String(Math.floor(s / 3600)).padStart(2, "0");
            const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
            const ss = String(s % 60).padStart(2, "0");
            return `${hh}:${mm}:${ss}`;
        };

        const loop = (now: number) => {
            frameCount++;
            const t = (now - start) / 1000;
            const dt = now - last;
            last = now;
            fpsAcc = fpsAcc * 0.92 + (1000 / Math.max(dt, 1)) * 0.08;

            if (frameCount % 4 === 0) {
                setFps(Math.round(fpsAcc));
                setFrame(frameCount);
                setRuntime(fmtTime(now - start));

                const h1 = Math.floor((Math.sin(t * 1.7) * 0.5 + 0.5) * 0xffff)
                    .toString(16)
                    .padStart(4, "0")
                    .toUpperCase();
                const h2 = Math.floor((Math.cos(t * 1.1) * 0.5 + 0.5) * 0xffff)
                    .toString(16)
                    .padStart(4, "0")
                    .toUpperCase();
                setSignal(`${h1} ${h2}`);
            }

            animationId = requestAnimationFrame(loop);
        };

        animationId = requestAnimationFrame(loop);

        return () => cancelAnimationFrame(animationId);
    }, []);

    useEffect(() => {
        const host = document.getElementById("extrude");
        if (!host || host.children.length > 0) return;

        const N = 14;
        for (let i = 0; i < N; i++) {
            const span = document.createElement("span");
            span.textContent = "λ";
            span.style.position = "absolute";
            const t = i / (N - 1);
            const r = Math.round(166 + (251 - 166) * t);
            const g = Math.round(95 + (150 - 95) * t);
            const b = Math.round(30 + (56 - 30) * t);
            const op = 0.25 + 0.55 * t;
            span.style.color = `rgba(${r},${g},${b},${op.toFixed(2)})`;
            const z = -((N - 1 - i) * 4);
            span.style.transform = `translateZ(${z}px)`;
            host.appendChild(span);
        }
    }, []);

    return (
        <div ref={containerRef} className="error-display">
            <style>{`
                .error-display {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    min-height: 400px;
                    background: #0a0603;
                    color: rgb(251, 150, 56);
                    font-family: 'JetBrains Mono', ui-monospace, Menlo, monospace;
                    overflow: hidden;
                    cursor: crosshair;
                }

                .rain-canvas {
                    position: absolute;
                    inset: 0;
                    z-index: 1;
                    width: 100%;
                    height: 100%;
                    opacity: 0.55;
                }

                .stage {
                    position: absolute;
                    inset: 0;
                    z-index: 2;
                    display: grid;
                    place-items: center;
                    perspective: 1400px;
                    perspective-origin: 50% 50%;
                }

                .scene {
                    width: clamp(160px, 40vmin, 380px);
                    height: clamp(160px, 40vmin, 380px);
                    transform-style: preserve-3d;
                    animation: spin 14s linear infinite;
                    will-change: transform;
                }

                @keyframes spin {
                    0%   { transform: rotateY(0deg) rotateX(0deg) rotateZ(0deg); }
                    25%  { transform: rotateY(90deg) rotateX(8deg) rotateZ(-3deg); }
                    50%  { transform: rotateY(180deg) rotateX(-6deg) rotateZ(4deg); }
                    75%  { transform: rotateY(270deg) rotateX(10deg) rotateZ(-2deg); }
                    100% { transform: rotateY(360deg) rotateX(0deg) rotateZ(0deg); }
                }

                .lambda {
                    --lambda-size: clamp(120px, 32vmin, 280px);
                    position: absolute;
                    inset: 0;
                    display: grid;
                    place-items: center;
                    font-family: 'Archivo Black', 'Helvetica Neue', sans-serif;
                    font-weight: 900;
                    font-size: var(--lambda-size);
                    line-height: 1;
                    user-select: none;
                    transform-style: preserve-3d;
                }

                .lambda.core {
                    color: rgb(251, 150, 56);
                    text-shadow:
                        0 0 8px rgba(251,150,56,0.9),
                        0 0 24px rgba(251,150,56,0.7),
                        0 0 60px rgba(251,150,56,0.45),
                        0 0 120px rgba(251,150,56,0.25);
                    filter: drop-shadow(0 0 30px rgba(251,150,56,0.5));
                    z-index: 10;
                }

                .extrude {
                    --lambda-size: clamp(120px, 32vmin, 280px);
                    position: absolute;
                    inset: 0;
                    display: grid;
                    place-items: center;
                    font-family: 'Archivo Black', 'Helvetica Neue', sans-serif;
                    font-weight: 900;
                    font-size: var(--lambda-size);
                    line-height: 1;
                    color: rgb(166, 95, 30);
                    pointer-events: none;
                }

                .ghost {
                    --lambda-size: clamp(120px, 32vmin, 280px);
                    position: absolute;
                    inset: 0;
                    display: grid;
                    place-items: center;
                    font-family: 'Archivo Black', 'Helvetica Neue', sans-serif;
                    font-weight: 900;
                    font-size: var(--lambda-size);
                    line-height: 1;
                    pointer-events: none;
                    mix-blend-mode: screen;
                }

                .ghost.g1 {
                    color: rgba(251,150,56,0.35);
                    transform: translateZ(60px) translateX(6px);
                    animation: ghostA 4.2s ease-in-out infinite alternate;
                }

                .ghost.g2 {
                    color: rgba(166,95,30,0.45);
                    transform: translateZ(-60px) translateX(-6px);
                    animation: ghostB 5.1s ease-in-out infinite alternate;
                }

                .ghost.g3 {
                    color: rgba(255,195,130,0.25);
                    transform: translateZ(120px);
                    animation: ghostA 3.3s ease-in-out infinite alternate-reverse;
                }

                @keyframes ghostA {
                    from { transform: translateZ(60px) translateX(6px) translateY(-2px); opacity: 0.9; }
                    to   { transform: translateZ(80px) translateX(12px) translateY(2px); opacity: 0.4; }
                }

                @keyframes ghostB {
                    from { transform: translateZ(-60px) translateX(-6px) translateY(2px); opacity: 0.8; }
                    to   { transform: translateZ(-90px) translateX(-14px) translateY(-2px); opacity: 0.4; }
                }

                .phantom {
                    --lambda-size: clamp(120px, 32vmin, 280px);
                    position: absolute;
                    inset: 0;
                    z-index: 2;
                    display: grid;
                    place-items: center;
                    font-family: 'Archivo Black', 'Helvetica Neue', sans-serif;
                    font-weight: 900;
                    font-size: var(--lambda-size);
                    line-height: 1;
                    pointer-events: none;
                    user-select: none;
                    will-change: transform, opacity, filter;
                    text-shadow:
                        1px 0 0 rgba(251,150,56,0.15),
                        -1px 0 0 rgba(166,95,30,0.12),
                        0 0 12px rgba(251,150,56,0.08);
                }

                .phantom.dx1 {
                    color: rgba(251, 150, 56, 0.06);
                    animation: dxDrift1 7s ease-in-out infinite;
                }

                .phantom.dx2 {
                    color: rgba(251, 150, 56, 0.05);
                    font-size: calc(var(--lambda-size) * 1.21);
                    animation: dxDrift2 9s ease-in-out infinite;
                }

                .phantom.dx3 {
                    color: rgba(166, 95, 30, 0.06);
                    font-size: calc(var(--lambda-size) * 0.90);
                    animation: dxDrift3 6s ease-in-out infinite;
                }

                .phantom.dx4 {
                    color: rgba(200, 120, 40, 0.07);
                    font-size: calc(var(--lambda-size) * 1.05);
                    clip-path: polygon(48% 0%, 52% 0%, 68% 22%, 78% 38%, 96% 70%, 100% 100%, 62% 100%, 50% 64%, 38% 100%, 0% 100%, 22% 56%, 36% 28%);
                    animation: dxDrift4 8s ease-in-out infinite;
                    filter: blur(0.4px);
                }

                @keyframes dxDrift1 {
                    0%, 100% { transform: translate(-18px, -10px) scale(1.02) skewX(-1deg); opacity: 0.10; }
                    50%      { transform: translate(-26px, -4px) scale(1.04) skewX(-3deg); opacity: 0.07; }
                }

                @keyframes dxDrift2 {
                    0%, 100% { transform: translate(22px, 12px) scale(0.97) skewY(2deg); opacity: 0.07; }
                    50%      { transform: translate(30px, 6px) scale(1.00) skewY(4deg); opacity: 0.10; }
                }

                @keyframes dxDrift3 {
                    0%, 100% { transform: translate(8px, -16px) scale(1.05) skewX(2deg); opacity: 0.09; }
                    50%      { transform: translate(-6px, -22px) scale(1.07) skewX(4deg); opacity: 0.06; }
                }

                @keyframes dxDrift4 {
                    0%, 100% { transform: translate(-22px, 14px) scale(1.04) skewY(-2deg); opacity: 0.10; }
                    50%      { transform: translate(-30px, 22px) scale(1.06) skewY(-4deg); opacity: 0.07; }
                }

                .ring {
                    position: absolute;
                    border: 1px solid rgba(251,150,56,0.2);
                    border-radius: 50%;
                    top: 50%;
                    left: 50%;
                    transform-style: preserve-3d;
                    pointer-events: none;
                }

                .ring.r1 {
                    width: min(440px, 80vmin);
                    height: min(440px, 80vmin);
                    margin-top: calc(min(440px, 80vmin) / -2);
                    margin-left: calc(min(440px, 80vmin) / -2);
                    transform: rotateX(75deg);
                    border-color: rgba(251,150,56,0.30);
                    animation: ringSpin 9s linear infinite;
                }

                .ring.r2 {
                    width: min(520px, 90vmin);
                    height: min(520px, 90vmin);
                    margin-top: calc(min(520px, 90vmin) / -2);
                    margin-left: calc(min(520px, 90vmin) / -2);
                    transform: rotateX(60deg) rotateY(20deg);
                    border-color: rgba(166,95,30,0.25);
                    animation: ringSpin 14s linear infinite reverse;
                }

                .ring.r3 {
                    width: min(600px, 100vmin);
                    height: min(600px, 100vmin);
                    margin-top: calc(min(600px, 100vmin) / -2);
                    margin-left: calc(min(600px, 100vmin) / -2);
                    transform: rotateX(70deg) rotateY(-25deg);
                    border-color: rgba(251,150,56,0.12);
                    animation: ringSpin 22s linear infinite;
                    border-style: dashed;
                }

                @keyframes ringSpin {
                    from { transform: rotateX(70deg) rotateZ(0deg); }
                    to   { transform: rotateX(70deg) rotateZ(360deg); }
                }

                .pulse {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: min(500px, 85vmin);
                    height: min(500px, 85vmin);
                    margin-top: calc(min(500px, 85vmin) / -2);
                    margin-left: calc(min(500px, 85vmin) / -2);
                    border-radius: 50%;
                    background: radial-gradient(circle,
                        rgba(251,150,56,0.25) 0%,
                        rgba(251,150,56,0.08) 30%,
                        transparent 60%);
                    animation: pulseGlow 3.4s ease-in-out infinite;
                    pointer-events: none;
                    z-index: 1;
                }

                @keyframes pulseGlow {
                    0%, 100% { transform: scale(1); opacity: 0.6; }
                    50%      { transform: scale(1.15); opacity: 1; }
                }

                .overlay {
                    position: absolute;
                    inset: 0;
                    z-index: 4;
                    pointer-events: none;
                    background:
                        radial-gradient(ellipse at center,
                            transparent 0%,
                            transparent 45%,
                            rgba(10,6,3,0.6) 85%,
                            rgba(10,6,3,0.95) 100%),
                        repeating-linear-gradient(
                            0deg,
                            rgba(0,0,0,0) 0px,
                            rgba(0,0,0,0) 2px,
                            rgba(0,0,0,0.18) 3px,
                            rgba(0,0,0,0) 4px);
                    mix-blend-mode: multiply;
                }

                .glow {
                    position: absolute;
                    inset: 0;
                    z-index: 3;
                    pointer-events: none;
                    background: radial-gradient(circle at 50% 50%,
                        rgba(251,150,56,0.10) 0%,
                        rgba(251,150,56,0.03) 30%,
                        transparent 60%);
                    animation: bgPulse 4s ease-in-out infinite;
                }

                @keyframes bgPulse {
                    0%, 100% { opacity: 0.7; }
                    50%      { opacity: 1; }
                }

                .glitch {
                    position: absolute;
                    inset: 0;
                    z-index: 5;
                    pointer-events: none;
                    background: rgba(251,150,56,0.05);
                    opacity: 0;
                    animation: glitchFlash 7s steps(1) infinite;
                }

                @keyframes glitchFlash {
                    0%, 96%, 100% { opacity: 0; }
                    97%           { opacity: 0.4; transform: translateX(-3px); }
                    98%           { opacity: 0; transform: translateX(3px); }
                    99%           { opacity: 0.3; }
                }

                .hud {
                    position: absolute;
                    z-index: 6;
                    color: rgba(251,150,56,0.85);
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 10px;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    pointer-events: none;
                    text-shadow: 0 0 8px rgba(251,150,56,0.4);
                }

                .hud.tl { top: 48px; left: 16px; }
                .hud.tr { top: 48px; right: 16px; text-align: right; }
                .hud.bl { bottom: 16px; left: 16px; }
                .hud.br { bottom: 16px; right: 16px; text-align: right; }

                .hud .row {
                    display: flex;
                    gap: 8px;
                    align-items: baseline;
                    margin-top: 3px;
                }

                .hud .dim { color: rgba(166,95,30,0.7); }
                .hud .val { color: rgb(251,150,56); font-variant-numeric: tabular-nums; }

                .brand {
                    font-size: 12px;
                    letter-spacing: 0.25em;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .brand .dot {
                    width: 6px;
                    height: 6px;
                    background: rgb(251, 150, 56);
                    box-shadow: 0 0 10px rgb(251, 150, 56);
                    animation: dotPulse 1.6s ease-in-out infinite;
                }

                @keyframes dotPulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50%      { opacity: 0.45; transform: scale(0.7); }
                }

                .corner {
                    position: absolute;
                    z-index: 5;
                    pointer-events: none;
                    width: 20px;
                    height: 20px;
                    border: 1px solid rgba(251,150,56,0.45);
                }

                .corner.tl { top: 12px; left: 12px; border-right: none; border-bottom: none; }
                .corner.tr { top: 12px; right: 12px; border-left: none; border-bottom: none; }
                .corner.bl { bottom: 12px; left: 12px; border-right: none; border-top: none; }
                .corner.br { bottom: 12px; right: 12px; border-left: none; border-top: none; }

                @media (max-width: 640px) {
                    .hud { font-size: 8px; letter-spacing: 0.1em; }
                    .brand { font-size: 10px; letter-spacing: 0.18em; }
                    .hud.bl, .hud.br { display: none; }
                    .corner { width: 14px; height: 14px; }
                }
            `}</style>

            <canvas ref={canvasRef} className="rain-canvas" />

            <div className="phantom dx1">λ</div>
            <div className="phantom dx2">λ</div>
            <div className="phantom dx3">λ</div>
            <div className="phantom dx4">λ</div>

            <div className="stage">
                <div className="pulse" />
                <div className="ring r1" />
                <div className="ring r2" />
                <div className="ring r3" />

                <div className="scene">
                    <div className="extrude" id="extrude" />
                    <div className="ghost g2">λ</div>
                    <div className="ghost g3">λ</div>
                    <div className="lambda core">λ</div>
                    <div className="ghost g1">λ</div>
                </div>
            </div>

            <div className="corner tl" />
            <div className="corner tr" />
            <div className="corner bl" />
            <div className="corner br" />

            <div className="glow" />
            <div className="overlay" />
            <div className="glitch" />

            <div className="hud tl">
                <div className="brand">
                    <span className="dot" />
                    <span>DATA NOT FOUND</span>
                </div>
                <div className="row">
                    <span className="dim">STATUS</span>
                    <span className="val">OFFLINE</span>
                </div>
                <div className="row">
                    <span className="dim">RT</span>
                    <span className="val">{runtime}</span>
                </div>
            </div>

            <div className="hud tr">
                <div className="brand">CONTENT DOESN&apos;T EXIST YET</div>
                <div className="row" style={{ justifyContent: "flex-end" }}>
                    <span className="dim">FPS</span>
                    <span className="val">{fps}</span>
                </div>
                <div className="row" style={{ justifyContent: "flex-end" }}>
                    <span className="dim">FRAME</span>
                    <span className="val">{String(frame).padStart(6, "0")}</span>
                </div>
            </div>

            <div className="hud bl">
                <div className="row">
                    <span className="dim">ERR</span>
                    <span className="val">404 // VOID</span>
                </div>
                <div className="row">
                    <span className="dim">SIG</span>
                    <span className="val">{signal}</span>
                </div>
            </div>

            <div className="hud br">
                <div className="row" style={{ justifyContent: "flex-end" }}>
                    <span className="dim">CONN</span>
                    <span className="val">SEVERED</span>
                </div>
                <div className="row" style={{ justifyContent: "flex-end" }}>
                    <span className="dim">SYS</span>
                    <span className="val">λ / OFFLINE</span>
                </div>
            </div>
        </div>
    );
};

export default ErrorDisplay;
