import React from "react";

type ProjectProps = {
  project?: { name: string };
  onSelect: (name: string) => void;
};

export default function Project({ project, onSelect }: ProjectProps) {
  if (!project || !project.name) {
    return null;
  }

  const projectSrc = `/projects/${( project.name)}
    .toLowerCase()
    .replace(/\s+/g, "-")}.mdx`;

  return (
    <div
      className="ml-2 my-1 mx-1 rounded cursor-pointer hover:bg-gray-700 hover:text-white transition duration-200 ease-in-out"
      onClick={() => onSelect(projectSrc)}
    >
      <span className="default-text">{project.name}</span>
    </div>
  );
}
