
import React from 'react';

const terasData = [
  { 
    title: 'Pendidikan Digital & AI', 
    desc: 'Integrasi AI dan teknologi dalam pengajaran & pembelajaran masa hadapan.',
    color: 'border-l-blue-500',
    icon: '🤖'
  },
  { 
    title: 'Kemenjadian Murid Holistik', 
    desc: 'Penekanan kepada Adab, Karakter, dan sahsiah murid yang utuh.',
    color: 'border-l-emerald-500',
    icon: '🌟'
  },
  { 
    title: 'Guru & Kepimpinan', 
    desc: 'Memperkasa kompetensi guru sebagai perancang transformasi pendidikan.',
    color: 'border-l-amber-500',
    icon: '🎓'
  },
  { 
    title: 'Kurikulum Anjal', 
    desc: 'Kurikulum yang fleksibel dan relevan dengan keperluan ekonomi global.',
    color: 'border-l-rose-500',
    icon: '🧭'
  },
  { 
    title: 'Sinergi Komuniti', 
    desc: 'Penglibatan aktif ibu bapa dan industri dalam ekosistem sekolah.',
    color: 'border-l-purple-500',
    icon: '🤝'
  }
];

const PPPMTeras: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Hala Tuju PPPM 2026-2035</h3>
        <span className="bg-blue-100 text-blue-700 text-[9px] font-black px-2 py-0.5 rounded-md uppercase">Strategik</span>
      </div>
      
      <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
        {terasData.map((teras, idx) => (
          <div 
            key={idx} 
            className={`p-3 rounded-2xl bg-slate-50 border-l-4 ${teras.color} hover:bg-white hover:shadow-md transition-all duration-300 group`}
          >
            <div className="flex gap-3 items-start">
              <span className="text-xl group-hover:scale-110 transition-transform">{teras.icon}</span>
              <div>
                <h4 className="text-xs font-bold text-slate-800 mb-0.5">{teras.title}</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">{teras.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-100">
        <p className="text-[9px] text-slate-400 italic text-center">
          "Pendidikan Berkualiti, Insan Terdidik, Negara Sejahtera"
        </p>
      </div>
    </div>
  );
};

export default PPPMTeras;
