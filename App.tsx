
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TakwimEvent, ProgramActivity, PBDRecord, HeadcountRecord } from './types';
import { fetchTakwim, fetchPrograms, fetchFolderImages, fetchPBD, fetchHeadcount } from './services/csvService';
import { TAKWIM_CSV_URL, PROGRAMS_CSV_URL, FOLDER_IMAGES_CSV_URL, PBD_CSV_URL, HEADCOUNT_CSV_URL } from './constants';
import DashboardHeader from './components/DashboardHeader';
import QuickAccess from './components/QuickAccess';
import TakwimCard from './components/TakwimCard';
import ProgramsTable from './components/ProgramsTable';
import AIInsights from './components/AIInsights';
import PPPMTeras from './components/PPPMTeras';
import Announcements from './components/Announcements';
import TeacherPortals from './components/TeacherPortals';
import ActivityGallery from './components/ActivityGallery';
import AIConsultant from './components/AIConsultant';
import StatCards from './components/StatCards';

const App: React.FC = () => {
  const [takwimEvents, setTakwimEvents] = useState<TakwimEvent[]>([]);
  const [programs, setPrograms] = useState<ProgramActivity[]>([]);
  const [folderImages, setFolderImages] = useState<{url: string, name: string, dateStr?: string}[]>([]);
  const [pbdData, setPbdData] = useState<PBDRecord[]>([]);
  const [headcountData, setHeadcountData] = useState<HeadcountRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [takwimData, programsData, imagesData, pbdRecords, hcRecords] = await Promise.all([
        fetchTakwim(TAKWIM_CSV_URL),
        fetchPrograms(PROGRAMS_CSV_URL),
        fetchFolderImages(FOLDER_IMAGES_CSV_URL),
        fetchPBD(PBD_CSV_URL),
        fetchHeadcount(HEADCOUNT_CSV_URL)
      ]);

      setTakwimEvents(takwimData);
      setPrograms(programsData);
      setFolderImages(imagesData);
      setPbdData(pbdRecords);
      setHeadcountData(hcRecords);
      setLoading(false);
    } catch (error) {
      console.error("Data load failed:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Statistik Dinamik SKPT
  const globalStats = useMemo(() => {
    const totalS = pbdData.reduce((acc, curr) => acc + (Number(curr.tp1) + Number(curr.tp2) + Number(curr.tp3) + Number(curr.tp4) + Number(curr.tp5) + Number(curr.tp6)), 0);
    const mtmS = pbdData.reduce((acc, curr) => acc + (Number(curr.tp3) + Number(curr.tp4) + Number(curr.tp5) + Number(curr.tp6)), 0);
    const excellenceS = pbdData.reduce((acc, curr) => acc + (Number(curr.tp5) + Number(curr.tp6)), 0);
    
    const mtmPct = totalS > 0 ? ((mtmS / totalS) * 100).toFixed(1) : "0.0";
    const excellencePct = totalS > 0 ? ((excellenceS / totalS) * 100).toFixed(1) : "0.0";
    
    const totalETR = headcountData.reduce((acc, curr) => acc + Number(curr.etr), 0);
    const totalAR = headcountData.reduce((acc, curr) => acc + Number(curr.ar), 0);
    const hcGap = totalETR > 0 ? ((totalAR / totalETR) * 100).toFixed(1) : "0.0";

    return [
      { 
        label: 'Enrolmen Dinilai', 
        value: totalS.toLocaleString(), 
        grow: 'Data', 
        desc: 'Jumlah Keseluruhan Murid (TP1-TP6)', 
        color: 'from-slate-600 to-slate-800' 
      },
      { 
        label: 'Kadar MTM (Lulus)', 
        value: `${mtmPct}%`, 
        grow: 'KPI', 
        desc: `Pencapaian TP3 - TP6`, 
        color: 'from-blue-600 to-blue-800' 
      },
      { 
        label: 'Kualiti (TP5 & TP6)', 
        value: excellenceS.toLocaleString(), 
        grow: 'Prestasi', 
        desc: `${excellencePct}% Murid Cemerlang`, 
        color: 'from-emerald-600 to-emerald-800' 
      },
      { 
        label: 'Pencapaian Headcount', 
        value: `${hcGap}%`, 
        grow: 'Target', 
        desc: `AR vs ETR (Target vs Sebenar)`, 
        color: 'from-purple-600 to-purple-800' 
      },
    ];
  }, [pbdData, headcountData]);

  return (
    <div className="min-h-screen pb-20 p-4 md:p-8 max-w-[1600px] mx-auto animate-fade-in">
      <DashboardHeader />
      
      <main className="space-y-12">
        <section>
           <QuickAccess />
        </section>

        {/* Real-Time Academic Pulse */}
        <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
           <StatCards stats={globalStats} />
        </section>

        <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
           <ActivityGallery 
             folderImages={folderImages} 
             loading={loading} 
             onRefresh={loadData} 
           />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch border-b border-slate-100 pb-12">
          <div className="lg:col-span-8 flex flex-col">
            <AIInsights events={takwimEvents} pbdData={pbdData} loading={loading} />
          </div>
          <div className="lg:col-span-4 flex flex-col">
            <Announcements events={takwimEvents} pbdData={pbdData} loading={loading} />
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-8 flex flex-col">
            <TakwimCard events={takwimEvents} loading={loading} />
          </div>
          <div className="lg:col-span-4 flex flex-col">
            <PPPMTeras />
          </div>
        </section>

        <section className="w-full">
          <ProgramsTable programs={programs} loading={loading} />
        </section>

        <section className="w-full pt-8 border-t border-slate-100">
           <TeacherPortals />
        </section>
      </main>

      <footer className="mt-20 pt-10 border-t border-slate-200 text-center">
         <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">UNIT KURIKULUM SK PEKAN TENOM DIGITAL CORE 2026</p>
      </footer>

      <AIConsultant />
    </div>
  );
};

export default App;
