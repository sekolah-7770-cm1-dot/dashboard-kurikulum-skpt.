
import React from 'react';
import { HeadcountRecord } from '../types';

interface HeadcountAnalysisProps {
  data: HeadcountRecord[];
  loading: boolean;
}

const HeadcountAnalysis: React.FC<HeadcountAnalysisProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-slate-900 rounded-[2.5rem] p-12 shadow-2xl h-80 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-blue-400">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Processing Headcount Metrics...</span>
        </div>
      </div>
    );
  }

  // Ambil 6 subjek pertama untuk visualisasi carta
  const displayData = data.slice(0, 6);
  
  const overallStats = data.reduce((acc, curr) => {
    acc.etr += curr.etr;
    acc.ar += curr.ar;
    return acc;
  }, { etr: 0, ar: 0 });

  const achievementRate = overallStats.etr > 0 
    ? ((overallStats.ar / overallStats.etr) * 100).toFixed(1) 
    : "0";

  return (
    <div id="analisis-headcount" className="bg-slate-900 rounded-[2.5rem] p-6 md:p-10 shadow-2xl border border-white/5 relative overflow-hidden group">
      {/* Background Decorative */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-10 h-1 bg-blue-500 rounded-full"></span>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase">Analisis Headcount (Target vs AR)</h2>
            </div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest pl-12">Penyelarasan Sasaran Akademik SKPTEN</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-3xl flex items-center gap-6">
             <div className="text-center">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Pencapaian KPI</p>
                <p className="text-xl font-black text-blue-400">{achievementRate}%</p>
             </div>
             <div className="h-8 w-px bg-white/10"></div>
             <div className="text-center">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</p>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter bg-emerald-400/10 px-2 py-0.5 rounded">On Track</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Legend and Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                <div>
                  <p className="text-[10px] font-black text-white uppercase tracking-widest">Sasaran (ETR)</p>
                  <p className="text-[9px] text-slate-400">Target yang ditetapkan untuk akhir tahun.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                <div>
                  <p className="text-[10px] font-black text-white uppercase tracking-widest">Pencapaian (AR)</p>
                  <p className="text-[9px] text-slate-400">Keputusan sebenar murid masa kini.</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl text-white shadow-xl">
               <h4 className="text-[11px] font-black uppercase tracking-widest mb-4 opacity-80">Rumusan Strategik</h4>
               <p className="text-xs font-medium leading-relaxed italic">
                 "Peningkatan sebanyak {((overallStats.ar - overallStats.etr) / overallStats.etr * 100).toFixed(1)}% diperlukan untuk mencapai sasaran tahunan bagi subjek teras."
               </p>
            </div>
          </div>

          {/* Comparison Bars */}
          <div className="lg:col-span-8 bg-black/20 rounded-[2rem] p-8 border border-white/5">
            <div className="space-y-8">
              {displayData.map((item, idx) => {
                const maxVal = Math.max(item.etr, item.ar, 10);
                const etrPct = (item.etr / maxVal) * 100;
                const arPct = (item.ar / maxVal) * 100;

                return (
                  <div key={idx} className="space-y-3">
                    <div className="flex justify-between items-center">
                       <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">{item.subjek}</span>
                       <div className="flex gap-4">
                          <span className="text-[10px] font-bold text-blue-400">ETR: {item.etr}</span>
                          <span className="text-[10px] font-bold text-emerald-400">AR: {item.ar}</span>
                       </div>
                    </div>
                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden relative">
                       {/* ETR Bar (Sasaran) */}
                       <div 
                         className="absolute inset-y-0 left-0 bg-blue-500/30 border-r border-blue-400 transition-all duration-1000 ease-out"
                         style={{ width: `${etrPct}%` }}
                       ></div>
                       {/* AR Bar (Pencapaian) */}
                       <div 
                         className="absolute inset-y-0 left-0 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-1000 ease-out delay-300"
                         style={{ width: `${arPct}%` }}
                       ></div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-10 pt-6 border-t border-white/5 flex justify-between items-center">
               <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Sistem Analisis Headcount V1.2</p>
               <div className="flex gap-2">
                  <div className="w-1 h-1 bg-blue-500 rounded-full animate-ping"></div>
                  <div className="w-1 h-1 bg-blue-500 rounded-full animate-ping delay-75"></div>
                  <div className="w-1 h-1 bg-blue-500 rounded-full animate-ping delay-150"></div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeadcountAnalysis;
