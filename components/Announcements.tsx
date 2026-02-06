
import React, { useMemo, useState, useEffect } from 'react';
import { TakwimEvent } from '../types';

interface AnnouncementsProps {
  events: TakwimEvent[];
  loading: boolean;
}

const Announcements: React.FC<AnnouncementsProps> = ({ events, loading }) => {
  const teacherAvatar = "https://lh3.googleusercontent.com/d/1lCegcUF3-GYyTPbSidhJdSfU_AZdyj8p=s1000";
  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number }>({ d: 0, h: 0, m: 0, s: 0 });

  const nextEvent = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const upcoming = events
      .filter(e => e.date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    
    return upcoming.length > 0 ? upcoming[0] : null;
  }, [events]);

  useEffect(() => {
    if (!nextEvent) return;

    const timer = setInterval(() => {
      const target = new Date(nextEvent.date);
      target.setHours(8, 0, 0, 0); // Anggap program mula jam 8 pagi
      const now = new Date().getTime();
      const distance = target.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
      } else {
        setTimeLeft({
          d: Math.floor(distance / (1000 * 60 * 60 * 24)),
          h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          s: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextEvent]);

  if (loading || !nextEvent) return null;

  return (
    <div className="w-full mb-8 group">
      <div className="relative bg-[#0f172a] rounded-[2rem] p-1 shadow-[0_20px_50px_-15px_rgba(30,58,138,0.5)] border border-white/5 overflow-hidden">
        
        {/* Glow Background Effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/10 via-transparent to-transparent opacity-50 group-hover:from-blue-600/20 transition-all duration-700"></div>
        
        {/* Shimmer Scanline */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms] ease-in-out"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-4 lg:gap-8 p-3 px-5">
          
          {/* Cgu Din Section (The Anchor) */}
          <div className="flex items-center gap-4 shrink-0 border-b lg:border-b-0 lg:border-r border-white/10 pb-3 lg:pb-0 lg:pr-8">
            <div className="relative">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)] border-2 border-blue-500/30 overflow-hidden transform group-hover:scale-110 transition-transform duration-500">
                <img src={teacherAvatar} alt="Cgu Din" className="w-full h-full object-contain scale-125 translate-y-1.5" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#0f172a] rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-0.5">Berita Terkini</span>
              <h4 className="text-[12px] font-black text-white uppercase tracking-tight">UNIT KURIKULUM SKPTEN</h4>
            </div>
          </div>

          {/* Event Content Section */}
          <div className="flex-1 flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-xl shrink-0">
               <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,1)]"></span>
               <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Live Takwim</span>
            </div>
            
            <div className="flex flex-col items-center md:items-start overflow-hidden flex-1">
              <p className="text-white text-xs md:text-sm font-black uppercase tracking-tight truncate w-full text-center md:text-left group-hover:text-blue-400 transition-colors">
                {nextEvent.program}
              </p>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest border-r border-slate-700 pr-3">
                  Siri Transformasi 2026
                </span>
                <span className="text-[9px] font-black text-blue-300 uppercase bg-blue-500/20 px-2 py-0.5 rounded border border-blue-500/30">
                  {nextEvent.unit}
                </span>
              </div>
            </div>
          </div>

          {/* Countdown Section (The Pro Timer) */}
          <div className="shrink-0 flex items-center gap-5 bg-black/40 backdrop-blur-md p-2.5 px-6 rounded-2xl border border-white/5 shadow-inner w-full lg:w-auto justify-center">
            <div className="flex flex-col items-center">
               <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Mula Dalam</span>
               <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-black text-white leading-none">{timeLeft.d}</span>
                    <span className="text-[7px] font-bold text-slate-500 uppercase">Hari</span>
                  </div>
                  <span className="text-blue-500 font-black animate-pulse">:</span>
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-black text-white leading-none">{String(timeLeft.h).padStart(2, '0')}</span>
                    <span className="text-[7px] font-bold text-slate-500 uppercase">Jam</span>
                  </div>
                  <span className="text-blue-500 font-black animate-pulse">:</span>
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-black text-blue-400 leading-none">{String(timeLeft.m).padStart(2, '0')}</span>
                    <span className="text-[7px] font-bold text-slate-500 uppercase">Minit</span>
                  </div>
                  <span className="text-blue-500 font-black animate-pulse">:</span>
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-black text-emerald-400 leading-none">{String(timeLeft.s).padStart(2, '0')}</span>
                    <span className="text-[7px] font-bold text-slate-500 uppercase">Saat</span>
                  </div>
               </div>
            </div>
            
            <div className="w-px h-10 bg-white/10 hidden md:block"></div>
            
            <div className="hidden md:flex flex-col items-center md:items-end">
               <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Tarikh Rasmi</span>
               <span className="text-[11px] font-black text-blue-400 uppercase tracking-tighter">
                 {nextEvent.date.toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' })}
               </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Announcements;
