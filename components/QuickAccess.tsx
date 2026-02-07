
import React from 'react';
import { ICONS } from '../constants';
import { DashboardView } from '../types';

interface QuickAccessProps {
  onNavigate: (view: DashboardView) => void;
  currentView: DashboardView;
}

const tiles = [
  { id: 'dashboard', label: 'Dashboard Utama', icon: ICONS.Dashboard, color: 'bg-blue-600', href: '#' },
  { id: 'pbd2025', label: 'Analisis PBD 2025', icon: ICONS.Chart, color: 'bg-emerald-600', href: '#pbd2025' },
  { id: 'takwim', label: 'Takwim Tahunan', icon: ICONS.Calendar, color: 'bg-indigo-600', href: '#takwim' },
  { id: 'panitia', label: 'Direktori Panitia', icon: ICONS.Users, color: 'bg-amber-500', href: '#panitia' },
  { id: 'guru', label: 'Senarai Guru', icon: ICONS.Users, color: 'bg-emerald-600', href: '#guru' },
  { id: 'buku', label: 'Buku Pengurusan', icon: ICONS.Book, color: 'bg-violet-600', href: '#buku' },
  { id: 'eopr', label: 'eOPR Kurikulum', icon: ICONS.FileText, color: 'bg-emerald-600', href: '#eopr' },
];

const QuickAccess: React.FC<QuickAccessProps> = ({ onNavigate, currentView }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string, href: string) => {
    e.preventDefault();
    onNavigate(id as DashboardView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="flex items-center gap-2 overflow-x-auto pb-4 custom-scrollbar -mx-2 px-2 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-7 lg:gap-4 lg:overflow-x-visible">
      {tiles.map((tile, idx) => {
        const isActive = (tile.id === currentView);

        return (
          <a
            key={idx}
            href={tile.href}
            onClick={(e) => handleClick(e, tile.id, tile.href)}
            className={`group flex-shrink-0 min-w-[120px] lg:min-w-0 bg-white py-3 px-2 md:py-5 rounded-[1.5rem] border flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95 ${
              isActive ? 'border-blue-500 ring-4 ring-blue-500/10 bg-blue-50/20 shadow-md' : 'border-slate-200 shadow-sm'
            }`}
          >
            <div className={`${tile.color} p-2.5 rounded-2xl text-white mb-2.5 shadow-md group-hover:scale-110 transition-transform`}>
              <tile.icon className="w-5 h-5" />
            </div>
            <span className={`font-black text-[9px] md:text-[10px] whitespace-nowrap uppercase tracking-[0.1em] transition-colors ${
              isActive ? 'text-blue-600' : 'text-slate-600 group-hover:text-blue-600'
            }`}>
              {tile.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
};

export default QuickAccess;
