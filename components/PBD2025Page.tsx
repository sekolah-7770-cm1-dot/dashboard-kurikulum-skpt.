
import React, { useState, useMemo, useEffect } from 'react';
import { PBDRecord } from '../types';
import { generatePBDAnalysis } from '../services/geminiService';

interface PBD2025PageProps {
  data: PBDRecord[];
  loading: boolean;
  onBack: () => void;
}

// Konfigurasi tema warna dan background unik bagi setiap subjek
const CORE_SUBJECTS = [
  { 
    id: 'BM', 
    name: 'Bahasa Melayu', 
    icon: '📖', 
    activeBg: 'bg-gradient-to-br from-blue-600 to-blue-800', 
    inactiveBg: 'bg-gradient-to-br from-blue-50/40 to-white',
    activeText: 'text-white',
    inactiveText: 'text-slate-800',
    accentText: 'text-blue-600',
    ring: 'ring-blue-500/30',
    border: 'border-blue-200',
    tpBg: 'bg-white/10'
  },
  { 
    id: 'BI', 
    name: 'Bahasa Inggeris', 
    icon: '🌐', 
    activeBg: 'bg-gradient-to-br from-indigo-600 to-violet-800', 
    inactiveBg: 'bg-gradient-to-br from-indigo-50/40 to-white',
    activeText: 'text-white',
    inactiveText: 'text-slate-800',
    accentText: 'text-indigo-600',
    ring: 'ring-indigo-500/30',
    border: 'border-indigo-200',
    tpBg: 'bg-white/10'
  },
  { 
    id: 'MATEMATIK', 
    name: 'Matematik', 
    icon: '🔢', 
    activeBg: 'bg-gradient-to-br from-amber-500 to-orange-600', 
    inactiveBg: 'bg-gradient-to-br from-amber-50/40 to-white',
    activeText: 'text-white',
    inactiveText: 'text-slate-800',
    accentText: 'text-amber-600',
    ring: 'ring-amber-500/30',
    border: 'border-amber-200',
    tpBg: 'bg-white/10'
  },
  { 
    id: 'SAINS', 
    name: 'Sains', 
    icon: '🧪', 
    activeBg: 'bg-gradient-to-br from-emerald-600 to-teal-700', 
    inactiveBg: 'bg-gradient-to-br from-emerald-50/40 to-white',
    activeText: 'text-white',
    inactiveText: 'text-slate-800',
    accentText: 'text-emerald-600',
    ring: 'ring-emerald-500/30',
    border: 'border-emerald-200',
    tpBg: 'bg-white/10'
  }
];

const isSubjectMatch = (recordSubjek: string, targetId: string) => {
  if (!recordSubjek || !targetId) return false;
  const s = recordSubjek.toUpperCase().trim();
  const id = targetId.toUpperCase().trim();
  
  if (id === 'BM') return s.includes('BM') || s.includes('MELAYU');
  if (id === 'BI') return s.includes('BI') || s.includes('INGGERIS') || s.includes('ENGLISH');
  if (id === 'SAINS') return s.includes('SAINS') || s.includes('SCIENCE') || s.includes('SN');
  if (id === 'MATEMATIK') return s.includes('MATEMATIK') || s.includes('MATH') || s.includes('MT');
  
  return s === id || s.includes(id) || id.includes(s);
};

const PBD2025Page: React.FC<PBD2025PageProps> = ({ data, loading, onBack }) => {
  const [selectedSubjek, setSelectedSubjek] = useState<string>('BM');
  const [selectedKelas, setSelectedKelas] = useState<string>('Semua');
  const [aiInsight, setAiInsight] = useState<string>('Cgu Din sedang menganalisis...');
  const [isAnalysing, setIsAnalysing] = useState(false);

  const teacherAvatar = "https://lh3.googleusercontent.com/d/1lCegcUF3-GYyTPbSidhJdSfU_AZdyj8p=s1000";

  const allAvailableSubjects = useMemo(() => {
    return Array.from(new Set(data.map(d => d.subjek))).filter(Boolean).sort();
  }, [data]);

  const allAvailableClasses = useMemo(() => {
    const list = Array.from(new Set(data.map(d => d.kelas)))
      .filter(Boolean)
      .sort((a, b) => (a as string).localeCompare(b as string));
    return ['Semua', ...list];
  }, [data]);

  const topSummaries = useMemo(() => {
    return CORE_SUBJECTS.map(sub => {
      const subData = data.filter(d => isSubjectMatch(d.subjek, sub.id));
      let m = 0, t = 0, tp1 = 0, tp2 = 0, tp3 = 0, tp4 = 0, tp5 = 0, tp6 = 0;
      subData.forEach(d => {
        const r1 = Number(d.tp1)||0, r2 = Number(d.tp2)||0, r3 = Number(d.tp3)||0;
        const r4 = Number(d.tp4)||0, r5 = Number(d.tp5)||0, r6 = Number(d.tp6)||0;
        tp1 += r1; tp2 += r2; tp3 += r3; tp4 += r4; tp5 += r5; tp6 += r6;
        m += (r3 + r4 + r5 + r6);
        t += (r1 + r2 + r3 + r4 + r5 + r6);
      });
      const pct = t > 0 ? (m / t * 100) : 0;
      const statusColor = pct >= 90 ? 'bg-emerald-400' : 
                          pct >= 70 ? 'bg-amber-400' : 
                          'bg-rose-400';
      
      return { ...sub, pct, statusColor, tp1, tp2, tp3, tp4, tp5, tp6 };
    });
  }, [data]);

  const stats = useMemo(() => {
    const subData = data.filter(d => {
        const matchSub = isSubjectMatch(d.subjek, selectedSubjek);
        const matchKelas = selectedKelas === 'Semua' || d.kelas === selectedKelas;
        return matchSub && matchKelas;
    });
    
    let tp1 = 0, tp2 = 0, tp3 = 0, tp4 = 0, tp5 = 0, tp6 = 0;
    subData.forEach(d => {
      tp1 += Number(d.tp1) || 0; tp2 += Number(d.tp2) || 0;
      tp3 += Number(d.tp3) || 0; tp4 += Number(d.tp4) || 0;
      tp5 += Number(d.tp5) || 0; tp6 += Number(d.tp6) || 0;
    });
    const total = tp1 + tp2 + tp3 + tp4 + tp5 + tp6;
    const mtm = total > 0 ? (((tp3 + tp4 + tp5 + tp6) / total) * 100).toFixed(1) : "0.0";
    const quality = total > 0 ? (((tp5 + tp6) / total) * 100).toFixed(1) : "0.0";
    return { tp1, tp2, tp3, tp4, tp5, tp6, total, mtm, quality };
  }, [data, selectedSubjek, selectedKelas]);

  const tpYearlyBreakdown = useMemo(() => {
    const years = ['1', '2', '3', '4', '5', '6'];
    return years.map(y => {
      const yearData = data.filter(d => d.kelas.startsWith(y) && isSubjectMatch(d.subjek, selectedSubjek));
      let tp1 = 0, tp2 = 0, tp3 = 0, tp4 = 0, tp5 = 0, tp6 = 0;
      yearData.forEach(d => {
        tp1 += Number(d.tp1) || 0; tp2 += Number(d.tp2) || 0;
        tp3 += Number(d.tp3) || 0; tp4 += Number(d.tp4) || 0;
        tp5 += Number(d.tp5) || 0; tp6 += Number(d.tp6) || 0;
      });
      return { year: `TAHUN ${y}`, tp1, tp2, tp3, tp4, tp5, tp6 };
    });
  }, [data, selectedSubjek]);

  const classComparison = useMemo(() => {
    const years = ['1', '2', '3', '4', '5', '6'];
    return years.map(y => {
      const yearData = data.filter(d => d.kelas.startsWith(y) && isSubjectMatch(d.subjek, selectedSubjek));
      const calcPct = (filter: string) => {
        const filtered = yearData.filter(d => d.kelas.toUpperCase().includes(filter.toUpperCase()));
        let mtm = 0, total = 0;
        filtered.forEach(d => {
          mtm += (Number(d.tp3)||0) + (Number(d.tp4)||0) + (Number(d.tp5)||0) + (Number(d.tp6)||0);
          total += (Number(d.tp1)||0) + (Number(d.tp2)||0) + (Number(d.tp3)||0) + (Number(d.tp4)||0) + (Number(d.tp5)||0) + (Number(d.tp6)||0);
        });
        return total > 0 ? ((mtm / total) * 100).toFixed(1) : "0.0";
      };
      return { year: `TAHUN ${y}`, bestari: calcPct('BESTARI'), cemerlang: calcPct('CEMERLANG') };
    });
  }, [data, selectedSubjek]);

  useEffect(() => {
    const fetchInsight = async () => {
      if (stats.total > 0) {
        setIsAnalysing(true);
        const subName = CORE_SUBJECTS.find(s => isSubjectMatch(selectedSubjek, s.id))?.name || selectedSubjek;
        const contextName = selectedKelas === 'Semua' ? subName : `${subName} (${selectedKelas})`;
        const insight = await generatePBDAnalysis(contextName, stats);
        setAiInsight(insight);
        setIsAnalysing(false);
      }
    };
    fetchInsight();
  }, [stats, selectedSubjek, selectedKelas]);

  if (loading) return <div className="p-20 text-center font-black text-slate-400 animate-pulse uppercase tracking-[0.5em]">Menjana Analisis Strategik...</div>;

  return (
    <div className="animate-fade-in pb-20 space-y-10">
      {/* Navigation & Selectors */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <button onClick={onBack} className="group flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95">
          <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </div>
          <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Dashboard Utama</span>
        </button>

        <div className="flex flex-col md:flex-row items-center gap-6 w-full lg:w-auto">
            <div className="flex items-center gap-4 bg-white border border-slate-200 px-6 py-3 rounded-3xl shadow-sm w-full md:w-auto">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subjek:</label>
                <select 
                    className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-black text-blue-600 uppercase outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer w-full md:w-48"
                    value={allAvailableSubjects.find(s => isSubjectMatch(s, selectedSubjek)) || selectedSubjek}
                    onChange={(e) => setSelectedSubjek(e.target.value)}
                >
                    {allAvailableSubjects.map((s, i) => (
                    <option key={i} value={s}>{s.toUpperCase()}</option>
                    ))}
                </select>
            </div>

            <div className="flex items-center gap-4 bg-white border border-slate-200 px-6 py-3 rounded-3xl shadow-sm w-full md:w-auto">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kelas:</label>
                <select 
                    className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-black text-blue-600 uppercase outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer w-full md:w-48"
                    value={selectedKelas}
                    onChange={(e) => setSelectedKelas(e.target.value)}
                >
                    {allAvailableClasses.map((k, i) => (
                    <option key={i} value={k}>{k.toUpperCase()}</option>
                    ))}
                </select>
            </div>
        </div>
      </div>

      {/* Hero Header PBD Section */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[3.5rem] p-8 md:p-14 text-white shadow-2xl border border-white/5">
         <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full -mr-20 -mt-20"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full -ml-20 -mb-20"></div>
         
         <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-blue-600/20 text-blue-400 text-[10px] font-black px-4 py-1.5 rounded-full border border-blue-500/30 uppercase tracking-[0.2em]">
                Pentaksiran Bilik Darjah (PBD)
              </span>
              <div className="h-px w-12 bg-slate-700"></div>
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Transformasi 2026-2035</span>
            </div>
            
            <h1 className="text-3xl md:text-6xl font-black text-white leading-none mb-6 tracking-tighter uppercase">
              ANALISIS PRESTASI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">AKADEMIK</span>
            </h1>
            
            <div className="max-w-4xl space-y-4">
               <p className="text-slate-300 text-sm md:text-lg font-medium leading-relaxed opacity-90">
                 Memacu kemenjadian murid melalui pentaksiran autentik yang holistik, selaras dengan <span className="text-white font-bold italic">Rancangan Pendidikan Malaysia 2026-2035</span>. 
                 Sistem ini menyediakan wawasan digital bagi memastikan Misi KPM dalam membangunkan potensi individu sepenuhnya tercapai melalui pemantauan Tahap Penguasaan (TP) yang telus dan berasaskan data.
               </p>
               <div className="flex items-center gap-4 text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest italic pt-2">
                 <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 #KemenjadianMurid #PendidikanBersepadu #AspirasiKPM
               </div>
            </div>
         </div>
         <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 w-full opacity-30"></div>
      </div>

      {/* Subject Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
        {topSummaries.map(s => {
          const isActive = isSubjectMatch(selectedSubjek, s.id);
          return (
            <button 
              key={s.id} 
              onClick={() => setSelectedSubjek(s.id)}
              className={`p-6 rounded-[2.5rem] flex flex-col items-start transition-all duration-500 active:scale-95 text-left w-full group overflow-hidden relative border ${
                isActive 
                ? `${s.activeBg} ${s.activeText} ${s.ring} border-white/20 shadow-2xl` 
                : `${s.inactiveBg} ${s.inactiveText} border-slate-100 shadow-sm hover:border-slate-300`
              }`}
            >
              <div className="flex items-center gap-3 mb-5 relative z-10">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${isActive ? 'bg-white/20' : 'bg-white shadow-sm'}`}>
                   {s.icon}
                </div>
                <h4 className={`text-[11px] font-black uppercase tracking-tight ${isActive ? 'text-white' : s.accentText}`}>
                  {s.name}
                </h4>
              </div>
              
              <div className="mb-6 relative z-10">
                <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 ${isActive ? 'text-white/60' : 'text-slate-400'}`}>MASTERY</p>
                <div className="flex items-center gap-2.5">
                  <span className={`text-4xl font-black tracking-tighter ${isActive ? 'text-white' : 'text-slate-900'}`}>{s.pct.toFixed(1)}%</span>
                  <div className={`w-3 h-3 rounded-full border-2 ${isActive ? 'border-white' : 'border-slate-100'} ${s.statusColor}`}></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 w-full mt-auto relative z-10">
                 {[
                   { label: 'TP1', val: s.tp1, color: isActive ? 'text-white/90' : 'text-slate-400' },
                   { label: 'TP2', val: s.tp2, color: isActive ? 'text-white/90' : 'text-slate-500' },
                   { label: 'TP3', val: s.tp3, color: isActive ? 'text-white font-bold' : 'text-amber-500 font-black' },
                   { label: 'TP4', val: s.tp4, color: isActive ? 'text-white font-bold' : 'text-emerald-500 font-black' },
                   { label: 'TP5', val: s.tp5, color: isActive ? 'text-white font-bold' : 'text-blue-600 font-black' },
                   { label: 'TP6', val: s.tp6, color: isActive ? 'text-white font-bold' : 'text-indigo-600 font-black' }
                 ].map((tp, idx) => (
                   <div key={idx} className={`p-2 rounded-xl border flex flex-col items-center transition-all ${isActive ? 'bg-white/10 border-white/10' : 'bg-white border-slate-50 shadow-sm'}`}>
                      <span className={`text-[7px] font-black uppercase mb-0.5 ${isActive ? 'text-white/50' : 'text-slate-400'}`}>{tp.label}</span>
                      <span className={`text-[10px] ${tp.color}`}>{tp.val}</span>
                   </div>
                 ))}
              </div>

              <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-10 transition-transform duration-700 group-hover:scale-150 ${isActive ? 'bg-white' : s.activeBg}`}></div>
            </button>
          );
        })}
      </div>

      {/* Hero Visual Detail Fokus */}
      <div className="bg-[#0f172a] rounded-[3.5rem] p-10 md:p-14 text-white relative overflow-hidden group shadow-2xl border border-white/5">
         <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-600/10 via-transparent to-indigo-600/5 pointer-events-none"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-5xl shadow-2xl transition-transform group-hover:scale-105 duration-700">
               {CORE_SUBJECTS.find(s => isSubjectMatch(selectedSubjek, s.id))?.icon || '📚'}
            </div>
            <div className="space-y-3 text-center md:text-left">
               <div className="flex items-center justify-center md:justify-start gap-4">
                  <span className="px-5 py-1.5 bg-blue-600 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">Detail Fokus</span>
                  <div className="h-px w-10 bg-slate-700"></div>
                  <span className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.2em]">Analisis {selectedKelas}</span>
               </div>
               <h1 className="text-3xl md:text-6xl font-black leading-none tracking-tighter uppercase">
                  {CORE_SUBJECTS.find(s => isSubjectMatch(selectedSubjek, s.id))?.name || selectedSubjek}
                  <span className="block text-xl md:text-2xl text-blue-400 mt-4 tracking-[0.25em] font-extrabold opacity-90">{selectedKelas}</span>
               </h1>
            </div>
         </div>
      </div>

      {/* Analytics Visualization */}
      <div className="bg-white rounded-[3.5rem] p-6 md:p-10 border border-slate-200 shadow-sm flex flex-col gap-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="text-center p-6 bg-slate-50/40 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all group">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-[0.2em]">MTM (TP3-6)</p>
              <p className="text-4xl md:text-5xl font-black text-emerald-500 tracking-tighter">{stats.mtm}%</p>
           </div>
           <div className="text-center p-6 bg-slate-50/40 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all group">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-[0.2em]">Kualiti (TP5-6)</p>
              <p className="text-4xl md:text-5xl font-black text-blue-600 tracking-tighter">{stats.quality}%</p>
           </div>
           <div className="text-center p-6 bg-slate-50/40 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all group">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-[0.2em]">Jml Murid</p>
              <p className="text-4xl md:text-5xl font-black text-slate-800 tracking-tighter">{stats.total}</p>
           </div>
        </div>

        <div className="min-h-[280px] flex items-end justify-around gap-4 px-4 pb-4">
           {[
             { label: 'TP1', val: stats.tp1, color: 'bg-slate-100 border-slate-200' },
             { label: 'TP2', val: stats.tp2, color: 'bg-slate-400 border-slate-500' },
             { label: 'TP3', val: stats.tp3, color: 'bg-[#fbbf24] border-[#d97706]' },
             { label: 'TP4', val: stats.tp4, color: 'bg-[#10b981] border-[#059669]' },
             { label: 'TP5', val: stats.tp5, color: 'bg-[#3b82f6] border-[#2563eb]' },
             { label: 'TP6', val: stats.tp6, color: 'bg-[#6366f1] border-[#4f46e5]' }
           ].map(d => {
             const h = stats.total > 0 ? (d.val / stats.total) * 230 : 0;
             return (
               <div key={d.label} className="flex-1 flex flex-col items-center gap-4 group h-full justify-end">
                  <div className="relative w-full flex flex-col items-center">
                     <div className="absolute -top-10 w-9 h-9 bg-[#1e293b] rounded-full flex items-center justify-center text-white text-[11px] font-black shadow-lg z-20 group-hover:scale-110 transition-transform">
                        {d.val}
                     </div>
                     <div 
                       className={`${d.color} w-full max-w-[70px] rounded-t-[2rem] transition-all duration-1000 shadow-md`} 
                       style={{ height: `${Math.max(h, 12)}px` }}
                     ></div>
                  </div>
                  <span className="text-[12px] font-black text-slate-800 uppercase tracking-widest">{d.label}</span>
               </div>
             );
           })}
        </div>
      </div>

      {/* Taburan TP Mengikut Tahun */}
      <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-slate-200 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-2xl">
         <div className="flex items-center gap-4 mb-10">
            <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Taburan Tahap Penguasaan (TP) Mengikut Tahun</h3>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50/50 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                     <th className="py-6 px-8">Tahun</th>
                     <th className="py-6 px-4 text-center">TP1</th>
                     <th className="py-6 px-4 text-center">TP2</th>
                     <th className="py-6 px-4 text-center">TP3</th>
                     <th className="py-6 px-4 text-center">TP4</th>
                     <th className="py-6 px-4 text-center">TP5</th>
                     <th className="py-6 px-4 text-center">TP6</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {tpYearlyBreakdown.map((row, i) => (
                     <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="py-5 px-8 font-black text-slate-700 text-xs tracking-wider">{row.year}</td>
                        <td className="py-5 px-4 text-center font-black text-slate-400 text-sm">{row.tp1}</td>
                        <td className="py-5 px-4 text-center font-black text-slate-500 text-sm">{row.tp2}</td>
                        <td className="py-5 px-4 text-center font-black text-amber-500 text-sm">{row.tp3}</td>
                        <td className="py-5 px-4 text-center font-black text-emerald-500 text-sm">{row.tp4}</td>
                        <td className="py-5 px-4 text-center font-black text-blue-600 text-sm">{row.tp5}</td>
                        <td className="py-5 px-4 text-center font-black text-indigo-600 text-sm">{row.tp6}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* AI Insights & Jadual Bestari vs Cemerlang */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-[#0f172a] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full"></div>
           <div className="flex items-center gap-5 mb-10">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center border-4 border-blue-400 p-1 overflow-hidden shadow-2xl">
                 <img src={teacherAvatar} alt="Cgu Din" className="w-full h-full object-contain scale-125 translate-y-2" />
              </div>
              <div>
                 <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest">cikgu Din AI</h4>
                 <div className="flex items-center gap-2">
                   <span className={`w-2 h-2 rounded-full animate-pulse ${isAnalysing ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                   <span className={`text-[10px] font-bold ${isAnalysing ? 'text-amber-400' : 'text-emerald-400'} uppercase tracking-widest`}>
                      {isAnalysing ? 'Analisis...' : 'Aktif'}
                   </span>
                 </div>
              </div>
           </div>
           <h3 className="text-2xl font-black uppercase tracking-tight text-blue-100 mb-6 flex items-center gap-3">
             <span className="w-1.5 h-7 bg-blue-500 rounded-full"></span>
             Ulasan Strategik
           </h3>
           <p className="text-[15px] font-medium leading-relaxed italic text-slate-300 flex-1">
              "{aiInsight}"
           </p>
        </div>

        <div className="lg:col-span-7 bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-2xl">
           <div className="flex items-center gap-4 mb-10">
              <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Bestari vs Cemerlang</h3>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead className="bg-slate-50/50 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                 <tr>
                   <th className="py-6 px-8">Tahun</th>
                   <th className="py-6 px-8 text-center">Bestari (%)</th>
                   <th className="py-6 px-8 text-center">Cemerlang (%)</th>
                   <th className="py-6 px-8 text-center">Jurang</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 {classComparison.map((row, i) => {
                   const diff = (parseFloat(row.bestari) - parseFloat(row.cemerlang)).toFixed(1);
                   const isPositive = parseFloat(diff) >= 0;
                   const isZero = parseFloat(diff) === 0;
                   return (
                     <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                       <td className="py-5 px-8 font-black text-slate-700 text-xs tracking-wider">{row.year}</td>
                       <td className="py-5 px-8 text-center font-black text-blue-600 text-sm">{row.bestari}%</td>
                       <td className="py-5 px-8 text-center font-black text-emerald-600 text-sm">{row.cemerlang}%</td>
                       <td className="py-5 px-8 text-center">
                          <span className={`text-[11px] font-black px-4 py-1.5 rounded-full shadow-sm ${
                             isZero ? 'bg-emerald-50 text-emerald-600' :
                             isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                          }`}>
                            {isPositive && !isZero ? '+' : ''}{diff}%
                          </span>
                       </td>
                     </tr>
                   );
                 })}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PBD2025Page;
