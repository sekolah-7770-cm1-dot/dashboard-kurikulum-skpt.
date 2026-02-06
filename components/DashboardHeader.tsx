
import React, { useState, useEffect } from 'react';
import { DAY_NAMES, MONTH_NAMES } from '../constants';

const DashboardHeader: React.FC = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const dayName = DAY_NAMES[now.getDay()];
      const day = now.getDate();
      const monthName = MONTH_NAMES[now.getMonth()];
      const year = now.getFullYear();
      
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');

      setCurrentDate(`${dayName.toUpperCase()}, ${day} ${monthName.toUpperCase()} ${year}`);
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000 * 60);
    return () => clearInterval(timer);
  }, []);

  /**
   * Menggunakan format lh3.googleusercontent.com/d/ID
   */
  const fileId = "1ZTDcPpUpuUbbjp0ibxQoBOQIZjWWq89J";
  const googleDriveLogoUrl = `https://lh3.googleusercontent.com/d/${fileId}=s1000?authuser=0`;

  return (
    <header className="relative bg-[#0f172a] text-white p-8 md:p-10 rounded-[2rem] shadow-2xl mb-10 overflow-hidden border border-white/5 group">
      {/* GLOBAL SHIMMER SCAN EFFECT - Menyapu keseluruhan HEADER dari hujung ke hujung */}
      <div className="global-shimmer-effect"></div>

      {/* Background Overlays */}
      <div 
        className="absolute inset-0 opacity-[0.15] grayscale mix-blend-overlay pointer-events-none"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1600")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>

      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M0 10 H20 M20 10 L30 0 M30 0 H50 M50 0 L60 10 H100" stroke="white" strokeWidth="0.5" fill="none"/>
              <circle cx="20" cy="10" r="1" fill="white"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>
      
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-600/20 blur-[100px] rounded-full"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-600/20 blur-[100px] rounded-full"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em]">Live System</span>
            </div>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] border-l border-slate-800 pl-3">Digital 4.0 Core</span>
          </div>
          
          <div className="flex items-center gap-4 text-slate-400">
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-widest">{currentTime}</span>
             </div>
             <span className="text-[10px] font-bold tracking-widest border-l border-slate-800 pl-4">{currentDate}</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          
          <div className="relative flex items-start gap-6 py-2 px-1">
            <div className="relative">
              {/* Logo Container */}
              <div className="relative flex items-center justify-center w-[115px] h-[106px] md:w-[132px] md:h-[122px] transition-all duration-700 transform translate-y-[5%] group-hover:translate-y-0 group-hover:scale-105">
                {!imgError ? (
                  <img 
                    src={googleDriveLogoUrl} 
                    alt="Logo SK Pekan Tenom" 
                    crossOrigin="anonymous"
                    className="w-full h-full object-contain relative z-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] animate-logo-float"
                    onError={() => {
                      console.error("Gagal memuatkan logo.");
                      setImgError(true);
                    }}
                  />
                ) : (
                  <div className="relative z-10 flex flex-col items-center justify-center text-center bg-slate-900/40 backdrop-blur-xl p-4 rounded-3xl border border-white/10 animate-logo-float">
                    <div className="w-12 h-12 mb-1 flex items-center justify-center bg-blue-500/20 rounded-full border border-blue-500/30">
                       <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                       </svg>
                    </div>
                    <span className="text-xl font-black text-blue-400 tracking-tighter">SKPT</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="relative flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-[10px] md:text-xs font-bold tracking-[0.4em] text-blue-400 uppercase">
                  Sekolah Kebangsaan Pekan Tenom
                </h2>
              </div>
              <h1 className="font-black tracking-tight text-white leading-[0.85] flex flex-col">
                <span className="text-4xl md:text-7xl uppercase">DASHBOARD</span>
                <span className="text-[1.65rem] md:text-[2.65rem] mt-2 text-transparent bg-clip-text bg-gradient-to-b from-slate-100 via-white to-slate-400 filter drop-shadow-[0_10px_12px_rgba(0,0,0,0.6)]">
                  UNIT KURIKULUM
                </span>
              </h1>
              
              <div className="mt-8 space-y-1">
                <p className="text-slate-300 text-[10px] md:text-xs font-semibold tracking-[0.1em] uppercase">
                  Pengurusan Digital & Tranformasi Pendidikan Unit Kurikulum
                </p>
                <p className="text-yellow-400 text-[10px] font-bold italic tracking-widest lowercase">
                  #inspirasicemerlang
                </p>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8 border-l border-white/10 pl-8 bg-black/20 backdrop-blur-md p-6 rounded-[2rem] border border-white/5 shadow-xl relative z-20">
            <div className="text-right">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Edisi</p>
              <p className="text-xs font-bold text-blue-100">Transformasi 2026</p>
            </div>
            <div className="h-10 w-px bg-white/10"></div>
            <div className="text-right">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Sistem</p>
              <div className="flex items-center justify-end gap-2">
                <span className="text-xs font-bold text-emerald-400">Aktif</span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
