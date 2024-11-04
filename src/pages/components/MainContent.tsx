import { useState, useEffect, Suspense } from 'react';

interface MainContentProps {
  markdownPath?: string;
}

export default function MainContent({ markdownPath = "home" }: MainContentProps) {
  const [MdxComponent, setMdxComponent] = useState<React.FC | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadMdx = async () => {
      try {
        setError(false); // Reset error state before loading
        const path = markdownPath || "home";
        const MdxModule = await import(`../data/markdown/${path}.mdx`);
        setMdxComponent(() => MdxModule.default);
      } catch (error) {
        console.error("Error loading content:", error);
        setError(true); // Set error state to display fallback message
        setMdxComponent(null);
      }
    };
    loadMdx();
  }, [markdownPath]);

  return (
    <div className='m-2'>
      {error ? (
        <div>Error loading content.</div>
      ) : MdxComponent ? (
        <Suspense fallback={<div>Loading...</div>}>
          <MdxComponent />
        </Suspense>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
