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

export type SysDevOps = {
    title: string;
    date: string;
    info?: string;
    skills?: string[];
};

export type Job = {
    title: string;
    company: string;
    date: string;
    info?: string;
    fileName?: string;
};

export interface ToDo {
    title: string;
    done: boolean;
    description?: string;
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
    jobs: Job[];
    experience: ExperienceForCV[];
    projects: ProjectForCV[];
    sysdevops: SysDevOps[];
    skills: Skill[];
}

export type TabData = {
    jobs?: Job[];
    experience?: Experience[];
    projects?: Project[];
    skills?: Skill[];
    books?: Book[];
    sysdevops?: SysDevOps[];
    todos?: ToDo[];
};

declare global {
    interface Window {
        setLightboxImage?: (src: string | null) => void;
    }
}