import NextImage from "next/image";
import { useState, useEffect } from "react";

interface SkillProps {
    skill: {
        name: string;
        category: string;
        fileName?: string;
    };
    onSelect: () => void;
    iconOnly?: boolean;
    hasDetails?: boolean;
}

const SkillComponent: React.FC<SkillProps> = ({
                                                  skill,
                                                  onSelect,
                                                  iconOnly = false,
                                                  hasDetails = true
                                              }) => {
    const [iconExists, setIconExists] = useState(true);
    const iconSrc = `/icons/${(skill.fileName || skill.name)
        .toLowerCase()
        .replace(/\s+/g, "-")}.svg`;

    // List of icons that need to be scaled up
    const needsScaling = ['javascript', 'php', 'laravel', 'mysql', 'ci-cd', 'error'];
    const needsMoreScaling = ['linux', 'inertia', 'github'];
    const iconKey = (skill.fileName || skill.name).toLowerCase().replace(/\s+/g, "-");
    const scaleClass = needsMoreScaling.includes(iconKey) ? 'scale-[2]' : needsScaling.includes(iconKey) ? 'scale-150' : '';

    useEffect(() => {
        const img = new window.Image();
        img.src = iconSrc;
        img.onload = () => setIconExists(true);
        img.onerror = () => setIconExists(false);
    }, [iconSrc]);

    const handleClick = (e: React.MouseEvent) => {
        if (hasDetails) {
            onSelect();
        } else {
            e.preventDefault();
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`group flex items-center ${
                hasDetails ? 'cursor-pointer hover:bg-orange-600/20' : 'cursor-default opacity-70'
            } transition duration-200 ease-in-out p-2 rounded-md border border-orange-600/30 overflow-hidden ${
                iconOnly ? "flex-col" : "gap-2 w-full min-w-0"
            }`}
            title={hasDetails ? `Click for ${skill.name} details` : `No details available for ${skill.name}`}
        >
            <div className={`relative ${iconOnly ? 'w-12 h-12' : 'w-8 h-8 sm:w-10 sm:h-10'} skill-icon flex items-center justify-center flex-shrink-0`}>
                {iconExists ? (
                    <NextImage
                        src={iconSrc}
                        alt={`${skill.name} icon`}
                        width={iconOnly ? 48 : 40}
                        height={iconOnly ? 48 : 40}
                        className={`object-contain mx-auto ${scaleClass}`}
                        onError={() => setIconExists(false)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-orange-600/20 rounded">
                        <span className="text-xs text-orange-400">{skill.name.charAt(0)}</span>
                    </div>
                )}
            </div>
            {!iconOnly && (
                <span className={`text-orange-400 text-sm font-hl glitch-text truncate ${
                    hasDetails ? 'group-hover:text-white' : ''
                } transition-colors`}>
                    {skill.name}
                </span>
            )}
            {!hasDetails && !iconOnly && (
                <span className="text-xs text-gray-500 ml-auto">No details</span>
            )}
        </div>
    );
};

export default SkillComponent;