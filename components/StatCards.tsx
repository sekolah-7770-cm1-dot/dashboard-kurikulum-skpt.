
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
          <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-[0.03] -mr-8 -mt-8 rounded-full group-hover:scale-150 transition-transform duration-700`}></div>
          
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
          <div className="flex items-baseline gap-2 mb-2">
            <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{stat.value}</h3>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${stat.grow.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              {stat.grow}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium italic">{stat.desc}</p>
          
          <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-blue-600 rounded-full" style={{ width: stat.value.includes('%') ? stat.value : '50%' }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCards;
