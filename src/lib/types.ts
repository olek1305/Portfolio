export type Experience = {
    title: string;
    company: string;
    fileName?: string;
    skills?: string[];
};

export type Project = {
    name: string;
    skills: string[];
};

export type Skill = {
    name: string;
    category: string;
    fileName?: string;
};

export type Book = {
    title: string;
    imagePath: string;
};

export type DevOpsItem = {
    title: string;
    date: string;
    info: string;
    skills?: string[];
};

export interface ToDoItem {
    title: string;
    description: string;
}
export interface ExperienceForCV extends Experience {
    date: string;
    info: string;
}

export interface ProjectForCV extends Project {
    date: string;
    info: string;
    fileName?: string;
}

export interface CVData {
    experience: ExperienceForCV[];
    projects: ProjectForCV[];
    devops: DevOpsItem[];
    skills: Skill[];
}

export type TabData = {
    experience?: Experience[];
    projects?: Project[];
    skills?: Skill[];
    books?: Book[];
    devopsItems?: DevOpsItem[];
    todos?: ToDoItem[];
};

declare global {
    interface Window {
        setLightboxImage?: (src: string | null) => void;
    }
}