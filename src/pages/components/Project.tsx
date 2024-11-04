import React from "react";

type ProjectProps = {
    project: { name: string; link: string; description: string };
    onSelect: (description: string) => void;
};

export default function Project({ project, onSelect }: ProjectProps) {
    return (
        <div
            className="ml-2 my-1 mx-1 rounded cursor-pointer"
            onClick={() => onSelect(project.description)}
        >
            <h3 className="text-md font-semibold">{project.name}</h3>
        </div>
    );
}
