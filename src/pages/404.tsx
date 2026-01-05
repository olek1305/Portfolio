import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const Custom404: React.FC = () => {
    return (
        <>
            <Head>
                <title>404 - Page Not Found | Aleksander Żak</title>
                <meta name="description" content="Page not found - Wrong path, Freeman!" />
                <link rel="icon" href="/favicon.ico" sizes="any"/>
            </Head>

            <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 font-hl">
                {/* Scanline overlay */}
                <div className="fixed inset-0 pointer-events-none opacity-20">
                    <div className="w-full h-full bg-repeat" style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,150,50,0.03) 2px, rgba(255,150,50,0.03) 4px)'
                    }}></div>
                </div>

                {/* Main content */}
                <div className="relative z-10 text-center max-w-lg">
                    {/* Error code */}
                    <div className="mb-6">
                        <span className="text-8xl md:text-9xl font-bold text-orange-600 glitch-text" data-text="404">
                            404
                        </span>
                    </div>

                    {/* HUD style box */}
                    <div className="hl-container mb-8">
                        <span className="hl-title">SYSTEM ERROR</span>
                        <div className="space-y-4 pt-4">
                            <p className="text-orange-400 text-xl pulse-glow">
                                SUBJECT: FREEMAN
                            </p>
                            <p className="text-gray-300 text-lg">
                                Wrong path detected.
                            </p>
                            <p className="text-gray-400 text-sm">
                                The page you are looking for has been moved, deleted, or never existed in this dimension.
                            </p>
                        </div>
                    </div>

                    {/* Status indicators */}
                    <div className="flex justify-center gap-8 mb-8 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-red-400">PAGE STATUS: MISSING</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                            <span className="text-orange-400">HEALTH: 404</span>
                        </div>
                    </div>

                    {/* Action button */}
                    <Link
                        href="/"
                        className="inline-block bg-orange-600 hover:bg-orange-500 text-black font-bold py-3 px-8 rounded transition-all duration-200 btn-hl"
                    >
                        ◄ RETURN TO FACILITY
                    </Link>

                    {/* Footer text */}
                    <p className="mt-8 text-gray-500 text-xs">
                        &quot;Prepare for unforeseen consequences&quot;
                    </p>
                </div>
            </div>
        </>
    );
};

export default Custom404;
