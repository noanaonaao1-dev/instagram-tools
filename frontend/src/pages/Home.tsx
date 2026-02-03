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
    <div className="relative min-h-screen bg-lumi-beige overflow-hidden font-sans text-lumi-dark selection:bg-lumi-rose selection:text-lumi-dark">
      {/* Background blobs - more "fuwafuwa" */}
      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          rotate: [0, 90, 0],
          x: [0, 80, 0],
          y: [0, 50, 0]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="fixed -top-48 -left-48 w-[800px] h-[800px] bg-lumi-rose/30 rounded-full blur-[140px] opacity-40 pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1.3, 1, 1.3],
          rotate: [0, -45, 0],
          x: [0, -100, 0],
          y: [0, -80, 0]
        }}
        transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
        className="fixed -bottom-64 -right-48 w-[900px] h-[900px] bg-lumi-mist/40 rounded-full blur-[160px] opacity-40 pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          x: [0, 150, 0],
          y: [0, -150, 0]
        }}
        transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-1/4 left-1/4 w-[600px] h-[600px] bg-lumi-lavender/30 rounded-full blur-[180px] opacity-30 pointer-events-none"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-32">
        <header className="mb-24 md:mb-40 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-[10px] uppercase tracking-[0.5em] text-lumi-dark/30 mb-8 font-medium">Digital Palette & Diagnostic</div>
            <h1 className="text-8xl md:text-[12rem] font-serif tracking-tighter mb-8 text-lumi-dark font-light italic opacity-90 drop-shadow-sm">Lumi</h1>
            <div className="flex items-center justify-center gap-8 text-lumi-dark/15">
              <span className="h-[0.5px] w-12 bg-current" />
              <span className="text-[9px] md:text-xs uppercase tracking-[1em] font-medium font-sans">Issue No. 01 — Aesthetic Stories</span>
              <span className="h-[0.5px] w-12 bg-current" />
            </div>
          </motion.div>
        </header>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.5 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-8 md:gap-x-12 gap-y-16 md:gap-y-24 mb-48"
        >
          {loading ? (
            <div className="col-span-full py-32 text-center opacity-30 tracking-[0.5em] uppercase text-[9px] animate-pulse">
              Collecting pieces...
            </div>
          ) : error ? (
            <div className="col-span-full py-32 text-center">
              <p className="text-lumi-dark/40 font-serif text-sm italic">{error}</p>
              <button onClick={() => window.location.reload()} className="mt-6 px-8 py-3 bg-white/50 backdrop-blur-md rounded-full text-[10px] tracking-[0.3em] uppercase hover:bg-white/80 transition-all border border-lumi-dark/5">RETRY</button>
            </div>
          ) : tools.length === 0 ? (
            <div className="col-span-full py-32 text-center opacity-30 tracking-[0.5em] uppercase text-[9px]">
              Empty collection.
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

        <section className="mt-48 py-32 bg-white/30 backdrop-blur-xl rounded-[4rem] border border-white/50 shadow-sm">
          <div className="max-w-4xl mx-auto px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-serif mb-24 text-lumi-dark/80 italic font-light tracking-tight">Lumi の楽しみ方</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-20 md:gap-16">
              <div className="space-y-8">
                <div className="w-16 h-16 bg-lumi-rose/40 backdrop-blur-md rounded-full flex items-center justify-center mx-auto shadow-inner text-white font-serif text-xl italic border border-white/40">1</div>
                <h3 className="text-xs font-bold tracking-[0.4em] text-lumi-dark/70 uppercase">診断をつくる</h3>
                <p className="text-xs text-lumi-dark/50 leading-relaxed font-serif px-2">
                  お好みのテーマを選んで、あなたの名前を入力。<br/>自分専用の特別なリンクを発行。
                </p>
              </div>
              <div className="space-y-8">
                <div className="w-16 h-16 bg-lumi-mist/40 backdrop-blur-md rounded-full flex items-center justify-center mx-auto shadow-inner text-white font-serif text-xl italic border border-white/40">2</div>
                <h3 className="text-xs font-bold tracking-[0.4em] text-lumi-dark/70 uppercase">ストーリーでシェア</h3>
                <p className="text-xs text-lumi-dark/50 leading-relaxed font-serif px-2">
                  リンクをインスタのストーリーへ。<br/>友達にあなたの印象を答えてもらいます。
                </p>
              </div>
              <div className="space-y-8">
                <div className="w-16 h-16 bg-lumi-lavender/40 backdrop-blur-md rounded-full flex items-center justify-center mx-auto shadow-inner text-white font-serif text-xl italic border border-white/40">3</div>
                <h3 className="text-xs font-bold tracking-[0.4em] text-lumi-dark/70 uppercase">結果をアンロック</h3>
                <p className="text-xs text-lumi-dark/50 leading-relaxed font-serif px-2">
                  回答が集まると診断結果が公開。<br/>美しい画像として保存して、再び共有。
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-48 text-center opacity-30 text-[9px] tracking-[0.5em] uppercase font-sans">
          &copy; 2024 Lumi &bull; Pure Aesthetic Studio
        </footer>
      </div>
    </div>
  );
};

const ToolCard = ({ tool }: { tool: Tool }) => (
  <div className="relative transition-all duration-700 ease-[0.22, 1, 0.36, 1] group-hover:scale-[1.02]">
    <div className="aspect-[4/5] overflow-hidden mb-6 bg-white/40 backdrop-blur-md rounded-[3rem] shadow-sm ring-1 ring-white/60 group-hover:shadow-xl group-hover:shadow-lumi-rose/10 transition-all duration-700">
      <img
        src={tool.image}
        alt={tool.title}
        className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
      />
    </div>
    <div className="px-4 text-center">
      <span className="text-[7px] uppercase tracking-[0.3em] text-lumi-dark/40 mb-2 block font-medium">{tool.tag}</span>
      <h2 className="text-sm md:text-lg font-serif mb-1.5 text-lumi-dark/90 leading-tight tracking-wide">{tool.title}</h2>
      <p className="text-[9px] md:text-[10px] text-lumi-dark/50 leading-relaxed line-clamp-2 font-serif font-light">{tool.description}</p>
    </div>
  </div>
);

export default Home;
