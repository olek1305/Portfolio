import React from "react";

interface MobileHalfLifeMenuProps {
    tabs: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const MobileHalfLifeMenu: React.FC<MobileHalfLifeMenuProps> = ({
                                                                   tabs,
                                                                   activeTab,
                                                                   onTabChange
                                                               }) => {
    return (
        <nav className="space-y-1 p-2" role="tablist" aria-label="Portfolio sections">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    role="tab"
                    aria-selected={activeTab === tab}
                    className={`w-full text-left p-3 text-base cursor-pointer transition-all duration-200 border-l-4 ${
                        activeTab === tab
                            ? "bg-orange-600/30 text-white font-bold border-orange-400 glitch-text active-glitch"
                            : "text-orange-400 hover:bg-orange-600/10 hover:text-white border-transparent"
                    } focus:outline-none focus:ring-2 focus:ring-orange-400`}
                    onClick={() => onTabChange(tab)}
                >
                    {tab}
                </button>
            ))}
        </nav>
    );
};

export default MobileHalfLifeMenu;