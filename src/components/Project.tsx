import Image from 'next/image';
import { Project } from "@/lib/types";

const ProjectComponent = ({ project, onSelect }: {
    project: Project;
    onSelect: () => void;
}) => {
    const getFrameworkIcon = () => {
        if (project.skills.includes('Laravel')) {
            return '/icons/laravel.svg';
        }
        if (project.skills.includes('Symfony')) {
            return '/icons/symfony.svg';
        }
        if (project.skills.includes('Next.js')) {
            return '/icons/nextjs.svg';
        }
        return '/icons/error.svg';
    };

    const frameworkIcon = getFrameworkIcon();

    return (
        <div
            className="flex items-center gap-3 p-2 hover:bg-orange-600/10 rounded cursor-pointer"
            onClick={onSelect}
        >
            <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
                <Image
                    src={frameworkIcon}
                    alt={project.name}
                    width={40}
                    height={40}
                    className="object-contain tech-icon hover:scale-110 transition-transform"
                />
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-orange-400 truncate">{project.name}</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                    {project.skills.map((skill, index) => (
                        <span key={index} className="text-xs bg-orange-600/20 text-orange-400 px-2 py-0.5 rounded">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectComponent;