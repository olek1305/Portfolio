import React, { useState } from 'react';
import { DownloadCVButton } from '@/components/PDFCV';
import TransitionEffect from '@/components/TransitionEffect';
import type { CVData } from '@/lib/types';

interface FooterProps {
    cvData: CVData | null;
}

const Footer: React.FC<FooterProps> = ({ cvData }) => {
    const [showCopiedMessage, setShowCopiedMessage] = useState(false);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText("olek1305@gmail.com").then(() => {
            setShowCopiedMessage(true);
            setTimeout(() => setShowCopiedMessage(false), 2000);
        });
    };

    // Work status configuration
    const workStatus = {
        available: false, // Change to false when busy/employed
        freelanceCount: 3 // Update with your completed freelance tasks
    };

    return (
        <footer className="bg-[#0a0a0a] border-t-2 border-orange-600 py-2 px-6 flex justify-center gap-4 md:gap-6 items-center flex-wrap">
            {/* HL1 Style Work Status */}
            <div className="flex items-center gap-2 hl-hud-status">
                <div className={`hl-status-dot ${workStatus.available ? 'available' : 'busy'}`}></div>
                <span className="text-orange-400 text-sm">
                    {workStatus.available ? 'AVAILABLE' : 'BUSY'}
                </span>
            </div>

            {/* HL1 Style Freelance Counter */}
            <div className="flex items-center gap-1 border-l border-orange-600/50 pl-4">
                <span className="text-orange-600 text-xs">FREELANCE COMPLETED:</span>
                <span className="hl-counter text-orange-400 text-sm">{workStatus.freelanceCount}</span>
            </div>

            {/* CV Download Button */}
            {cvData ? (
                <DownloadCVButton cvData={cvData} />
            ) : (
                <span className="text-orange-400 text-sm">▼ Preparing CV...</span>
            )}

            {/* GitHub Link */}
            <a
                href="https://github.com/olek1305"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-white text-sm"
            >
                ▼ GitHub
            </a>

            {/* Email with copy functionality */}
            <div className="relative h-6 flex items-center">
                <button
                    onClick={handleCopyEmail}
                    className="text-orange-400 hover:text-white text-sm"
                >
                    ▼ Email
                </button>
                {showCopiedMessage && (
                    <div className="ammo-pickup absolute -top-8 left-0 right-0 mx-auto w-fit bg-orange-600 text-black px-2 py-1 rounded-md text-xs">
                        Copied!
                    </div>
                )}
            </div>

            {/* Transition effect component */}
            <TransitionEffect />
        </footer>
    );
};

export default Footer;