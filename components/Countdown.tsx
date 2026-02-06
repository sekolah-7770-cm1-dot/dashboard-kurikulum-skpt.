
import React, { useMemo } from 'react';
import { TakwimEvent } from '../types';

interface CountdownProps {
  events: TakwimEvent[];
}

const Countdown: React.FC<CountdownProps> = ({ events }) => {
  const nextBigEvent = useMemo(() => {
    const now = new Date();
    // Cari acara yang mengandungi kata kunci penting
    const keywords = ['UASA', 'CUTI', 'MESYUARAT', 'PEPERIKSAAN', 'BENGKEL', 'SUKAN'];
    return events
      .filter(e => e.date >= now)
      .filter(e => keywords.some(k => e.program.toUpperCase().includes(k)))
      .sort((a, b) => a.date.getTime() - b.date.getTime())[0];
  }, [events]);

  if (!nextBigEvent) return null;

  const diffTime = Math.abs(nextBigEvent.date.getTime() - new Date().getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl p-6 text-white shadow-lg flex items-center justify-between overflow-hidden relative group">
      <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
         <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
           <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 100 16 8 8 0 000-16zm1 8h4v2h-6V7h2v5z" />
         </svg>
      </div>
      
      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-100 mb-1">Kira Detik Acara Terhampir</p>
        <h3 className="text-lg font-black uppercase leading-tight max-w-[200px]">{nextBigEvent.program}</h3>
        <p className="text-[10px] font-bold text-amber-100 mt-1 uppercase tracking-widest italic">
          {nextBigEvent.date.toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center bg-white/20 backdrop-blur-md rounded-2xl p-4 min-w-[100px] border border-white/30">
        <span className="text-4xl font-black">{diffDays}</span>
        <span className="text-[9px] font-black uppercase tracking-widest">HARI LAGI</span>
      </div>
    </div>
  );
};

export default Countdown;
