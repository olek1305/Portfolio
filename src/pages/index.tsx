import React, { HTMLAttributes } from "react";
import {MDXProvider} from "@mdx-js/react";
import {useState, useEffect} from "react";
import Head from "next/head";
import Image from "next/image";
import {ImgHTMLAttributes} from "react";

// Components
import DinoAnimation from "./components/DinoAnimation";
import SlideShow from "./components/SlideShow";
import Experience from "./components/Experience";
import Project from "./components/Project";
import Skill from "./components/Skill";
import Book from './components/Book';
import GitHubStats from './components/GitHubStats';
import ErrorBoundary from './components/ErrorBoundary';

// Data
import data from "./data/data.json";
import SlideOver from "@/pages/components/SlideOver";

const components = {
    h1: (props: HTMLAttributes<HTMLHeadingElement>): React.ReactElement => (
        <h1 className="text-purple-400 text-2xl" {...props} />
    ),
    p: (props: HTMLAttributes<HTMLParagraphElement>): React.ReactElement => (
        <p className="text-green-400 text-lg" {...props} />
    ),
    ul: (props: HTMLAttributes<HTMLUListElement>): React.ReactElement => (
        <ul className="text-green-400 list-none text-lg" {...props} />
    ),
    strong: (props: HTMLAttributes<HTMLElement>): React.ReactElement => (
        <strong className="text-red-400 font-bold text-lg" {...props} />
    ),
    a: (props: HTMLAttributes<HTMLAnchorElement>): React.ReactElement => (
        <a
            className="text-green-400 hover:bg-gray-700 hover:text-white hover:cursor-pointer"
            {...props}
        />
    ),
    img: ((props: ImgHTMLAttributes<HTMLImageElement> & { src: string }): React.ReactElement => {
        const {src, alt, ...rest} = props;
        const imageList = src.includes(",") ? src.split(",") : [src];

        return imageList.length > 1 ? (
            <SlideShow images={imageList} altText={alt || ""}/>
        ) : (
            <Image src={imageList[0]} alt={alt || ""} {...rest} width={500} height={500}
                   className="custom-image-class"/>
        );
    }) as React.ComponentType,
};

export default function Home() {
    const [MdxComponent, setMdxComponent] = useState<React.FC | null>(null);
    const [showDino, setShowDino] = useState(true);
    const [showCopiedMessage, setShowCopiedMessage] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [showGitHubStats, setShowGitHubStats] = useState(true);
    const [showMain, setShowMain] = useState(false);

    useEffect(() => {
        setIsClient(true);
        // Load home.mdx content, but don't show it initially
        const timer = setTimeout(() => {
            handleSelectMarkdown("home", "home").then(() => {
                // Don't change showMain to true to keep GitHub stats as the default view
            });
        }, 900);

        return () => clearTimeout(timer);
    }, []);

    const handleSelectMarkdown = async (
        category: string,
        name: string,
        fileName?: string
    ) => {
        if (category !== "projects") {
            setSelectedProject(null);
        }

        // If clicking on profile, show GitHub stats and hide main content
        if (category === "home" && name === "home") {
            setShowGitHubStats(true);
            setShowMain(false);
            return;
        } else {
            // Otherwise show main content and hide GitHub stats
            setShowGitHubStats(false);
            setShowMain(true);
        }

        const markdownFile =
            category === "home"
                ? `${name.toLowerCase().replace(/\s+/g, "-")}.mdx`
                : `${category}/${
                    fileName || name.toLowerCase().replace(/\s+/g, "-")
                }.mdx`;

        try {
            const MdxModule = await import(`./data/markdown/${markdownFile}`);
            setMdxComponent(() => MdxModule.default);
        } catch (error) {
            console.error("Markdown file not found:", markdownFile);
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

    const handleProjectSelect = (project: { name: string; skills: string[] }) => {
        setSelectedProject(project as Project);
        // Hide GitHub stats and show main content
        setShowGitHubStats(false);
        setShowMain(true);

        handleSelectMarkdown("projects", project.name)
            .then(() => {
                console.log(`Project ${project.name} markdown loaded successfully`);
            })
            .catch((error) => {
                console.error(`Error loading project ${project.name} markdown:`, error);
            });
    };

    type Project = {
        name: string;
        skills: string[];
    };

    return (
        <div className="bg-[#0d1117] text-gray-300 p-4 scrollbar-fixed main-content w-full h-full m-0">
            <Head>
                <title>Home - Aleksander Żak | PHP Developer</title>
                <meta
                    name="description"
                    content="Aleksander Żak's portfolio - PHP Developer based in Bydgoszcz, Poland."
                />
            </Head>
            {/* Centered Wrapper */}
            <div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2" style={{ height: 'calc(100vh - 120px)' }}>
                    {/* Sidebar */}
                    {isClient && (
                        <div className="col-span-1 space-y-4 flex flex-col text-center h-full overflow-y-auto">
                            <div
                                className="sp-container p-4 rounded cursor-pointer hover:bg-gray-700"
                                onClick={() => handleSelectMarkdown("home", "home")}
                            >
                                <h3 className="sp-title">profile</h3>
                                <h2 className="text-3xl font-bold text-white">
                                    Aleksander Żak
                                </h2>
                                <p className="text-xl">
                                    <span className="text-blue-300">PHP</span> developer. Poland,
                                    Bydgoszcz.
                                </p>
                            </div>

                            {/* Experience Section */}
                            <div className="sp-container relative">
                                <h3 className="sp-title">
                                    experience ({data.experience.length} total)
                                </h3>
                                <div className="sp-content">
                                    <ul className="space-y-2">
                                        {data.experience.map((exp, idx) => (
                                            <li key={idx}>
                                                <Experience
                                                    experience={exp}
                                                    onSelect={() =>
                                                        handleSelectMarkdown(
                                                            "experiences",
                                                            exp.title,
                                                            exp.fileName
                                                        )
                                                    }
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Projects Section */}
                            <div className="sp-container relative">
                                <h3 className="sp-title">
                                    projects ({data.projects.length} total)
                                </h3>
                                <div className="sp-content">
                                    <ul className="space-y-2">
                                        {data.projects.map((project, idx) => (
                                            <li key={idx}>
                                                <Project
                                                    project={project}
                                                    onSelect={() => handleProjectSelect(project)}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Skills Section */}
                            <div className="sp-container relative">
                                <h3 className="sp-title">
                                    skills ({data.skills.length} total)
                                </h3>
                                <div className="sp-content">
                                    <ul className="grid grid-cols-2 gap-2">
                                        {data.skills.map((skill, idx) => (
                                            <li
                                                key={idx}
                                                className={`${
                                                    selectedProject?.skills?.includes(skill.name)
                                                        ? "bg-purple-600"
                                                        : ""
                                                }`}
                                            >
                                                <Skill
                                                    skill={skill}
                                                    onSelect={() =>
                                                        handleSelectMarkdown(
                                                            "skills",
                                                            skill.name,
                                                            skill.fileName
                                                        )
                                                    }
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Content Area - Shows either GitHubStats or Main Content */}
                    <div className="col-span-1 md:col-span-3 h-full">
                        {/* GitHub Stats (shown by default) */}
                        {showGitHubStats && isClient && (
                            <div className="w-full h-full fade-in main-section-container" style={{ height: 'calc(100% - 5px)', overflow: 'visible' }}>
                                <ErrorBoundary
                                  onError={(error) => {
                                    console.error('GitHub Stats error caught by ErrorBoundary:', error);
                                  }}
                                  fallback={
                                    <div className="sp-container h-full overflow-visible">
                                      <div className="p-4 text-center block" style={{ height: 'calc(100% - 30px)', overflow: 'visible' }}>
                                        <div className="bg-red-900/30 border border-red-700 rounded-md p-4 text-red-400 mb-4">
                                          <h4 className="text-lg font-bold mb-2">GitHub Stats Error</h4>
                                          <p>Sorry, we couldn&#39;t load the GitHub stats at this time.</p>
                                        </div>

                                        <div className="bg-[#161b22] p-4 rounded-lg mb-4">
                                          <h4 className="text-white font-medium mb-2">Possible reasons:</h4>
                                          <ul className="text-left text-gray-300 list-disc pl-5 space-y-2">
                                            <li>GitHub API rate limit exceeded (resets after 60 minutes)</li>
                                            <li>Network connectivity issues</li>
                                            <li>GitHub API service disruption</li>
                                          </ul>
                                        </div>

                                        <button 
                                          onClick={() => {
                                            setShowGitHubStats(false);
                                            setShowMain(true);
                                          }}
                                          className="mt-4 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-md"
                                        >
                                          Show Main Content Instead
                                        </button>
                                      </div>
                                      {/* Title rendered last to be on top */}
                                      <h3 className="sp-title">GitHub Stats</h3>

                                      {/* Side elements */}
                                        <div className="absolute top-14 right-0 flex flex-col gap-4 h-full" style={{ width: '40px', marginRight: '-5px' }}>
                                            <Book books={data.books}/>
                                            <SlideOver items={data.inProgress} name="in Progress"/>
                                            <SlideOver items={data.setup} name="Setup"/>
                                        </div>
                                    </div>
                                  }
                                >
                                  <div className="relative h-full w-full">
                                    <GitHubStats 
                                      username="olek1305"
                                      className="h-full pr-[120px] overflow-hidden" /* Add padding to make room for side elements and prevent scrolling */
                                      onClose={() => {
                                        setShowGitHubStats(false);
                                        setShowMain(true);
                                      }}
                                    />

                                    {/* Side elements */}
                                    <div className="absolute top-14 right-0 flex flex-col gap-4 h-full" style={{ width: '40px', marginRight: '-5px' }}>
                                      <Book books={data.books}/>
                                      <SlideOver items={data.inProgress} name="in Progress"/>
                                      <SlideOver items={data.setup} name="Setup"/>
                                    </div>
                                  </div>
                                </ErrorBoundary>
                            </div>
                        )}

                        {/* Main Content */}
                        {showMain && (
                        <div className="sp-container p-6 fade-in h-full main-section-container relative">
                                <h3 className="sp-title">Main</h3>
                                <button
                                    onClick={() => {
                                        setShowMain(false);
                                        setShowGitHubStats(true);
                                    }}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-white z-10"
                                    aria-label="Show GitHub Stats"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                {/* Main content with padding to make room for side elements */}
                                <div className="pr-[120px] h-full overflow-hidden">
                                  {isClient && MdxComponent ? (
                                      <MDXProvider components={components}>
                                          <MdxComponent />
                                      </MDXProvider>
                                  ) : (
                                      <div>Click on an item to load content.</div>
                                  )}
                                  {showDino && <DinoAnimation/>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-end space-x-4 mt-4">
                    <button
                        onClick={(e) => {
                            setShowDino((prev) => !prev);
                            e.currentTarget.blur();
                        }}
                        className="text-purple-400 hover:underline"
                    >
                        {showDino ? "Hide Dino" : "Show Dino"}
                    </button>

                    <a
                        href="/cv/aleksander-zak.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:underline"
                    >
                        Resume
                    </a>

                    <a
                        href="https://github.com/olek1305"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:underline"
                    >
                        GitHub
                    </a>

                    <div className="relative">
                        <button
                            onClick={handleCopyEmail}
                            className="text-purple-400 hover:underline"
                        >
                            Email
                        </button>
                        {showCopiedMessage && (
                            <div
                                className="absolute -top-20 -left-12 bg-gray-900 text-white text-xl px-2 py-1 rounded-md animate-bounce-fade border-white border-2">
                                Copied email!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
