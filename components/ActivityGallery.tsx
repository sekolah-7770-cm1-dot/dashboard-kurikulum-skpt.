
import React, { useState, useMemo } from 'react';

interface ActivityGalleryProps {
  folderImages: {url: string, name: string, dateStr?: string}[];
  loading?: boolean;
  onRefresh?: () => void;
}

const ActivityGallery: React.FC<ActivityGalleryProps> = ({ folderImages, loading, onRefresh }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const defaultImages = [
    { url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop", name: "Default 1" },
    { url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000&auto=format&fit=crop", name: "Default 2" },
    { url: "https://images.unsplash.com/photo-1577891729319-f4871c674881?q=80&w=1000&auto=format&fit=crop", name: "Default 3" },
    { url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1000&auto=format&fit=crop", name: "Default 4" },
    { url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1000&auto=format&fit=crop", name: "Default 5" }
  ];

  const extractTimestamp = (item: {name: string, dateStr?: string}) => {
    const source = ((item.dateStr || "") + " " + (item.name || "")).toUpperCase();
    const dmyMatch = source.match(/(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
    if (dmyMatch) return new Date(parseInt(dmyMatch[3]), parseInt(dmyMatch[2]) - 1, parseInt(dmyMatch[1])).getTime();
    const ymdMatch = source.match(/(\d{4})(\d{2})(\d{2})/);
    if (ymdMatch) return new Date(parseInt(ymdMatch[1]), parseInt(ymdMatch[2]) - 1, parseInt(ymdMatch[3])).getTime();
    return 0;
  };

  const imagesToShow = useMemo(() => {
    if (!folderImages || folderImages.length === 0) return defaultImages;
    const now = Date.now();
    const threeWeeksInMs = 21 * 24 * 60 * 60 * 1000;
    const processed = folderImages.map(img => ({ ...img, timestamp: extractTimestamp(img) }));
    let filtered = processed.filter(img => (now - img.timestamp) <= threeWeeksInMs);
    if (filtered.length === 0) {
      filtered = processed.sort((a, b) => b.timestamp - a.timestamp);
    } else {
      filtered = filtered.sort((a, b) => b.timestamp - a.timestamp);
    }
    return filtered.slice(0, 5);
  }, [folderImages]);

  const hasData = folderImages.length > 0;

  if (loading) {
    return (
      <div className="w-full mb-4 animate-pulse px-2">
        <div className="h-[200px] grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="md:col-span-2 md:row-span-2 bg-slate-200 rounded-xl"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="md:col-span-1 bg-slate-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mb-4 relative">
      <div className="flex justify-between items-center mb-3 px-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg md:text-xl font-black text-slate-800 uppercase tracking-tight">Aktiviti</h2>
          <div className="flex items-center gap-1.5 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
             <span className={`w-1.5 h-1.5 rounded-full ${hasData ? 'bg-indigo-500 animate-pulse' : 'bg-slate-300'}`}></span>
             <span className={`text-[8px] font-black uppercase tracking-widest ${hasData ? 'text-indigo-600' : 'text-slate-400'}`}>
               Live
             </span>
          </div>
        </div>
        
        <button 
          onClick={onRefresh}
          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors group"
          title="Muat Semula"
        >
          <svg className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:rotate-180 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357-2H15" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-1 md:grid-rows-2 gap-2 h-auto md:h-[260px] px-2">
        {imagesToShow.map((imgObj, idx) => {
          const isLarge = idx === 0;
          return (
            <div 
              key={idx}
              onClick={() => setSelectedImage(imgObj.url)}
              className={`group relative overflow-hidden rounded-xl border-2 border-white shadow-md cursor-zoom-in transition-all duration-500 hover:shadow-indigo-100/50 hover:-translate-y-0.5 ${
                isLarge ? 'md:col-span-2 md:row-span-2 min-h-[180px]' : 'md:col-span-1 md:row-span-1 min-h-[80px]'
              }`}
            >
              <img 
                src={imgObj.url} 
                alt="Aktiviti"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          );
        })}
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-4 right-4 text-white/50 hover:text-white">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img 
            src={selectedImage} 
            alt="Pemandangan Penuh" 
            className="max-w-full max-h-full rounded-lg shadow-2xl object-contain border-2 border-white/10"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default ActivityGallery;
