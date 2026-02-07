
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TakwimEvent, ProgramActivity, DashboardView, TeacherRecord, PBDRecord } from './types';
import { fetchTakwim, fetchPrograms, fetchFolderImages, fetchTeachers, fetchPBD } from './services/csvService';
import { TAKWIM_CSV_URL, PROGRAMS_CSV_URL, FOLDER_IMAGES_CSV_URL, TEACHERS_CSV_URL, PBD_2025_CSV_URL } from './constants';
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
import CartaOrganisasi from './components/CartaOrganisasi';
import EOPRKurikulum from './components/EOPRKurikulum';
import PanitiaPage from './components/PanitiaPage';
import TakwimPage from './components/TakwimPage';
import BukuPengurusan from './components/BukuPengurusan';
import SenaraiGuru from './components/SenaraiGuru';
import Mukadimah from './components/Mukadimah';
import PBD2025Page from './components/PBD2025Page';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<DashboardView>('dashboard');
  const [takwimEvents, setTakwimEvents] = useState<TakwimEvent[]>([]);
  const [programs, setPrograms] = useState<ProgramActivity[]>([]);
  const [teachers, setTeachers] = useState<TeacherRecord[]>([]);
  const [pbd2025Data, setPbd2025Data] = useState<PBDRecord[]>([]);
  const [folderImages, setFolderImages] = useState<{url: string, name: string, dateStr?: string}[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [takwimData, programsData, imagesData, teachersData, pbdData] = await Promise.all([
        fetchTakwim(TAKWIM_CSV_URL),
        fetchPrograms(PROGRAMS_CSV_URL),
        fetchFolderImages(FOLDER_IMAGES_CSV_URL),
        fetchTeachers(TEACHERS_CSV_URL),
        fetchPBD(PBD_2025_CSV_URL)
      ]);

      setTakwimEvents(takwimData);
      setPrograms(programsData);
      setFolderImages(imagesData);
      setTeachers(teachersData);
      setPbd2025Data(pbdData);
      setLoading(false);
    } catch (error) {
      console.error("Data load failed:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const globalStats = useMemo(() => {
    const totalEvents = takwimEvents.length;
    const now = new Date();
    const currentMonthEvents = takwimEvents.filter(e => e.date.getMonth() === now.getMonth() && e.date.getFullYear() === now.getFullYear()).length;
    const uniqueUnits = new Set(takwimEvents.map(e => e.unit)).size;
    const upcomingEvents = takwimEvents.filter(e => e.date >= now).length;

    return [
      { label: 'Aktiviti Kurikulum', value: totalEvents.toLocaleString(), grow: 'Total', desc: 'Program Terjadual Unit Kurikulum 2026', color: 'from-slate-600 to-slate-800' },
      { label: 'Fokus Bulan Ini', value: currentMonthEvents.toString(), grow: 'Semasa', desc: `Aktiviti Kurikulum Bulan Ini`, color: 'from-blue-600 to-blue-800' },
      { label: 'Unit / Panitia', value: uniqueUnits.toString(), grow: 'Aktif', desc: `Unit Terlibat Dalam Kurikulum`, color: 'from-emerald-600 to-emerald-800' },
      { label: 'Program Mendatang', value: upcomingEvents.toString(), grow: 'Next', desc: `Baki Aktiviti Perlu Dilaksana`, color: 'from-purple-600 to-purple-800' },
    ];
  }, [takwimEvents]);

  return (
    <div className="min-h-screen pb-20 p-4 md:p-8 max-w-[1600px] mx-auto animate-fade-in">
      <DashboardHeader />
      
      <main className="space-y-12">
        {/* QuickAccess and other views... */}
        <section>
           <QuickAccess onNavigate={(view) => setCurrentView(view)} currentView={currentView} />
           {currentView === 'dashboard' && <div className="mt-8"><Announcements events={takwimEvents} loading={loading} /></div>}
        </section>

        {currentView === 'dashboard' ? (
          <>
            <section className="animate-fade-in" style={{ animationDelay: '0.05s' }}><Mukadimah /></section>
            <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}><StatCards stats={globalStats} /></section>
            <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}><ActivityGallery folderImages={folderImages} loading={loading} onRefresh={loadData} /></section>
            <section className="animate-fade-in" style={{ animationDelay: '0.25s' }}><AIInsights events={takwimEvents} loading={loading} /></section>
            <section id="takwim-seksyen" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-8 flex flex-col"><TakwimCard events={takwimEvents} loading={loading} /></div>
              <div className="lg:col-span-4 flex flex-col"><PPPMTeras /></div>
            </section>
            <section className="w-full"><ProgramsTable programs={programs} loading={loading} /></section>
          </>
        ) : currentView === 'pbd2025' ? (
          <PBD2025Page data={pbd2025Data} loading={loading} onBack={() => setCurrentView('dashboard')} />
        ) : currentView === 'takwim' ? (
          <TakwimPage events={takwimEvents} loading={loading} onBack={() => setCurrentView('dashboard')} />
        ) : currentView === 'carta' ? (
          <CartaOrganisasi onBack={() => setCurrentView('dashboard')} />
        ) : currentView === 'panitia' ? (
          <PanitiaPage onBack={() => setCurrentView('dashboard')} />
        ) : currentView === 'buku' ? (
          <BukuPengurusan onBack={() => setCurrentView('dashboard')} />
        ) : currentView === 'guru' ? (
          <SenaraiGuru teachers={teachers} loading={loading} onBack={() => setCurrentView('dashboard')} />
        ) : (
          <EOPRKurikulum onBack={() => setCurrentView('dashboard')} folderImages={folderImages} />
        )}

        <section className="w-full pt-8 border-t border-slate-100"><TeacherPortals /></section>
      </main>

      <footer className="mt-20 pt-10 border-t border-slate-200 text-center">
         <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">UNIT KURIKULUM DIGITAL CORE 2026</p>
         <p className="text-slate-400 text-[8px] font-bold uppercase tracking-widest mt-2">Sistem Integrasi: UNIKUR SKPTEN</p>
      </footer>

      <AIConsultant />
    </div>
  );
};

export default App;
