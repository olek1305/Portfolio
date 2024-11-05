import React from "react";

type ProjectProps = {
  project?: { name: string; fileName?: string };
  onSelect: (name: string) => void;
};

export default function Project({ project, onSelect }: ProjectProps) {
  if (!project || !project.name) {
    return null;
  }

  return (
    <div
      className="ml-2 my-1 mx-1 rounded cursor-pointer hover:bg-gray-700 hover:text-white transition duration-200 ease-in-out"
      onClick={() => onSelect(project.name)}
    >
      <span className="default-text">{project.name}</span>
    </div>
  );
}
