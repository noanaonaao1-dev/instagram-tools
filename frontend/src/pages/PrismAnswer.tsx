import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Copy, Check, Instagram, Twitter, Box, Send } from 'lucide-react';
import { toPng } from 'html-to-image';
import * as THREE from 'three';

interface Question {
  id: number;
  text: string;
}

interface Response {
  scores: Record<string, number>;
  message: string;
}

interface Session {
  creatorName: string;
  targetCount: number;
  questions: Question[];
  responses: Response[];
}

const PrismAnswer = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isOwner = searchParams.get('owner') === 'true';

  const [session, setSession] = useState<Session | null>(null);
  const [currentStep, setCurrentStep] = useState(isOwner ? -1 : 0); // -1: Link, 0-9: Quiz, 10: Message, 11: Result
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [message, setMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      const answered = localStorage.getItem(`prism_answered_${id}`);
      if (answered && !isOwner) {
        setCurrentStep(11);
      }

      fetch(`/api/prism/${id}`)
        .then(res => res.json())
        .then(data => setSession(data))
        .catch(err => console.error(err));
    }
  }, [id, isOwner]);

  const handleAnswer = (score: number) => {
    if (!session) return;
    const qid = session.questions[currentStep].id;
    setAnswers({ ...answers, [qid]: score });
    setCurrentStep(currentStep + 1);
  };

  const submitResponse = async () => {
    setIsSubmitting(true);
    try {
      await fetch(`/api/prism/${id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, message }),
      });
      localStorage.setItem(`prism_answered_${id}`, 'true');
      setCurrentStep(11);
      // Refresh session data to get latest progress
      const res = await fetch(`/api/prism/${id}`);
      const data = await res.json();
      setSession(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyLink = () => {
    const url = `${window.location.origin}/tools/prism-of-me/${id}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const downloadImage = async () => {
    if (resultRef.current) {
      const dataUrl = await toPng(resultRef.current, { quality: 0.95 });
      const link = document.createElement('a');
      link.download = `prism-${session?.creatorName}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  // Aggregated Scores Calculation
  const getAggregatedScores = () => {
    if (!session || session.responses.length === 0) return { static: 0, warm: 0, sharp: 0, elegant: 0, vivid: 0 };
    const totals = session.responses.reduce((acc, r) => ({
      static: acc.static + r.scores.static,
      warm: acc.warm + r.scores.warm,
      sharp: acc.sharp + r.scores.sharp,
      elegant: acc.elegant + r.scores.elegant,
      vivid: acc.vivid + r.scores.vivid
    }), { static: 0, warm: 0, sharp: 0, elegant: 0, vivid: 0 });

    const count = session.responses.length;
    return {
      static: totals.static / count,
      warm: totals.warm / count,
      sharp: totals.sharp / count,
      elegant: totals.elegant / count,
      vivid: totals.vivid / count
    };
  };

  const getTwoName = (scores: Record<string, number>) => {
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const top = sorted[0][0];
    const second = sorted[1][0];

    const titles: Record<string, string> = {
      static: '静寂', warm: '温もり', sharp: '鋭気', elegant: '優雅', vivid: '色彩'
    };
    const combined: Record<string, string> = {
      'static-warm': '朝靄に溶ける抱擁',
      'static-sharp': '研ぎ澄まされた沈黙',
      'static-elegant': '月下に咲く一輪',
      'static-vivid': '夢現の境界線',
      'warm-static': '陽だまりの追憶',
      'warm-sharp': '灯火の意志',
      'warm-elegant': '春風の舞',
      'warm-vivid': '咲き誇る鼓動',
      'sharp-static': '氷原の眼差し',
      'sharp-warm': '黄金の決断',
      'sharp-elegant': '孤高の旋律',
      'sharp-vivid': '閃光の記憶',
      'elegant-static': '古都の溜息',
      'elegant-warm': '絹の温もり',
      'elegant-sharp': '麗しき刃',
      'elegant-vivid': '万華鏡の夢',
      'vivid-static': '極彩色の凪',
      'vivid-warm': '祭囃子の残り香',
      'vivid-sharp': '雷鳴の余韻',
      'vivid-elegant': '百花繚乱の夜',
    };

    return combined[`${top}-${second}`] || `${titles[top]}の結晶`;
  };

  // Three.js Visualization logic
  useEffect(() => {
    if (currentStep === 11 && session && canvasRef.current) {
      const scores = getAggregatedScores();
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
      renderer.setSize(300, 300);
      renderer.setPixelRatio(window.devicePixelRatio);
      canvasRef.current.appendChild(renderer.domElement);

      const geometry = new THREE.OctahedronGeometry(1, 0);

      // Calculate color based on top attribute
      const colors: Record<string, number> = {
        static: 0xA3B1C6, warm: 0xD8B4A0, sharp: 0x93A8AC, elegant: 0xB1A296, vivid: 0xD7C0D0
      };
      const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
      const primaryColor = colors[sorted[0][0]] || 0xffffff;

      const material = new THREE.MeshPhysicalMaterial({
        color: primaryColor,
        metalness: 0.1,
        roughness: 0.2,
        transmission: 0.6,
        thickness: 0.5,
        transparent: true,
        opacity: 0.8,
        flatShading: true,
      });
      const prism = new THREE.Mesh(geometry, material);
      scene.add(prism);

      const light = new THREE.PointLight(0xffffff, 1);
      light.position.set(5, 5, 5);
      scene.add(light);
      scene.add(new THREE.AmbientLight(0xffffff, 0.5));

      camera.position.z = 2.2;

      const animate = () => {
        requestAnimationFrame(animate);
        prism.rotation.x += 0.005;
        prism.rotation.y += 0.01;
        // Scale based on scores intensity
        const scale = 0.8 + (Math.abs(sorted[0][1]) / 50);
        prism.scale.set(scale, scale, scale);
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        renderer.dispose();
        if (canvasRef.current) {
          canvasRef.current.innerHTML = '';
        }
      };
    }
  }, [currentStep, session]);

  if (!session) return <div className="min-h-screen flex items-center justify-center font-serif opacity-30 tracking-widest">Loading...</div>;

  const scores = getAggregatedScores();
  const twoName = getTwoName(scores);
  const progress = session.responses.length / session.targetCount;
  const isRevealed = progress >= 1;
  const blurValue = Math.max(0, 20 * (1 - progress));

  return (
    <div className="min-h-screen bg-[#F8F8F4] flex items-center justify-center px-6 py-12">
      <AnimatePresence mode="wait">
        {currentStep === -1 && (
           <motion.div
            key="link"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
            className="max-w-md w-full text-center bg-white p-12 rounded-[2.5rem] shadow-sm border border-black/5"
           >
             <Box className="mx-auto mb-8 opacity-10" size={48} />
             <h2 className="text-2xl font-serif mb-6 opacity-80">結晶の核が生成されました</h2>
             <p className="text-sm opacity-50 mb-10 leading-relaxed font-serif">
               リンクをシェアして、友達にあなたの印象を答えてもらいましょう。<br />
               {session.targetCount}人に達すると、結晶が完成します。
             </p>
             <div className="bg-[#F8F8F4] p-4 rounded-2xl flex items-center gap-3 mb-10 border border-black/5">
               <input readOnly value={`${window.location.origin}/tools/prism-of-me/${id}`} className="bg-transparent flex-1 text-xs opacity-40 outline-none font-mono" />
               <button onClick={copyLink} className="p-2.5 bg-white rounded-xl shadow-sm">
                 {isCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="opacity-30" />}
               </button>
             </div>
             <button onClick={() => setCurrentStep(0)} className="w-full py-4 bg-black text-white rounded-full text-[10px] tracking-[0.3em] uppercase">回答を開始する</button>
           </motion.div>
        )}

        {currentStep >= 0 && currentStep <= 9 && (
          <motion.div key={`q-${currentStep}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-md w-full">
            <div className="text-center mb-12">
              <span className="text-[10px] uppercase tracking-[0.4em] opacity-30 mb-2 block">Part {currentStep + 1} / 10</span>
              <h2 className="text-xl font-serif opacity-70 leading-relaxed px-4 h-20 flex items-center justify-center">
                {session.questions[currentStep].text}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                { label: "全くそう思わない", score: 1 },
                { label: "あまり思わない", score: 2 },
                { label: "どちらともいえない", score: 3 },
                { label: "少しそう思う", score: 4 },
                { label: "強くそう思う", score: 5 },
              ].map((opt) => (
                <button
                  key={opt.score}
                  onClick={() => handleAnswer(opt.score)}
                  className="w-full py-4 px-6 bg-white border border-black/5 rounded-2xl text-sm font-serif opacity-60 hover:opacity-100 hover:border-black/20 transition-all text-center"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {currentStep === 10 && (
          <motion.div key="message" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full text-center">
            <h2 className="text-2xl font-serif mb-6 opacity-80">一言メッセージ</h2>
            <p className="text-xs opacity-40 mb-10 font-serif">{session.creatorName}さんへの印象を一言添えてください。</p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="例：いつも落ち着いていて素敵です。"
              className="w-full h-32 bg-white border border-black/5 rounded-[2rem] p-6 text-sm font-serif focus:outline-none focus:border-black/20 transition-all mb-10 resize-none"
            />
            <button
              onClick={submitResponse}
              disabled={isSubmitting}
              className="group w-full py-5 bg-black text-white rounded-full flex items-center justify-center gap-3 disabled:opacity-30"
            >
              <span className="text-[10px] tracking-[0.3em] uppercase">{isSubmitting ? 'Sending...' : '結晶を送る'}</span>
              <Send size={14} className="opacity-60 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </motion.div>
        )}

        {currentStep === 11 && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-8 py-10 w-full">
            {/* Lock & Reveal Header */}
            {!isRevealed && (
              <div className="text-center mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-[10px] uppercase tracking-[0.5em] opacity-30">Lock & Reveal</span>
                </div>
                <div className="text-2xl font-serif opacity-70 mb-1">
                  {session.responses.length} / {session.targetCount}
                </div>
                <div className="w-48 h-[2px] bg-black/5 mx-auto overflow-hidden rounded-full">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${progress * 100}%` }}
                    className="h-full bg-black/40"
                  />
                </div>
              </div>
            )}

            {/* 9:16 Result Card */}
            <div ref={resultRef} className="w-[320px] aspect-story bg-white relative overflow-hidden shadow-2xl rounded-sm">
               <div className="absolute inset-0 bg-[#FBFBFA]" />

               <div className="relative h-full flex flex-col items-center justify-between py-16 px-8 text-center">
                  <div className="flex justify-between w-full opacity-20 text-[7px] tracking-[0.4em] uppercase">
                    <span>Prism Report</span>
                    <span>{isRevealed ? 'Unlocked' : 'Locked'}</span>
                  </div>

                  <div className={`transition-all duration-1000 ${!isRevealed ? 'grayscale' : ''}`} style={{ filter: `blur(${blurValue}px)` }}>
                    <div ref={canvasRef} className="w-[240px] h-[240px] flex items-center justify-center" />

                    <div className="mt-8">
                      <h3 className="text-[9px] font-serif opacity-30 mb-2 italic">The prism of</h3>
                      <h2 className="text-3xl font-serif opacity-80 tracking-tighter mb-4">{session.creatorName}</h2>
                      <div className="inline-block px-4 py-1.5 border border-black/5 rounded-full text-[10px] font-serif opacity-40 tracking-widest italic">
                        {isRevealed ? twoName : '？？？'}
                      </div>
                    </div>

                    {isRevealed && (
                      <div className="mt-10 flex justify-center">
                        <RadarChart scores={scores} />
                      </div>
                    )}
                  </div>

                  <div className="w-full flex-1 flex flex-col justify-end">
                    {isRevealed ? (
                      <div className="space-y-4 mb-8 text-left">
                        <div className="text-[8px] uppercase tracking-widest opacity-20 border-b border-black/5 pb-2">Friend Messages</div>
                        <div className="max-h-24 overflow-hidden opacity-40 text-[9px] font-serif leading-relaxed italic space-y-2">
                          {session.responses.slice(0, 3).map((r, i) => (
                            <p key={i}>"{r.message}"</p>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="py-8 opacity-20 text-[9px] font-serif italic mb-auto">
                        結晶が完成すると、<br />友達からのメッセージが読めるようになります。
                      </div>
                    )}

                    {/* Mention Space */}
                    <div className="mb-10 text-center">
                      <div className="text-[7px] tracking-[0.3em] opacity-10 mb-2 uppercase">Mention friends to reveal your prism</div>
                      <div className="h-14 border border-dashed border-black/5 rounded-lg flex items-center justify-center">
                        <span className="text-[8px] opacity-10 font-serif italic">@mention_space</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-end opacity-20 text-[6px] tracking-[0.2em] uppercase pt-4 border-t border-black/5">
                      <span>lumi.prism</span>
                      <span className="text-[9px] font-serif lowercase">@{session.creatorName}</span>
                    </div>
                  </div>
               </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center gap-6">
              {isRevealed && (
                <button onClick={downloadImage} className="flex items-center gap-3 px-10 py-4 bg-black text-white rounded-full text-[10px] tracking-[0.3em] uppercase shadow-xl shadow-black/10">
                  <Download size={14} /> Report を保存
                </button>
              )}

              <div className="flex gap-4">
                <button onClick={copyLink} className="p-4 bg-white rounded-full border border-black/5 shadow-sm">
                  {isCopied ? <Check size={18} className="text-green-500" /> : <Instagram size={18} className="opacity-40" />}
                </button>
                <button className="p-4 bg-white rounded-full border border-black/5 shadow-sm">
                  <Twitter size={18} className="opacity-40" />
                </button>
              </div>

              <Link to="/" className="text-[10px] uppercase tracking-[0.3em] opacity-20 hover:opacity-50 transition-all mt-4">
                Create your own prism
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const RadarChart = ({ scores }: { scores: Record<string, number> }) => {
  const size = 100;
  const center = size / 2;
  const radius = 40;
  const attributes = ['static', 'warm', 'sharp', 'elegant', 'vivid'];

  const points = attributes.map((attr, i) => {
    const angle = (Math.PI * 2 * i) / attributes.length - Math.PI / 2;
    // Normalize score (-20 to 20 range assumed for extreme cases, but let's use 10 for visibility)
    const val = Math.min(Math.max((scores[attr] || 0) + 10, 2), 20) / 20;
    const x = center + radius * val * Math.cos(angle);
    const y = center + radius * val * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={size} height={size} className="opacity-40">
      <polygon points={points} fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="0.5" />
      {attributes.map((_, i) => {
        const angle = (Math.PI * 2 * i) / attributes.length - Math.PI / 2;
        return (
          <line
            key={i}
            x1={center} y1={center}
            x2={center + radius * Math.cos(angle)} y2={center + radius * Math.sin(angle)}
            stroke="currentColor" strokeWidth="0.2" strokeDasharray="1,1"
          />
        );
      })}
    </svg>
  );
};

export default PrismAnswer;
