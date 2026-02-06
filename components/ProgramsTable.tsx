
import React, { useState, useMemo, useEffect } from 'react';
import { ProgramActivity } from '../types';
import { MONTH_NAMES } from '../constants';

interface ProgramsTableProps {
  programs: ProgramActivity[];
  loading: boolean;
}

const ProgramsTable: React.FC<ProgramsTableProps> = ({ programs, loading }) => {
  const [search, setSearch] = useState('');
  const [bidangFilter, setBidangFilter] = useState('Semua');
  const [monthFilter, setMonthFilter] = useState<string>('latest2'); // Set default ke 2 bulan terkini
  const [yearFilter, setYearFilter] = useState<string>('Semua');

  // Generate unique years and categories from data
  const { uniqueBidang, uniqueYears } = useMemo(() => {
    const bidangSet = new Set<string>(programs.map(p => p.bidang).filter(b => b && b.length > 0));
    const yearSet = new Set<string>(programs.map(p => p.date.getFullYear().toString()));
    
    return {
      uniqueBidang: ['Semua', ...Array.from(bidangSet).sort()],
      uniqueYears: ['Semua', ...Array.from(yearSet).sort((a: string, b: string) => parseInt(b) - parseInt(a))]
    };
  }, [programs]);

  // Efek untuk set Tahun Semasa secara automatik jika data dimuatkan
  useEffect(() => {
    if (!loading && programs.length > 0 && yearFilter === 'Semua') {
      const currentYear = new Date().getFullYear().toString();
      if (uniqueYears.includes(currentYear)) {
        setYearFilter(currentYear);
      }
    }
  }, [loading, programs, uniqueYears, yearFilter]);

  const filteredPrograms = useMemo(() => {
    // Cari julat bulan terkini jika filter adalah 'latest2'
    let allowedMonths: number[] = [];
    if (monthFilter === 'latest2') {
      const now = new Date();
      const currentMonth = now.getMonth();
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      allowedMonths = [currentMonth, prevMonth];
    }

    return programs
      .filter(p => {
        const progName = (p.program || '').toLowerCase();
        const unitName = (p.unit || '').toLowerCase();
        const bidangName = (p.bidang || '').toLowerCase();
        const searchTerm = search.toLowerCase();
        
        const matchesSearch = progName.includes(searchTerm) || 
                             unitName.includes(searchTerm) || 
                             bidangName.includes(searchTerm);
        
        const matchesBidang = bidangFilter === 'Semua' || p.bidang === bidangFilter;
        
        // Logik Penapisan Bulan
        let matchesMonth = false;
        if (monthFilter === 'Semua') {
          matchesMonth = true;
        } else if (monthFilter === 'latest2') {
          matchesMonth = allowedMonths.includes(p.date.getMonth());
        } else {
          matchesMonth = p.date.getMonth().toString() === monthFilter;
        }

        const matchesYear = yearFilter === 'Semua' || p.date.getFullYear().toString() === yearFilter;
        
        return matchesSearch && matchesBidang && matchesMonth && matchesYear;
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [programs, search, bidangFilter, monthFilter, yearFilter]);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          <p className="text-slate-500 font-medium animate-pulse">Memuatkan data rekod...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="senarai-aktiviti" className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-800">Rekod Aktiviti Kurikulum</h2>
            <span className={`px-2.5 py-1 text-[9px] font-black rounded-full uppercase tracking-tighter ${monthFilter === 'latest2' ? 'bg-indigo-600 text-white animate-pulse' : 'bg-blue-100 text-blue-700'}`}>
              {monthFilter === 'latest2' ? '🔥 2 Bulan Terakhir' : 'Rekod Terpilih'}
            </span>
          </div>
          <div className="h-1 w-12 bg-blue-600 rounded-full mt-1"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 w-full xl:w-auto">
          <div className="relative">
            <input 
              type="text"
              placeholder="Cari aktiviti..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <select 
            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            value={bidangFilter}
            onChange={(e) => setBidangFilter(e.target.value)}
          >
            <option value="Semua">Semua Bidang / Panitia</option>
            {uniqueBidang.filter(b => b !== 'Semua').map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <select 
            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
          >
            <option value="latest2">✨ 2 Bulan Terkini</option>
            <option value="Semua">Semua Bulan</option>
            {MONTH_NAMES.map((name, idx) => (
              <option key={idx} value={idx.toString()}>{name}</option>
            ))}
          </select>

          <select 
            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="Semua">Semua Tahun</option>
            {uniqueYears.filter(y => y !== 'Semua').map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar overflow-y-auto max-h-[500px] border border-slate-50 rounded-2xl">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-slate-100 z-10">
            <tr className="text-[10px] uppercase text-slate-600 font-bold tracking-widest border-b border-slate-200">
              <th className="py-4 px-6">Tarikh (MM/DD)</th>
              <th className="py-4 px-6">Unit / Panitia</th>
              <th className="py-4 px-6">Program / Aktiviti</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPrograms.length > 0 ? (
              filteredPrograms.map((prog, idx) => (
                <tr key={idx} className="hover:bg-blue-50/40 transition-colors group">
                  <td className="py-4 px-6 text-xs font-medium text-slate-500 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-slate-800 font-bold">
                        {prog.date.toLocaleDateString('ms-MY', { month: 'long', day: '2-digit' })}
                      </span>
                      <span className="text-[10px] text-slate-400">{prog.date.getFullYear()}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                     <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-700">{prog.unit}</span>
                        <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">{prog.bidang}</span>
                     </div>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-slate-800">
                    {prog.program}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-20 text-center text-slate-400 font-medium italic">
                  Tiada rekod ditemui untuk 2 bulan terkini. Cuba tukar filter "Bulan" atau "Tahun".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex justify-end">
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           Menunjukkan {filteredPrograms.length} rekod aktiviti
         </p>
      </div>
    </div>
  );
};

export default ProgramsTable;
