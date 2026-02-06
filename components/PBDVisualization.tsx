
import React, { useMemo, useState } from 'react';
import { PBDRecord } from '../types';

interface PBDVisualizationProps {
  data: PBDRecord[];
  loading: boolean;
}

const PBDVisualization: React.FC<PBDVisualizationProps> = ({ data, loading }) => {
  const [selectedSubjek, setSelectedSubjek] = useState<string>('Semua');

  const subjekList = useMemo(() => {
    const list = Array.from(new Set(data.map(d => d.subjek))).sort();
    return ['Semua', ...list];
  }, [data]);

  const stats = useMemo(() => {
    let tp1 = 0, tp2 = 0, tp3 = 0, tp4 = 0, tp5 = 0, tp6 = 0;
    
    const relevantData = selectedSubjek === 'Semua' ? data : data.filter(d => d.subjek === selectedSubjek);
    
    relevantData.forEach(d => {
      tp1 += (Number(d.tp1) || 0); 
      tp2 += (Number(d.tp2) || 0); 
      tp3 += (Number(d.tp3) || 0);
      tp4 += (Number(d.tp4) || 0); 
      tp5 += (Number(d.tp5) || 0); 
      tp6 += (Number(d.tp6) || 0);
    });

    const total = tp1 + tp2 + tp3 + tp4 + tp5 + tp6;
    const mtm = total > 0 ? (((tp3 + tp4 + tp5 + tp6) / total) * 100).toFixed(1) : "0.0";
    const excellence = total > 0 ? (((tp5 + tp6) / total) * 100).toFixed(1) : "0.0";

    return { tp1, tp2, tp3, tp4, tp5, tp6, total, mtm, excellence };
  }, [data, selectedSubjek]);

  const chartData = [
    { label: 'TP1', val: stats.tp1, color: 'bg-slate-300' },
    { label: 'TP2', val: stats.tp2, color: 'bg-slate-400' },
    { label: 'TP3', val: stats.tp3, color: 'bg-yellow-400' },
    { label: 'TP4', val: stats.tp4, color: 'bg-lime-500' },
    { label: 'TP5', val: stats.tp5, color: 'bg-emerald-500' },
    { label: 'TP6', val: stats.tp6, color: 'bg-blue-600' },
  ];

  if (loading) return <div className="h-64 flex items-center justify-center text-slate-400">Menganalisis Data PBD...</div>;

  return (
    <div id="visualisasi-pbd" className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-slate-200 min-h-[500px]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <div className="flex items-center gap-3">
             <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
             <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Prestasi PBD: {selectedSubjek}</h2>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-4 mt-1">Data Real-Time daripada Spreadsheet</p>
        </div>
        
        <select 
          className="bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-black rounded-2xl p-3 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all uppercase"
          value={selectedSubjek}
          onChange={(e) => setSelectedSubjek(e.target.value)}
        >
          {subjekList.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MTM Ring */}
        <div className="bg-slate-900 rounded-[2rem] p-8 text-white flex flex-col items-center justify-center text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full"></div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Melepasi Tahap Minimum (MTM)</p>
           <div className="relative w-40 h-40 flex items-center justify-center mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - (283 * Number(stats.mtm)) / 100} className="text-emerald-500 transition-all duration-1000" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-4xl font-black">{stats.mtm}%</span>
              </div>
           </div>
           <div className="grid grid-cols-2 gap-4 w-full pt-6 border-t border-white/5">
              <div>
                 <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">JUMLAH MURID</p>
                 <p className="text-lg font-black text-blue-400">{stats.total}</p>
              </div>
              <div>
                 <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">TP5 & TP6</p>
                 <p className="text-lg font-black text-emerald-400">{stats.excellence}%</p>
              </div>
           </div>
        </div>

        {/* Bar Chart Breakdown */}
        <div className="lg:col-span-2 bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
           <div className="h-64 flex items-end justify-around gap-2 mb-6">
              {chartData.map(d => {
                const height = stats.total > 0 ? (d.val / stats.total) * 100 : 0;
                return (
                  <div key={d.label} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
                     <div className="relative w-full flex flex-col items-center">
                        <div className="absolute -top-8 bg-slate-800 text-white text-[9px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {d.val} Murid
                        </div>
                        <div 
                          className={`${d.color} w-full max-w-[40px] rounded-t-xl transition-all duration-1000 ease-out shadow-sm group-hover:brightness-110`}
                          style={{ height: `${Math.max(height * 2.5, 4)}px` }}
                        ></div>
                     </div>
                     <span className="text-[10px] font-black text-slate-400 uppercase">{d.label}</span>
                  </div>
                );
              })}
           </div>
           
           <div className="p-4 bg-white rounded-2xl border border-slate-200">
              <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Analisis Kualiti</h4>
              <div className="flex gap-6">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-[10px] font-bold text-slate-600">Potensi TP5 & TP6: {stats.tp5 + stats.tp6} Murid</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-[10px] font-bold text-slate-600">Sasaran MTM: {stats.mtm}%</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PBDVisualization;
