
import React from 'react';

const portals = [
  { 
    name: 'DELIMa', 
    desc: 'Google Workspace', 
    icon: '☁️', 
    color: 'bg-blue-50',
    url: 'https://delima.moe-dl.edu.my/'
  },
  { 
    name: 'HRMIS 2.0', 
    desc: 'Data Perkhidmatan', 
    icon: '👤', 
    color: 'bg-emerald-50',
    url: 'https://hrmis2.eghrmis.gov.my/'
  },
  { 
    name: 'APDM', 
    desc: 'Kehadiran Murid', 
    icon: '📝', 
    color: 'bg-amber-50',
    url: 'https://apdm.moe.gov.my/'
  },
  { 
    name: 'e-OPERASI', 
    desc: 'Data Guru', 
    icon: '⚙️', 
    color: 'bg-rose-50',
    url: 'https://eoperasi.moe.gov.my/'
  },
  { 
    name: 'SPLKPM', 
    desc: 'Latihan Guru', 
    icon: '📚', 
    color: 'bg-indigo-50',
    url: 'https://splkpm.moe.gov.my/'
  },
  { 
    name: 'idMe', 
    desc: 'Pengurusan Identiti', 
    icon: '🔑', 
    color: 'bg-purple-50',
    url: 'https://idme.moe.gov.my/'
  },
];

const TeacherPortals: React.FC = () => {
  return (
    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px]"></div>
      
      <div className="relative z-10">
        <h3 className="text-lg font-black uppercase tracking-widest mb-2">Gerbang Sistem KPM</h3>
        <p className="text-slate-400 text-xs font-medium mb-8">Pautan pantas ke aplikasi pengurusan harian guru.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {portals.map((p, idx) => (
            <a 
              key={idx} 
              href={p.url} 
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:-translate-y-1 transition-all group text-center"
            >
              <div className="text-2xl mb-2 group-hover:scale-125 transition-transform">{p.icon}</div>
              <span className="text-[10px] font-black uppercase tracking-tighter mb-1">{p.name}</span>
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-tight">{p.desc}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherPortals;
