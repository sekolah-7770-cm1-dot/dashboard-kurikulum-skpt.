
import React, { useMemo } from 'react';
import { TakwimEvent } from '../types';

interface AnnouncementsProps {
  events: TakwimEvent[];
  loading: boolean;
}

const Announcements: React.FC<AnnouncementsProps> = ({ events, loading }) => {
  const notices = useMemo(() => {
    const combinedNotices = [];

    // 1. Makluman Takwim Terdekat
    const now = new Date();
    const upcoming = events.filter(e => e.date >= now).slice(0, 5);
    upcoming.forEach(e => {
      combinedNotices.push({
        tag: "TAKWIM",
        icon: "📅",
        color: "bg-blue-600",
        msg: `Program Terdekat: ${e.program} (${e.unit}).`,
        date: e.date.toLocaleDateString('ms-MY', { day: 'numeric', month: 'short' })
      });
    });

    return combinedNotices;
  }, [events]);

  if (loading) return <div className="p-10 text-center text-slate-400">Menyusun Hebahan...</div>;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Hebahan</h3>
          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Automasi Takwim Unit Kurikulum Sek. Keb. Pekan, Tenom</span>
        </div>
        <div className="p-2 bg-indigo-50 rounded-xl">
           <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
           </svg>
        </div>
      </div>
      
      <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
        {notices.length > 0 ? notices.map((n, idx) => (
          <div key={idx} className="flex gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition-all group">
            <div className="text-xl flex-shrink-0 mt-1">{n.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-1.5 py-0.5 ${n.color} text-white text-[7px] font-black rounded uppercase`}>{n.tag}</span>
                <span className="text-[8px] text-slate-400 font-bold uppercase">{n.date}</span>
              </div>
              <p className="text-[10px] font-bold text-slate-700 leading-snug">
                {n.msg}
              </p>
            </div>
          </div>
        )) : (
          <p className="text-[10px] text-slate-400 italic text-center py-10">Tiada hebahan kurikulum terkini.</p>
        )}
      </div>
    </div>
  );
};

export default Announcements;
