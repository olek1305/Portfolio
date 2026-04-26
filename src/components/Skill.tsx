import NextImage from "next/image";
import { useState, useEffect } from "react";

interface SkillProps {
    skill: {
        name: string;
        category: string;
        fileName?: string;
    };
    iconOnly?: boolean;
}

const SkillComponent: React.FC<SkillProps> = ({ skill, iconOnly = false }) => {
    const [iconExists, setIconExists] = useState(true);
    const iconSrc = `/icons/${(skill.fileName || skill.name)
        .toLowerCase()
        .replace(/\s+/g, "-")}.svg`;

    const needsScaling = ['javascript', 'php', 'laravel', 'mysql', 'ci-cd', 'error'];
    const needsMoreScaling = ['linux', 'inertia', 'github'];
    const iconKey = (skill.fileName || skill.name).toLowerCase().replace(/\s+/g, "-");
    const scaleClass = needsMoreScaling.includes(iconKey)
        ? 'scale-[2]'
        : needsScaling.includes(iconKey)
            ? 'scale-150'
            : '';

    useEffect(() => {
        const img = new window.Image();
        img.src = iconSrc;
        img.onload = () => setIconExists(true);
        img.onerror = () => setIconExists(false);
    }, [iconSrc]);

    return (
        <div
            className={`flex items-center p-2 rounded-md border border-orange-600/30 overflow-hidden ${
                iconOnly ? "flex-col" : "gap-2 w-full min-w-0"
            }`}
        >
            <div
                className={`relative ${
                    iconOnly ? 'w-12 h-12' : 'w-8 h-8 sm:w-10 sm:h-10'
                } flex items-center justify-center flex-shrink-0`}
            >
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
                <span className="text-orange-400 text-sm font-hl truncate">
                    {skill.name}
                </span>
            )}
        </div>
    );
};

export default SkillComponent;
