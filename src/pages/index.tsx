import React, { HTMLAttributes, ReactNode } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { MDXProvider } from "@mdx-js/react";
import { useState, useEffect } from "react";
import DinoAnimation from "./components/DinoAnimation";
import Experience from "./components/Experience";
import Project from "./components/Project";
import Skill from "./components/Skill";
import Head from "next/head";
import data from "./data/data.json";

const components = {
  h1: (props: HTMLAttributes<HTMLHeadingElement>): JSX.Element => (
    <h1 className="text-purple-400 text-2xl" {...props} />
  ),
  p: (props: HTMLAttributes<HTMLParagraphElement>): JSX.Element => (
    <p className="text-white" {...props} />
  ),
  ul: (props: HTMLAttributes<HTMLUListElement>): JSX.Element => (
    <ul className="text-green-400 list-none" {...props} />
  ),
  strong: (props: HTMLAttributes<HTMLElement>): JSX.Element => (
    <strong className="text-red-400 font-bold" {...props} />
  ),
  a: (props: HTMLAttributes<HTMLAnchorElement>): JSX.Element => (
    <a
      className="text-green-400 hover:bg-gray-700 hover:text-white hover:cursor-pointer"
      {...props}
    />
  ),
  code: ({
    className,
    children,
  }: {
    className?: string;
    children?: ReactNode;
  }): JSX.Element => {
    const language = className?.replace(/language-/, "") || "text";
    return (
      <SyntaxHighlighter
        language={language}
        style={docco}
        customStyle={{
          backgroundColor: "#e5e7eb",
          border: "1px solid #ffffff",
          width: "40%",
        }}
      >
        {children}
      </SyntaxHighlighter>
    );
  },
};

export default function Home() {
  const [MdxComponent, setMdxComponent] = useState<React.FC | null>(null);
  const [showDino, setShowDino] = useState(true);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    setIsClient(true);
    const timer = setTimeout(() => {
      handleSelectMarkdown("home", "home");
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
    navigator.clipboard.writeText(email);
    setShowCopiedMessage(true);
    setTimeout(() => setShowCopiedMessage(false), 2000);
  };

  const handleProjectSelect = (project: { name: string; skills: string[] }) => {
    setSelectedProject(project as Project);
    handleSelectMarkdown("projects", project.name);
  };
  
  type Project = {
    name: string;
    skills: string[];
  };

  type Skill = {
    name: string;
    category: string;
    fileName?: string;
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-300 p-4 scrollbar-fixed">
      <Head>
        <title>Home - Aleksander Żak | PHP Developer</title>
        <meta
          name="description"
          content="Aleksander Żak's portfolio - PHP Developer based in Bydgoszcz, Poland."
        />
      </Head>
      {/* Centered Wrapper */}
      <div className="max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {/* Sidebar */}
          {isClient && (
            <div className="col-span-1 space-y-4 flex flex-col text-center">
              <div
                className="sp-container p-4 rounded cursor-pointer hover:bg-gray-700"
                onClick={() => handleSelectMarkdown("home", "home")}
              >
                <h3 className="sp-title">profile</h3>
                <h2 className="text-lg md:text-xl font-bold text-white">
                  Aleksander Żak
                </h2>
                <p className="text-sm md:text-base">
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

          {/* Main Content */}
          <div className="sp-container col-span-1 md:col-span-3 p-6">
            <h3 className="sp-title">Main</h3>
            {isClient && MdxComponent ? (
              <MDXProvider components={components}>
                <MdxComponent />
              </MDXProvider>
            ) : (
              <div>Click on an item to load content.</div>
            )}
            {showDino && <DinoAnimation />}
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
              <div className="absolute -top-20 -left-12 bg-gray-900 text-white text-xl px-2 py-1 rounded-md animate-bounce-fade border-white border-2">
                Copied email!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
