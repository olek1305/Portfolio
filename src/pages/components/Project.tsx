import React from "react";

type ProjectProps = {
    project: { name: string; };
    onSelect: (name: string) => void;
};

export default function Project({ project, onSelect }: ProjectProps) {
    return (
        <div
            className="ml-2 my-1 mx-1 rounded cursor-pointer hover:bg-gray-700 hover:text-white transition duration-200 ease-in-out text-center"
            onClick={() => onSelect(project.name)}
        >
            <span>{project.name}</span>
        </div>
    );
}
