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
                                                       onToggleGithub,
                                                   }) => {
    return (
        <div className="relative w-full max-w-xs min-h-[400px] p-6 bg-transparent text-[#ff9900] tracking-widest select-none overflow-hidden ">

            {/* Menu items */}
            <nav className="relative z-10 flex flex-col gap-5">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => onTabChange(tab)}
                        className={`relative text-2xl transition-all duration-300 ease-in-out
              ${
                            activeTab === tab
                                ? "text-[#ffbb33] glitch-text active-glitch"
                                : "hover:text-[#ffcc55] hover:glitch-text"
                        }
              focus:outline-none`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#ffbb33] animate-pulse"></span>
                        )}
                    </button>
                ))}

                <button
                    onClick={onToggleGithub}
                    className={`relative text-xl transition-all duration-300 ease-in-out mt-4
            ${
                        githubOpen
                            ? "text-[#ffbb33] glitch-text active-glitch"
                            : "hover:text-[#ffcc55] hover:glitch-text"
                    }
            focus:outline-none`}
                >
                    {githubOpen ? "▼ GitHub Stats" : "▲ GitHub Stats"}
                </button>
            </nav>
        </div>
    );
};

export default HalfLifeMenu;
