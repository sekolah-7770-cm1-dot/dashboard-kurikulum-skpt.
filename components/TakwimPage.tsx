
import React, { useState, useMemo, useEffect } from 'react';
import { TakwimEvent } from '../types';
import { MONTH_NAMES } from '../constants';

interface TakwimPageProps {
  events: TakwimEvent[];
  loading: boolean;
  onBack: () => void;
}

const TakwimPage: React.FC<TakwimPageProps> = ({ events, loading, onBack }) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [searchTerm, setSearchTerm] = useState('');

  const teacherAvatar = "https://lh3.googleusercontent.com/d/1lCegcUF3-GYyTPbSidhJdSfU_AZdyj8p=s1000";

  const getUnitColor = (unit: string) => {
    const u = (unit || 'UMUM').toUpperCase();
    if (u.includes('KURIKULUM')) return 'text-blue-600 bg-blue-50 border-blue-100';
    if (u.includes('HEM')) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (u.includes('KOKU')) return 'text-rose-600 bg-rose-50 border-rose-100';
    if (u.includes('SUWA') || u.includes('PIBG')) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-slate-500 bg-slate-50 border-slate-100';
  };

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesMonth = e.date.getMonth() === selectedMonth;
      const matchesSearch = e.program.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesMonth && matchesSearch;
    });
  }, [events, selectedMonth, searchTerm]);

  // Sorotan Tarikh Penting (Aktiviti Besar Sepanjang Tahun)
  const importantDates = useMemo(() => {
    const now = new Date();
    now.setHours(0,0,0,0);
    const keywords = ['UASA', 'CUTI', 'MESYUARAT AGUNG', 'PEPERIKSAAN', 'PBD', 'SUKAN', 'RAYA', 'CINA', 'MAULIDUR'];
    return events
      .filter(e => e.date >= now)
      .filter(e => keywords.some(k => e.program.toUpperCase().includes(k)))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
  }, [events]);

  const nextReminder = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const upcoming = events
      .filter(e => e.date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    return upcoming.length > 0 ? upcoming[0] : null;
  }, [events]);

  const monthStats = useMemo(() => {
    const monthEvents = events.filter(e => e.date.getMonth() === selectedMonth);
    return { total: monthEvents.length };
  }, [events, selectedMonth]);

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Menyusun Takwim Digital...</p>
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

        <div className="hidden md:flex items-center gap-3 px-6 py-2.5 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
           <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
           <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Takwim Rasmi Digital</span>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] p-6 md:p-12 shadow-sm border border-slate-200">
        
        {/* Intro Section with Avatar */}
        <div className="mb-12 p-6 md:p-10 bg-slate-900 rounded-[3rem] flex flex-col md:row items-center gap-10 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[120px] rounded-full"></div>
           <div className="flex flex-col md:flex-row items-center gap-10 relative z-10 w-full">
              <div className="relative flex-shrink-0">
                <div className="w-36 h-36 md:w-52 md:h-52 bg-white/10 backdrop-blur-xl rounded-[2.5rem] shadow-2xl flex items-center justify-center border-2 border-white/20 p-1 transform transition-all duration-700 group-hover:scale-105 group-hover:border-blue-500/50">
                  <img 
                    src={teacherAvatar} 
                    alt="Cgu Din" 
                    className="w-full h-full object-contain transform translate-y-2 scale-110" 
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-8 h-8 rounded-full border-4 border-slate-900 shadow-xl flex items-center justify-center">
                   <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                 <h2 className="text-[12px] md:text-[14px] font-black text-blue-400 uppercase tracking-[0.3em] mb-3">PENGURUSAN TAKWIM UNIT KURIKULUM SKPTEN</h2>
                 <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none mb-6">
                   KALENDAR <span className="text-blue-500 font-black">AKADEMIK</span> 2026
                 </h1>
                 <p className="text-[11px] md:text-[14px] text-slate-300 font-bold italic leading-relaxed opacity-90 max-w-2xl">
                   "Takwim digital anda kini diselaraskan dengan data terkini daripada Google Sheets. Pantau tarikh penting dengan lebih mudah dan sistematik."
                 </p>
              </div>
           </div>
        </div>

        {/* Tarikh Penting Highlights Section (NEW) */}
        <div className="mb-12">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Tarikh Penting 2026</h2>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-black rounded uppercase tracking-widest">Highlights</span>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {importantDates.length > 0 ? importantDates.map((item, idx) => (
                <div key={idx} className="bg-amber-50 border border-amber-100 p-5 rounded-3xl hover:shadow-lg transition-all group relative overflow-hidden">
                   <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-125 transition-transform duration-700 text-amber-600">
                      <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 100 16 8 8 0 000-16zm1 8h4v2h-6V7h2v5z" />
                      </svg>
                   </div>
                   <div className="relative z-10">
                      <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">
                        {item.date.toLocaleDateString('ms-MY', { day: 'numeric', month: 'short' })}
                      </p>
                      <h4 className="text-[11px] font-black text-slate-800 uppercase leading-tight line-clamp-2">
                        {item.program}
                      </h4>
                      <div className="mt-3 flex items-center justify-between">
                         <span className="text-[8px] font-bold text-amber-500 uppercase">{item.unit || 'UMUM'}</span>
                         <span className="text-[8px] font-black text-white bg-amber-500 px-2 py-0.5 rounded-full">
                           {Math.ceil((item.date.getTime() - new Date().getTime()) / (1000 * 3600 * 24))} hari
                         </span>
                      </div>
                   </div>
                </div>
              )) : (
                <div className="col-span-5 py-8 bg-slate-50 border border-dashed border-slate-200 rounded-3xl text-center">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tiada tarikh penting dikesan buat masa ini</p>
                </div>
              )}
           </div>
        </div>

        {/* Month Selector Bar */}
        <div className="mb-12 flex items-center gap-2 overflow-x-auto pb-4 custom-scrollbar -mx-4 px-4 border-t border-slate-50 pt-12">
           {MONTH_NAMES.map((month, idx) => (
             <button
              key={idx}
              onClick={() => setSelectedMonth(idx)}
              className={`flex-shrink-0 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                selectedMonth === idx
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 -translate-y-1'
                : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
              }`}
             >
               {month}
             </button>
           ))}
        </div>

        {/* Search & Grid Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 border-b border-slate-50 pb-8">
           <div className="flex flex-col items-center md:items-start">
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                Aktiviti: {MONTH_NAMES[selectedMonth]} 2026
              </h2>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">Senarai Aktiviti Mengikut Bulan Pilihan</p>
           </div>
           
           <div className="relative w-full md:w-80">
              <input 
                type="text" 
                placeholder="Cari aktiviti..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all shadow-sm"
              />
              <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
           </div>
        </div>

        {/* Peringatan Aktiviti Terdekat (Banner) */}
        {nextReminder && (
          <div className="mb-10 p-6 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-[2.5rem] shadow-xl shadow-blue-200/50 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group border border-blue-400/30">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
             <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/30 group-hover:rotate-12 transition-transform duration-500">
               <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
               </svg>
             </div>
             <div className="flex-1 text-center md:text-left">
                <span className="text-[9px] font-black text-blue-100 uppercase tracking-[0.4em] mb-1 block">Peringatan Aktiviti Mendatang</span>
                <h3 className="text-lg md:text-xl font-black text-white uppercase leading-tight tracking-tight">
                  {nextReminder.program}
                </h3>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
                   <div className="px-3 py-1 bg-white/10 rounded-lg border border-white/20 flex items-center gap-2">
                      <svg className="w-3 h-3 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-[10px] font-bold text-white uppercase">
                        {nextReminder.date.toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                   </div>
                   <span className="px-3 py-1 bg-emerald-500 text-white text-[9px] font-black rounded-lg uppercase tracking-widest shadow-lg">
                      {nextReminder.unit || 'UMUM'}
                   </span>
                </div>
             </div>
             <div className="bg-white/10 backdrop-blur-xl p-4 px-6 rounded-3xl border border-white/20 text-center min-w-[120px]">
                <p className="text-[8px] font-black text-blue-100 uppercase tracking-widest mb-1">Kira Detik</p>
                <p className="text-3xl font-black text-white">
                  {Math.ceil((nextReminder.date.getTime() - new Date().getTime()) / (1000 * 3600 * 24))}
                </p>
                <p className="text-[8px] font-black text-blue-200 uppercase tracking-widest">Hari Lagi</p>
             </div>
          </div>
        )}

        {/* Takwim Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event, idx) => {
              const today = isToday(event.date);
              const unitStyle = getUnitColor(event.unit);
              
              return (
                <div 
                  key={idx} 
                  className={`relative group rounded-[2.5rem] border p-6 flex flex-col gap-5 transition-all duration-500 hover:-translate-y-2 ${
                    today 
                    ? 'bg-blue-600 border-blue-500 shadow-2xl shadow-blue-200' 
                    : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-slate-200/40'
                  }`}
                >
                  <div className="flex justify-between items-start">
                     <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl border ${
                       today ? 'bg-white border-white' : 'bg-slate-50 border-slate-100 group-hover:bg-blue-50'
                     } transition-colors shadow-sm`}>
                        <span className={`text-xl font-black leading-none ${today ? 'text-blue-600' : 'text-slate-800'}`}>
                          {event.date.getDate()}
                        </span>
                        <span className={`text-[8px] font-bold uppercase ${today ? 'text-blue-400' : 'text-slate-400'}`}>
                          {MONTH_NAMES[event.date.getMonth()].substring(0, 3)}
                        </span>
                     </div>
                     {today && (
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[8px] font-black text-white uppercase tracking-widest border border-white/30 animate-pulse">Hari Ini</span>
                     )}
                  </div>

                  <div className="flex-1">
                     <span className={`text-[8px] font-black uppercase tracking-[0.25em] ${today ? 'text-blue-200' : 'text-slate-400'}`}>
                       Program / Aktiviti
                     </span>
                     <h4 className={`text-sm font-black uppercase leading-tight tracking-tight mt-1 line-clamp-3 ${
                       today ? 'text-white' : 'text-slate-700 group-hover:text-blue-700'
                     }`}>
                       {event.program}
                     </h4>
                  </div>

                  <div className={`pt-4 border-t ${today ? 'border-white/10' : 'border-slate-50'} flex flex-col gap-2`}>
                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${today ? 'text-blue-200' : 'text-slate-400'}`}>
                      Tindakan Unit
                    </span>
                    <span className={`px-4 py-2 rounded-xl text-[10px] font-bold border truncate text-center ${
                      today ? 'bg-white/10 border-white/20 text-white' : unitStyle
                    }`}>
                      {event.unit || 'UMUM'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-32 text-center flex flex-col items-center">
             <div className="w-24 h-24 bg-slate-50 rounded-[3rem] flex items-center justify-center mb-8 text-slate-200 border border-slate-100">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
             </div>
             <h3 className="text-slate-400 font-black uppercase text-sm tracking-[0.4em]">Tiada Aktiviti Terjadual</h3>
             <p className="text-[10px] text-slate-300 mt-2 font-bold uppercase">Sila cuba carian lain atau tukar bulan pilihan anda.</p>
          </div>
        )}
      </div>

      <div className="mt-12 text-center">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.6em] opacity-40">
           Digital Calendar Core SKPTEN
         </p>
      </div>
    </div>
  );
};

export default TakwimPage;
