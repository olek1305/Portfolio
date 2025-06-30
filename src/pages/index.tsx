import React, { HTMLAttributes } from "react";
import {MDXProvider} from "@mdx-js/react";
import {useState, useEffect} from "react";
import Head from "next/head";
import Image from "next/image";
import {ImgHTMLAttributes} from "react";

// Components
import SlideShow from "./components/SlideShow";
import GitHubStats from './components/GitHubStats';
import ErrorBoundary from './components/ErrorBoundary';
import HalfLifeMenu from './components/HalfLifeMenu';
import TransitionEffect from './components/TransitionEffect';

// Data
import data from "./data/data.json";
import phpData from './data/PHP.json';
import csharpData from './data/CSharp.json';
import devopsData from './data/DevOps.json';
import skillsData from './data/skills.json';
import booksData from './data/books.json';


// Types
import type { Project, TabData } from './types';
import ExperienceComponent from "@/pages/components/Experience";
import { ProjectComponent} from "@/pages/components/Project";
import SkillComponent from "@/pages/components/Skill";
import BookComponent from "@/pages/components/Book";
import {ImageLightbox} from "@/pages/components/ImageLightbox";

const components = {
    h1: (props: HTMLAttributes<HTMLHeadingElement>): React.ReactElement => (
        <h1 className="text-orange-400 text-2xl font-hl" {...props} />
    ),
    p: (props: HTMLAttributes<HTMLParagraphElement>): React.ReactElement => (
        <p className="text-gray-200 text-lg font-hl" {...props} />
    ),
    ul: (props: HTMLAttributes<HTMLUListElement>): React.ReactElement => (
        <ul className="text-gray-200 list-disc pl-5 text-lg font-hl" {...props} />
    ),
    strong: (props: HTMLAttributes<HTMLElement>): React.ReactElement => (
        <strong className="text-orange-400 font-bold text-lg font-hl" {...props} />
    ),
    a: (props: HTMLAttributes<HTMLAnchorElement>): React.ReactElement => (
        <a
            className="text-orange-400 hover:text-white hover:cursor-pointer font-hl"
            {...props}
        />
    ),
    img: ((props: ImgHTMLAttributes<HTMLImageElement> & { src: string }): React.ReactElement => {
        const {src, alt, ...rest} = props;
        const imageList = src.includes(",") ? src.split(",") : [src];
        const [lightboxOpen, setLightboxOpen] = useState(false);
        const [currentImageIndex, setCurrentImageIndex] = useState(0);

        return (
            <>
                {lightboxOpen && (
                    <ImageLightbox
                        src={imageList[currentImageIndex]}
                        alt={alt || "Enlarged image view"}
                        onClose={() => setLightboxOpen(false)}
                    />
                )}

                {imageList.length > 1 ? (
                    <SlideShow images={imageList} altText={alt || "Slideshow images"}/>
                ) : (
                    <div className="relative group">
                        <Image
                            src={imageList[0]}
                            alt={alt || "Image"}
                            width={800}
                            height={600}
                            className="border-2 border-orange-600 rounded-md cursor-zoom-in transition-transform group-hover:scale-105"
                            onClick={() => setLightboxOpen(true)}
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white bg-orange-600/80 px-2 py-1 rounded text-sm">
                    Click to enlarge
                  </span>
                        </div>
                    </div>
                )}
            </>
        );
    }) as React.ComponentType,
};

export default function Home() {
    const [MdxComponent, setMdxComponent] = useState<React.FC | null>(null);
    const [showCopiedMessage, setShowCopiedMessage] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [showGitHubStats, setShowGitHubStats] = useState(true);
    const [showMain, setShowMain] = useState(false);
    const [activeTab, setActiveTab] = useState("Developer PHP");
    const [isLoading, setIsLoading] = useState(true);
    const [tabChanged, setTabChanged] = useState(false);
    const [currentData, setCurrentData] = useState<TabData>(phpData);

    useEffect(() => {
        setIsClient(true);
        const timer = setTimeout(() => {
            handleSelectMarkdown("home", "home").then(() => {});
        }, 900);

        return () => clearTimeout(timer);
    }, []);

    // Loading
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    // JSON
    useEffect(() => {
        switch(activeTab) {
            case "Developer PHP":
                setCurrentData(phpData);
                break;
            case "Developer C#":
                setCurrentData(csharpData);
                break;
            case "DevOps":
                setCurrentData(devopsData);
                break;
            case "Skills":
                setCurrentData(skillsData);
                break;
            case "Books":
                setCurrentData(booksData);
                break;
            default:
                setCurrentData(phpData);
        }
    }, [activeTab]);

    // In your main component
    const handleSelectMarkdown = async (
        category: string,
        name: string,
        fileName?: string,
        tab?: string
    ) => {
        if (category !== "projects") {
            setSelectedProject(null);
        }

        if (category === "skills") {
            const skillFileName = fileName || name.toLowerCase().replace(/\s+/g, "-");
            const markdownFile = `skills/${skillFileName}.mdx`;

            try {
                console.log("Loading skill MDX from:", `./data/markdown/${markdownFile}`);
                const MdxModule = await import(`./data/markdown/${markdownFile}`);
                setMdxComponent(() => MdxModule.default);
                return;
            } catch (error) {
                console.error("Skill MDX file not found:", markdownFile, error);
                try {
                    const ErrorMdxModule = await import(`./data/markdown/error.mdx`);
                    setMdxComponent(() => ErrorMdxModule.default);
                } catch (error) {
                    console.error("Error file not found:", error);
                    setMdxComponent(null);
                }
                return;
            }
        }

        if (category === "home" && name === "home") {
            setShowGitHubStats(true);
            setShowMain(false);
            return;
        } else {
            setShowGitHubStats(false);
            setShowMain(true);
        }

        let subcategory = '';
        if (tab) {
            if (tab.includes("PHP")) subcategory = 'php';
            else if (tab.includes("C#")) subcategory = 'csharp';
            else if (tab.includes("DevOps")) subcategory = 'devops';
        }

        const basePath = subcategory
            ? `${category}/${subcategory}/${fileName || name.toLowerCase().replace(/\s+/g, "-")}`
            : `${category}/${fileName || name.toLowerCase().replace(/\s+/g, "-")}`;

        const markdownFile = `${basePath}.mdx`;

        try {
            console.log("Loading MDX from:", `./data/markdown/${markdownFile}`); // Logowanie ścieżki
            const MdxModule = await import(`./data/markdown/${markdownFile}`);
            setMdxComponent(() => MdxModule.default);
        } catch (error) {
            console.error("Markdown file not found:", markdownFile, error);
            try {
                const ErrorMdxModule = await import(`./data/markdown/error.mdx`);
                setMdxComponent(() => ErrorMdxModule.default);
            } catch (error) {
                console.error("Error file not found:", error);
                setMdxComponent(null);
            }
        }
    };

    const handleCopyEmail = () => {
        const email = "olek1305@gmail.com";
        navigator.clipboard.writeText(email).then(() => {
        });
        setShowCopiedMessage(true);
        setTimeout(() => setShowCopiedMessage(false), 2000);
    };

    const handleProjectSelect = (project: Project) => {
        setSelectedProject(project);
        setShowGitHubStats(false);
        setShowMain(true);

        handleSelectMarkdown("projects", project.name, undefined, activeTab)
            .then(() => {
                console.log(`Project ${project.name} markdown loaded successfully`);
            })
            .catch((error) => {
                console.error(`Error loading project ${project.name} markdown:`, error);
            });
    };

    const renderContentForTab = (tab: string) => {
        switch(tab) {
            case "Developer PHP":
            case "Developer C#":
            case "DevOps":
                return (
                    <div className="space-y-4">
                        {currentData.experience && currentData.experience.length > 0 && (
                            <div className="hl-container relative">
                                <h3 className="hl-title">
                                    {tab} Experience ({currentData.experience.length})
                                </h3>
                                <div className="hl-content">
                                    <ul className="space-y-2">
                                        {currentData.experience.map((exp, idx) => (
                                            <li key={idx}>
                                                <ExperienceComponent
                                                    experience={exp}
                                                    onSelect={() =>
                                                        handleSelectMarkdown(
                                                            "experiences",
                                                            exp.title,
                                                            exp.fileName,
                                                            activeTab
                                                        )
                                                    }
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {currentData.projects && currentData.projects.length > 0 && (
                            <div className="hl-container relative">
                                <h3 className="hl-title">
                                    {tab} Projects ({currentData.projects.length})
                                </h3>
                                <div className="hl-content">
                                    <ul className="space-y-2">
                                        {currentData.projects.map((project, idx) => (
                                            <li key={idx}>
                                                <ProjectComponent
                                                    project={project}
                                                    onSelect={() => handleProjectSelect(project)}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case "Skills":
                return currentData.skills && currentData.skills.length > 0 && (
                    <div className="hl-container relative">
                        <h3 className="hl-title">Skills ({currentData.skills.length})</h3>
                        <div className="hl-content">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2">
                                {currentData.skills.map((skill, idx) => (
                                    <SkillComponent
                                        key={idx}
                                        skill={skill}
                                        onSelect={() => handleSelectMarkdown("skills", skill.name, skill.fileName)}
                                        hasDetails={!!skill.fileName || true}
                                        iconOnly={false}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case "Books":
                return currentData.books && currentData.books.length > 0 && (
                    <div className="hl-container relative">
                        <h3 className="hl-title">Books ({currentData.books.length})</h3>
                        <div className="hl-content p-4">
                            <BookComponent books={currentData.books} />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="relative">
            {isLoading && (
                <div className="loading-screen">
                    <div className="loading-bar" />
                </div>
            )}
            <div className="bg-[#1a1a1a] text-gray-300 h-screen flex flex-col overflow-hidden font-hl">
                <Head>
                    <title>Home - Aleksander Żak | PHP Developer</title>
                    <meta
                        name="description"
                        content="Aleksander Żak's portfolio - PHP Developer based in Bydgoszcz, Poland."
                    />
                </Head>

                <header className="bg-[#0a0a0a] border-b-2 border-orange-600 py-3 px-6">
                    {/* Profile Section */}
                    <div
                        className="text-orange-400 text-2xl cursor-pointer hover:text-white"
                        onClick={() => {
                            setShowMain(false);
                            setShowGitHubStats(true);
                            setActiveTab("Developer PHP");
                        }}
                    >
                        Aleksander Żak, PHP <span className={"text-gray-200"}>&</span> DevOps
                        <p className="text-gray-400 text-sm">Bydgoszcz, Poland</p>
                    </div>
                </header>

                <div className="flex flex-1 overflow-hidden">
                    {/* Half-Life-style Left Menu */}
                    <div className="w-64 bg-[#0a0a0a] border-r-2 border-orange-600 p-4 flex-shrink-0">
                        <HalfLifeMenu
                            tabs={["Developer PHP", "Developer C#", "DevOps", "Skills", "Books"]}
                            activeTab={activeTab}
                            onTabChange={(tab) => {
                                setTabChanged(true);
                                setActiveTab(tab);
                                setTimeout(() => setTabChanged(false), 300);
                            }}
                            githubOpen={showGitHubStats}
                            onToggleGithub={() => {
                                setShowGitHubStats(!showGitHubStats);
                                setShowMain(showGitHubStats);
                            }}
                        />
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 flex overflow-hidden">
                        {/* Left Content - Dynamic based on active tab */}
                        <div className="w-1/3 bg-[#121212] p-4 overflow-y-auto border-r border-orange-600/30">
                            <div className={tabChanged ? "tab-switch" : ""}>
                                {renderContentForTab(activeTab)}
                            </div>
                        </div>

                        {/* Right Content - GitHub Stats or Main Content */}
                        <div className="w-2/3 bg-[#1a1a1a] p-4 overflow-y-auto">
                            {showGitHubStats && isClient && (
                                <div className="relative h-full">
                                    <ErrorBoundary
                                        onError={(error) => {
                                            console.error('GitHub Stats error caught by ErrorBoundary:', error);
                                        }}
                                        fallback={
                                            <div className="p-4 text-center">
                                                <div className="bg-red-900/30 border border-red-700 rounded-md p-4 text-red-400 mb-4">
                                                    <h4 className="text-lg font-bold mb-2">GitHub Stats Error</h4>
                                                    <p>Sorry, we couldn&#39;t load the GitHub stats at this time.</p>
                                                </div>
                                            </div>
                                        }
                                    >
                                        <GitHubStats
                                            username="olek1305"
                                            className="h-full"
                                        />
                                    </ErrorBoundary>
                                </div>
                            )}

                            {showMain && (
                                <div className="relative h-full">
                                    <button
                                        onClick={() => {
                                            setShowMain(false);
                                            setShowGitHubStats(true);
                                        }}
                                        className="absolute top-2 right-2 text-orange-400 hover:text-white z-10"
                                        aria-label="Show GitHub Stats"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>

                                    <div className="h-full overflow-auto">
                                        {isClient && MdxComponent ? (
                                            <MDXProvider components={components}>
                                                <MdxComponent />
                                            </MDXProvider>
                                        ) : (
                                            <div className="text-orange-400 text-center mt-10">Select an item to view details</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Half-Life-style Footer */}
                <footer className="bg-[#0a0a0a] border-t-2 border-orange-600 py-2 px-6 flex justify-center gap-6 items-center">
                    <a
                        href="/cv/aleksander-zak.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-400 hover:text-white text-sm"
                    >
                        ▼ Resume
                    </a>

                    <a
                        href="https://github.com/olek1305"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-400 hover:text-white text-sm"
                    >
                        ▼ GitHub
                    </a>

                    <div className="relative h-6 flex items-center">
                        <button
                            onClick={handleCopyEmail}
                            className="text-orange-400 hover:text-white text-sm"
                        >
                            ▼ Email
                        </button>
                        {showCopiedMessage && (
                            <div className="ammo-pickup absolute -top-8 left-0 right-0 mx-auto w-fit bg-orange-600 text-black px-2 py-1 rounded-md text-xs">
                                Copied!
                            </div>
                        )}
                    </div>
                    <TransitionEffect />
                </footer>
            </div>
        </div>

    );
}