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

export type TabData = {
    experience?: Experience[];
    projects?: Project[];
    skills?: Skill[];
    books?: Book[];
    devopsItems?: DevOpsItem[];
};


declare global {
    interface Window {
        setLightboxImage?: (src: string | null) => void;
    }
}