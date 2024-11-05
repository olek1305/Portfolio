import Image from "next/image";

interface SkillProps {
  skill: {
    name: string;
    fileName?: string;
  };
  onSelect: (name: string) => void;
}

export default function Skill({ skill, onSelect }: SkillProps) {
  if (!skill || !skill.name) {
    return null;
  }

  const iconSrc = `/icons/${(skill.fileName || skill.name).toLowerCase().replace(/\s+/g, '-')}.svg`;

  return (
    <li
      onClick={() => onSelect(skill.fileName || skill.name)}
      className="items-center cursor-pointer skill-icon hover:bg-gray-700 hover:text-white transition duration-200 ease-in-out"
    >
      <Image
        src={iconSrc}
        alt={`${skill.name} icon`}
        width={28}
        height={28}
        className="ml-10 mx-2 skill-icon-background invert-icon"
      />
      <span className="default-text">{skill.name}</span>
    </li>
  );
}
