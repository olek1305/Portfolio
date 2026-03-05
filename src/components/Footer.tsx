import React, { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import TransitionEffect from "@/components/TransitionEffect";
import type { CVData } from "@/lib/types";

interface FooterProps {
    cvData: CVData | null;
}

const LazyDownloadCVButton = dynamic<{
    cvData: CVData | null;
    autoOpenOnReady?: boolean;
    onPdfReady?: (url: string) => void;
    onAutoOpenComplete?: () => void;
}>(
    () => import("@/components/PDFCV").then((mod) => mod.DownloadCVButton),
    {
        ssr: false,
        loading: () => <span className="text-orange-400 text-sm">Preparing CV module...</span>,
    }
);

const Footer: React.FC<FooterProps> = ({ cvData }) => {
    const [showCopiedMessage, setShowCopiedMessage] = useState(false);
    const [cvModuleEnabled, setCvModuleEnabled] = useState(false);
    const [autoOpenCV, setAutoOpenCV] = useState(false);
    const pendingWindowRef = useRef<Window | null>(null);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText("olek1305@gmail.com").then(() => {
            setShowCopiedMessage(true);
            setTimeout(() => setShowCopiedMessage(false), 2000);
        });
    };

    const handlePdfReady = useCallback((url: string) => {
        const pendingWindow = pendingWindowRef.current;

        if (pendingWindow && !pendingWindow.closed) {
            pendingWindow.location.href = url;
        } else {
            window.open(url, "_blank");
        }

        pendingWindowRef.current = null;
        setAutoOpenCV(false);
    }, []);

    const handleLoadAndOpenPdf = () => {
        pendingWindowRef.current = window.open("about:blank", "_blank");
        setCvModuleEnabled(true);
        setAutoOpenCV(true);
    };

    const workStatus = {
        available: false,
        freelanceCount: 3,
    };

    return (
        <footer className="bg-[#0a0a0a] border-t-2 border-orange-600 py-2 px-6 flex justify-center gap-4 md:gap-6 items-center flex-wrap">
            <div className="flex items-center gap-2 hl-hud-status">
                <div className={`hl-status-dot ${workStatus.available ? "available" : "busy"}`}></div>
                <span className="text-orange-400 text-sm">{workStatus.available ? "AVAILABLE" : "BUSY"}</span>
            </div>

            <div className="flex items-center gap-1 border-l border-orange-600/50 pl-4">
                <span className="text-orange-600 text-xs">FREELANCE COMPLETED:</span>
                <span className="hl-counter text-orange-400 text-sm">{workStatus.freelanceCount}</span>
            </div>

            {cvData ? (
                cvModuleEnabled ? (
                    <LazyDownloadCVButton
                        cvData={cvData}
                        autoOpenOnReady={autoOpenCV}
                        onPdfReady={handlePdfReady}
                        onAutoOpenComplete={() => setAutoOpenCV(false)}
                    />
                ) : (
                    <button
                        onClick={handleLoadAndOpenPdf}
                        className="text-orange-400 hover:text-white text-sm"
                    >
                        Open CV (PDF)
                    </button>
                )
            ) : (
                <span className="text-orange-400 text-sm">Preparing CV...</span>
            )}

            <a
                href="https://github.com/olek1305"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-white text-sm"
            >
                GitHub
            </a>

            <div className="relative h-6 flex items-center">
                <button onClick={handleCopyEmail} className="text-orange-400 hover:text-white text-sm">
                    Email
                </button>
                {showCopiedMessage && (
                    <div className="ammo-pickup absolute -top-10 left-1/2 -translate-x-1/2 w-max bg-orange-600 text-black px-3 py-1 rounded text-xs font-bold tracking-wide animate-bounce">
                        Copied!
                    </div>
                )}
            </div>

            <TransitionEffect />
        </footer>
    );
};

export default Footer;
