
import React, { useState } from 'react';

interface CartaOrganisasiProps {
  onBack: () => void;
}

const CartaOrganisasi: React.FC<CartaOrganisasiProps> = ({ onBack }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  
  // Link Imej Carta Organisasi daripada Google Drive
  const cartaId = "1tNkhLuvSB2eXT6bP3zgSFIxvLfgmSs6-";
  const cartaImageUrl = `https://lh3.googleusercontent.com/d/${cartaId}=s2000`;

  const kpmMandates = [
    {
      role: 'PENGERUSI (GURU BESAR)',
      desc: 'Peneraju kepimpinan instruksional yang bertanggungjawab menetapkan hala tuju kurikulum dan memastikan standard kualiti pendidikan dipatuhi sepenuhnya.',
      icon: '👑'
    },
    {
      role: 'TIMBALAN PENGERUSI (GPK PENTADBIRAN)',
      desc: 'Pengurus kurikulum yang menyelaraskan pelaksanaan jadual waktu, pengurusan panitia, dan pemantauan kualiti PdP secara berkala.',
      icon: '⚖️'
    },
    {
      role: 'SETIAUSAHA KURIKULUM',
      desc: 'Nadi pengurusan dokumen dan data yang memastikan setiap keputusan mesyuarat JKKS diterjemahkan kepada tindakan yang berkesan.',
      icon: '📝'
    },
    {
      role: 'KETUA PANITIA',
      desc: 'Pakar subjek yang menerajui inovasi pedagogi, pengurusan sumber pendidikan, dan analisis intervensi berfokus bagi setiap murid.',
      icon: '🎯'
    }
  ];

  return (
    <div className="animate-fade-in min-h-[80vh] pb-20">
      {/* Back Button Navigation */}
      <div className="mb-8 flex justify-start">
        <button 
          onClick={onBack}
          className="group flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500 transition-all active:scale-95"
        >
          <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </div>
          <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Dashboard Utama</span>
        </button>
      </div>

      <div className="bg-white rounded-[3rem] p-6 md:p-12 shadow-sm border border-slate-200 overflow-hidden relative">
        {/* 1. Header Section */}
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tighter uppercase">PENGURUSAN <span className="text-blue-600">KURIKULUM</span></h2>
            <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
          </div>
          <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-[0.4em] mb-2">JAWATANKUASA KURIKULUM SEKOLAH (JKKS) SK PEKAN TENOM</p>
          <div className="px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full flex items-center gap-2">
             <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
             <span className="text-[9px] font-black text-blue-700 uppercase tracking-widest">Mandat KPM: Kepimpinan Instruksional Berkesan</span>
          </div>
        </div>

        {/* 2. Vision/Mission Statement Section */}
        <div className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[60px] rounded-full"></div>
              <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.3em] mb-4">Falsafah Pengurusan</h3>
              <p className="text-lg md:text-xl font-bold leading-relaxed italic opacity-90">
                "Membentuk ekosistem kurikulum yang dinamik melalui tadbir urus yang telus, berintegriti, dan berasaskan data untuk kemenjadian murid yang holistik."
              </p>
           </div>
           <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white relative overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 blur-[60px] rounded-full"></div>
              <h3 className="text-xs font-black text-blue-100 uppercase tracking-[0.3em] mb-4">Objektif Strategik 2026</h3>
              <ul className="space-y-3">
                 {[
                   'Penyelarasan PdP selaras dengan KSSR (Semakan 2017).',
                   'Pemerkasaan PBD melalui moderasi yang adil and sahih.',
                   'Integrasi Teknologi Digital & AI dalam pengurusan panitia.'
                 ].map((text, i) => (
                   <li key={i} className="flex items-start gap-3 text-[11px] md:text-xs font-bold uppercase tracking-tight">
                      <span className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 flex-shrink-0"></span>
                      {text}
                   </li>
                 ))}
              </ul>
           </div>
        </div>

        {/* 3. Image Display Area (Carta Photo) */}
        <div className="relative group mb-16">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Visual Carta Organisasi</h3>
           </div>

           <div 
             className="relative w-full bg-slate-50 rounded-[3rem] border-4 border-slate-100 p-2 md:p-8 shadow-inner cursor-zoom-in overflow-hidden"
             onClick={() => setIsZoomed(true)}
           >
              <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"></div>
              
              <div className="relative z-0 overflow-hidden rounded-[2rem]">
                <img 
                  src={cartaImageUrl} 
                  alt="Carta Organisasi SKPTEN" 
                  className="w-full h-auto object-contain transition-transform duration-1000 group-hover:scale-[1.01]"
                />
              </div>

              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-8 py-4 rounded-2xl border border-blue-100 shadow-2xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 z-20 flex items-center gap-3">
                 <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                 </svg>
                 <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Klik untuk paparan HD skrin penuh</span>
              </div>
           </div>
        </div>

        {/* 4. Peranan Jawatankuasa Section (Placed at the bottom) */}
        <div className="mb-12">
           <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Bidang Tugas & Tanggungjawab</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpmMandates.map((item, idx) => (
                <div key={idx} className="bg-[#f8fafc]/50 border border-slate-100 p-8 rounded-[2.5rem] flex flex-col gap-4 shadow-sm hover:shadow-xl hover:bg-white transition-all duration-500 group">
                   <div className="text-4xl mb-2 transform transition-transform group-hover:scale-125 duration-500 origin-left">
                     {item.icon}
                   </div>
                   <h4 className="text-[13px] font-black text-slate-900 uppercase leading-tight tracking-tight">
                     {item.role}
                   </h4>
                   <p className="text-[11px] font-semibold text-slate-500 leading-relaxed italic opacity-80">
                      "{item.desc}"
                   </p>
                </div>
              ))}
           </div>
        </div>

        {/* Technical Footer */}
        <div className="mt-12 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-2xl">
                 <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                 </svg>
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Kualiti Tadbir Urus</p>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">SKPM Kualiti @Sekolah (Standard 3.1)</p>
              </div>
           </div>
           
           <div className="text-center md:text-right">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">SK PEKAN TENOM DIGITAL HUB</p>
           </div>
        </div>
      </div>

      {/* Fullscreen Modal / Zoom View */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-xl flex flex-col animate-fade-in"
          onClick={() => setIsZoomed(false)}
        >
          {/* Modal Header */}
          <div className="p-6 flex justify-between items-center text-white border-b border-white/10 bg-black/20">
             <div className="flex items-center gap-4">
                <h3 className="text-sm font-black uppercase tracking-widest">Pemandangan Penuh Carta Organisasi</h3>
                <span className="px-2 py-0.5 bg-blue-600 rounded text-[8px] font-black uppercase">Original View</span>
             </div>
             <button 
               className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all border border-white/20"
               onClick={() => setIsZoomed(false)}
             >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
             </button>
          </div>
          
          {/* Scrollable Image Content */}
          <div className="flex-1 overflow-auto p-4 md:p-12 flex justify-center custom-scrollbar">
             <img 
               src={cartaImageUrl} 
               alt="Carta Organisasi Full View" 
               className="max-w-none h-auto md:w-full md:max-w-7xl object-contain shadow-2xl rounded-lg border-2 border-white/5"
               onClick={(e) => e.stopPropagation()}
             />
          </div>
          
          {/* Modal Footer Tip */}
          <div className="p-4 text-center text-slate-500 text-[9px] font-bold uppercase tracking-widest">
            Gunakan tetikus atau sentuhan untuk menatal. Klik di mana-mana untuk tutup.
          </div>
        </div>
      )}
    </div>
  );
};

export default CartaOrganisasi;
