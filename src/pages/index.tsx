import React, {ImgHTMLAttributes, HTMLAttributes, useState, useEffect, useCallback} from "react";
import { MDXProvider } from "@mdx-js/react";
import Head from "next/head";
import Image from "next/image";

// Types
import type { CVData, Project, TabData } from '@/lib/types';

// Components
import SlideShow from "@/components/SlideShow";
import GitHubStats from '@/components/GitHubStats';
import ErrorBoundary from '@/components/ErrorBoundary';
import HalfLifeMenu from '@/components/HalfLifeMenu';
import MobileHalfLifeMenu from '@/components/MobileHalfLifeMenu';
import ExperienceComponent from "@/components/Experience";
import ProjectComponent from "@/components/Project";
import SkillComponent from "@/components/Skill";
import BookComponent from "@/components/Book";
import ImageLightbox from "@/components/ImageLightbox";
import Footer from "@/components/Footer";
import LoadingSequence from "@/components/LoadingSequence"


// Data
import todoData from './data/ToDo.json';
import phpData from './data/PHP.json';
// import pythonData from './data/Python.json';
import sysDevOpsData from './data/SysDevOpsData.json';
import skillsData from './data/Skills.json';
import booksData from './data/Books.json';

const components = {
    h1: (props: HTMLAttributes<HTMLHeadingElement>) => (
        <h1 className="glitch-text active-glitch text-2xl font-hl" {...props} />
    ),
    p: (props: HTMLAttributes<HTMLParagraphElement>) => (
        <p className="text-orange-100 text-lg font-hl" {...props} />
    ),
    ul: (props: HTMLAttributes<HTMLUListElement>) => (
        <ul className="text-orange-100 list-disc pl-5 text-lg font-hl" {...props} />
    ),
    strong: (props: HTMLAttributes<HTMLElement>) => (
        <strong className="glitch-text active-glitch font-bold text-lg font-hl" {...props} />
    ),
    a: (props: HTMLAttributes<HTMLAnchorElement>) => (
        <a className="glitch-text active-glitch hover:text-white hover:cursor-pointer font-hl" {...props} />
    ),
    img: ((props: ImgHTMLAttributes<HTMLImageElement> & { src: string }) => {
        const { src, alt } = props;
        const imageList = src.includes(",") ? src.split(",") : [src];
        const [lightboxOpen, setLightboxOpen] = useState(false);
        const [currentImageIndex] = useState(0);

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
                    <SlideShow images={imageList} altText={alt || "Slideshow images"} />
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

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => setIsMobile(window.innerWidth <= 768);

        // Initial check and event listener setup
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    return isMobile;
};

// Responsive above 1080p as 1080p
const useViewportScale = () => {
    useEffect(() => {
        const updateViewport = () => {
            const viewport = document.querySelector('meta[name="viewport"]');
            if (!viewport) return;

            const screenWidth = window.screen.width;

            if (screenWidth > 1920) {
                viewport.setAttribute('content', 'width=1920');
            } else {
                viewport.setAttribute('content', 'width=device-width, initial-scale=1');
            }
        };

        updateViewport();
        window.addEventListener('resize', updateViewport);
        return () => window.removeEventListener('resize', updateViewport);
    }, []);
};

export default function Home() {
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
    const isMobile = useIsMobile();
    useViewportScale();

    // Handle mobile-specific settings
    useEffect(() => {
        if (isMobile) {
            setShowGitHubStats(true);
            setShowMain(false);
            setActiveTab("GitHub Stats");
        }
    }, [isMobile]);

    // Handle tab changes and data updates
    useEffect(() => {
        switch (activeTab) {
            case "Developer PHP":
                setCurrentData(phpData);
                break;
            // case "Developer Python":
            //     setCurrentData(pythonData);
            //     break;
            case "System Administration & DevOps":
                setCurrentData(sysDevOpsData);
                break;
            case "Skills":
                setCurrentData(skillsData);
                break;
            case "Books":
                setCurrentData(booksData);
                break;
            case "ToDo":
                setCurrentData(todoData);
                break;
            case "GitHub Stats":
                setShowGitHubStats(true);
                setShowMain(false);
                break;
            default:
                setCurrentData(phpData);
        }
    }, [activeTab]);

    /**
     * Handles loading markdown content based on category and name
     */
    const handleSelectMarkdown = useCallback(
        async (category: string, name: string, fileName?: string, tab?: string) => {
            if (category !== "projects" && category !== "System Administration & DevOps") {
                setSelectedProject(null);
            }

            // Handle skills category separately
            if (category === "skills") {
                const skillFileName = fileName || name.toLowerCase().replace(/\s+/g, "-");
                return loadMarkdownFile(`skills/${skillFileName}.mdx`);
            }

            // Handle home screen
            if (category === "home" && name === "home") {
                setShowGitHubStats(true);
                setShowMain(false);
                return;
            }

            setShowGitHubStats(false);
            setShowMain(true);

            // Determine subcategory based on a tab
            let subcategory = '';
            if (tab) {
                if (tab.includes("PHP")) subcategory = 'php';
                // else if (tab.includes("Python")) subcategory = 'python';
                else if (tab.includes("System Administration & DevOps")) subcategory = 'System Administration & DevOps';
            }

            const basePath = subcategory
                ? `${category}/${subcategory}/${fileName || name.toLowerCase().replace(/\s+/g, "-")}`
                : `${category}/${fileName || name.toLowerCase().replace(/\s+/g, "-")}`;

            return loadMarkdownFile(`${basePath}.mdx`);
        },
        []
    );

    useEffect(() => {
        // Initialize client-side and load initial content
        setIsClient(true);

        const loadInitialData = async () => {
            await handleSelectMarkdown("home", "home");

            // Fetch CV data
            try {
                const response = await fetch('/api/generate-cv');
                if (!response.ok) new Error('Network response was not ok');
                setCvData(await response.json());
            } catch (error) {
                console.error('Error fetching CV data:', error);
            }
        };

        const timer1 = setTimeout(() => loadInitialData(), 900);
        const timer2 = setTimeout(() => setIsLoading(false), 2500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [handleSelectMarkdown]);

    /**
     * Helper function to load markdown files with error handling
     */
    const loadMarkdownFile = async (path: string) => {
        try {
            const MdxModule = await import(`./data/markdown/${path}`);
            setMdxComponent(() => MdxModule.default);
        } catch (error) {
            console.error("Markdown file not found:", path, error);
            try {
                const ErrorMdxModule = await import(`./data/markdown/error.mdx`);
                setMdxComponent(() => ErrorMdxModule.default);
            } catch (error) {
                console.error("Error file not found:", error);
                setMdxComponent(null);
            }
        }
    };

    // UI interaction handlers
    const toggleMenu = () => setMenuOpen(!menuOpen);

    const handleMobileTabChange = (tab: string) => {
        setTabChanged(true);
        setActiveTab(tab);
        setMenuOpen(false);

        if (tab === "GitHub Stats") {
            setShowGitHubStats(true);
            setShowMain(false);
        } else {
            setShowGitHubStats(false);
            setShowMain(true);
        }

        setTimeout(() => setTabChanged(false), 300);
    };

    const handleProjectSelect = (project: Project) => {
        setSelectedProject(project);
        setShowGitHubStats(false);
        setShowMain(true);
        handleSelectMarkdown("projects", project.name, undefined, activeTab)
            .catch(error => console.error(`Error loading project ${project.name} markdown:`, error));
    };

    const renderContentForTab = (tab: string) => {
        switch (tab) {
            case "Developer PHP":
            // case "Developer Python":
                return (
                    <div className="space-y-4">
                        {currentData.experience && currentData.experience.length > 0 && (
                            <div className="hl-container relative">
                                <h3 className="hl-title pulse-glow">
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
                                <h3 className="hl-title pulse-glow">
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
            case "System Administration & DevOps":
                return currentData.sysdevops && currentData.sysdevops.length > 0 && (
                    <div className="hl-container relative">
                        <h3 className="hl-title pulse-glow">DevOps Topics ({currentData.sysdevops.length})</h3>
                        <div className="hl-content">
                            <ul className="space-y-4">
                                {currentData.sysdevops.map((item, idx) => (
                                    <li key={idx} className="p-3 transition-colors rounded cursor-pointer hover:bg-orange-600/10 btn-hl">
                                        <div>
                                            <div className="flex justify-between items-center">
                                                <h4 className="text-orange-400 text-lg font-bold glitch-text">{item.title}</h4>
                                                <p className="text-orange-400 text-sm glitch-text">{item.date}</p>
                                            </div>
                                            <p className="mb-2 text-orange-100">{item.info}</p>
                                            {item.skills && item.skills.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {item.skills.map((skill, skillIdx) => (
                                                        <span
                                                            key={skillIdx}
                                                            className="text-xs bg-orange-600/20 text-orange-400 px-2 py-0.5 rounded glitch-text"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );
            case "Skills":
                return currentData.skills && currentData.skills.length > 0 && (
                    <div className="hl-container relative">
                        <h3 className="hl-title pulse-glow">Skills ({currentData.skills.length})</h3>
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
                        <h3 className="hl-title pulse-glow">Books ({currentData.books.length})</h3>
                        <div className="hl-content p-4">
                            <BookComponent books={currentData.books}/>
                        </div>
                    </div>
                );
            case "ToDo":
                return currentData.todos && currentData.todos.length > 0 && (
                    <div className="hl-container relative">
                        <h3 className="hl-title pulse-glow">My To-Do Plan ({currentData.todos.length})</h3>
                        <div className="hl-content">
                            <ul className="space-y-4">
                                {currentData.todos.map((item, idx) => (
                                    <li key={idx} className="p-3 hover:bg-gray-800 rounded-lg transition-colors">
                                        <div>
                                            <h4 className={`glitch-text text-lg font-bold ${item.done ? 'line-through text-gray-500' : ''}`}>
                                                {item.title}
                                            </h4>
                                            <p className={`${item.done ? 'line-through text-gray-500' : 'text-orange-400'}`}>
                                                {item.description}
                                            </p>
                                            {item.done && <span className="text-green-400 text-sm">Completed</span>}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="relative ">
            {/* Loading screen */}
            {isLoading && (
                <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
                    <div className="border-2 border-orange-600 bg-gray-900 p-6 rounded-md max-w-2xl w-full">
                        <div className="text-center mb-4">
                            <div className="text-orange-400 text-xl font-mono mb-1">
                                PORTFOLIO
                            </div>
                            <div className="text-gray-400 text-sm font-mono">
                                LOADING SEQUENCE INITIATED
                            </div>
                        </div>

                        <LoadingSequence isLoading={isLoading}/>

                        <div className="mt-6 text-xs text-gray-500 font-mono text-center">
                            © 2025 Aleksander Żak. All rights reserved.
                        </div>
                    </div>
                </div>
            )}

            {/* Main app container */}
            <div className="bg-[#1a1a1a] text-gray-300 h-screen flex flex-col overflow-hidden font-hl">
                <Head>
                    <title>Aleksander Żak | PHP Developer & DevOps</title>
                    <meta name="description" content="PHP Developer & DevOps Engineer based in Bydgoszcz, Poland. Specializing in Laravel, Vue.js, Docker, and modern web development."/>
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                    <meta name="keywords" content="PHP Developer, Laravel, Vue.js, DevOps, Docker, Bydgoszcz, Poland, Web Developer, Full Stack"/>
                    <meta name="author" content="Aleksander Żak"/>
                    <meta name="robots" content="index, follow"/>

                    {/* Open Graph / Facebook */}
                    <meta property="og:type" content="website"/>
                    <meta property="og:url" content="https://portfolio-rho-three-26.vercel.app/"/>
                    <meta property="og:title" content="Aleksander Żak | PHP Developer & DevOps"/>
                    <meta property="og:description" content="PHP Developer & DevOps Engineer specializing in Laravel, Vue.js, Docker. Based in Bydgoszcz, Poland."/>
                    <meta property="og:image" content="https://portfolio-rho-three-26.vercel.app/og-image.png"/>

                    {/* Twitter */}
                    <meta property="twitter:card" content="summary_large_image"/>
                    <meta property="twitter:url" content="https://portfolio-rho-three-26.vercel.app/"/>
                    <meta property="twitter:title" content="Aleksander Żak | PHP Developer & DevOps"/>
                    <meta property="twitter:description" content="PHP Developer & DevOps Engineer specializing in Laravel, Vue.js, Docker. Based in Bydgoszcz, Poland."/>
                    <meta property="twitter:image" content="https://portfolio-rho-three-26.vercel.app/og-image.png"/>

                    {/* Canonical */}
                    <link rel="canonical" href="https://portfolio-rho-three-26.vercel.app/"/>

                    {/* Favicon */}
                    <link rel="icon" href="/favicon.ico" sizes="any"/>
                </Head>

                {/* Mobile Header */}
                {isMobile && (
                    <header
                        className="bg-[#0a0a0a] border-b-2 border-orange-600 py-3 px-6 flex justify-between items-center">
                        <div
                            className="text-orange-400 text-xl cursor-pointer hover:text-white glitch-text active-glitch"
                            data-text="Aleksander Żak"
                            onClick={() => handleMobileTabChange("Developer PHP")}
                        >
                            Aleksander Żak
                            <p className="text-gray-400 text-xs">Bydgoszcz, Poland</p>
                        </div>
                        <button
                            onClick={toggleMenu}
                            className="text-orange-400 hover:text-white focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {menuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"/>
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M4 6h16M4 12h16M4 18h16"/>
                                )}
                            </svg>
                        </button>
                    </header>
                )}

                {/* Desktop Header */}
                {!isMobile && (
                    <header className="bg-[#0a0a0a] border-b-2 border-orange-600 py-3 px-6">
                        <div
                            className="text-orange-400 text-2xl cursor-pointer hover:text-white glitch-text active-glitch"
                            data-text="Aleksander Żak, PHP & System Administration & DevOps"
                            onClick={() => {
                                setShowMain(false);
                                setShowGitHubStats(true);
                                setActiveTab("Developer PHP");
                            }}
                        >
                            Aleksander Żak, PHP <span className="text-gray-200">&</span> System Administration <span className="text-gray-200">&</span> DevOps
                            <p className="text-gray-400 text-sm">Bydgoszcz, Poland</p>
                        </div>

                    </header>
                )}

                <div className="flex flex-1 overflow-hidden">
                    {/* Desktop Menu */}
                    {!isMobile && (
                        <div className="w-64 bg-[#0a0a0a] border-r-2 border-orange-600 p-4 flex-shrink-0">
                            <HalfLifeMenu
                                tabs={["Developer PHP",
                                    // "Developer Python",
                                    "System Administration & DevOps",
                                    "Skills"
                                ]}
                                activeTab={activeTab}
                                onTabChange={(tab) => {
                                    setTabChanged(true);
                                    setActiveTab(tab);
                                    setTimeout(() => setTabChanged(false), 300);
                                }}
                                githubOpen={showGitHubStats}
                                onToggleGithub={() => {
                                    if (showGitHubStats) {
                                        // Hiding GitHub - show Lambda (empty state)
                                        setShowGitHubStats(false);
                                        setShowMain(false);
                                    } else {
                                        // Showing GitHub
                                        setShowGitHubStats(true);
                                        setShowMain(false);
                                    }
                                }}
                            />
                        </div>
                    )}

                    {/* Mobile Menu */}
                    {isMobile && menuOpen && (
                        <div className="absolute top-16 left-0 right-0 z-50 bg-[#0a0a0a] border-b-2 border-orange-600">
                            <MobileHalfLifeMenu
                                tabs={["Developer PHP", "System Administration & DevOps", "Skills", "GitHub Stats"]}
                                activeTab={activeTab}
                                onTabChange={handleMobileTabChange}
                            />
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                        {/* Left Panel - Show on mobile when not viewing GitHub Stats */}
                        {isMobile && !showGitHubStats && (
                            <div className="w-full bg-[#121212] p-4 overflow-y-auto border-b border-orange-600/30">
                                <div className={tabChanged ? "tab-switch" : ""}>
                                    {renderContentForTab(activeTab)}
                                </div>
                            </div>
                        )}

                        {/* Desktop Left Panel */}
                        {!isMobile && (
                            <div className="w-1/3 bg-[#121212] p-4 overflow-y-auto border-r border-orange-600/30">
                                <div className={tabChanged ? "tab-switch" : ""}>
                                    {renderContentForTab(activeTab)}
                                </div>
                            </div>
                        )}

                        {/* Right Content */}
                        <div className={`${isMobile ? 'w-full' : 'w-2/3'} bg-[#1a1a1a] p-4 overflow-y-auto`}>
                            {showGitHubStats && isClient && (
                                <div className="relative h-full">
                                    <ErrorBoundary
                                        onError={(error) => {
                                            console.error('GitHub Stats error caught by ErrorBoundary:', error);
                                        }}
                                        fallback={
                                            <div className="p-4 text-center">
                                                <div
                                                    className="bg-red-900/30 border border-red-700 rounded-md p-4 text-red-400 mb-4">
                                                    <h4 className="text-lg font-bold mb-2">GitHub Stats Error</h4>
                                                    <p>Sorry, we could&#39;t load the GitHub stats at this time.</p>
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
                                    {!isMobile && (
                                        <button
                                            onClick={() => {
                                                setShowMain(false);
                                                setShowGitHubStats(true);
                                            }}
                                            className="absolute top-2 right-2 text-orange-400 hover:text-white z-10"
                                            aria-label="Show GitHub Stats"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                                 viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M6 18L18 6M6 6l12 12"/>
                                            </svg>
                                        </button>
                                    )}

                                    <div className="h-full overflow-auto">
                                        {isClient && MdxComponent && (
                                            <MDXProvider components={components}>
                                                <MdxComponent/>
                                            </MDXProvider>
                                        )}
                                    </div>

                                </div>
                            )}

                            {/* Empty state - Lambda animation */}
                            {!showGitHubStats && !showMain && (
                                <div className="h-full flex flex-col items-center justify-center">
                                    <div className="relative">
                                        {/* Lambda symbol */}
                                        <span
                                            className="text-[12rem] font-bold text-orange-600/20 glitch-text select-none"
                                            data-text="λ"
                                        >
                                            λ
                                        </span>
                                        {/* Glow effect */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-[12rem] font-bold text-orange-600/10 blur-xl animate-pulse select-none">
                                                λ
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-orange-600/40 text-sm mt-4 tracking-widest">
                                        SELECT FROM MENU
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <Footer cvData={cvData}/>
            </div>
        </div>
    );
}