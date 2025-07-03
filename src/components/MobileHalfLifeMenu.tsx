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
        <div className="space-y-1 p-2">
            {tabs.map((tab) => (
                <div
                    key={tab}
                    className={`p-3 text-base cursor-pointer transition-all duration-200 border-l-4 ${
                        activeTab === tab
                            ? "bg-orange-600/30 text-white font-bold border-orange-400 glitch-text active-glitch"
                            : "text-orange-400 hover:bg-orange-600/10 hover:text-white border-transparent"
                    }`}
                    onClick={() => onTabChange(tab)}
                >
                    {tab}
                </div>
            ))}
        </div>
    );
};

export default MobileHalfLifeMenu;