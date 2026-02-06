
import React from 'react';

interface BukuPengurusanProps {
  onBack: () => void;
}

const BukuPengurusan: React.FC<BukuPengurusanProps> = ({ onBack }) => {
  const docId = "1YRYDLvikDFhqLiypE8DsmZXJsQi_AzNO";
  const pdfUrl = `https://drive.google.com/file/d/${docId}/preview`;
  const viewUrl = `https://drive.google.com/file/d/${docId}/view?usp=sharing`;
  
  const teacherAvatar = "https://lh3.googleusercontent.com/d/1lCegcUF3-GYyTPbSidhJdSfU_AZdyj8p=s1000";

  return (
    <div className="animate-fade-in min-h-[80vh] pb-20">
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

        <div className="hidden md:flex items-center gap-3 px-6 py-2.5 bg-violet-500/10 border border-violet-500/20 rounded-2xl">
           <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></span>
           <span className="text-[10px] font-black text-violet-700 uppercase tracking-widest">Dokumen Dasar & Operasi</span>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] p-6 md:p-12 shadow-sm border border-slate-200 overflow-hidden relative">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-8 bg-violet-600 rounded-full"></div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tighter uppercase">BUKU PENGURUSAN <span className="text-violet-600">KURIKULUM</span></h2>
            <div className="w-1.5 h-8 bg-violet-600 rounded-full"></div>
          </div>
          <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-[0.4em] mb-2">PANDUAN OPERASI STANDARD (SOP) SK PEKAN TENOM 2026</p>
          <div className="px-4 py-1.5 bg-violet-50 border border-violet-100 rounded-full flex items-center gap-2">
             <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></span>
             <span className="text-[9px] font-black text-violet-700 uppercase tracking-widest">Rujukan Rasmi Pendidik</span>
          </div>
        </div>

        {/* Intro Avatar Section */}
        <div className="mb-12 p-8 md:p-12 bg-slate-900 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 blur-[120px] rounded-full"></div>
           <div className="relative z-10 flex-shrink-0">
              <div className="w-40 h-40 md:w-52 md:h-52 bg-white/10 backdrop-blur-xl rounded-[2.5rem] shadow-2xl flex items-center justify-center border-2 border-white/20 p-1 transform transition-all duration-700 group-hover:scale-105 group-hover:border-violet-500/50">
                <img 
                  src={teacherAvatar} 
                  alt="Cgu Din" 
                  className="w-full h-full object-contain transform translate-y-2 scale-110" 
                />
              </div>
           </div>
           <div className="relative z-10 flex-1 text-center md:text-left">
              <h3 className="text-violet-400 text-xs font-black uppercase tracking-[0.3em] mb-4">KOMUNIKASI CGU DIN</h3>
              <p className="text-xl md:text-2xl font-bold leading-relaxed italic opacity-95">
                "Buku Pengurusan Unit Kurikulum ini merupakan kompas utama dalam memastikan setiap perancangan akademik kita selaras dengan aspirasi KPM. Sila jadikan ia rujukan harian anda."
              </p>
              <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
                 <a 
                   href={viewUrl}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-violet-900/20 transition-all active:scale-95"
                 >
                   Buka Di Tab Baharu
                 </a>
                 <button className="px-8 py-4 bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/20 transition-all">
                   Semakan Dasar
                 </button>
              </div>
           </div>
        </div>

        {/* Embedded PDF Section */}
        <div className="mb-12">
           <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-6 bg-violet-600 rounded-full"></div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Kandungan Digital Interaktif</h3>
           </div>

           <div className="w-full aspect-[4/5] md:aspect-video bg-slate-100 rounded-[2.5rem] border-4 border-slate-50 overflow-hidden shadow-inner relative">
              <iframe 
                src={pdfUrl} 
                className="w-full h-full"
                title="Buku Pengurusan Kurikulum PDF"
                allow="autoplay"
              ></iframe>
           </div>
        </div>

        {/* Key Features / Content Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           {[
             { title: 'Dasar & Mandat', icon: '⚖️', desc: 'Garis panduan rasmi KPM dan ketetapan kurikulum sekolah.' },
             { title: 'Struktur Jawatankuasa', icon: '🏛️', desc: 'Hierarki organisasi dan bidang tugas bagi setiap unit.' },
             { title: 'Takwim & Perancangan', icon: '📅', desc: 'Pelan tindakan tahunan dan carta gantt pelaksanaan program.' }
           ].map((item, idx) => (
             <div key={idx} className="bg-slate-50 border border-slate-100 p-8 rounded-[2rem] hover:bg-white hover:shadow-xl hover:border-violet-200 transition-all group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">{item.icon}</div>
                <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-wider mb-2">{item.title}</h4>
                <p className="text-[11px] font-semibold text-slate-500 italic opacity-80 leading-relaxed">
                  {item.desc}
                </p>
             </div>
           ))}
        </div>

        {/* Technical Footer */}
        <div className="mt-12 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-violet-50 rounded-2xl">
                 <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                 </svg>
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Status Dokumen</p>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Edisi Kemas Kini 2026 (FINAL)</p>
              </div>
           </div>
           
           <div className="text-center md:text-right">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">SK PEKAN TENOM DIGITAL HUB</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BukuPengurusan;
