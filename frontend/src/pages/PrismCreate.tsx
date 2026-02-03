import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Box } from 'lucide-react';

const PrismCreate = () => {
  const [name, setName] = useState('');
  const [targetCount, setTargetCount] = useState('5');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setLoading(true);
    try {
      const res = await fetch('/api/prism/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, targetCount }),
      });
      const data = await res.json();
      if (data.id) {
        navigate(`/tools/prism-of-me/${data.id}?owner=true`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-lumi-beige relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed -top-24 -left-24 w-96 h-96 bg-lumi-rose/20 rounded-full blur-3xl opacity-50" />
      <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-lumi-sage/20 rounded-full blur-3xl opacity-50" />

      <div className="relative z-10 max-w-md w-full text-center bg-white/40 backdrop-blur-xl p-12 rounded-[3.5rem] shadow-sm border border-white/60">
        <div className="mb-12">
          <Box className="mx-auto mb-6 text-lumi-dark/20" size={40} />
          <h1 className="text-4xl font-serif mb-4 text-lumi-dark/80 font-light tracking-tighter">心のプリズム</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-lumi-dark/30 leading-relaxed mb-8 font-sans font-bold">
            他者視点診断
          </p>
          <p className="text-sm text-lumi-dark/50 leading-relaxed px-4 font-serif italic">
            友達があなたに抱く印象が、<br />一つの「結晶」を紡ぎます。
          </p>
        </div>

        <form onSubmit={handleCreate} className="space-y-12">
          <div className="space-y-8">
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

            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest text-lumi-dark/30">解き放たれる人数を選択</label>
              <div className="flex justify-center gap-6">
                {['5', '10', '20'].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setTargetCount(count)}
                    className={`w-14 h-14 rounded-full border transition-all duration-500 font-serif text-lg flex items-center justify-center ${
                      targetCount === count
                      ? 'bg-lumi-dark text-white border-lumi-dark shadow-xl shadow-lumi-dark/10'
                      : 'bg-white/50 border-lumi-dark/5 text-lumi-dark/40 hover:border-lumi-dark/20'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !name}
            className="group flex flex-nowrap items-center justify-center gap-3 mx-auto py-5 px-10 bg-white border border-white/60 shadow-xl shadow-lumi-dark/5 rounded-full hover:scale-105 active:scale-95 transition-all duration-500 disabled:opacity-30"
          >
            <span
              className="text-[10px] uppercase font-bold text-lumi-dark/60"
              style={{ whiteSpace: 'nowrap', display: 'block' }}
            >
              {loading ? 'Creating...' : '診断をはじめる'}
            </span>
            <ArrowRight size={14} className="text-lumi-dark/30 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-16 pt-8 border-t border-lumi-dark/5">
          <p className="text-[10px] text-lumi-dark/30 mb-4 tracking-widest uppercase">How to Play</p>
          <ul className="text-[10px] text-lumi-dark/40 space-y-2 font-serif italic text-left max-w-[200px] mx-auto">
            <li>1. 自分の名前と目標人数を設定</li>
            <li>2. 発行されたリンクをシェア</li>
            <li>3. 友達があなたへの印象を回答</li>
            <li>4. 目標人数に達すると「結晶」が解禁</li>
          </ul>
        </div>

        <div className="mt-12 opacity-20 text-[9px] tracking-[0.5em] uppercase font-light">
          Lock & Reveal System
        </div>
      </div>
    </div>
  );
};

export default PrismCreate;
