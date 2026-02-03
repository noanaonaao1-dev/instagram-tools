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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tools')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch tools');
        return res.json();
      })
      .then(data => setTools(data))
      .catch(err => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-8 py-16 md:py-24">
      <header className="mb-20 text-center">
        <h1 className="text-5xl md:text-7xl font-serif tracking-tighter mb-6 text-lumi-dark font-light">Lumi</h1>
        <div className="flex items-center justify-center gap-4 text-lumi-dark/40">
          <div className="h-[1px] w-8 bg-current"></div>
          <p className="text-[10px] uppercase tracking-[0.4em]">Story Diagnostic & Collective</p>
          <div className="h-[1px] w-8 bg-current"></div>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {loading ? (
          <div className="col-span-full py-20 text-center opacity-30 tracking-widest uppercase text-xs">
            Loading collection...
          </div>
        ) : tools.length === 0 ? (
          <div className="col-span-full py-20 text-center opacity-30 tracking-widest uppercase text-xs">
            No tools available.
          </div>
        ) : tools.map((tool, index) => (
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
  <div className="relative transition-all duration-700 ease-out group-hover:translate-y-[-4px]">
    <div className="aspect-square overflow-hidden mb-5 bg-lumi-pale rounded-lumi ring-1 ring-black/[0.05]">
      <img
        src={tool.image}
        alt={tool.title}
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
      />
    </div>
    <div className="flex justify-between items-start px-2">
      <div>
        <span className="text-[8px] uppercase tracking-[0.2em] text-lumi-dark/40 mb-1.5 block">{tool.tag}</span>
        <h2 className="text-lg md:text-xl font-serif mb-1.5 text-lumi-dark leading-tight">{tool.title}</h2>
        <p className="text-[11px] text-lumi-dark/60 leading-relaxed line-clamp-2">{tool.description}</p>
      </div>
      <div className="pt-6">
        <Sparkles size={16} className="text-lumi-dark/20 group-hover:text-lumi-dark/60 transition-colors" />
      </div>
    </div>
  </div>
);

export default Home;
