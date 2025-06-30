import React from "react";
import { Experience } from "../lib/types";

type ExperienceProps = {
  experience: Experience;
  onSelect: () => void;
};

export default function ExperienceComponent({ experience, onSelect }: ExperienceProps) {
  return (
      <div
          className="ml-2 my-1 mx-1 rounded cursor-pointer flex justify-between items-center hover:bg-gray-700 hover:text-white transition duration-200 ease-in-out"
          onClick={onSelect}
      >
        <span className="text-lg text-left">{experience.title}</span>
        <span className="text-orange-400 text-right">
        {experience.company}
      </span>
      </div>
  );
}