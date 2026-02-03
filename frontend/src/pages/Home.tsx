import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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
    <div className="relative min-h-screen bg-lumi-beige overflow-hidden font-sans text-lumi-dark">
      {/* Background blobs for a "looser" feel */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="fixed -top-24 -left-24 w-[500px] h-[500px] bg-lumi-rose/20 rounded-full blur-[100px] opacity-60"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -40, 0],
          y: [0, -60, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="fixed -bottom-48 -right-24 w-[600px] h-[600px] bg-lumi-sage/20 rounded-full blur-[120px] opacity-60"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 100, 0],
          y: [0, -100, 0]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-lumi-blue/10 rounded-full blur-[150px] opacity-40"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-24">
        <header className="mb-20 md:mb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <h1 className="text-7xl md:text-9xl font-serif tracking-tighter mb-6 text-lumi-dark font-light italic opacity-80">Lumi</h1>
            <div className="flex items-center justify-center gap-6 text-lumi-dark/20">
              <span className="h-[1px] w-8 bg-current" />
              <span className="text-[10px] md:text-xs uppercase tracking-[0.8em] font-light font-sans font-bold">Story Collective</span>
              <span className="h-[1px] w-8 bg-current" />
            </div>
          </motion.div>
        </header>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-3 md:gap-x-6 gap-y-10 md:gap-y-16 mb-32"
        >
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
        </motion.div>

        <section className="mt-32 py-24 border-t border-lumi-dark/5">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-serif mb-20 text-lumi-dark/70 italic">Lumi の楽しみ方</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
              <div className="space-y-6">
                <div className="w-14 h-14 bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto shadow-sm text-lumi-dark/30 font-serif text-lg italic border border-white">1.</div>
                <h3 className="text-[10px] font-bold tracking-[0.3em] text-lumi-dark/60 uppercase">診断をつくる</h3>
                <p className="text-[10px] md:text-[11px] text-lumi-dark/40 leading-relaxed font-serif px-4">
                  気になるツールを選んで、あなたの名前を入力。自分だけの専用リンクを発行します。
                </p>
              </div>
              <div className="space-y-6">
                <div className="w-14 h-14 bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto shadow-sm text-lumi-dark/30 font-serif text-lg italic border border-white">2.</div>
                <h3 className="text-[10px] font-bold tracking-[0.3em] text-lumi-dark/60 uppercase">ストーリーでシェア</h3>
                <p className="text-[10px] md:text-[11px] text-lumi-dark/40 leading-relaxed font-serif px-4">
                  リンクをインスタグラムのストーリーでシェア。友達にあなたの印象を答えてもらいましょう。
                </p>
              </div>
              <div className="space-y-6">
                <div className="w-14 h-14 bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto shadow-sm text-lumi-dark/30 font-serif text-lg italic border border-white">3.</div>
                <h3 className="text-[10px] font-bold tracking-[0.3em] text-lumi-dark/60 uppercase">結果をアンロック</h3>
                <p className="text-[10px] md:text-[11px] text-lumi-dark/40 leading-relaxed font-serif px-4">
                  回答が集まると診断結果がオープン！美しい画像として保存して、再びストーリーで共有。
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
