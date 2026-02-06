
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
    
    // Agihan Jawatan - Diperluaskan kepada 10 teratas
    const jawatanMap: Record<string, number> = {};
    teachers.forEach(t => {
      const j = (t.jawatan || 'Guru').trim().toUpperCase();
      jawatanMap[j] = (jawatanMap[j] || 0) + 1;
    });
    const sortedJawatan = Object.entries(jawatanMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // Agihan Opsyen - Diperluaskan kepada 12 teratas
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
      <div className="mb-8 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="group flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500 transition-all active:scale-95"
        >
          <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </div>
          <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Dashboard Utama</span>
        </button>

        <div className="hidden md:flex items-center gap-3 px-6 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
           <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
           <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Digital Human Resource Hub</span>
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] p-6 md:p-12 shadow-sm border border-slate-200 relative overflow-hidden">
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>

        {/* Intro Section */}
        <div className="mb-12 p-8 md:p-14 bg-[#0f172a] rounded-[3rem] text-white flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden group">
           <div className="relative z-10 flex-shrink-0">
              <div className="w-44 h-44 md:w-56 md:h-56 bg-white/10 backdrop-blur-xl rounded-[3rem] shadow-2xl flex items-center justify-center border-2 border-white/20 p-1">
                <img 
                  src={teacherAvatar} 
                  alt="Cgu Din" 
                  className="w-full h-full object-contain transform translate-y-2 scale-110" 
                />
              </div>
           </div>
           
           <div className="relative z-10 flex-1 text-center lg:text-left">
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3 mb-6">
                <span className="bg-emerald-600/20 text-emerald-400 text-[9px] font-black px-4 py-1.5 rounded-full border border-emerald-500/30 uppercase tracking-[0.2em]">
                  Modul Sumber Manusia
                </span>
                <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest border-l border-slate-800 pl-3">
                  SK Pekan Tenom
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-8">
                PROFIL <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">PENDIDIK</span> <br/>
                <span className="text-2xl md:text-4xl opacity-90">SKPT DIGITAL CORE</span>
              </h1>
           </div>
        </div>

        {/* ANALISIS KEPAKARAN & JAWATAN */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
           {/* Jawatan Analytics */}
           <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                 <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Analisis Agihan Jawatan</h3>
              </div>
              <div className="space-y-6 flex-1 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                 {stats.jawatanDist.map(([jawatan, count]) => (
                   <div key={jawatan} className="space-y-2">
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] md:text-[11px] font-black text-slate-600 uppercase tracking-wide">{jawatan}</span>
                         <span className="text-[10px] md:text-[11px] font-black text-blue-600">{count} Orang</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
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
           <div className="bg-emerald-50/30 rounded-[2.5rem] p-8 border border-emerald-100/50 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                 <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Kekuatan Opsyen Utama</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                 {stats.opsyenDist.map(([opsyen, count]) => (
                   <div key={opsyen} className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-between group hover:border-emerald-400 transition-colors">
                      <div className="flex flex-col">
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Bidang</span>
                         <span className="text-[10px] md:text-[11px] font-black text-slate-700 uppercase leading-tight">{opsyen}</span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                         <span className="text-xs font-black text-emerald-600">{count}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center mb-12 gap-8 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
           <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 md:gap-16">
              <div className="text-center md:text-left">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">JUMLAH GURU</p>
                 <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-slate-800">{stats.total}</span>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase">Orang</span>
                 </div>
              </div>
              <div className="hidden md:block h-12 w-px bg-slate-200"></div>
              <div className="text-center md:text-left">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">KEPELBAGAIAN OPSYEN</p>
                 <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-slate-800">{stats.optionsCount}</span>
                    <span className="text-[10px] font-bold text-blue-600 uppercase">Subjek</span>
                 </div>
              </div>
           </div>
           
           <div className="relative w-full xl:w-96">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="Cari nama, jawatan atau opsyen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border-2 border-slate-100 rounded-[1.5rem] py-5 pl-14 pr-6 text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm placeholder:text-slate-300"
              />
           </div>
        </div>

        {/* Teachers Grid */}
        {filteredTeachers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTeachers.map((teacher, idx) => (
              <div 
                key={idx} 
                className="group bg-white border border-slate-100 p-7 rounded-[2.5rem] hover:shadow-[0_20px_50px_rgba(16,185,129,0.1)] hover:border-emerald-200 transition-all duration-500 relative overflow-hidden flex flex-col"
              >
                <div className="relative z-10 flex-1">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-emerald-600 group-hover:text-white group-hover:rotate-6 transition-all shadow-sm">
                      👨‍🏫
                    </div>
                  </div>

                  <h4 className="text-[13px] font-black text-slate-800 uppercase leading-tight mb-5 group-hover:text-emerald-700 transition-colors min-h-[2.5rem]">
                    {teacher.nama}
                  </h4>
                  
                  <div className="space-y-4 pt-4 border-t border-slate-50">
                    <div className="flex flex-col gap-1">
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Jawatan Utama</span>
                       <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <span className="text-[10px] font-bold text-slate-600 leading-tight uppercase tracking-tight">{teacher.jawatan}</span>
                       </div>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Opsyen Strategik</span>
                       <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                          <span className="text-[10px] font-black text-blue-600 leading-tight uppercase tracking-tight">{teacher.opsyen}</span>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-50 flex items-center justify-between">
                   <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">SK Pekan Tenom</span>
                   <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-emerald-500/20 rounded-full group-hover:bg-emerald-500 transition-colors"></div>
                      <div className="w-2 h-2 bg-blue-500/20 rounded-full group-hover:bg-blue-500 transition-colors"></div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
             <div className="w-24 h-24 bg-white rounded-[3rem] flex items-center justify-center mx-auto mb-8 text-slate-200 shadow-sm border border-slate-100">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
             </div>
             <h3 className="text-slate-400 font-black uppercase text-sm tracking-[0.4em]">Rekod Tidak Ditemui</h3>
             <p className="text-[11px] text-slate-300 mt-2 font-bold uppercase tracking-widest">Sila gunakan kata kunci carian yang berbeza.</p>
          </div>
        )}
      </div>

      <div className="mt-12 flex flex-col items-center gap-4">
         <div className="h-px w-24 bg-slate-200"></div>
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.6em] opacity-40">
           Digital HR Intelligence Hub SKPTEN
         </p>
      </div>
    </div>
  );
};

export default SenaraiGuru;
