import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Copy, Check, Instagram, Twitter } from 'lucide-react';
import { toPng } from 'html-to-image';

interface Session {
  creatorName: string;
}

const QUESTIONS = [
  {
    id: 1,
    text: "あなたから見たこの人の「雰囲気」は？",
    options: [
      { text: "凛とした", colors: ["#D4DFE6", "#EAEAEA", "#A3B1C6"] },
      { text: "ふんわり", colors: ["#FADADD", "#F5F5DC", "#EAE7E2"] },
      { text: "神秘的", colors: ["#E6E6FA", "#D8BFD8", "#C0C0C0"] }
    ]
  },
  {
    id: 2,
    text: "この人の「内面」を一言で表すと？",
    options: [
      { text: "温かい", colors: ["#FDF5E6", "#FFDAB9", "#F5F5DC"] },
      { text: "冷静", colors: ["#E0E5D8", "#B0C4DE", "#D3D3D3"] },
      { text: "無邪気", colors: ["#FFFACD", "#E0FFFF", "#F0FFF0"] }
    ]
  },
  {
    id: 3,
    text: "この人と過ごす時間はどんな感じ？",
    options: [
      { text: "穏やか", colors: ["#F5F5F0", "#E0E5D8", "#D9D9D2"] },
      { text: "刺激的", colors: ["#FADADD", "#E6E6FA", "#F5F5DC"] },
      { text: "心地よい", colors: ["#D4DFE6", "#FADADD", "#F5F5F0"] }
    ]
  }
];

const PaletteAnswer = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isOwner = searchParams.get('owner') === 'true';

  const [session, setSession] = useState<Session | null>(null);
  const [currentStep, setCurrentStep] = useState(isOwner ? -1 : 0); // -1: Intro/Link Share, 0+: Questions, -2: Result
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentColors, setCurrentColors] = useState(["#F5F5F0", "#EAE7E2", "#D9D9D2"]);
  const [isCopied, setIsCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/palette/${id}`)
        .then(res => res.json())
        .then(data => setSession(data))
        .catch(err => console.error(err));
    }
  }, [id]);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    // Update colors based on the last answer
    const newColors = QUESTIONS[currentStep].options[optionIndex].colors;
    setCurrentColors(newColors);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(-2); // Result
    }
  };

  const copyLink = () => {
    const url = `${window.location.origin}/tools/palette-of-me/${id}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const downloadImage = async () => {
    if (resultRef.current) {
      const dataUrl = await toPng(resultRef.current, { quality: 0.95 });
      const link = document.createElement('a');
      link.download = `palette-${session?.creatorName}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  if (!session) return <div className="min-h-screen flex items-center justify-center font-serif opacity-50">Loading...</div>;

  return (
    <div className="min-h-screen bg-lumi-beige overflow-hidden">
      {/* Background Gradient */}
      <div
        className="fixed inset-0 transition-all duration-[2000ms] ease-out opacity-60"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${currentColors[0]}, transparent 70%),
                       radial-gradient(circle at 70% 20%, ${currentColors[1]}, transparent 70%),
                       radial-gradient(circle at 50% 80%, ${currentColors[2]}, transparent 70%)`,
          filter: 'blur(60px)'
        }}
      />

      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <AnimatePresence mode="wait">
          {/* Owner View: Link Sharing */}
          {currentStep === -1 && (
            <motion.div
              key="owner"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="max-w-md w-full text-center bg-white/30 backdrop-blur-xl border border-white/40 p-12 rounded-[2rem] shadow-sm"
            >
              <h2 className="text-3xl font-serif mb-6 opacity-80">Lumi Link</h2>
              <p className="text-sm opacity-50 mb-12 leading-relaxed">
                リンクをシェアして、<br />友達から見たあなたをカラーパレットに。
              </p>

              <div className="bg-white/60 p-5 rounded-2xl flex items-center gap-4 mb-10 ring-1 ring-black/5">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/tools/palette-of-me/${id}`}
                  className="bg-transparent flex-1 text-xs opacity-50 outline-none font-mono tracking-tighter overflow-hidden text-ellipsis"
                />
                <button onClick={copyLink} className="p-2.5 bg-lumi-beige rounded-xl hover:bg-white transition-all shadow-sm">
                  {isCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="opacity-40" />}
                </button>
              </div>

              <div className="flex flex-col gap-6">
                <button
                  onClick={() => setCurrentStep(0)}
                  className="py-4 px-8 bg-black text-white rounded-full text-[10px] tracking-[0.3em] uppercase hover:bg-black/80 transition-all shadow-lg shadow-black/10"
                >
                  自分で試してみる
                </button>
                <Link
                  to="/"
                  className="text-[10px] tracking-[0.2em] uppercase opacity-30 hover:opacity-60 transition-opacity"
                >
                  Back to Menu
                </Link>
              </div>
            </motion.div>
          )}

          {/* Answering Steps */}
          {currentStep >= 0 && (
            <motion.div
              key={`q-${currentStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-md w-full"
            >
              <span className="text-[10px] uppercase tracking-[0.3em] opacity-30 mb-4 block text-center">
                Question {currentStep + 1} / {QUESTIONS.length}
              </span>
              <h2 className="text-2xl font-serif mb-12 text-center opacity-80 leading-relaxed">
                {session.creatorName}さんの<br />
                {QUESTIONS[currentStep].text}
              </h2>
              <div className="space-y-4">
                {QUESTIONS[currentStep].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className="w-full py-5 px-6 bg-white/30 backdrop-blur-sm border border-white/20 rounded-2xl text-left hover:bg-white/50 transition-all duration-300 font-serif opacity-70 hover:opacity-100"
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Result View */}
          {currentStep === -2 && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-8 py-10"
            >
              {/* 9:16 Result Card */}
              <div
                ref={resultRef}
                className="w-[320px] aspect-story bg-white relative overflow-hidden shadow-2xl rounded-sm"
              >
                {/* Watercolor background again but contained */}
                <div
                  className="absolute inset-0 opacity-80"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${currentColors[0]}, transparent 70%),
                                 radial-gradient(circle at 70% 20%, ${currentColors[1]}, transparent 70%),
                                 radial-gradient(circle at 50% 80%, ${currentColors[2]}, transparent 70%)`,
                    filter: 'blur(40px)'
                  }}
                />

                <div className="relative h-full flex flex-col items-center justify-between py-16 px-8 text-center">
                  <div className="flex justify-between w-full opacity-20 text-[8px] tracking-[0.4em] uppercase">
                    <span>Lumi Palette</span>
                    <span>No. {id?.substring(0, 4).toUpperCase()}</span>
                  </div>

                  <div>
                    <h3 className="text-sm font-serif opacity-40 mb-2 italic">The Palette of</h3>
                    <h2 className="text-4xl font-serif opacity-80 tracking-tighter mb-8">{session.creatorName}</h2>
                    <div className="space-y-2">
                      {answers.map((ans, i) => (
                        <div key={i} className="text-xs font-serif opacity-40 tracking-widest uppercase italic">
                          {QUESTIONS[i].options[ans].text}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="w-full">
                    {/* Space for mention */}
                    <div className="border-t border-black/5 pt-8 mb-4">
                      <div className="text-[10px] uppercase tracking-widest opacity-20 mb-8">Write mention here</div>
                      <div className="h-12 w-full border border-dashed border-black/10 rounded-lg" />
                    </div>
                    <div className="flex justify-between items-end opacity-20 text-[7px] tracking-[0.2em] uppercase">
                      <span>lumi.diag</span>
                      <span className="text-[10px] font-serif lowercase">@{session.creatorName}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-4 max-w-[320px]">
                <button
                  onClick={downloadImage}
                  className="flex items-center gap-2 px-6 py-3 bg-black/80 text-white rounded-full text-xs tracking-widest uppercase hover:bg-black transition-colors"
                >
                  <Download size={14} /> Save Image
                </button>
                <div className="flex gap-2">
                   <button
                    onClick={() => alert('画像を保存してInstagramでシェアしてください')}
                    className="p-3 bg-white/80 rounded-full hover:bg-white transition-colors border border-black/5"
                   >
                    <Instagram size={18} className="opacity-60" />
                  </button>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(session.creatorName + 'さんのカラーパレットを作成しました！')}&url=${encodeURIComponent(window.location.origin)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/80 rounded-full hover:bg-white transition-colors border border-black/5"
                  >
                    <Twitter size={18} className="opacity-60" />
                  </a>
                </div>
              </div>

              <button
                onClick={() => window.location.href = '/'}
                className="text-[10px] uppercase tracking-widest opacity-30 hover:opacity-60 transition-opacity mt-4"
              >
                Create your own palette
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PaletteAnswer;
