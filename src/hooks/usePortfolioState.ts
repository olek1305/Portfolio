import { useState, useEffect, useCallback } from "react";
import type { CVData, Project, TabData } from "@/lib/types";

import phpData from "@/pages/data/PHP.json";
import sysDevOpsData from "@/pages/data/SysDevOpsData.json";
import skillsData from "@/pages/data/Skills.json";
import booksData from "@/pages/data/Books.json";
import jobsData from "@/pages/data/Jobs.json";
import todoData from "@/pages/data/ToDo.json";

interface UsePortfolioStateReturn {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    currentData: TabData;
    showGitHubStats: boolean;
    setShowGitHubStats: (show: boolean) => void;
    showMain: boolean;
    setShowMain: (show: boolean) => void;
    selectedProject: Project | null;
    setSelectedProject: (project: Project | null) => void;
    isLoading: boolean;
    tabChanged: boolean;
    setTabChanged: (changed: boolean) => void;
    cvData: CVData | null;
    menuOpen: boolean;
    toggleMenu: () => void;
    setMenuOpen: (open: boolean) => void;
    handleSelectMarkdown: (category: string, name: string, fileName?: string, tab?: string) => Promise<void>;
    loadMarkdownFile: (path: string) => Promise<void>;
    MdxComponent: React.FC | null;
    isClient: boolean;
}

const tabDataMap: Record<string, TabData> = {
    "Developer PHP": phpData,
    "System Administration & DevOps": sysDevOpsData,
    "Skills": skillsData,
    "Jobs": jobsData,
    "Books": booksData,
    "ToDo": todoData,
};

export const usePortfolioState = (isMobile: boolean): UsePortfolioStateReturn => {
    const [MdxComponent, setMdxComponent] = useState<React.FC | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [showGitHubStats, setShowGitHubStats] = useState(true);
    const [showMain, setShowMain] = useState(false);
    const [activeTab, setActiveTab] = useState("Developer PHP");
    const [isLoading, setIsLoading] = useState(true);
    const [tabChanged, setTabChanged] = useState(false);
    const [currentData, setCurrentData] = useState<TabData>(phpData);
    const [cvData, setCvData] = useState<CVData | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = useCallback(() => setMenuOpen(prev => !prev), []);

    const loadMarkdownFile = useCallback(async (path: string) => {
        try {
            const MdxModule = await import(`@/pages/data/markdown/${path}`);
            setMdxComponent(() => MdxModule.default);
        } catch {
            try {
                const ErrorMdxModule = await import(`@/pages/data/markdown/error.mdx`);
                setMdxComponent(() => ErrorMdxModule.default);
            } catch {
                setMdxComponent(null);
            }
        }
    }, []);

    const handleSelectMarkdown = useCallback(
        async (category: string, name: string, fileName?: string, tab?: string) => {
            if (category !== "projects" && category !== "System Administration & DevOps") {
                setSelectedProject(null);
            }

            if (category === "skills") {
                setShowGitHubStats(false);
                setShowMain(true);
                const skillFileName = fileName || name.toLowerCase().replace(/\s+/g, "-");
                return loadMarkdownFile(`skills/${skillFileName}.mdx`);
            }

            if (category === "home" && name === "home") {
                setShowGitHubStats(true);
                setShowMain(false);
                return;
            }

            setShowGitHubStats(false);
            setShowMain(true);

            let subcategory = "";
            if (tab) {
                if (tab.includes("PHP")) subcategory = "php";
                else if (tab.includes("System Administration & DevOps")) subcategory = "System Administration & DevOps";
            }

            const basePath = subcategory
                ? `${category}/${subcategory}/${fileName || name.toLowerCase().replace(/\s+/g, "-")}`
                : `${category}/${fileName || name.toLowerCase().replace(/\s+/g, "-")}`;

            return loadMarkdownFile(`${basePath}.mdx`);
        },
        [loadMarkdownFile]
    );

    useEffect(() => {
        if (isMobile) {
            setShowGitHubStats(true);
            setShowMain(false);
            setActiveTab("GitHub Stats");
        }
    }, [isMobile]);

    useEffect(() => {
        if (activeTab === "GitHub Stats") {
            setShowGitHubStats(true);
            setShowMain(false);
        } else {
            setCurrentData(tabDataMap[activeTab] || phpData);
        }
    }, [activeTab]);

    useEffect(() => {
        setIsClient(true);

        const loadInitialData = async () => {
            await handleSelectMarkdown("home", "home");

            try {
                const response = await fetch("/api/generate-cv");
                if (response.ok) {
                    setCvData(await response.json());
                }
            } catch (error) {
                console.error("Error fetching CV data:", error);
            }
        };

        const timer1 = setTimeout(() => loadInitialData(), 900);
        const timer2 = setTimeout(() => setIsLoading(false), 2500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [handleSelectMarkdown]);

    return {
        activeTab,
        setActiveTab,
        currentData,
        showGitHubStats,
        setShowGitHubStats,
        showMain,
        setShowMain,
        selectedProject,
        setSelectedProject,
        isLoading,
        tabChanged,
        setTabChanged,
        cvData,
        menuOpen,
        toggleMenu,
        setMenuOpen,
        handleSelectMarkdown,
        loadMarkdownFile,
        MdxComponent,
        isClient,
    };
};
