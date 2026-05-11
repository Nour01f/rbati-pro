'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// 1. WORKOUT PLAN COMPLETO (Spostato all'inizio per evitare errori di inizializzazione)
const WORKOUT_PLAN = {
  'Lunedì': { target: 'LEG DOMINATION', icon: '01', exercises: [
    { name: 'Leg Press 45°', img: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=800', guide: 'Focus talloni.' },
    { name: 'Leg Extension', img: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=800', guide: 'Peak contraction 1s.' },
    { name: 'Leg Curl', img: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=800', guide: 'Controlla il ritorno.' }
  ]},
  'Martedì': { target: 'CHEST ELITE', icon: '02', exercises: [
    { name: 'Chest Press', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800', guide: 'Scapole incollate.' },
    { name: 'Pec Deck', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800', guide: 'Senti la contrazione al centro.' },
    { name: 'Pushdown Tricipiti', img: 'https://images.unsplash.com/photo-1581009146145-b5ef03a7403f?q=80&w=800', guide: 'Gomiti fermi ai fianchi.' }
  ]},
  'Mercoledì': { target: 'BACK & BICEPS', icon: '03', exercises: [
    { name: 'Lat Machine', img: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=800', guide: 'Tira con i gomiti.' },
    { name: 'Pulley Basso', img: 'https://images.unsplash.com/photo-1596357399117-572046ca4bb8?q=80&w=800', guide: 'Schiena dritta, tira all ombelico.' },
    { name: 'Curl Bicipiti', img: 'https://images.unsplash.com/photo-1581009146145-b5ef03a7403f?q=80&w=800', guide: 'No dondolii col corpo.' }
  ]},
  'Giovedì': { target: 'REST & CARDIO', icon: '04', exercises: [
    { name: 'Treadmill Inclinato', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800', guide: 'Pendenza 10%, velocità 5.5.' }
  ]},
  'Venerdì': { target: 'SHOULDER POWER', icon: '05', exercises: [
    { name: 'Shoulder Press', img: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800', guide: 'Spinta verticale esplosiva.' },
    { name: 'Alzate Laterali', img: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800', guide: 'Mignolo verso l alto.' }
  ]},
  'Sabato': { target: 'FULL BODY ELITE', icon: '06', exercises: [
    { name: 'Squat', img: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800', guide: 'Talloni incollati, scendi profondo.' },
    { name: 'Panca Piana', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800', guide: 'Arco lombare accennato.' }
  ]},
  'Domenica': { target: 'RECOVERY', icon: '07', exercises: [] }
};

export default function RbatiFitApp() {
  const [view, setView] = useState('splash');
  const [selectedDay, setSelectedDay] = useState('Lunedì');
  const [selectedEx, setSelectedEx] = useState(null);
  const [logs, setLogs] = useState({});
  const [bodyStats, setBodyStats] = useState([]);
  const [completedExercises, setCompletedExercises] = useState({});

  // Input States gestiti correttamente (No document.getElementById)
  const [kg, setKg] = useState('');
  const [reps, setReps] = useState('');
  const [note, setNote] = useState('');
  
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const sndSuccess = useRef(null);
  const sndPR = useRef(null);

  useEffect(() => {
    if (!document.querySelector('meta[name="viewport"]')) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover';
      document.head.appendChild(meta);
    }
    const savedLogs = localStorage.getItem('rbati_v_elite_logs');
    const savedStats = localStorage.getItem('rbati_v_elite_stats');
    if (savedLogs) setLogs(JSON.parse(savedLogs));
    if (savedStats) setBodyStats(JSON.parse(savedStats));

    sndSuccess.current = new Audio('/success.mp3');
    sndPR.current = new Audio('/pr.mp3');
  }, []);

  // Auto-save globale
  useEffect(() => { localStorage.setItem('rbati_v_elite_logs', JSON.stringify(logs)); }, [logs]);
  useEffect(() => { localStorage.setItem('rbati_v_elite_stats', JSON.stringify(bodyStats)); }, [bodyStats]);

  useEffect(() => {
    let interval = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && isTimerActive) {
      setIsTimerActive(false);
      if (window.navigator.vibrate) window.navigator.vibrate([400, 100, 400]);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  // Calcolo Summary Sessione
  const sessionSummary = useMemo(() => {
    const dayEx = WORKOUT_PLAN[selectedDay]?.exercises || [];
    let vol = 0, sets = 0, prs = 0;
    dayEx.forEach(ex => {
      const h = logs[ex.name] || [];
      h.forEach(s => { vol += s.vol; sets++; if (s.isPR) prs++; });
    });
    return { vol, sets, prs };
  }, [logs, selectedDay]);

  const saveSet = () => {
    if (!kg || !reps) return;
    const w = parseFloat(kg);
    const r = parseInt(reps);
    const history = logs[selectedEx.name] || [];
    const pr = history.length > 0 ? Math.max(...history.map(h => h.weight)) : 0;
    const isPR = w > pr && pr > 0;

    const newSet = {
      id: Date.now(),
      date: new Date().toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' }),
      weight: w, reps: r, vol: w * r, note, isPR
    };

    setLogs(prev => ({ ...prev, [selectedEx.name]: [...(prev[selectedEx.name] || []), newSet] }));
    setCompletedExercises(prev => ({ ...prev, [selectedEx.name]: true }));
    setKg(''); setReps(''); setNote('');
    setTimer(120); setIsTimerActive(true);
    isPR ? sndPR.current?.play() : sndSuccess.current?.play();
  };

  const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-black/90 backdrop-blur-2xl border-t border-white/5 flex justify-around items-center z-50">
      {[ {v: 'splash', i: '🏠'}, {v: 'days', i: '💪'}, {v: 'progress', i: '📈'} ].map(btn => (
        <button key={btn.v} onPointerDown={() => setView(btn.v)} className={`text-2xl transition-all ${view === btn.v ? 'text-[#FF6600] scale-110' : 'text-zinc-600'}`}>{btn.i}</button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden selection:bg-[#FF6600]/30">
      <AnimatePresence mode="wait">
        {view === 'splash' && (
          <motion.div key="splash" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="min-h-screen flex flex-col items-center justify-center p-10 text-center" style={{ background: 'radial-gradient(circle at top, rgba(255,102,0,0.2), black 70%)' }}>
            <p className="text-[#FF6600] font-black tracking-[12px] mb-4 uppercase text-[10px]">Elite Stealth</p>
            <h1 className="text-8xl font-black italic mb-12 tracking-tighter">RBATI<br/><span className="text-[#FF6600]">PRO</span></h1>
            <button onPointerDown={() => setView('days')} className="bg-[#FF6600] text-black px-16 py-6 rounded-[2.5rem] font-black text-2xl uppercase active:scale-95 transition-all shadow-[0_0_50px_rgba(255,102,0,0.3)]">Inizia Sessione</button>
          </motion.div>
        )}

        {view === 'days' && (
          <motion.div key="days" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="p-6 pb-32">
            <h2 className="text-6xl font-black italic tracking-tighter leading-none mb-10">{selectedDay.toUpperCase()}<br/><span className="text-[#FF6600] text-3xl">{WORKOUT_PLAN[selectedDay]?.target}</span></h2>
            
            <div className="flex gap-2 mb-8 overflow-x-auto pb-4 no-scrollbar">
              {Object.keys(WORKOUT_PLAN).map(day => (
                <button key={day} onPointerDown={() => setSelectedDay(day)} className={`px-6 py-3 rounded-full font-black text-xs uppercase border transition-all whitespace-nowrap ${selectedDay === day ? 'bg-[#FF6600] text-black border-[#FF6600]' : 'bg-white/5 text-zinc-500 border-white/5'}`}>{day}</button>
              ))}
            </div>

            <div className="space-y-4 mb-10">
              {WORKOUT_PLAN[selectedDay].exercises.map(ex => (
                <div key={ex.name} onPointerDown={() => { setSelectedEx(ex); setView('log'); }} className={`p-7 rounded-[2rem] border transition-all flex justify-between items-center ${completedExercises[ex.name] ? 'bg-[#FF6600]/10 border-[#FF6600]/30' : 'bg-white/5 border-white/10'}`}>
                  <h3 className="text-xl font-black italic uppercase">{ex.name}</h3>
                  {completedExercises[ex.name] ? <span className="text-[#FF6600] font-black">✓</span> : <span className="text-zinc-800">→</span>}
                </div>
              ))}
              {WORKOUT_PLAN[selectedDay].exercises.length === 0 && <p className="text-center py-10 text-zinc-600 font-black italic uppercase tracking-widest">Rest Day 🔋</p>}
            </div>

            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
               <p className="text-zinc-600 font-black text-[9px] uppercase mb-4 tracking-widest italic">Session Summary</p>
               <div className="grid grid-cols-3 gap-4 text-center">
                  <div><p className="text-2xl font-black italic">{(sessionSummary.vol/1000).toFixed(1)}t</p><p className="text-[8px] opacity-30 uppercase">Volume</p></div>
                  <div><p className="text-2xl font-black italic">{sessionSummary.sets}</p><p className="text-[8px] opacity-30 uppercase">Sets</p></div>
                  <div><p className="text-2xl font-black italic text-[#FF6600]">{sessionSummary.prs}</p><p className="text-[8px] opacity-30 uppercase">PRs</p></div>
               </div>
            </div>
          </motion.div>
        )}

        {view === 'log' && (
          <motion.div key="log" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="p-6 pb-32">
            <button onPointerDown={() => setView('days')} className="text-[#FF6600] font-black text-[10px] tracking-widest mb-8 uppercase">← Back</button>
            <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 mb-8 backdrop-blur-3xl">
              <h3 className="text-3xl font-black italic mb-6 text-[#FF6600] leading-none">{selectedEx.name}</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                   <p className="text-[8px] font-black text-zinc-500 uppercase ml-4">KG</p>
                   <input value={kg} onChange={e => setKg(e.target.value)} type="number" inputMode="decimal" placeholder="00" className="w-full p-6 bg-white/5 rounded-3xl text-4xl font-black outline-none border border-white/5 focus:border-[#FF6600]/50" />
                </div>
                <div className="space-y-2">
                   <p className="text-[8px] font-black text-zinc-500 uppercase ml-4">REPS</p>
                   <input value={reps} onChange={e => setReps(e.target.value)} type="number" inputMode="numeric" placeholder="00" className="w-full p-6 bg-white/5 rounded-3xl text-4xl font-black outline-none border border-white/5 focus:border-[#FF6600]/50" />
                </div>
              </div>
              <button onPointerDown={saveSet} className="w-full bg-[#FF6600] text-black py-6 rounded-3xl font-black text-2xl uppercase active:scale-95 transition-all">Save Set</button>
            </div>
            
            <div className="space-y-4">
              <p className="text-zinc-600 font-black text-[9px] uppercase tracking-widest ml-4">History</p>
              {(logs[selectedEx.name] || []).slice().reverse().map(set => (
                <div key={set.id} className={`p-6 rounded-[2.5rem] border flex justify-between items-center ${set.isPR ? 'bg-[#FF6600]/10 border-[#FF6600]/40 shadow-[0_0_30px_rgba(255,102,0,0.1)]' : 'bg-white/5 border-white/5'}`}>
                  <div><p className="text-[10px] font-black opacity-30">{set.date}</p><p className="text-3xl font-black italic">{set.weight}kg × {set.reps}</p></div>
                  {set.isPR && <span className="bg-[#FF6600] text-black px-3 py-1 rounded-lg font-black text-[10px] italic">PR</span>}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {view === 'progress' && (
          <motion.div key="progress" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="p-6 pb-32">
             <h2 className="text-6xl font-black italic mb-10 text-[#FF6600] tracking-tighter">ANALYTICS</h2>
             <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 mb-8 h-64">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={bodyStats}>
                      <Line type="monotone" dataKey="weight" stroke="#FF6600" strokeWidth={4} dot={{fill: '#FF6600', r: 6}} />
                      <XAxis dataKey="date" hide />
                      <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
                   </LineChart>
                </ResponsiveContainer>
             </div>
             <button onPointerDown={() => {
               const val = prompt("Nuovo peso (kg):");
               if(val) setBodyStats([...bodyStats, {date: new Date().toLocaleDateString(), weight: parseFloat(val)}]);
             }} className="w-full bg-[#FF6600] text-black py-5 rounded-3xl font-black uppercase text-xs tracking-widest">Update Weight</button>
          </motion.div>
        )}
      </AnimatePresence>

      {isTimerActive && (
        <motion.div initial={{scale:0, y:50}} animate={{scale:1, y:0}} className="fixed bottom-24 right-6 w-20 h-20 bg-[#FF6600] rounded-full flex items-center justify-center text-3xl font-black text-black z-[60] shadow-[0_0_50px_rgba(255,102,0,0.5)]">
           {timer}
        </motion.div>
      )}

      <BottomNav />
    </div>
  );
}