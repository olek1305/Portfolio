import React from "react";

interface HalfLifeMenuProps {
    tabs: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
    githubOpen: boolean;
    onToggleGithub: () => void;
}

const HalfLifeMenu: React.FC<HalfLifeMenuProps> = ({
                                                       tabs,
                                                       activeTab,
                                                       onTabChange,
                                                       githubOpen,
                                                       onToggleGithub
                                                   }) => {
    return (
        <div className="space-y-2">
            {tabs.map((tab) => (
                <div
                    key={tab}
                    className={`p-3 text-lg cursor-pointer transition-all duration-200 border-l-4 ${
                        activeTab === tab
                            ? "bg-orange-600/30 text-white font-bold border-orange-400"
                            : "text-orange-400 hover:bg-orange-600/10 hover:text-white border-transparent"
                    }`}
                    onClick={() => onTabChange(tab)}
                >
                    {tab}
                </div>
            ))}

            <div
                className={`p-3 text-lg cursor-pointer transition-all duration-200 border-l-4 ${
                    githubOpen
                        ? "bg-orange-600/30 text-white font-bold border-orange-400"
                        : "text-orange-400 hover:bg-orange-600/10 hover:text-white border-transparent"
                }`}
                onClick={onToggleGithub}
            >
                {githubOpen ? "▼ GitHub Stats" : "▲ GitHub Stats"}
            </div>
        </div>
    );
};

export default HalfLifeMenu;