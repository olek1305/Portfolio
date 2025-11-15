import React from "react";
import { Experience } from "@/lib/types";

type ExperienceProps = {
  experience: Experience;
  onSelect: () => void;
};

export default function ExperienceComponent({ experience, onSelect }: ExperienceProps) {
  return (
      <div
          className="ml-2 my-1 mx-1 rounded cursor-pointer flex justify-between items-center hover:bg-orange-600/10 btn-hl"
          onClick={onSelect}
      >
        <span className="text-lg text-left glitch-text">{experience.title}</span>
        <span className="text-right glitch-text">
        {experience.company}
      </span>
      </div>
  );
}