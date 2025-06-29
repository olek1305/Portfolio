import React from "react";
import { Project } from "../types";

type ProjectProps = {
  project: Project;
  onSelect: () => void;
};

export default function ProjectComponent({ project, onSelect }: ProjectProps) {
  return (
      <div
          className="ml-2 my-1 mx-1 rounded cursor-pointer hover:bg-gray-700 hover:text-white transition duration-200 ease-in-out"
          onClick={onSelect}
      >
        <span className="text-lg">{project.name}</span>
      </div>
  );
}