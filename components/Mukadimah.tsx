
import React from 'react';

const Mukadimah: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-[#0f172a] rounded-[3rem] p-8 md:p-12 shadow-2xl border border-white/5 group">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full -ml-20 -mb-20"></div>
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
        <div className="lg:w-2/3">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-blue-600/20 text-blue-400 text-[10px] font-black px-4 py-1.5 rounded-full border border-blue-500/30 uppercase tracking-[0.2em]">
              Visi Transformasi 2026-2035
            </span>
            <div className="h-px w-12 bg-slate-700"></div>
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Digital Core SKPTEN</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.1] mb-6 tracking-tighter">
            MEMPERKASA <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">EKOSISTEM DIGITAL</span> <br className="hidden md:block" />
            UNTUK KECEMERLANGAN KURIKULUM
          </h2>
          
          <div className="space-y-4 max-w-3xl">
            <p className="text-slate-300 text-sm md:text-base font-medium leading-relaxed opacity-90">
              Dashboard Unit Kurikulum SK Pekan Tenom dibangunkan sebagai manifestasi sokongan terhadap <span className="text-white font-bold">Dasar Pendidikan Digital KPM</span> dan <span className="text-white font-bold">Transformasi Pendidikan 2026-2035</span>. 
              Kami mengintegrasikan teknologi pintar untuk memastikan pengurusan data akademik, takwim, dan dokumentasi panitia dilaksanakan secara dinamik, telus, dan berpaksikan data (Data-Driven Decision Making).
            </p>
            <p className="text-slate-400 text-xs md:text-sm italic leading-relaxed">
              "Inisiatif ini bermatlamat untuk mengurangkan beban tugas pengkeranian guru dan meningkatkan fokus terhadap kepimpinan instruksional demi kemenjadian murid yang holistik di era kecerdasan buatan (AI)."
            </p>
          </div>
        </div>

        <div className="lg:w-1/3 w-full">
          <div className="grid grid-cols-1 gap-4">
            <div className="p-5 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 hover:bg-white/10 transition-all group/card">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center text-2xl group-hover/card:scale-110 transition-transform">
                    🎯
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider mb-1">Objektif Utama</h4>
                    <p className="text-[10px] text-slate-400 leading-snug">Penyelarasan data masa nyata (real-time) bagi semua unit kurikulum.</p>
                  </div>
               </div>
            </div>
            
            <div className="p-5 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 hover:bg-white/10 transition-all group/card">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-600/20 rounded-2xl flex items-center justify-center text-2xl group-hover/card:scale-110 transition-transform">
                    ⚡
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider mb-1">Impak Digital</h4>
                    <p className="text-[10px] text-slate-400 leading-snug">Memacu budaya kerja profesional yang pantas, tepat, dan efisien.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle animation line at bottom */}
      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 w-full opacity-30"></div>
    </div>
  );
};

export default Mukadimah;
