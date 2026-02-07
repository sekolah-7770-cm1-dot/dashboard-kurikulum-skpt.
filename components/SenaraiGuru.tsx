
import React, { useState, useMemo } from 'react';
import { TeacherRecord } from '../types';

interface SenaraiGuruProps {
  teachers: TeacherRecord[];
  loading: boolean;
  onBack: () => void;
}

const SenaraiGuru: React.FC<SenaraiGuruProps> = ({ teachers, loading, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const teacherAvatar = "https://lh3.googleusercontent.com/d/1lCegcUF3-GYyTPbSidhJdSfU_AZdyj8p=s1000";

  const filteredTeachers = useMemo(() => {
    return teachers.filter(t => 
      t.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.jawatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.opsyen.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [teachers, searchTerm]);

  const stats = useMemo(() => {
    const total = teachers.length;
    
    // Agihan Jawatan
    const jawatanMap: Record<string, number> = {};
    teachers.forEach(t => {
      const j = (t.jawatan || 'Guru').trim().toUpperCase();
      jawatanMap[j] = (jawatanMap[j] || 0) + 1;
    });
    const sortedJawatan = Object.entries(jawatanMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // Agihan Opsyen
    const opsyenMap: Record<string, number> = {};
    teachers.forEach(t => {
      const o = (t.opsyen || 'Am').trim().toUpperCase();
      opsyenMap[o] = (opsyenMap[o] || 0) + 1;
    });
    const sortedOpsyen = Object.entries(opsyenMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12);

    return { 
      total, 
      optionsCount: Object.keys(opsyenMap).length,
      jawatanDist: sortedJawatan,
      opsyenDist: sortedOpsyen
    };
  }, [teachers]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <div className="relative">
           <div className="w-20 h-20 border-4 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin"></div>
           <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl">👨‍🏫</span>
           </div>
        </div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Menyusun Direktori Pendidik...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-20">
      {/* Header Controls */}
      <div className="mb-6 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="group flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-500 transition-all active:scale-95"
        >
          <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </div>
          <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Dashboard Utama</span>
        </button>

        <div className="hidden md:flex items-center gap-2.5 px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
           <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
           <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Digital HR Hub</span>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-slate-200 relative overflow-hidden">
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none"></div>

        {/* Intro Section - Hero Pendidik */}
        <div className="mb-8 p-6 md:p-10 bg-[#0f172a] rounded-[2.5rem] text-white flex flex-col lg:flex-row items-center gap-8 lg:gap-14 relative overflow-hidden group shadow-xl">
           {/* Shimmer Scanline Animation */}
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms] ease-in-out"></div>

           <div className="relative z-10 flex-shrink-0">
              <div className="w-32 h-32 md:w-44 md:h-44 bg-white/10 backdrop-blur-xl rounded-[2.5rem] shadow-2xl flex items-center justify-center border-2 border-white/20 p-1 transform transition-all duration-700 group-hover:scale-105 group-hover:border-emerald-500/40">
                <img 
                  src={teacherAvatar} 
                  alt="Cgu Din" 
                  className="w-full h-full object-contain transform translate-y-1 scale-110" 
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 border-4 border-[#0f172a] rounded-full"></div>
           </div>
           
           <div className="relative z-10 flex-1 text-center lg:text-left">
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-2 mb-4">
                <span className="bg-emerald-600/20 text-emerald-400 text-[8px] font-black px-3 py-1 rounded-full border border-emerald-500/30 uppercase tracking-[0.2em]">
                  Modul Sumber Manusia
                </span>
                <span className="text-slate-500 text-[8px] font-black uppercase tracking-widest border-l border-slate-800 pl-2">
                  SK Pekan Tenom
                </span>
              </div>
              
              <h1 className="font-black text-white uppercase leading-none mb-4">
                <span className="text-3xl md:text-5xl tracking-[0.1em]">PROFIL</span> <br/>
                <span className="text-3xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400 tracking-[0.05em]">PENDIDIK</span> <br/>
                <span className="text-xs md:text-sm mt-4 block text-blue-300 font-black tracking-[0.3em] transition-all duration-500 group-hover:tracking-[0.35em] uppercase opacity-90">
                  UNIT KURIKULUM DIGITAL CORE
                </span>
              </h1>

              {/* Kata Semangat Strategik - PANJANG & RAPAT */}
              <div className="max-w-2xl space-y-2 border-t border-white/10 pt-4 mt-4">
                 <p className="text-slate-300 text-[11px] md:text-sm font-medium leading-tight opacity-90">
                   Membangun potensi insan melalui kepimpinan instruksional yang berimpak tinggi, berintegriti, dan berteraskan data raya. 
                   Kita tekad menerajui transformasi pendidikan digital secara bersepadu menerusi ekosistem UNIT KURIKULUM Digital Core selaras dengan <span className="text-white font-bold italic">Aspirasi KPM 2026-2035</span>.
                 </p>
                 <div className="flex items-center justify-center lg:justify-start gap-3 text-emerald-400 text-[9px] font-black uppercase tracking-[0.3em] italic">
                   #UNIKURSKPTEN #InspirasiCemerlang
                 </div>
              </div>
           </div>
        </div>

        {/* ANALISIS KEPAKARAN & JAWATAN */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
           {/* Jawatan Analytics */}
           <div className="bg-slate-50 rounded-[2rem] p-7 border border-slate-100 flex flex-col h-full hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2.5 mb-6">
                 <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                 <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">Agihan Jawatan</h3>
              </div>
              <div className="space-y-5 flex-1 max-h-[300px] overflow-y-auto pr-3 custom-scrollbar">
                 {stats.jawatanDist.map(([jawatan, count]) => (
                   <div key={jawatan} className="space-y-1.5 group">
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-black text-slate-600 uppercase tracking-wide group-hover:text-blue-600 transition-colors">{jawatan}</span>
                         <span className="text-[10px] font-black text-blue-600">{count}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                         <div 
                           className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                           style={{ width: `${(count / stats.total) * 100}%` }}
                         ></div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Opsyen Analytics */}
           <div className="bg-emerald-50/30 rounded-[2rem] p-7 border border-emerald-100/50 flex flex-col h-full hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2.5 mb-6">
                 <div className="w-1 h-5 bg-emerald-500 rounded-full"></div>
                 <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">Kekuatan Opsyen</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 max-h-[300px] overflow-y-auto pr-3 custom-scrollbar">
                 {stats.opsyenDist.map(([opsyen, count]) => (
                   <div key={opsyen} className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-sm flex items-center justify-between group hover:border-emerald-400 transition-colors">
                      <div className="flex flex-col">
                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Bidang</span>
                         <span className="text-[10px] font-black text-slate-700 uppercase leading-tight tracking-tight">{opsyen}</span>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
                         <span className="text-[10px] font-black">{count}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Search Bar & Summary Stats */}
        <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center mb-10 gap-6 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
           <div className="flex items-center justify-center md:justify-start gap-10">
              <div className="text-center md:text-left">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">JUMLAH GURU</p>
                 <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-slate-800">{stats.total}</span>
                    <span className="text-[9px] font-bold text-emerald-600 uppercase">Pendidik</span>
                 </div>
              </div>
              <div className="h-10 w-px bg-slate-200"></div>
              <div className="text-center md:text-left">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">OPSYEN</p>
                 <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-slate-800">{stats.optionsCount}</span>
                    <span className="text-[9px] font-bold text-blue-600 uppercase">Kategori</span>
                 </div>
              </div>
           </div>
           
           <div className="relative w-full xl:w-80">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="Cari pendidik..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-xs font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-300"
              />
           </div>
        </div>

        {/* Teachers Grid */}
        {filteredTeachers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTeachers.map((teacher, idx) => (
              <div 
                key={idx} 
                className="group bg-white border border-slate-100 p-6 rounded-[2rem] hover:shadow-xl hover:border-emerald-200 transition-all duration-500 relative overflow-hidden flex flex-col"
              >
                <div className="relative z-10 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-2xl group-hover:bg-emerald-600 group-hover:text-white group-hover:rotate-6 transition-all shadow-sm">
                      👨‍🏫
                    </div>
                  </div>

                  <h4 className="text-xs font-black text-slate-800 uppercase leading-tight mb-4 group-hover:text-emerald-700 transition-colors min-h-[2.2rem] tracking-tight">
                    {teacher.nama}
                  </h4>
                  
                  <div className="space-y-3 pt-3 border-t border-slate-50">
                    <div className="flex flex-col gap-0.5">
                       <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Jawatan</span>
                       <div className="flex items-center gap-1.5">
                          <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                          <span className="text-[9px] font-bold text-slate-600 leading-tight uppercase tracking-tight">{teacher.jawatan}</span>
                       </div>
                    </div>
                    
                    <div className="flex flex-col gap-0.5">
                       <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Opsyen</span>
                       <div className="flex items-center gap-1.5">
                          <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                          <span className="text-[9px] font-black text-blue-600 leading-tight uppercase tracking-tight">{teacher.opsyen}</span>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-50 flex items-center justify-between">
                   <span className="text-[7px] font-black text-slate-300 uppercase tracking-[0.2em]">UNIT KURIKULUM</span>
                   <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-emerald-500/20 rounded-full group-hover:bg-emerald-500 transition-colors"></div>
                      <div className="w-1.5 h-1.5 bg-blue-500/20 rounded-full group-hover:bg-blue-500 transition-colors"></div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-200 shadow-sm border border-slate-100">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
             </div>
             <h3 className="text-slate-400 font-black uppercase text-xs tracking-[0.3em]">Rekod Tidak Ditemui</h3>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col items-center gap-2">
         <div className="h-px w-16 bg-slate-200"></div>
         <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.5em] opacity-40">
           UNIT KURIKULUM SKPTEN Digital Core
         </p>
      </div>
    </div>
  );
};

export default SenaraiGuru;
