
import React, { useState, useMemo } from 'react';

interface ActivityGalleryProps {
  folderImages: {url: string, name: string, dateStr?: string}[];
  loading?: boolean;
  onRefresh?: () => void;
}

const ActivityGallery: React.FC<ActivityGalleryProps> = ({ folderImages, loading, onRefresh }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const meta = [
    { 
      title: "Kecemerlangan SKPT", 
      color: "from-blue-600 to-indigo-500",
      comment: "Pemantauan berterusan standard pengajaran dan pembelajaran bagi menjamin kualiti akademik murid."
    },
    { 
      title: "Inovasi Digital", 
      color: "from-emerald-600 to-teal-500",
      comment: "Penerapan elemen STEM dan digitalisasi dalam bilik darjah selaras dengan aspirasi PAK-21."
    },
    { 
      title: "Kemenjadian Murid", 
      color: "from-amber-600 to-orange-500",
      comment: "Pembangunan potensi murid secara holistik melalui pentaksiran bilik darjah yang autentik."
    },
    { 
      title: "Sinergi Komuniti", 
      color: "from-rose-600 to-pink-500",
      comment: "Kolaborasi strategik bersama komuniti bagi memperkukuh ekosistem pembelajaran yang kondusif."
    },
    { 
      title: "Transformasi Sekolah", 
      color: "from-purple-600 to-violet-500",
      comment: "Pelaksanaan inisiatif transformasi berfokuskan kepada peningkatan prestasi kurikulum sekolah."
    },
  ];

  const defaultImages = [
    { url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop", name: "Default" },
    { url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000&auto=format&fit=crop", name: "Default" },
    { url: "https://images.unsplash.com/photo-1577891729319-f4871c674881?q=80&w=1000&auto=format&fit=crop", name: "Default" },
    { url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1000&auto=format&fit=crop", name: "Default" },
    { url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1000&auto=format&fit=crop", name: "Default" }
  ];

  const hasFolderData = folderImages.length > 0;

  /**
   * Pengestrakan Tarikh Dinamik:
   * Mengesan format YYYYMMDD, DD-MM-YYYY, atau tarikh dalam dateStr.
   */
  const extractTimestamp = (item: {name: string, dateStr?: string}) => {
    const name = item.name || "";
    const dateStr = item.dateStr || "";
    const source = (dateStr + " " + name).toUpperCase();

    // 1. Cuba format DD-MM-YYYY atau DD/MM/YYYY
    const dmyMatch = source.match(/(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
    if (dmyMatch) {
      return new Date(parseInt(dmyMatch[3]), parseInt(dmyMatch[2]) - 1, parseInt(dmyMatch[1])).getTime();
    }

    // 2. Cuba format YYYYMMDD (biasanya nama fail kamera/upload)
    const ymdMatch = source.match(/(\d{4})(\d{2})(\d{2})/);
    if (ymdMatch) {
      return new Date(parseInt(ymdMatch[1]), parseInt(ymdMatch[2]) - 1, parseInt(ymdMatch[3])).getTime();
    }

    // 3. Cuba format YYYY-MM-DD
    const isoMatch = source.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      return new Date(parseInt(isoMatch[1]), parseInt(isoMatch[2]) - 1, parseInt(isoMatch[3])).getTime();
    }

    return 0;
  };

  const imagesToShow = useMemo(() => {
    if (!hasFolderData) return defaultImages;

    // Proses data dengan timestamp
    const processed = folderImages.map(img => ({
      ...img,
      timestamp: extractTimestamp(img),
      dateOnly: new Date(extractTimestamp(img)).toDateString()
    }));

    // Isih: Paling terbaru dahulu
    const sorted = [...processed].sort((a, b) => b.timestamp - a.timestamp);

    // Ambil 5 gambar, cuba utamakan tarikh berbeza (4-5 tarikh unik)
    const finalSelection: typeof processed = [];
    const seenDates = new Set<string>();

    // Langkah 1: Ambil gambar terbaru bagi setiap tarikh unik
    for (const item of sorted) {
      if (item.timestamp > 0 && !seenDates.has(item.dateOnly) && finalSelection.length < 5) {
        seenDates.add(item.dateOnly);
        finalSelection.push(item);
      }
    }

    // Langkah 2: Jika masih tak cukup 5 (sebab tak cukup tarikh unik), isi dengan gambar baki yang terbaru
    if (finalSelection.length < 5) {
      const remaining = sorted.filter(s => !finalSelection.some(f => f.url === s.url));
      finalSelection.push(...remaining.slice(0, 5 - finalSelection.length));
    }

    return finalSelection.slice(0, 5);
  }, [folderImages, hasFolderData]);

  if (loading) {
    return (
      <div className="w-full mb-16 animate-pulse px-2">
        <div className="h-10 bg-slate-200 w-64 mb-8 rounded-xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[550px]">
          <div className="md:col-span-2 md:row-span-2 bg-slate-200 rounded-[3rem]"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="md:col-span-1 bg-slate-200 rounded-[3rem]"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mb-16 relative">
      <div className="flex flex-col sm:flex-row justify-between items-end mb-8 px-4 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`w-8 h-1.5 rounded-full ${hasFolderData ? 'bg-indigo-500 animate-pulse' : 'bg-slate-300'}`}></span>
            <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${hasFolderData ? 'text-indigo-600' : 'text-slate-400'}`}>
              ARKIB DIGITAL TERKINI
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">Sorotan Aktiviti</h2>
        </div>
        
        <div className="flex items-center gap-3">
           <button 
             onClick={onRefresh}
             className="px-4 py-2.5 bg-white border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 rounded-2xl flex items-center gap-2 transition-all active:scale-95 shadow-sm group"
           >
              <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357-2H15" />
              </svg>
              <span className="text-[10px] font-black uppercase tracking-widest">Refresh</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-1 md:grid-rows-2 gap-6 h-auto md:h-[620px] px-2">
        {imagesToShow.map((imgObj, idx) => {
          const isLarge = idx === 0;
          const info = meta[idx % meta.length];
          
          return (
            <div 
              key={idx}
              onClick={() => setSelectedImage(imgObj.url)}
              className={`group relative overflow-hidden rounded-[3rem] border-[8px] border-white shadow-2xl cursor-zoom-in transition-all duration-1000 hover:shadow-indigo-200/50 hover:-translate-y-2 ${
                isLarge ? 'md:col-span-2 md:row-span-2 min-h-[400px]' : 'md:col-span-1 md:row-span-1 min-h-[220px]'
              }`}
            >
              <div className="absolute inset-0">
                <img 
                  src={imgObj.url} 
                  alt={imgObj.name}
                  className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-125"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500"></div>
              </div>

              <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end pointer-events-none">
                <div className="relative">
                   {isLarge && (
                     <div className="flex mb-4">
                        <span className={`px-4 py-1.5 bg-gradient-to-r ${info.color} text-[8px] font-black text-white uppercase tracking-[0.2em] rounded-full shadow-lg transform -translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-700`}>
                          AKTIVITI TERBARU
                        </span>
                     </div>
                   )}
                   
                   <h3 className={`font-black text-white uppercase tracking-tight leading-[0.9] ${isLarge ? 'text-3xl md:text-5xl' : 'text-lg md:text-xl'} transition-all duration-500`}>
                     {isLarge ? "SOROTAN UTAMA" : info.title}
                   </h3>

                   <p className="mt-4 text-slate-300 text-[8px] md:text-[9px] font-medium leading-relaxed max-w-[95%] opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 delay-150 border-l border-white/20 pl-3">
                     {info.comment}
                   </p>
                </div>
              </div>
              
              {isLarge && hasFolderData && (
                <div className="absolute top-8 left-8 bg-indigo-600 text-white text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest animate-pulse shadow-xl border border-indigo-400/50">
                  LATEST UPLOAD
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-10"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img 
            src={selectedImage} 
            alt="Besar" 
            className="max-w-full max-h-full rounded-3xl shadow-2xl object-contain border-8 border-white/5"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default ActivityGallery;
