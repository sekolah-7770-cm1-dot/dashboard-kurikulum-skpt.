
import React, { useState, useMemo, useEffect } from 'react';
import { PBDRecord } from '../types';
import { generatePBDAnalysis } from '../services/geminiService';

interface PBD2025PageProps {
  data: PBDRecord[];
  loading: boolean;
  onBack: () => void;
}

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
  const [aiInsight, setAiInsight] = useState<string>('Cgu Din sedang menganalisis data...');
  const [isAnalysing, setIsAnalysing] = useState(false);

  const teacherAvatar = "https://lh3.googleusercontent.com/d/1lCegcUF3-GYyTPbSidhJdSfU_AZdyj8p=s1000";

  const allAvailableSubjects = useMemo(() => {
    return Array.from(new Set(data.map(d => d.subjek))).filter(Boolean).sort();
  }, [data]);

  const allAvailableClasses = useMemo(() => {
    // FIX: Provide explicit string type to Array.from to ensure correct type inference in filter and sort
    const list = Array.from<string>(new Set(data.map(d => d.kelas)))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
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

  const tpClassBreakdown = useMemo(() => {
    // Ambil semua kelas yang ada data bagi subjek terpilih
    // FIX: Provide explicit string type to Array.from to ensure subjectClasses is string[]
    const subjectClasses = Array.from<string>(new Set(
      data.filter(d => isSubjectMatch(d.subjek, selectedSubjek)).map(d => d.kelas)
    )).sort((a, b) => a.localeCompare(b));

    // FIX: Explicitly type parameter k as string
    return subjectClasses.map((k: string) => {
      const classData = data.filter(d => d.kelas === k && isSubjectMatch(d.subjek, selectedSubjek));
      let tp1 = 0, tp2 = 0, tp3 = 0, tp4 = 0, tp5 = 0, tp6 = 0;
      classData.forEach(d => {
        tp1 += Number(d.tp1) || 0; tp2 += Number(d.tp2) || 0;
        tp3 += Number(d.tp3) || 0; tp4 += Number(d.tp4) || 0;
        tp5 += Number(d.tp5) || 0; tp6 += Number(d.tp6) || 0;
      });
      return { kelas: k.toUpperCase(), tp1, tp2, tp3, tp4, tp5, tp6 };
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
      <div className="relative overflow-hidden bg-[#0f172a] rounded-[3.5rem] p-8 md:p-16 text-white shadow-2xl border border-white/5 group">
         <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-600/10 via-transparent to-indigo-600/5 pointer-events-none"></div>
         <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full group-hover:bg-blue-500/20 transition-all duration-1000"></div>
         
         <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <span className="bg-blue-600/20 text-blue-400 text-[10px] font-black px-5 py-2 rounded-full border border-blue-500/30 uppercase tracking-[0.3em]">
                Pentaksiran Bilik Darjah (PBD)
              </span>
              <div className="h-px w-16 bg-slate-700"></div>
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">UNIT KURIKULUM DIGITAL CORE</span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-black text-white leading-[0.9] mb-8 tracking-tighter uppercase">
              ANALISIS PRESTASI <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">AKADEMIK STRATEGIK</span>
            </h1>
            
            <div className="max-w-4xl space-y-4 border-l-4 border-blue-600 pl-8 py-2">
               <p className="text-slate-300 text-sm md:text-xl font-medium leading-relaxed opacity-90">
                 Membangun potensi insan melalui kepimpinan instruksional yang berimpak tinggi, berintegriti, dan berteraskan data raya. 
                 Kita tekad menerajui transformasi pendidikan digital secara bersepadu menerusi ekosistem <span className="text-white font-bold">UNIT KURIKULUM Digital Core</span> selaras dengan <span className="text-blue-400 font-bold italic">Aspirasi KPM 2026-2035</span>.
               </p>
               <div className="flex items-center gap-6 text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] italic">
                 <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    #UNITKURIKULUM
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    #INSPIRASICEMERLANG
                 </div>
               </div>
            </div>
         </div>
         <div className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 w-full opacity-40"></div>
      </div>

      {/* Core Subjects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {topSummaries.map(s => {
          const isActive = isSubjectMatch(selectedSubjek, s.id);
          return (
            <button 
              key={s.id} 
              onClick={() => setSelectedSubjek(s.id)}
              className={`p-8 rounded-[3rem] flex flex-col items-start transition-all duration-500 active:scale-95 text-left w-full group overflow-hidden relative border-2 ${
                isActive 
                ? `${s.activeBg} ${s.activeText} ${s.ring} border-white/20 shadow-2xl -translate-y-2` 
                : `${s.inactiveBg} ${s.inactiveText} border-slate-100 shadow-sm hover:border-slate-300 hover:-translate-y-1`
              }`}
            >
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all shadow-lg ${isActive ? 'bg-white/20' : 'bg-white'}`}>
                   {s.icon}
                </div>
                <h4 className={`text-xs font-black uppercase tracking-widest ${isActive ? 'text-white' : s.accentText}`}>
                  {s.name}
                </h4>
              </div>
              <div className="mb-8 relative z-10">
                <p className={`text-[9px] font-black uppercase tracking-[0.3em] mb-1 ${isActive ? 'text-white/60' : 'text-slate-400'}`}>TAHAP PENGUASAAN</p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-5xl font-black tracking-tighter ${isActive ? 'text-white' : 'text-slate-900'}`}>{s.pct.toFixed(1)}%</span>
                  <span className={`text-[10px] font-bold uppercase ${isActive ? 'text-white/80' : 'text-slate-500'}`}>MTM</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2.5 w-full mt-auto relative z-10">
                 {[
                   { label: 'TP1-2', val: s.tp1 + s.tp2, color: isActive ? 'text-white/70' : 'text-slate-400' },
                   { label: 'TP3-4', val: s.tp3 + s.tp4, color: isActive ? 'text-white font-black' : 'text-emerald-600 font-black' },
                   { label: 'TP5-6', val: s.tp5 + s.tp6, color: isActive ? 'text-white font-black' : 'text-blue-600 font-black' }
                 ].map((tp, idx) => (
                   <div key={idx} className={`p-3 rounded-2xl border flex flex-col items-center transition-all ${isActive ? 'bg-white/10 border-white/10' : 'bg-white border-slate-50 shadow-sm'}`}>
                      <span className={`text-[7px] font-black uppercase mb-1 tracking-widest ${isActive ? 'text-white/50' : 'text-slate-400'}`}>{tp.label}</span>
                      <span className={`text-[11px] ${tp.color}`}>{tp.val}</span>
                   </div>
                 ))}
              </div>
              <div className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-10 transition-transform duration-1000 group-hover:scale-150 ${isActive ? 'bg-white' : s.activeBg}`}></div>
            </button>
          );
        })}
      </div>

      {/* Analysis Focus Header */}
      <div className="bg-white rounded-[3.5rem] p-10 md:p-14 border-2 border-slate-100 shadow-sm relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/50 blur-[100px] rounded-full pointer-events-none"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className={`w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-2xl transition-all group-hover:rotate-6 duration-700 ${CORE_SUBJECTS.find(s => isSubjectMatch(selectedSubjek, s.id))?.activeBg || 'bg-slate-900'} text-white border-4 border-white`}>
               {CORE_SUBJECTS.find(s => isSubjectMatch(selectedSubjek, s.id))?.icon || '📚'}
            </div>
            <div className="space-y-4 text-center md:text-left flex-1">
               <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
                  <span className="px-6 py-2 bg-slate-900 text-white text-[10px] font-black rounded-xl uppercase tracking-widest shadow-lg">Analisis Fokus</span>
                  <div className="h-px w-12 bg-slate-200"></div>
                  <span className="text-slate-400 text-[11px] font-black uppercase tracking-[0.3em]">SK PEKAN TENOM</span>
               </div>
               <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-none tracking-tighter uppercase">
                  {CORE_SUBJECTS.find(s => isSubjectMatch(selectedSubjek, s.id))?.name || selectedSubjek}
                  <span className="text-blue-600 ml-4">{selectedKelas}</span>
               </h1>
            </div>
            <div className="hidden lg:flex items-center gap-8 pl-10 border-l-2 border-slate-100">
               <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">JUMLAH MURID</p>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter">{stats.total}</p>
               </div>
            </div>
         </div>
      </div>

      {/* Detailed Stats & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white rounded-[3.5rem] p-10 border-2 border-slate-100 shadow-sm flex flex-col gap-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="p-8 bg-emerald-50/50 rounded-[2.5rem] border border-emerald-100 hover:bg-emerald-50 transition-all group flex flex-col items-center text-center">
                <p className="text-[10px] font-black text-emerald-600 uppercase mb-3 tracking-[0.3em]">MTM (TP3-TP6)</p>
                <div className="flex items-baseline gap-2">
                   <span className="text-5xl md:text-7xl font-black text-emerald-600 tracking-tighter">{stats.mtm}%</span>
                </div>
                <div className="w-full h-2 bg-emerald-100 rounded-full mt-6 overflow-hidden">
                   <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${stats.mtm}%` }}></div>
                </div>
             </div>
             <div className="p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 hover:bg-blue-50 transition-all group flex flex-col items-center text-center">
                <p className="text-[10px] font-black text-blue-600 uppercase mb-3 tracking-[0.3em]">KUALITI (TP5-TP6)</p>
                <div className="flex items-baseline gap-2">
                   <span className="text-5xl md:text-7xl font-black text-blue-600 tracking-tighter">{stats.quality}%</span>
                </div>
                <div className="w-full h-2 bg-blue-100 rounded-full mt-6 overflow-hidden">
                   <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${stats.quality}%` }}></div>
                </div>
             </div>
          </div>

          <div className="min-h-[320px] flex items-end justify-around gap-6 px-4 pb-4 bg-slate-50/30 rounded-[3rem] p-8 border border-slate-50">
             {[
               { label: 'TP1', val: stats.tp1, color: 'bg-slate-200 border-slate-300' },
               { label: 'TP2', val: stats.tp2, color: 'bg-slate-400 border-slate-500' },
               { label: 'TP3', val: stats.tp3, color: 'bg-amber-400 border-amber-500' },
               { label: 'TP4', val: stats.tp4, color: 'bg-emerald-500 border-emerald-600' },
               { label: 'TP5', val: stats.tp5, color: 'bg-blue-600 border-blue-700' },
               { label: 'TP6', val: stats.tp6, color: 'bg-indigo-600 border-indigo-700' }
             ].map(d => {
               const h = stats.total > 0 ? (d.val / stats.total) * 240 : 0;
               return (
                 <div key={d.label} className="flex-1 flex flex-col items-center gap-5 group h-full justify-end">
                    <div className="relative w-full flex flex-col items-center">
                       <div className="absolute -top-12 bg-slate-900 text-white text-[11px] font-black px-3 py-1.5 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all transform -translate-y-2 group-hover:translate-y-0">
                          {d.val} Murid
                       </div>
                       <div 
                         className={`${d.color} w-full max-w-[80px] rounded-t-[2.5rem] transition-all duration-1000 shadow-2xl group-hover:brightness-110`} 
                         style={{ height: `${Math.max(h, 15)}px` }}
                       ></div>
                    </div>
                    <span className="text-xs font-black text-slate-800 uppercase tracking-widest">{d.label}</span>
                 </div>
               );
             })}
          </div>
        </div>

        {/* AI Insight Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-8">
           <div className="bg-[#0f172a] rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col h-full border border-white/5">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 blur-[80px] rounded-full"></div>
              
              <div className="flex items-center gap-6 mb-10">
                 <div className="relative">
                    <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center border-4 border-blue-500/50 p-1 overflow-hidden shadow-2xl transform rotate-3">
                       <img src={teacherAvatar} alt="Cgu Din" className="w-full h-full object-contain scale-125 translate-y-2" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-6 h-6 rounded-full border-4 border-[#0f172a] animate-pulse"></div>
                 </div>
                 <div>
                    <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-1">Pakar Data AI</h4>
                    <h3 className="text-xl font-black uppercase tracking-tight">CIKGU DIN AI</h3>
                 </div>
              </div>

              <div className="flex-1 flex flex-col">
                 <h3 className="text-2xl font-black uppercase tracking-tight text-blue-100 mb-6 flex items-center gap-3">
                   <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                   Ulasan Strategik
                 </h3>
                 <div className="relative p-6 bg-white/5 rounded-[2.5rem] border border-white/10 italic text-slate-300 leading-relaxed text-base">
                    {isAnalysing ? (
                      <div className="space-y-3">
                         <div className="h-3 bg-white/10 rounded-full w-full animate-pulse"></div>
                         <div className="h-3 bg-white/10 rounded-full w-[80%] animate-pulse"></div>
                         <div className="h-3 bg-white/10 rounded-full w-[90%] animate-pulse"></div>
                      </div>
                    ) : (
                      <>
                        <span className="absolute -top-4 -left-2 text-6xl text-blue-500/20 font-serif leading-none">“</span>
                        {aiInsight}
                        <span className="absolute -bottom-10 -right-2 text-6xl text-blue-500/20 font-serif leading-none">”</span>
                      </>
                    )}
                 </div>
              </div>

              <div className="mt-14 pt-6 border-t border-white/5 flex items-center justify-between opacity-50">
                 <p className="text-[8px] font-black uppercase tracking-[0.5em]">System Core Active</p>
                 <div className="flex gap-1">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Comparison Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
         <div className="bg-white rounded-[3.5rem] p-10 border-2 border-slate-100 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-2xl">
            <div className="flex items-center gap-4 mb-10">
               <div className="w-2 h-10 bg-blue-600 rounded-full"></div>
               <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Taburan TP Mengikut Kelas</h3>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-slate-50/50 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b-2 border-slate-100">
                        <th className="py-6 px-8">Kelas</th>
                        <th className="py-6 px-4 text-center">TP1-2</th>
                        <th className="py-6 px-4 text-center">TP3</th>
                        <th className="py-6 px-4 text-center">TP4</th>
                        <th className="py-6 px-4 text-center">TP5</th>
                        <th className="py-6 px-4 text-center">TP6</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {tpClassBreakdown.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                           <td className="py-6 px-8 font-black text-slate-700 text-xs tracking-wider">{row.kelas}</td>
                           <td className="py-6 px-4 text-center font-black text-slate-400 text-sm">{row.tp1 + row.tp2}</td>
                           <td className="py-6 px-4 text-center font-black text-amber-500 text-sm">{row.tp3}</td>
                           <td className="py-6 px-4 text-center font-black text-emerald-500 text-sm">{row.tp4}</td>
                           <td className="py-6 px-4 text-center font-black text-blue-600 text-sm">{row.tp5}</td>
                           <td className="py-6 px-4 text-center font-black text-indigo-600 text-sm">{row.tp6}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         <div className="bg-white rounded-[3.5rem] p-10 border-2 border-slate-100 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-2xl">
            <div className="flex items-center gap-4 mb-10">
               <div className="w-2 h-10 bg-emerald-500 rounded-full"></div>
               <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Analisis Kelas Bestari vs Cemerlang</h3>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b-2 border-slate-100">
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
                        <td className="py-6 px-8 font-black text-slate-700 text-xs tracking-wider">{row.year}</td>
                        <td className="py-6 px-8 text-center font-black text-blue-600 text-sm">{row.bestari}%</td>
                        <td className="py-6 px-8 text-center font-black text-emerald-600 text-sm">{row.cemerlang}%</td>
                        <td className="py-6 px-8 text-center">
                           <span className={`text-[11px] font-black px-5 py-2 rounded-2xl shadow-sm ${
                              isZero ? 'bg-slate-50 text-slate-500' :
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

      <div className="text-center pt-10">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.8em] opacity-40">
           UNIT KURIKULUM DIGITAL CORE 2026
         </p>
      </div>
    </div>
  );
};

export default PBD2025Page;
