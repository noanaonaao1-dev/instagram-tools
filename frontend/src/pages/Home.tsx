import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/tools')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch tools');
        return res.json();
      })
      .then(data => setTools(data))
      .catch(err => {
        console.error(err);
        setError('データの取得に失敗しました');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen bg-lumi-beige overflow-hidden">
      {/* Background blobs for a "looser" feel */}
      <div className="fixed -top-24 -left-24 w-96 h-96 bg-lumi-rose/30 rounded-full blur-3xl opacity-50" />
      <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-lumi-sage/30 rounded-full blur-3xl opacity-50" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10 md:py-20">
        <header className="mb-12 md:mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-serif tracking-tighter mb-4 text-lumi-dark font-light italic text-lumi-dark/80">Lumi</h1>
          <div className="flex items-center justify-center gap-4 text-lumi-dark/20">
            <span className="text-[10px] uppercase tracking-[0.5em] font-light font-sans font-bold">Story Collective</span>
          </div>
        </header>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-2 md:gap-x-4 gap-y-6 md:gap-y-10 mb-24">
          {loading ? (
            <div className="col-span-full py-20 text-center opacity-30 tracking-widest uppercase text-[10px]">
              Loading collection...
            </div>
          ) : error ? (
            <div className="col-span-full py-20 text-center text-lumi-dark/40 font-serif">
              {error}
              <button onClick={() => window.location.reload()} className="block mx-auto mt-4 text-[10px] underline tracking-widest">RETRY</button>
            </div>
          ) : tools.length === 0 ? (
            <div className="col-span-full py-20 text-center opacity-30 tracking-widest uppercase text-[10px]">
              No tools available.
            </div>
          ) : tools.map((tool) => (
            <div key={tool.id} className="group">
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

        {/* How to Use Section */}
        <section className="mt-20 py-16 border-t border-lumi-dark/5">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-xl md:text-2xl font-serif mb-12 text-lumi-dark/70 italic">Lumi の楽しみ方</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-lumi-dark/30 font-serif italic">1.</div>
                <h3 className="text-xs font-bold tracking-widest text-lumi-dark/60 uppercase">診断をつくる</h3>
                <p className="text-[10px] text-lumi-dark/40 leading-relaxed font-serif">
                  気になるツールを選んで、あなたの名前を入力。自分だけの専用リンクを発行します。
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-lumi-dark/30 font-serif italic">2.</div>
                <h3 className="text-xs font-bold tracking-widest text-lumi-dark/60 uppercase">ストーリーでシェア</h3>
                <p className="text-[10px] text-lumi-dark/40 leading-relaxed font-serif">
                  リンクをインスタグラムのストーリーでシェア。友達にあなたの印象を答えてもらいましょう。
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-lumi-dark/30 font-serif italic">3.</div>
                <h3 className="text-xs font-bold tracking-widest text-lumi-dark/60 uppercase">結果をReveal</h3>
                <p className="text-[10px] text-lumi-dark/40 leading-relaxed font-serif">
                  回答が集まると診断結果がアンロック！美しい画像として保存して、再びストーリーで共有。
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-24 text-center opacity-20 text-[8px] tracking-widest uppercase font-sans">
          &copy; 2024 Lumi Studio. Minimal & Pure.
        </footer>
      </div>
    </div>
  );
};

const ToolCard = ({ tool }: { tool: Tool }) => (
  <div className="relative transition-all duration-500 ease-out group-hover:translate-y-[-2px]">
    <div className="aspect-square overflow-hidden mb-3 bg-lumi-pale rounded-[1.5rem] md:rounded-[2rem] shadow-sm ring-1 ring-black/[0.02]">
      <img
        src={tool.image}
        alt={tool.title}
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80"
      />
    </div>
    <div className="px-1 text-center">
      <span className="text-[6px] uppercase tracking-[0.2em] text-lumi-dark/30 mb-1 block font-sans font-bold">{tool.tag}</span>
      <h2 className="text-[10px] md:text-sm font-serif mb-0.5 text-lumi-dark/80 leading-tight">{tool.title}</h2>
      <p className="hidden md:block text-[8px] text-lumi-dark/40 leading-relaxed line-clamp-1 font-sans">{tool.description}</p>
    </div>
  </div>
);

export default Home;
