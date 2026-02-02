import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

interface Tool {
  id: string;
  title: string;
  description: string;
  image: string;
  url: string;
  external: boolean;
  tag: string;
}

const Home = () => {
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    fetch('/api/tools')
      .then(res => res.json())
      .then(data => setTools(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
      <header className="mb-24 text-center">
        <h1 className="text-6xl md:text-8xl font-serif tracking-tighter mb-6 opacity-80 font-light">Lumi</h1>
        <div className="flex items-center justify-center gap-4 opacity-40">
          <div className="h-[1px] w-8 bg-current"></div>
          <p className="text-[10px] uppercase tracking-[0.4em]">Story Diagnostic & Collective</p>
          <div className="h-[1px] w-8 bg-current"></div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {tools.map((tool, index) => (
          <div key={tool.id} className={`group ${index % 2 === 1 ? 'md:mt-12' : ''}`}>
            {tool.external ? (
              <a href={tool.url} target="_blank" rel="noopener noreferrer" className="block">
                <ToolCard tool={tool} />
              </a>
            ) : (
              <Link to={tool.url} className="block">
                <ToolCard tool={tool} />
              </Link>
            )}
          </div>
        ))}
      </div>

      <footer className="mt-32 text-center opacity-40 text-xs tracking-widest uppercase">
        &copy; 2024 Lumi Studio. Minimal & Pure.
      </footer>
    </div>
  );
};

const ToolCard = ({ tool }: { tool: Tool }) => (
  <div className="relative overflow-hidden transition-all duration-700 ease-out group-hover:translate-y-[-8px]">
    <div className="aspect-[4/5] overflow-hidden mb-6 bg-lumi-pale ring-1 ring-black/5">
      <img
        src={tool.image}
        alt={tool.title}
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100"
      />
    </div>
    <div className="flex justify-between items-start">
      <div>
        <span className="text-[10px] uppercase tracking-widest opacity-50 mb-1 block">{tool.tag}</span>
        <h2 className="text-2xl font-serif mb-1 opacity-80">{tool.title}</h2>
        <p className="text-sm opacity-50 leading-relaxed max-w-[240px]">{tool.description}</p>
      </div>
      <div className="pt-6">
        <Sparkles size={16} className="opacity-20 group-hover:opacity-60 transition-opacity" />
      </div>
    </div>
  </div>
);

export default Home;
