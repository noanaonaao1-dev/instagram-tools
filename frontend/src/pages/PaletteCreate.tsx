import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

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
        // 通常はクリップボードにコピーしたりするが、ここでは回答画面へ遷移
        navigate(`/tools/palette-of-me/${data.id}?owner=true`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-lumi-beige">
      <div className="max-w-md w-full text-center">
        <div className="mb-12">
          <Sparkles className="mx-auto mb-6 opacity-30" size={32} />
          <h1 className="text-3xl font-serif mb-4 opacity-80">私を構成する成分表</h1>
          <p className="text-sm opacity-50 leading-relaxed">
            友達にあなたの印象を答えてもらい、<br />
            あなただけの色を完成させましょう。
          </p>
        </div>

        <form onSubmit={handleCreate} className="space-y-12">
          <div className="relative">
            <input
              type="text"
              placeholder="YOUR NAME"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border-b border-black/10 py-6 px-2 text-center text-2xl focus:outline-none focus:border-black/30 transition-all font-serif placeholder:opacity-20 placeholder:font-light"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !name}
            className="group flex items-center justify-center gap-4 mx-auto py-4 px-14 bg-black text-white rounded-full hover:scale-105 active:scale-95 transition-all duration-500 disabled:opacity-10"
          >
            <span className="text-xs tracking-[0.3em] uppercase font-light">
              {loading ? 'Creating...' : 'リンクを発行する'}
            </span>
            <ArrowRight size={14} className="opacity-60 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-20 opacity-30 text-[10px] tracking-[0.3em] uppercase">
          Ephemeral & Nuance
        </div>
      </div>
    </div>
  );
};

export default PaletteCreate;
