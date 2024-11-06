import React from "react";

type ExperienceProps = {
  experience?: { title: string; company: string; fileName?: string };
  onSelect: (title: string) => void;
};

export default function Experience({ experience, onSelect }: ExperienceProps) {
  if (!experience || !experience.title || !experience.company) {
    return null;
  }

  const ExperienceSrc = `/projects/${(experience.fileName || experience.title)}
  .toLowerCase()
  .replace(/\s+/g, "-")}.mdx`;

  return (
    <div
      className="ml-2 my-1 mx-1 rounded cursor-pointer flex justify-between items-center hover:bg-gray-700 hover:text-white transition duration-200 ease-in-out"
      onClick={() => onSelect(ExperienceSrc)}
    >
      <span className="default-text text-left">{experience.title}</span>
      <span className="default-text text-purple-400 text-right">{experience.company}</span>
    </div>
  );
}
