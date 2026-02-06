
import React from 'react';
import { ICONS } from '../constants';

const tiles = [
  { label: 'Jadual Waktu', icon: ICONS.Calendar, color: 'bg-blue-500', href: '#' },
  { label: 'Senarai Aktiviti', icon: ICONS.Chart, color: 'bg-emerald-500', href: '#senarai-aktiviti' },
  { label: 'Takwim', icon: ICONS.Dashboard, color: 'bg-purple-500', href: '#' },
  { label: 'Panitia', icon: ICONS.Users, color: 'bg-amber-500', href: '#' },
  { label: 'Portals KPM', icon: ICONS.Book, color: 'bg-blue-600', href: '#' },
];

const QuickAccess: React.FC = () => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#') && href.length > 1) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="flex items-center gap-3 overflow-x-auto pb-4 custom-scrollbar -mx-2 px-2 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-5 lg:overflow-x-visible">
      {tiles.map((tile, idx) => (
        <a
          key={idx}
          href={tile.href}
          onClick={(e) => handleScroll(e, tile.href)}
          className="group flex-shrink-0 min-w-[120px] lg:min-w-0 bg-white p-4 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center transition-all hover:-translate-y-1 hover:shadow-md hover:border-blue-500 active:scale-95"
        >
          <div className={`${tile.color} p-3 rounded-xl text-white mb-2 shadow-sm group-hover:scale-110 transition-transform`}>
            <tile.icon className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors text-[11px] whitespace-nowrap">
            {tile.label}
          </span>
        </a>
      ))}
    </nav>
  );
};

export default QuickAccess;
