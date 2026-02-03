import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const PaletteCreate = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setLoading(true);
    try {
      const res = await fetch('/api/palette/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.id) {
        navigate(`/tools/palette-of-me/${data.id}?owner=true`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-lumi-beige relative overflow-hidden font-sans">
      {/* Background blobs */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="fixed -top-12 -right-12 w-96 h-96 bg-lumi-blue/10 rounded-full blur-3xl opacity-40"
      />
      <motion.div
        animate={{ scale: [1.1, 1, 1.1], x: [0, -20, 0] }}
        transition={{ duration: 18, repeat: Infinity }}
        className="fixed -bottom-12 -left-12 w-96 h-96 bg-lumi-rose/10 rounded-full blur-3xl opacity-40"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 max-w-md w-full text-center bg-white/30 backdrop-blur-2xl p-10 md:p-16 rounded-[4rem] shadow-sm border border-white/80"
      >
        <div className="mb-12">
          <Sparkles className="mx-auto mb-6 text-lumi-dark/30" size={32} />
          <h1 className="text-3xl font-serif mb-4 text-lumi-dark/80 font-light">ワタシの成分パレット</h1>
          <p className="text-sm text-lumi-dark/50 leading-relaxed px-4 font-serif italic">
            友達から見たあなたの色を、<br />
            パレットに閉じ込めましょう。
          </p>
        </div>

        <form onSubmit={handleCreate} className="space-y-12">
          <div className="relative">
            <input
              type="text"
              placeholder="YOUR NAME"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border-b border-lumi-dark/10 py-6 px-2 text-center text-2xl focus:outline-none focus:border-lumi-dark/40 transition-all font-serif placeholder:text-lumi-dark/20 placeholder:font-light text-lumi-dark"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !name}
            className="group flex flex-nowrap items-center justify-center gap-3 mx-auto py-4 px-10 bg-lumi-dark text-white rounded-full shadow-xl shadow-lumi-dark/10 hover:scale-105 active:scale-95 transition-all duration-500 disabled:opacity-40"
          >
            <span
              className="text-[10px] uppercase font-bold"
              style={{ whiteSpace: 'nowrap', display: 'block' }}
            >
              {loading ? 'Creating...' : 'リンクを発行する'}
            </span>
            <ArrowRight size={14} className="opacity-60 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-16 pt-8 border-t border-lumi-dark/5">
          <p className="text-[10px] text-lumi-dark/30 mb-4 tracking-widest uppercase">How to Play</p>
          <ul className="text-[10px] text-lumi-dark/40 space-y-2 font-serif italic">
            <li>1. あなたの名前を入力してリンクを発行</li>
            <li>2. ストーリーでリンクをシェア</li>
            <li>3. 友達があなたの「成分（色）」を回答</li>
            <li>4. リアルタイムにあなたの色が混ざり合います</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default PaletteCreate;
