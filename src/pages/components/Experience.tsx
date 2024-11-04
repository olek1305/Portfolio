import React from "react";

type ExperienceProps = {
    experience: { title: string; company: string; description: string };
    onSelect: (description: string) => void;
};

export default function Experience({ experience, onSelect }: ExperienceProps) {
    return (
        <div
            className="ml-2 my-1 mx-1 rounded cursor-pointer"
            onClick={() => onSelect(experience.description)}
        >
            <h3 className="text-md font-semibold">{experience.title}</h3>
            <p className="text-gray-400">{experience.company}</p>
        </div>
    );
}