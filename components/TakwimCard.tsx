
import React, { useState, useMemo, useEffect } from 'react';
import { TakwimEvent } from '../types';
import { MONTH_NAMES } from '../constants';

interface TakwimCardProps {
  events: TakwimEvent[];
  loading: boolean;
}

const TakwimCard: React.FC<TakwimCardProps> = ({ events, loading }) => {
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');

  // Cari bulan unik yang hanya mempunyai data aktiviti
  const uniqueMonths = useMemo(() => {
    const monthMap = new Map();
    events.forEach(e => {
      const key = `${e.date.getFullYear()}-${e.date.getMonth()}`;
      if (!monthMap.has(key)) {
        monthMap.set(key, { year: e.date.getFullYear(), month: e.date.getMonth() });
      }
    });
    return Array.from(monthMap.values()).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });
  }, [events]);

  useEffect(() => {
    // Logik Automatik: Pilih bulan semasa jika wujud dalam data
    if (!loading && events.length > 0 && selectedMonth === 'all') {
      const now = new Date();
      const currentMonthIndex = now.getMonth();
      const currentYear = now.getFullYear();

      // Cuba cari jika bulan & tahun semasa ada dalam data unik
      const hasCurrentMonth = uniqueMonths.find(
        m => m.month === currentMonthIndex && m.year === currentYear
      );

      if (hasCurrentMonth) {
        setSelectedMonth(currentMonthIndex);
      } else if (uniqueMonths.length > 0) {
        // Jika tiada aktiviti bulan ini, pilih bulan pertama yang tersedia dalam data
        setSelectedMonth(uniqueMonths[0].month);
      }
    }
  }, [events, loading, selectedMonth, uniqueMonths]);

  const filteredEvents = useMemo(() => {
    if (selectedMonth === 'all') return events;
    return events.filter(e => e.date.getMonth() === selectedMonth);
  }, [events, selectedMonth]);

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const getUnitColor = (unit: string) => {
    const u = unit.toUpperCase();
    if (u.includes('KURIKULUM')) return 'text-blue-600 bg-blue-50 border-blue-100';
    if (u.includes('HEM')) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (u.includes('KOKU')) return 'text-rose-600 bg-rose-50 border-rose-100';
    if (u.includes('SUWA') || u.includes('PIBG')) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-slate-500 bg-slate-50 border-slate-100';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-[2.5rem] p-12 shadow-sm border border-slate-200 h-80 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-[5px] border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-black text-xs uppercase tracking-[0.3em]">Digitalizing Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-slate-200 h-full flex flex-col overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
        <div className="relative">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Takwim Kurikulum</h2>
          <div className="h-1.5 w-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mt-2"></div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select 
            className="w-full sm:w-auto bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-black rounded-2xl p-3.5 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all uppercase tracking-widest shadow-sm"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
          >
            <option value="all">📅 Arkib Keseluruhan</option>
            {uniqueMonths.map(m => (
              <option key={`${m.year}-${m.month}`} value={m.month}>
                {MONTH_NAMES[m.month].toUpperCase()} {m.year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4">
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEvents.map((event, idx) => {
              const today = isToday(event.date);
              const unitStyle = getUnitColor(event.unit);
              
              return (
                <div 
                  key={idx} 
                  className={`relative group rounded-3xl border p-5 flex flex-col gap-4 transition-all duration-500 hover:-translate-y-1 ${
                    today 
                    ? 'bg-blue-600 border-blue-500 shadow-xl shadow-blue-200' 
                    : 'bg-white border-slate-100 hover:border-blue-300 hover:shadow-2xl hover:shadow-slate-200/50'
                  }`}
                >
                  {/* Hari Ini Indicator */}
                  {today && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg border border-white/30">
                       <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                       <span className="text-[8px] font-black text-white uppercase tracking-tighter">HARI INI</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className={`flex flex-col items-center justify-center min-w-[52px] h-[52px] rounded-2xl border ${
                      today ? 'bg-white border-white' : 'bg-slate-50 border-slate-100 group-hover:bg-blue-50'
                    } transition-colors`}>
                      <span className={`text-xl font-black leading-none ${today ? 'text-blue-600' : 'text-slate-800'}`}>
                        {event.date.getDate()}
                      </span>
                      <span className={`text-[8px] font-bold uppercase ${today ? 'text-blue-400' : 'text-slate-400'}`}>
                        {MONTH_NAMES[event.date.getMonth()].substring(0, 3)}
                      </span>
                    </div>
                    <div className="flex flex-col">
                       <span className={`text-[9px] font-black uppercase tracking-widest ${today ? 'text-blue-100' : 'text-slate-300'}`}>
                         Aktiviti
                       </span>
                       <h4 className={`text-[13px] font-black uppercase leading-tight tracking-tight line-clamp-2 ${
                         today ? 'text-white' : 'text-slate-700 group-hover:text-blue-700'
                       }`}>
                         {event.program}
                       </h4>
                    </div>
                  </div>

                  <div className={`mt-auto pt-4 border-t ${today ? 'border-white/10' : 'border-slate-50'} flex flex-col gap-1`}>
                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${today ? 'text-blue-200' : 'text-slate-400'}`}>
                      Tindakan
                    </span>
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border truncate max-w-[140px] ${
                        today ? 'bg-white/10 border-white/20 text-white' : unitStyle
                      }`}>
                        {event.unit || 'UMUM'}
                      </span>
                      <svg className={`w-4 h-4 transition-transform group-hover:scale-125 ${today ? 'text-white/40' : 'text-slate-200 group-hover:text-blue-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 text-slate-200 border border-slate-100">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
               </svg>
            </div>
            <h3 className="text-slate-400 font-black uppercase text-xs tracking-[0.3em]">Tiada Jadual Ditemui</h3>
            <p className="text-[10px] text-slate-300 mt-2 font-bold uppercase">Sistem sedia untuk input data baharu</p>
          </div>
        )}
      </div>
      
      <div className="mt-8 pt-6 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
             <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white"></div>
             <div className="w-6 h-6 rounded-full bg-emerald-100 border-2 border-white"></div>
             <div className="w-6 h-6 rounded-full bg-rose-100 border-2 border-white"></div>
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bersepadu</span>
        </div>
        <div className="flex items-center gap-3">
           <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-1.5 rounded-xl uppercase tracking-widest shadow-sm">
             {filteredEvents.length} AKTIVITI TERJADUAL
           </span>
        </div>
      </div>
    </div>
  );
};

export default TakwimCard;
