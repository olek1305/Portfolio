import React from "react";

type ProjectProps = {
    project: { name: string; };
    onSelect: (name: string) => void;
};

export default function Project({ project, onSelect }: ProjectProps) {
    return (
        <div
            className="ml-2 my-1 mx-1 rounded cursor-pointer"
            onClick={() => onSelect(project.name)}
        >
            <span className="default-text">{project.name}</span>
        </div>
    );
}
