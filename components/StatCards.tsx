
import React from 'react';

interface StatItem {
  label: string;
  value: string;
  grow: string;
  desc: string;
  color: string;
}

interface StatCardsProps {
  stats: StatItem[];
}

const StatCards: React.FC<StatCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm hover:shadow-2xl hover:border-blue-200 transition-all duration-500 group overflow-hidden relative">
          {/* Background Decor */}
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-[0.05] -mr-12 -mt-12 rounded-full group-hover:scale-150 transition-transform duration-1000`}></div>
          
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{stat.label}</p>
          <div className="flex items-baseline gap-3 mb-3">
            <h3 className="text-4xl font-black text-slate-800 tracking-tighter group-hover:text-blue-600 transition-colors">{stat.value}</h3>
            <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg shadow-sm border ${
              stat.grow === 'Total' || stat.grow === 'Next' || stat.grow === 'Semasa' || stat.grow === 'Aktif'
              ? 'bg-blue-50 text-blue-600 border-blue-100' 
              : 'bg-emerald-50 text-emerald-600 border-emerald-100'
            }`}>
              {stat.grow}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-bold italic leading-relaxed">{stat.desc}</p>
          
          <div className="mt-6 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
             <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000" style={{ width: '65%' }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCards;
