
import React, { useState } from 'react';

interface PanitiaPageProps {
  onBack: () => void;
}

const PanitiaPage: React.FC<PanitiaPageProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const teacherAvatar = "https://lh3.googleusercontent.com/d/1lCegcUF3-GYyTPbSidhJdSfU_AZdyj8p=s1000";

  const kpmGuidelines = [
    {
      title: 'Peranan Utama',
      icon: '🚀',
      desc: 'Bertindak sebagai nadi penggerak kecemerlangan akademik bagi mata pelajaran. Panitia bertanggungjawab merancang, melaksana, dan memantau keberkesanan PdP selaras dengan KSSM/KSSR.',
      color: 'bg-blue-50 text-blue-700'
    },
    {
      title: 'Tujuan Strategik',
      icon: '🎯',
      desc: 'Memastikan penyelarasan rancangan mengajar, meningkatkan kualiti pedagogi guru melalui kolaborasi, serta mengurus sumber pendidikan dan ABM secara sistematik untuk impak maksimum.',
      color: 'bg-emerald-50 text-emerald-700'
    },
    {
      title: 'Kefungsian Operasi',
      icon: '⚙️',
      desc: 'Melaksanakan Mesyuarat Panitia berkala, Professional Learning Community (PLC), analisis data pencapaian murid (PBD/UASA), serta merangka program intervensi dan pengayaan.',
      color: 'bg-amber-50 text-amber-700'
    }
  ];

  const panitiaList = [
    { name: 'Bahasa Melayu', icon: '📖', color: 'border-l-blue-500', category: 'Teras', link: '#' },
    { name: 'Bahasa Inggeris', icon: '🌐', color: 'border-l-indigo-500', category: 'Teras', link: '#' },
    { name: 'Matematik', icon: '🔢', color: 'border-l-purple-500', category: 'Teras', link: '#' },
    { name: 'Sains', icon: '🧪', color: 'border-l-emerald-500', category: 'Teras', link: '#' },
    { name: 'Pendidikan Islam', icon: '🕌', color: 'border-l-green-600', category: 'Agama/Moral', link: '#' },
    { name: 'Pendidikan Moral', icon: '⚖️', color: 'border-l-rose-400', category: 'Agama/Moral', link: '#' },
    { name: 'Sejarah', icon: '🏛️', color: 'border-l-amber-600', category: 'Teras', link: '#' },
    { name: 'Pendidikan Jasmani', icon: '🏃', color: 'border-l-orange-500', category: 'Sukan/Kesihatan', link: '#' },
    { name: 'Pendidikan Kesihatan', icon: '🏥', color: 'border-l-red-500', category: 'Sukan/Kesihatan', link: '#' },
    { name: 'Pendidikan Seni Visual', icon: '🎨', color: 'border-l-pink-500', category: 'Kesenian', link: '#' },
    { name: 'Pendidikan Muzik', icon: '🎵', color: 'border-l-violet-500', category: 'Kesenian', link: '#' },
    { name: 'Reka Bentuk dan Teknologi', icon: '🛠️', color: 'border-l-slate-600', category: 'Teknikal', link: '#' },
    { name: 'Bahasa Arab', icon: '✍️', color: 'border-l-teal-600', category: 'Bahasa Tambahan', link: '#' },
    { name: 'Bahasa Cina', icon: '🏮', color: 'border-l-red-600', category: 'Bahasa Tambahan', link: '#' },
  ];

  const filteredPanitia = panitiaList.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        <div className="hidden md:flex items-center gap-3 px-6 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
           <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
           <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Direktori Panitia SKPTEN</span>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] p-6 md:p-10 shadow-sm border border-slate-200">
        
        {/* Cgu Din Intro Section - Enormously Enlarged Avatar */}
        <div className="mb-12 p-6 md:p-10 bg-slate-50 border border-slate-100 rounded-[3rem] flex flex-col md:flex-row items-center gap-10 group hover:bg-white hover:shadow-2xl hover:border-amber-200 transition-all duration-700">
           <div className="relative flex-shrink-0">
              {/* Avatar frame enlarged dramatically (w-32 -> w-52) */}
              <div className="w-40 h-40 md:w-52 md:h-52 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center border-4 border-slate-100 p-1 transform transition-all duration-700 group-hover:scale-105 group-hover:shadow-amber-100">
                <img src={teacherAvatar} alt="Cgu Din" className="w-full h-full object-contain transform translate-y-2 scale-110" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-400 w-7 h-7 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
              </div>
           </div>
           <div className="flex-1 text-center md:text-left">
              <h2 className="text-[12px] md:text-[16px] font-black text-slate-900 uppercase leading-tight mb-3 tracking-tighter">
                cikgu Din – HUB PENGETAHUAN PANITIA
              </h2>
              <p className="text-[11px] md:text-[14px] text-slate-500 font-bold italic leading-relaxed opacity-95 max-w-2xl">
                "Pengurusan panitia yang mantap adalah kunci kepada kualiti instruksional. Mari kita selami dasar pengoperasian panitia yang berkesan berdasarkan garis panduan Kementerian Pendidikan Malaysia."
              </p>
           </div>
        </div>

        {/* GUIDELINES SECTION */}
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-3 mb-2">
              <div className="flex items-center gap-3 mb-1">
                 <span className="text-[9px] font-black text-amber-600 bg-amber-100 px-3 py-0.5 rounded-full">DASAR KPM</span>
                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">SPI Bil. 4/1986: Pengurusan Panitia</span>
              </div>
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Fungsi & Mandat Strategik</h2>
           </div>
           
           {kpmGuidelines.map((item, idx) => (
             <div key={idx} className={`p-6 rounded-[2.5rem] border border-transparent shadow-sm hover:shadow-md transition-all group ${item.color}`}>
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {item.icon}
                   </div>
                   <h3 className="text-xs font-black uppercase tracking-wider">{item.title}</h3>
                </div>
                <p className="text-[10px] font-semibold leading-relaxed opacity-80 italic">
                   {item.desc}
                </p>
             </div>
           ))}
        </div>

        {/* Search & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-t border-slate-50 pt-12">
          <div className="relative">
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 leading-none tracking-tighter uppercase">
              SENARAI <span className="text-amber-500">PANITIA</span>
            </h1>
            <div className="h-1.5 w-16 bg-amber-500 rounded-full mt-2"></div>
          </div>

          <div className="relative w-full md:w-80 group">
            <input 
              type="text" 
              placeholder="Cari panitia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-xs font-bold outline-none focus:ring-4 focus:ring-amber-500/10 focus:bg-white focus:border-amber-500 transition-all shadow-sm"
            />
            <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Grid Display */}
        {filteredPanitia.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPanitia.map((panitia, idx) => (
              <div 
                key={idx} 
                className={`bg-white border border-slate-100 p-6 rounded-[2rem] hover:shadow-xl hover:border-amber-200 transition-all duration-500 group cursor-pointer relative overflow-hidden border-l-4 ${panitia.color || 'border-l-slate-200'}`}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 -mr-12 -mt-12 rounded-full opacity-50 group-hover:bg-amber-50 transition-colors"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-sm">
                      {panitia.icon}
                    </div>
                    <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">{panitia.category}</span>
                  </div>

                  <h3 className="text-[13px] font-black text-slate-800 uppercase leading-tight mb-2 group-hover:text-amber-600 transition-colors">
                    {panitia.name}
                  </h3>

                  <div className="flex flex-col gap-1.5 mt-4">
                    <div className="flex items-center justify-between">
                       <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Fail Digital</span>
                       <span className="text-[8px] font-black text-emerald-500 uppercase">Lengkap</span>
                    </div>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 w-[85%] rounded-full"></div>
                    </div>
                  </div>

                  <a 
                    href={panitia.link}
                    target={panitia.link !== '#' ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="mt-6 block w-full py-2.5 bg-slate-50 group-hover:bg-amber-500 group-hover:text-white rounded-xl text-[8px] font-black text-center uppercase tracking-[0.2em] transition-all border border-slate-100 group-hover:border-amber-400"
                  >
                    Buka Folder
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
             <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Tiada panitia dijumpai dengan carian tersebut.</p>
          </div>
        )}

      </div>

      <div className="mt-12 text-center">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.6em] opacity-40">
           Curriculum Hub SKPTEN V2.0
         </p>
      </div>
    </div>
  );
};

export default PanitiaPage;
