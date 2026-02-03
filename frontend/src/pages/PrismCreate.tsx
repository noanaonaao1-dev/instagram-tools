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
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#F8F8F4]">
      <div className="max-w-md w-full text-center">
        <div className="mb-12">
          <Box className="mx-auto mb-6 opacity-20" size={40} />
          <h1 className="text-4xl font-serif mb-4 opacity-80 font-light tracking-tighter text-gray-700">Prism of Me</h1>
          <p className="text-[11px] uppercase tracking-[0.3em] opacity-40 leading-relaxed mb-8">
            先着解放型・他者視点診断
          </p>
          <p className="text-sm opacity-50 leading-relaxed px-4 font-serif">
            友達があなたに抱く印象が、一つの「結晶」を紡ぎます。<br />
            設定した人数に達すると、あなたの本当の輝きが明らかに。
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
                className="w-full bg-transparent border-b border-black/10 py-6 px-2 text-center text-2xl focus:outline-none focus:border-black/30 transition-all font-serif placeholder:opacity-20 placeholder:font-light"
                required
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest opacity-30">解き放たれる人数を選択</label>
              <div className="flex justify-center gap-6">
                {['5', '10', '20'].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setTargetCount(count)}
                    className={`w-14 h-14 rounded-full border transition-all duration-500 font-serif text-lg flex items-center justify-center ${
                      targetCount === count
                      ? 'bg-black text-white border-black shadow-lg shadow-black/10'
                      : 'border-black/5 text-black/40 hover:border-black/20'
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
            className="group flex items-center justify-center gap-4 mx-auto py-5 px-16 bg-white border border-black/5 shadow-sm rounded-full hover:scale-105 active:scale-95 transition-all duration-500 disabled:opacity-30"
          >
            <span className="text-xs tracking-[0.3em] uppercase font-light text-gray-600">
              {loading ? 'Creating...' : '結晶の核を生成する'}
            </span>
            <ArrowRight size={14} className="opacity-40 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-24 opacity-20 text-[9px] tracking-[0.5em] uppercase font-light">
          Lock & Reveal System
        </div>
      </div>
    </div>
  );
};

export default PrismCreate;
