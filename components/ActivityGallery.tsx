
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
      <div className="flex justify-between items-end mb-4 px-4">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none flex items-center gap-2">
            <span className="text-slate-800">SOROTAN</span>
            <span className="text-blue-600">BERITA</span>
          </h2>
          <div className="flex items-center gap-1.5 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 shadow-sm self-center">
             <span className={`w-2 h-2 rounded-full ${hasData ? 'bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(79,70,229,0.5)]' : 'bg-slate-300'}`}></span>
             <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${hasData ? 'text-indigo-600' : 'text-slate-400'}`}>
               Sistem Live
             </span>
          </div>
        </div>
        
        <button 
          onClick={onRefresh}
          className="p-2 hover:bg-slate-100 rounded-xl transition-all group border border-slate-50"
          title="Muat Semula"
        >
          <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:rotate-180 transition-all duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357-2H15" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-1 md:grid-rows-2 gap-3 h-auto md:h-[320px] px-2">
        {imagesToShow.map((imgObj, idx) => {
          const isLarge = idx === 0;
          return (
            <div 
              key={idx}
              onClick={() => setSelectedImage(imgObj.url)}
              className={`group relative overflow-hidden rounded-[2rem] border-4 border-white shadow-xl cursor-zoom-in transition-all duration-700 hover:shadow-indigo-200/50 hover:-translate-y-1 ${
                isLarge ? 'md:col-span-2 md:row-span-2 min-h-[240px]' : 'md:col-span-1 md:row-span-1 min-h-[100px]'
              }`}
            >
              <img 
                src={imgObj.url} 
                alt="Sorotan Berita SKPT"
                className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              {/* Subtle Magazine Decoration on Large Image */}
              {isLarge && (
                <div className="absolute top-4 left-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0">
                  <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[8px] font-black text-blue-600 uppercase tracking-[0.3em] shadow-lg">
                    Lensa Kurikulum
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img 
            src={selectedImage} 
            alt="Pemandangan Penuh" 
            className="max-w-full max-h-[90vh] rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)] object-contain border-4 border-white/10 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default ActivityGallery;
