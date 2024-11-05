import React from "react";

type ExperienceProps = {
    experience: { title: string; company: string; };
    onSelect: (title: string) => void;
};

export default function Experience({ experience, onSelect }: ExperienceProps) {
    return (
        <div
            className="ml-2 my-1 mx-1 rounded cursor-pointer flex justify-between items-center"
            onClick={() => onSelect(experience.title)}
        >
            <span className="default-text text-left">{experience.title}</span>
            <span className="default-text text-purple-400 text-right">{experience.company}</span>
        </div>
    );
}