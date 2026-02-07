
import React, { useMemo } from 'react';
import { MONTH_NAMES } from '../constants';

interface EOPRKurikulumProps {
  onBack: () => void;
  folderImages?: {url: string, name: string, dateStr?: string}[];
}

const EOPRKurikulum: React.FC<EOPRKurikulumProps> = ({ onBack, folderImages = [] }) => {
  const APPSHEET_URL = "https://www.appsheet.com/newshortcut/9f42ef3e-2741-46b4-8751-67c13379fc21";
  
  const posterImage = "https://lh3.googleusercontent.com/d/1sNNV1ML-sXCirnHDZN5er7UjChYD-uRh=s1600";
  const schoolLogo = "https://lh3.googleusercontent.com/d/1ZTDcPpUpuUbbjp0ibxQoBOQIZjWWq89J=s1000";
  const teacherAvatar = "https://lh3.googleusercontent.com/d/1lCegcUF3-GYyTPbSidhJdSfU_AZdyj8p=s1000";

  const modules = [
    { title: 'Laporan Impak Program', desc: 'Dokumentasi pelaksanaan, keberkesanan, dan refleksi aktiviti unit.', status: 'Aktif', icon: '📋' },
    { title: 'PBD & Intervensi', desc: 'Analisis tahap penguasaan murid dan perancangan pelan tindakan.', status: 'Kritikal', icon: '📊' },
    { title: 'PLC & Kolaborasi', desc: 'Rekod Professional Learning Community dan perkongsian ilmu guru.', status: 'Dinamik', icon: '👥' },
    { title: 'Pencerapan & Pemantauan', desc: 'Pemantauan kualiti PdP dan semakan hasil kerja murid berkala.', status: 'Berkala', icon: '🔍' },
    { title: 'Data Headcount & UASA', desc: 'Pemantauan sasaran ETR dan analisis pencapaian peperiksaan.', status: 'Penting', icon: '📈' },
    { title: 'Pengurusan Fail Digital', desc: 'Sistem arkib digital bersepadu bagi dokumen dan minit mesyuarat.', status: 'Tersusun', icon: '📁' },
  ];

  // Algoritma untuk mengambil 10 gambar unik dari bulan yang berbeza, berubah setiap hari
  const monthlyHighlights = useMemo(() => {
    if (!folderImages || folderImages.length === 0) return [];
    
    // Jana seed unik berdasarkan hari ini (YYYYMMDD)
    const now = new Date();
    const daySeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
    
    const result: {url: string, month: string}[] = [];

    // Loop untuk 10 bulan pertama (JAN - OKT)
    for (let m = 0; m < 10; m++) {
      // Cari semua gambar yang berada dalam bulan m + 1
      const imgsInMonth = folderImages.filter(img => {
        if (!img.dateStr) return false;
        const parts = img.dateStr.split(/[\/-]/);
        if (parts.length < 2) return false;
        // Match sama ada bahagian pertama (M) atau kedua (D) adalah bulan yang dicari
        // Ini untuk menangani pelbagai format tarikh CSV
        const val1 = parseInt(parts[0]);
        const val2 = parseInt(parts[1]);
        return val1 === m + 1 || val2 === m + 1;
      });

      if (imgsInMonth.length > 0) {
        // Pilih satu gambar secara rawak tetapi stabil bagi hari tersebut
        const selectedIdx = daySeed % imgsInMonth.length;
        result.push({ 
          url: imgsInMonth[selectedIdx].url, 
          month: MONTH_NAMES[m].substring(0, 3).toUpperCase() 
        });
      } else {
        // Jika tiada gambar bagi bulan tersebut, ambil mana-mana gambar secara stabil
        const fallbackIdx = (daySeed + m) % folderImages.length;
        result.push({ 
          url: folderImages[fallbackIdx].url, 
          month: MONTH_NAMES[m].substring(0, 3).toUpperCase() 
        });
      }
    }

    return result;
  }, [folderImages]);

  return (
    <div className="animate-fade-in min-h-screen pb-20">
      {/* Navigation Header */}
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
           <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">OPR Command Intelligence System</span>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] p-6 md:p-12 shadow-sm border border-slate-200 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-8 items-start">
            
            {/* POSTER DISPLAY SECTION */}
            <div className="lg:col-span-5 flex justify-center">
               <div className="relative w-full max-w-[360px] aspect-[9/16] bg-[#1a1c23] rounded-[2.5rem] border-[6px] border-[#2a2d37] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col items-center group">
                  <img 
                    src={posterImage} 
                    alt="eOPR Kurikulum Poster" 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none"></div>
                  <div className="absolute bottom-10 left-6 right-6 flex items-center gap-3 py-3 px-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">System Online</span>
                  </div>
               </div>
            </div>

            {/* INTERACTIVE CONTROLS SECTION */}
            <div className="lg:col-span-7 pt-2">
              
              {/* COMPACT CARD WITH ENLARGED AVATAR */}
              <div className="mb-10 p-6 md:p-10 bg-blue-50/40 border border-blue-100 rounded-[3rem] relative flex flex-col sm:flex-row items-center gap-10 shadow-sm transition-all hover:bg-white hover:shadow-xl group">
                <div className="relative flex-shrink-0">
                  <div className="w-36 h-36 md:w-48 md:h-48 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center border-4 border-white p-1 transform transition-all duration-700 group-hover:scale-105 group-hover:shadow-blue-200">
                    <img 
                      src={teacherAvatar} 
                      alt="cikgu Din Avatar" 
                      className="w-full h-full object-contain transform translate-y-1 scale-110"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-emerald-400 w-7 h-7 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                     <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mb-3">
                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-100 px-4 py-1 rounded-full border border-blue-200">
                      ASISTEN DIGITAL
                    </span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic">
                      KURIKULUM V2.0
                    </span>
                  </div>
                  
                  <h2 className="text-lg md:text-xl font-black text-slate-900 uppercase leading-tight mb-3 tracking-normal">
                    cikgu Din – PEMBANTU DIGITAL UNIT KURIKULUM SKPTEN
                  </h2>
                  
                  <p className="text-[11px] md:text-[13px] text-slate-500 font-bold italic leading-relaxed max-w-lg opacity-90">
                    "Selamat bertugas, rakan pendidik! Mari kita memantapkan dokumentasi kurikulum melalui gerbang digital yang serba pantas ini."
                  </p>
                </div>
              </div>

              {/* Descriptions & Access */}
              <div className="mb-8 pl-2">
                <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-3">Gateway Access</h3>
                <h1 className="text-4xl md:text-5xl font-black text-slate-800 leading-none mb-4 tracking-tighter">
                  PUSAT KAWALAN <span className="text-blue-600">eOPR</span>
                </h1>
                <p className="text-slate-600 text-[13px] font-medium leading-relaxed max-w-xl">
                  Gerbang Penyelarasan eOPR Unit Kurikulum SKPTEN adalah pemacu transformasi digital yang menyediakan akses strategik bagi pelaporan dan pemantauan prestasi akademik secara dinamik dan bersepadu.
                </p>
              </div>

              {/* DECORATIVE MONTHLY GALLERY - Filling the empty space with daily rotation */}
              <div className="mb-10 p-6 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 relative overflow-hidden group/gallery">
                 <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                       <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                       <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">SOROTAN AKTIVITI BULANAN</h3>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Koleksi Lensa Unit Kurikulum SKPTEN</span>
                       <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">*Gambar berubah setiap hari</span>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-5 gap-3">
                    {monthlyHighlights.map((img, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 group/img">
                         <div className="w-full aspect-square bg-white rounded-2xl overflow-hidden border-2 border-white shadow-sm transition-all duration-500 group-hover/img:-translate-y-1 group-hover/img:shadow-md group-hover/img:border-blue-400">
                            <img 
                              src={img.url} 
                              alt={`Aktiviti ${img.month}`} 
                              className="w-full h-full object-cover grayscale-[0.3] group-hover/img:grayscale-0 transition-all duration-700" 
                            />
                         </div>
                         <span className="text-[8px] font-black text-slate-400 uppercase group-hover/img:text-blue-600 transition-colors tracking-tighter">
                            {img.month}
                         </span>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Modules Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                {modules.map((m, idx) => (
                  <div key={idx} className="bg-slate-50/50 border border-slate-100 p-5 rounded-[2rem] hover:bg-white hover:shadow-xl hover:border-blue-200 transition-all duration-500 group cursor-default">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-10 h-10 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all text-lg">
                        {m.icon}
                      </div>
                      <div>
                        <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-wide">{m.title}</h3>
                        <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Status: {m.status}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{m.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <a 
                  href={APPSHEET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-black uppercase tracking-[0.25em] rounded-2xl shadow-xl shadow-blue-200/50 transition-all active:scale-95 group"
                >
                  Buka Laporan AppSheet
                  <svg className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
                
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl">
                   <img src={schoolLogo} className="w-5 h-5 object-contain opacity-50" alt="SKPT" />
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">
                     *Penyelarasan Data Aktif
                   </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12 text-center">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.6em] opacity-40">
           Digital Core Intelligence SKPTEN
         </p>
      </div>
    </div>
  );
};

export default EOPRKurikulum;
