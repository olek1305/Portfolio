import { useState, useEffect } from "react";
import data from "./data/data.json";
import Experience from "./components/Experience";
import Project from "./components/Project";
import Skill from "./components/Skill";

export default function Home() {
  const [category, setCategory] = useState<string | null>(null);
  const [MdxComponent, setMdxComponent] = useState<React.FC | null>(null);

  const handleSelectMarkdown = async (
    category: string,
    name: string,
    fileName?: string
  ) => {
    setCategory(category);

    const markdownFile =
      category === "home"
        ? `${name.toLowerCase().replace(/\s+/g, "-")}.mdx`
        : fileName ||
          `${category}/${name.toLowerCase().replace(/\s+/g, "-")}.mdx`;

    try {
      const MdxModule = await import(`./data/markdown/${markdownFile}`);
      setMdxComponent(() => MdxModule.default);
    } catch (error) {
      console.error("Markdown file not found:", markdownFile);
      setMdxComponent(null);
    }
  };

  useEffect(() => {
    handleSelectMarkdown("home", "home");
  }, []);

  return (
    <div className="min-h-screen text-gray-300 p-4 sp-body text-base/5 ">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        {/* Sidebar */}
        <div className="col-span-1 space-y-4 flex flex-col text-center">
          <div
            className="sp-container p-4 rounded cursor-pointer"
            onClick={() => handleSelectMarkdown("home", "home")}
          >
            <h3 className="sp-title">profile</h3>
            <h2 className="text-lg md:text-xl font-bold text-white">
              Aleksander Żak
            </h2>
            <p className="text-sm md:text-base">A passionate PHP developer</p>
          </div>

          {/* Experience Section */}
          <div className="sp-container relative">
            <h3 className="sp-title">experience</h3>
            <div className="sp-content">
              <ul className="space-y-2">
                {data.experience.map((exp, idx) => (
                  <Experience
                    key={idx}
                    experience={exp}
                    onSelect={() =>
                      handleSelectMarkdown("experiences", exp.title)
                    }
                  />
                ))}
              </ul>
            </div>
          </div>

          {/* Projects Section */}
          <div className="sp-container relative">
            <h3 className="sp-title">projects</h3>
            <div className="sp-content">
              <ul className="space-y-2">
                {data.projects.map((project, idx) => (
                  <Project
                    key={idx}
                    project={project}
                    onSelect={() =>
                      handleSelectMarkdown("projects", project.name)
                    }
                  />
                ))}
              </ul>
            </div>
          </div>

          {/* Skills Section */}
          <div className="sp-container relative">
            <h3 className="sp-title">skills</h3>
            <div className="sp-content">
              <ul className="grid grid-cols-2 gap-2">
                {data.skills.map((skill, idx) => (
                  <Skill
                    key={idx}
                    skill={skill}
                    onSelect={() =>
                      handleSelectMarkdown("skills", skill.name, skill.fileName)
                    }
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="sp-container col-span-1 md:col-span-3 p-6">
          {MdxComponent ? (
            <MdxComponent />
          ) : (
            <div className="text-center">Click on an item to load content.</div>
          )}
        </div>
      </div>
    </div>
  );
}
