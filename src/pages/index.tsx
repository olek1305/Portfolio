import { useState } from "react";
import data from "./data/data.json";
import Experience from "./components/Experience";
import Project from "./components/Project";
import Skill from "./components/Skill";
import MainContent from "./components/MainContent";

export default function Home() {
  const [markdownPath, setMarkdownPath] = useState<string>("");

  const handleSelectMarkdown = (path: string) => {
    setMarkdownPath(path);
  };

  return (
    <div className="h-screen bg-gray-900 text-gray-300 p-4 sp-body text-sm lowercase">
      <div className="grid grid-cols-1 md:grid-cols-3 h-full gap-2">
        {/* Sidebar */}
        <div className="col-span-1 space-y-4 h-full flex flex-col">
          <div className="bg-gray-800 p-4 rounded sp-div">
            <h2 className="text-lg md:text-xl font-bold text-white">Aleksander Żak</h2>
            <p className="text-sm md:text-base">a passionate developer php</p>
          </div>

          <div className="sp-container relative max-h-[calc(100vh/3)] md:max-h-[200px]">
            <h3 className="sp-title">experience</h3>
            <div className="sp-content overflow-y-auto">
              <ul className="space-y-1">
                {data.experience.map((exp, idx) => (
                  <Experience
                    key={idx}
                    experience={exp}
                    onSelect={() => setMarkdownPath(exp.title.replace(/\s+/g, '-').toLowerCase())}
                  />
                ))}
              </ul>
            </div>
          </div>

          <div className="sp-container relative max-h-[calc(100vh/3)] md:max-h-[200px]">
            <h3 className="sp-title">projects</h3>
            <div className="sp-content overflow-y-auto">
              <ul className="space-y-1">
                {data.projects.map((project, idx) => (
                  <Project
                    key={idx}
                    project={project}
                    onSelect={() => setMarkdownPath(project.name.replace(/\s+/g, '-').toLowerCase())}
                  />
                ))}
              </ul>
            </div>
          </div>

          <div className="sp-container relative max-h-[calc(100vh/3)] md:max-h-[200px]">
            <h3 className="sp-title">skills</h3>
            <div className="sp-content overflow-y-auto">
              <ul className="grid grid-cols-2 gap-2">
                {data.skills.map((skill, idx) => (
                  <Skill
                    key={idx}
                    skill={skill}
                    onSelect={() => setMarkdownPath(skill.name.replace(/\s+/g, '-').toLowerCase())}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-1 md:col-span-2 bg-gray-800 p-6 rounded space-y-4 h-full sp-border sp-div">
          <MainContent markdownPath={markdownPath} />
        </div>
      </div>
    </div>
  );
}
