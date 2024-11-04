import Image from "next/image";

interface SkillProps {
  skill: {
    name: string;
  };
  onSelect: (name: string) => void;
}

export default function Skill({ skill, onSelect }: SkillProps) {
  const iconSrc = `/icons/${skill.name.toLowerCase()}.svg`;

  return (
    <li
      onClick={() => onSelect(skill.name)}
      className="items-center cursor-pointer skill-icon"
    >
      <Image
        src={iconSrc}
        alt={`${skill.name} icon`}
        width={28}
        height={28}
        className="ml-2 my-1 mx-1 skill-icon-background invert-icon"
      />
      <span>{skill.name}</span>
    </li>
  );
}